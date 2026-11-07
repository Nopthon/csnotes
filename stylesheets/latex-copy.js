(() => {
  "use strict";

  const SVG_MATH = '[class~="math-svg"],[class$="-math-svg"]';
  const MATH = `.katex-display,.katex,mjx-container,.MathJax_Display,.MathJax,.MathJax_SVG_Display,.MathJax_SVG,math,[data-latex],[data-tex],${SVG_MATH}`;
  const TEX = 'annotation[encoding="application/x-tex"],annotation[encoding="application/x-latex"]';
  const SKIP = "script,style,noscript,template,.MathJax_Preview,mjx-assistive-mml";
  const EDITOR = "input,textarea,select";
  let pendingCopy = null;
  let press = null;
  let hovered = null;
  let toast = null;
  let requestId = 0;
  const openEditors = new Map();
  const editors = new WeakMap();
  const embeddedSources = new WeakMap();
  const pageRenderers = new WeakMap();
  // The markup and source a formula had before this extension touched it, kept
  // across edit sessions so "还原" can always go back to what the page rendered.
  const formulaMarkup = new WeakMap();
  const pristineSources = new WeakMap();
  const editedSources = new WeakMap();

  // Keep page-level click-outside and shortcut handlers from treating the
  // editor as part of the page. Capture-phase listeners registered by the page
  // on window/document have already run, but bubble-phase handlers are shielded.
  for (const type of ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "contextmenu", "wheel", "input", "change", "keyup", "keypress"]) {
    document.addEventListener(type, event => {
      // Nothing to shield until an editor exists; skip the path allocation on
      // every wheel/input event of every page.
      if (!openEditors.size) return;
      if (event.composedPath().some(node => editors.has(node))) event.stopImmediatePropagation();
    }, type === "wheel" ? { passive: true } : false);
  }

  function element(node) {
    return node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
  }

  function parentOf(node) {
    return node.parentElement || node.getRootNode().host || null;
  }

  function shadowContains(root, target) {
    for (let node = target; node;) {
      const tree = node.getRootNode();
      if (tree === root) return true;
      node = tree.host;
      if (!node) return false;
    }
  }

  function mathAncestor(node) {
    let root = null;
    for (let parent = element(node); parent; parent = parentOf(parent)) {
      if (parent.matches(MATH)) root = parent;
    }
    return root;
  }

  function selectionRoot(range) {
    // A selection may start and end inside the visual half of a formula.
    return mathAncestor(range.commonAncestorContainer) || element(range.commonAncestorContainer);
  }

  function mathJaxItems(root) {
    const items = new Map();
    try {
      const doc = window.MathJax?.startup?.document;
      if (doc && (root.matches("mjx-container") || root.querySelector("mjx-container"))) {
        for (const item of doc.getMathItemsWithin([root])) {
          if (item.inputJax?.name === "TeX" && item.typesetRoot) {
            items.set(item.typesetRoot, { tex: item.math, display: !!item.display });
          }
        }
      }
    } catch {
      // DOM annotations still work if a site's MathJax instance is unavailable.
    }
    return items;
  }

  function ownValue(object, key) {
    try { return Object.getOwnPropertyDescriptor(object, key)?.value; } catch { return undefined; }
  }

  function reactFiber(node) {
    const key = Object.keys(node).find(key => key.startsWith("__reactFiber$"));
    let fiber = key && ownValue(node, key);
    if (!fiber) return null;
    let root = fiber;
    for (let i = 0; root.return && i < 200; i++) root = root.return;
    // DOM references can still point to the previous fiber after a commit.
    if (root.stateNode?.current === root.alternate && fiber.alternate) fiber = fiber.alternate;
    return fiber;
  }

  function formulaOwners(node) {
    const owners = [];
    let fiber = reactFiber(node);
    for (let i = 0; fiber && i < 8; i++, fiber = fiber.return) {
      if (fiber.stateNode instanceof Element && fiber.stateNode !== node) break;
      if (!(fiber.stateNode instanceof Element)) owners.push({ props: fiber.memoizedProps, state: fiber.memoizedState });
    }
    const component = ownValue(node, "__vueParentComponent");
    if (component?.subTree?.el === node) owners.push({ props: component.props });
    const vue = ownValue(node, "__vue__");
    if (vue?.$el === node) owners.push({ props: vue.$props });
    return owners;
  }

  function ownerSource(node) {
    for (const { props } of formulaOwners(node)) {
      if (!props || typeof props !== "object") continue;
      for (const key of ["latex", "tex", "math", "formula"]) {
        const tex = ownValue(props, key);
        if (typeof tex === "string" && tex.trim() && tex.length <= 250000) return tex;
      }
      const ast = ownValue(props, "node");
      if (/^(?:inlineMath|displayMath|math|mathInline|mathBlock|inline_math|block_math|math_inline|math_block)$/.test(ast?.type) &&
          typeof ast.value === "string" && ast.value.length <= 250000) return ast.value;
    }
    return null;
  }

  function privateKatex(node) {
    if (pageRenderers.has(node)) return pageRenderers.get(node);
    for (const { state } of formulaOwners(node)) {
      let hook = state;
      for (let i = 0; hook && i < 40; i++, hook = ownValue(hook, "next")) {
        const value = ownValue(hook, "memoizedState");
        for (const candidate of [value, value && ownValue(value, "current")]) {
          if (candidate && typeof ownValue(candidate, "renderToString") === "function" &&
              typeof ownValue(candidate, "render") === "function" && typeof ownValue(candidate, "version") === "string") {
            pageRenderers.set(node, candidate);
            return candidate;
          }
        }
      }
    }
    return null;
  }

  const entityCache = new Map();
  const commonEntities = {
    "&amp;": "&", "&apos;": "'", "&copy;": "©", "&gt;": ">", "&hellip;": "…", "&laquo;": "«",
    "&ldquo;": "“", "&lsquo;": "‘", "&lt;": "<", "&mdash;": "—", "&middot;": "·", "&nbsp;": " ",
    "&ndash;": "–", "&quot;": '"', "&raquo;": "»", "&rdquo;": "”", "&reg;": "®", "&rsquo;": "’",
    "&trade;": "™", "&times;": "×", "&divide;": "÷", "&plusmn;": "±", "&deg;": "°", "&micro;": "µ",
    "&para;": "¶", "&sect;": "§", "&euro;": "€", "&pound;": "£", "&yen;": "¥", "&cent;": "¢",
    "&frac12;": "½", "&frac14;": "¼", "&frac34;": "¾", "&sup2;": "²", "&sup3;": "³"
  };
  let entityDocument;

  function decodeEntities(text) {
    if (!text.includes("&")) return text;
    return text.replace(/&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]+);/gi, entity => {
      const cached = entityCache.get(entity);
      if (cached !== undefined) return cached;
      let value = entity;
      if (entity[1] === "#") {
        const hex = entity[2]?.toLowerCase() === "x";
        const code = Number.parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
        if (code > 0 && code <= 0x10ffff) value = String.fromCodePoint(code);
      } else {
        try {
          entityDocument ||= new DOMParser();
          value = entityDocument.parseFromString(`<!doctype html><body>${entity}`, "text/html").body.textContent;
        } catch {
          value = commonEntities[entity.toLowerCase()] ?? entity;
        }
      }
      entityCache.set(entity, value);
      return value;
    });
  }

  function textSignature(text) {
    return text.normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}\u0001]/gu, "");
  }

  function pageSignature(text) {
    // DOM text is already rendered and decoded. Literal "<" or "&...;" here is
    // content, so do not apply Markdown/HTML rules to it.
    return textSignature(text);
  }

  function matchingPair(text, start, open, close) {
    let depth = 0;
    for (let i = start; i < text.length; i++) {
      if (text[i] === "\\") { i++; continue; }
      if (text[i] === open) depth++;
      else if (text[i] === close && --depth === 0) return i;
    }
    return -1;
  }

  function stripMarkdownLinks(text) {
    // Inline link destinations can contain balanced parentheses. A plain
    // regexp would leave part of those URLs in the source signature.
    let result = "", i = 0;
    while (i < text.length) {
      const image = text[i] === "!" && text[i + 1] === "[";
      const start = image ? i + 1 : i;
      if (text[start] === "[" && text[start - 1] !== "\\") {
        const close = matchingPair(text, start, "[", "]");
        if (close >= 0 && text[close + 1] === "(") {
          const end = matchingPair(text, close + 1, "(", ")");
          if (end >= 0) {
            if (!image) result += text.slice(start + 1, close);
            i = end + 1;
            continue;
          }
        }
      }
      result += text[i++];
    }
    return result;
  }

  function sourceSignature(prose) {
    // Fenced/inline/indented code is literal on the rendered page. It must not
    // be treated as Markdown or HTML, and formulas inside it are not markers.
    return prose.split("\u0002").map((part, index) => {
      if (index % 2) return textSignature(part);
      let text = stripMarkdownLinks(part)
        .replace(/!\[[^\]]*\]\[[^\]]*\]/g, "")
        .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1")
        .replace(/^ {0,3}\[(?!\^)[^\]]+\]:[^\n]*$/gm, "")
        .replace(/<((?:https?|ftp|mailto):[^>\s]+)>/gi, "$1")
        .replace(/<([^<>\s]+@[^<>\s]+)>/g, "$1");
      // Tags are removed before entity decoding: "&lt;b&gt;" is literal text,
      // not markup.
      text = decodeEntities(text.replace(/<\/?[a-zA-Z][^>]*>/g, ""));
      return textSignature(text);
    }).join("");
  }

  function markdownMath(text) {
    const formulas = [];
    let prose = "", i = 0, lastFormulaEnd = -1;
    const escaped = index => {
      let slashes = 0;
      while (index > 0 && text[--index] === "\\") slashes++;
      return slashes % 2 === 1;
    };
    const literal = value => { prose += `\u0002${value}\u0002`; };
    const links = value => {
      // Do not parse formulas inside link destinations or HTML attributes.
      let depth = 0;
      for (let j = 0; j < value.length; j++) {
        if (value[j] === "(") depth++;
        else if (value[j] === ")" && --depth === 0) return value.slice(0, j + 1);
      }
      return value.slice(0, 1);
    };
    while (i < text.length) {
      const lineStart = i === 0 || text[i - 1] === "\n";
      const fence = lineStart && text.slice(i).match(/^ {0,3}(`{3,}|~{3,})[^\n]*\n/);
      if (fence) {
        const end = new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}[ \\t]*\\r?$`, "m");
        const rest = text.slice(i + fence[0].length), close = end.exec(rest);
        literal(close ? rest.slice(0, close.index) : rest);
        i = close ? i + fence[0].length + close.index + close[0].length : text.length;
        continue;
      }
      if (lineStart) {
        const indent = text.slice(i).match(/^(?: {4,}|\t+)/);
        if (indent) {
          // A four-space indent inside a list is a nested list item, not an
          // indented code block. Strip the structural prefix and keep parsing.
          const nested = text.slice(i + indent[0].length).match(/^(?:\d{1,9}[.)]|[-+*])[ \t]+(?:\[[ xX]\][ \t]+)?/);
          if (nested) { i += indent[0].length + nested[0].length; continue; }
          // Otherwise it is an indented code block. Keep the text for context
          // matching, but never expose "$...$" inside it as a formula.
          const code = text.slice(i).match(/^(?:(?: {4}|\t)[^\n]*(?:\n|$)|[ \t]*(?:\n|$))+/)[0];
          literal(code);
          i += code.length;
          continue;
        }
      }
      if (lineStart) {
        const quoted = text.slice(i).match(/^(?: {0,3}>[ \t]?)*/)[0].length;
        const list = text.slice(i + quoted).match(/^ {0,3}(?:\d{1,9}[.)]|[-+*])[ \t]+(?:\[[ xX]\][ \t]+)?/);
        if (list) { i += quoted + list[0].length; continue; }
        const definition = text.slice(i).match(/^ {0,3}\[(?!\^)[^\]]+\]:[^\n]*(?:\n|$)/);
        if (definition) { prose += definition[0]; i += definition[0].length; continue; }
      }
      if (text[i] === "`" && !escaped(i)) {
        const ticks = text.slice(i).match(/^`+/)[0], end = text.indexOf(ticks, i + ticks.length);
        if (end >= 0) { literal(text.slice(i + ticks.length, end)); i = end + ticks.length; continue; }
      }
      if (text[i] === "<") {
        const rest = text.slice(i);
        const comment = rest.match(/^<!--[\s\S]*?-->/);
        if (comment) { i += comment[0].length; continue; }
        const autolink = rest.match(/^<([^<>\s]+@[^<>\s]+|(?:https?|ftp|mailto):[^<>\s]+)>/i);
        if (autolink) { prose += autolink[0]; i += autolink[0].length; continue; }
        const tag = rest.match(/^<\/?[a-zA-Z][^>]*>/);
        if (tag) { prose += tag[0]; i += tag[0].length; continue; }
      }
      if (text[i] === "(" && text[i - 1] === "]") {
        const destination = links(text.slice(i));
        prose += destination;
        i += destination.length;
        continue;
      }
      let open = null, close = null;
      if (text.startsWith("$$", i) && !escaped(i)) { open = close = "$$"; }
      else if (text[i] === "$" && !escaped(i) && (text[i - 1] !== "$" || i === lastFormulaEnd) && !/\s/.test(text[i + 1] || " ")) { open = close = "$"; }
      else if (!escaped(i) && (text.startsWith("\\(", i) || text.startsWith("\\[", i))) {
        open = text.slice(i, i + 2); close = open === "\\(" ? "\\)" : "\\]";
      }
      if (open) {
        let end = text.indexOf(close, i + open.length);
        while (end >= 0 && escaped(end)) end = text.indexOf(close, end + close.length);
        if (close === "$" && end >= 0 &&
            (/\s/.test(text[end - 1]) || /\d/.test(text[end + 1] || ""))) end = -1;
        if (end >= 0 && (open !== "$" || !text.slice(i + 1, end).includes("\n"))) {
          const tex = text.slice(i + open.length, end).trim();
          if (tex) {
            formulas.push({ tex, display: open === "$$" || open === "\\[" });
            lastFormulaEnd = end + close.length;
            prose += "\u0001"; i = lastFormulaEnd; continue;
          }
        }
      }
      prose += text[i++];
    }
    const key = sourceSignature(prose), marks = [];
    for (let j = 0; j < key.length; j++) if (key[j] === "\u0001") marks.push(j);
    return { key, marks, formulas };
  }

  function collectMarkdown(value, output, limit = 5000) {
    const seen = new Set();
    let budget = limit;
    function visit(value, depth) {
      if (--budget < 0) return;
      if (typeof value === "string") {
        if (value.length <= 250000 && /\$|\\[([]/.test(value)) output.add(value);
      } else if (value && typeof value === "object" && depth < 12 && !seen.has(value) && !(value instanceof Node)) {
        seen.add(value);
        for (const key of Object.keys(value).slice(0, 1000)) {
          if (budget < 0) break;
          visit(ownValue(value, key), depth + 1);
        }
      }
    }
    visit(value, 0);
  }

  // Clicking a formula without an inline source scans the page's JSON payloads,
  // which is the only expensive step of that path. It is split out here so the
  // idle warmer can fill the per-script cache ahead of the click.
  function scriptMarkdown(script) {
    const text = script.textContent;
    let cached = embeddedSources.get(script);
    if (!cached || cached.text !== text) {
      const found = new Set();
      try { collectMarkdown(JSON.parse(text), found); } catch { /* Not a JSON source document. */ }
      cached = { text, values: [...found].map(markdownMath).filter(value => value.formulas.length) };
      embeddedSources.set(script, cached);
    }
    return cached.values;
  }

  function jsonScripts() {
    const scripts = [];
    let bytes = 0;
    for (const script of document.querySelectorAll('script[type="application/json"],script[type="application/ld+json"]')) {
      const length = script.textContent.length;
      bytes += length;
      if (length > 5000000 || bytes > 8000000) continue;
      scripts.push(script);
    }
    return scripts;
  }

  function pageMarkdown() {
    const values = [];
    for (const script of jsonScripts()) values.push(...scriptMarkdown(script));
    return values;
  }

  let warmIdle = 0;
  let warmStarted = false;
  const warmSeen = new WeakMap();

  function warmSources() {
    if (warmIdle) return;
    // One script per idle slice keeps a multi-megabyte payload from landing as a
    // single long task.
    const run = () => {
      warmIdle = 0;
      for (const script of jsonScripts()) {
        const length = script.textContent.length;
        if (warmSeen.get(script) === length) continue;
        warmSeen.set(script, length);
        scriptMarkdown(script);
        return warmSources();
      }
    };
    warmIdle = typeof requestIdleCallback === "function"
      ? requestIdleCallback(run, { timeout: 3000 })
      : setTimeout(run, 300);
  }

  function hasInlineSource(node) {
    const tex = node.getAttribute("data-latex") ?? node.getAttribute("data-tex");
    if (typeof tex === "string" && tex.trim()) return true;
    if (node.querySelector(TEX)?.textContent?.trim()) return true;
    return node.matches(".MathJax_Display,.MathJax,.MathJax_SVG_Display,.MathJax_SVG");
  }

  function needsPageSources() {
    for (const node of document.querySelectorAll(MATH)) if (!hasInlineSource(node)) return true;
    return false;
  }

  function watchSources() {
    // Streaming pages rewrite their payload constantly. Rescanning on every
    // change would cost more than the click it saves, so wait for a quiet DOM.
    if (warmStarted || !document.querySelector('script[type="application/json"],script[type="application/ld+json"]')) return;
    warmStarted = true;
    if (typeof MutationObserver === "function") {
      let settle = 0;
      new MutationObserver(() => {
        clearTimeout(settle);
        settle = setTimeout(() => { settle = 0; warmSources(); }, 1500);
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
    warmSources();
  }

  function sourceCandidates(node, items) {
    if (!items.markdown) {
      items.markdown = pageMarkdown();
      items.localMarkdown = new WeakMap();
      items.scopes = new WeakMap();
      items.recovered = new WeakMap();
    }
    const local = [];
    for (let parent = node, depth = 0; parent && depth < 7; parent = parentOf(parent), depth++) {
      let values = items.localMarkdown.get(parent);
      if (!values) {
        const strings = new Set();
        const vue = ownValue(parent, "__vueParentComponent");
        collectMarkdown(vue?.props, strings, 600);
        collectMarkdown(ownValue(parent, "__vue__")?.$props, strings, 600);
        const propsKey = Object.keys(parent).find(key => key.startsWith("__reactProps$"));
        if (propsKey) collectMarkdown(ownValue(parent, propsKey), strings, 600);
        let fiber = reactFiber(parent);
        for (let i = 0; fiber && i < 4; i++, fiber = fiber.return) collectMarkdown(fiber.memoizedProps, strings, 600);
        values = [...strings].map(markdownMath).filter(value => value.formulas.length);
        items.localMarkdown.set(parent, values);
      }
      for (const value of values) local.push(value);
    }
    // Different component layers often expose the same Markdown string. Keep
    // one candidate per parsed key *and* formula list; identical prose with
    // different formulas must remain ambiguous instead of being deduplicated.
    const unique = new Map();
    for (const value of [...local, ...items.markdown]) {
      const identity = `${value.key}\u0000${value.formulas.map(formula => `${formula.display}:${formula.tex}`).join("\u0000")}`;
      if (!unique.has(identity)) unique.set(identity, value);
    }
    return [...unique.values()];
  }

  function isRendered(node) {
    try {
      if (typeof node.checkVisibility === "function" &&
          node.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return true;
    } catch { /* Fall through to computed style. */ }
    const style = getComputedStyle(node);
    // checkVisibility() reports false for display:contents even though its
    // children are rendered. Such wrappers are common in app layouts.
    if (style.display === "contents") return style.visibility !== "hidden" && style.visibility !== "collapse";
    return style.display !== "none" && style.visibility !== "hidden" &&
      style.visibility !== "collapse" && style.opacity !== "0";
  }

  function sourceScope(root, target) {
    let text = "", budget = 12000;
    const nodes = [];
    function visit(node) {
      if (--budget < 0 || text.length > 100000) return;
      if (node.nodeType === Node.TEXT_NODE) { text += node.data; return; }
      if (node.nodeType !== Node.ELEMENT_NODE || node.matches(`${SKIP},${EDITOR},button,.latex-copy-editor,.latex-copy-toast`) || node.hidden) return;
      if (node.getAttribute("aria-hidden") === "true" || !isRendered(node)) return;
      if (node.matches(MATH)) { text += "\u0001"; nodes.push(node); return; }
      if (node.localName === "svg") return;
      for (const child of node.childNodes) visit(child);
      // Only enter shadow trees that actually contain the formula. This keeps
      // unrelated component internals out of the context signature.
      if (node.shadowRoot && shadowContains(node.shadowRoot, target)) {
        for (const child of node.shadowRoot.childNodes) visit(child);
      }
    }
    visit(root);
    const complete = budget >= 0 && text.length <= 100000;
    return { key: complete ? pageSignature(text) : "", nodes, complete };
  }

  function recoverSource(node, items) {
    // HTML-only renderers may keep the Markdown in component props or embedded
    // JSON. Match surrounding prose and every formula position, never a page-
    // wide formula index or a reconstruction from visual glyphs.
    const direct = ownerSource(node);
    if (direct) return { tex: direct, display: isDisplay(node) };
    const candidates = sourceCandidates(node, items);
    if (items.recovered.has(node)) return items.recovered.get(node);
    for (let root = parentOf(node), depth = 0; root && root !== document.body && depth < 6; root = parentOf(root), depth++) {
      let scope = items.scopes.get(root);
      if (!scope) { scope = sourceScope(root, node); items.scopes.set(root, scope); }
      // Scopes only grow as we climb; an incomplete child cannot become
      // complete in a larger ancestor.
      if (!scope.complete) break;
      if (scope.key.replace(/\u0001/g, "").length < 6) continue;
      const index = scope.nodes.indexOf(node);
      if (index < 0) continue;
      const choices = new Map();
      for (const candidate of candidates) {
        if (candidate.key.length < scope.key.length) continue;
        let start = candidate.key.indexOf(scope.key), matches = 0;
        while (start >= 0 && matches++ < 20) {
          const first = candidate.marks.indexOf(start + scope.key.indexOf("\u0001"));
          const source = candidate.formulas[first + index];
          if (first >= 0 && source && candidate.marks[first + scope.nodes.length - 1] < start + scope.key.length) {
            choices.set(`${source.display}:${source.tex}`, source);
          }
          start = candidate.key.indexOf(scope.key, start + 1);
        }
      }
      if (choices.size === 1) {
        const source = choices.values().next().value;
        items.recovered.set(node, source);
        return source;
      }
    }
    items.recovered.set(node, null);
    return null;
  }

  function isDisplay(node) {
    return node.matches(".katex-display,.MathJax_Display,.MathJax_SVG_Display") ||
      !!node.closest(".katex-display,.MathJax_Display,.MathJax_SVG_Display") ||
      node.getAttribute("display") === "true" || node.getAttribute("display") === "block" ||
      node.getAttribute("data-display") === "true" || [...node.classList].some(name => /(?:^|-)math-display$/.test(name));
  }

  function formula(node, items) {
    if (!node.matches(MATH)) return null;
    const edited = editedSources.get(node);
    if (edited) return edited;
    const item = items.get(node);
    if (item) return item;
    let tex = node.getAttribute("data-latex") ?? node.getAttribute("data-tex");
    if (!tex?.trim()) tex = node.querySelector(TEX)?.textContent ?? null;
    let display = isDisplay(node);

    // MathJax 2 retains the input in a script element beside its visual output.
    if (tex === null && node.matches(".MathJax_Display,.MathJax,.MathJax_SVG_Display,.MathJax_SVG")) {
      const frame = node.matches(".MathJax,.MathJax_SVG") ? node : node.querySelector(".MathJax,.MathJax_SVG");
      try {
        const jax = window.MathJax?.Hub?.getJaxFor(frame || node);
        if (jax?.inputJax === "TeX") tex = jax.originalText;
      } catch { /* Fall back to the original script below. */ }
      if (tex === null) {
        const script = (frame?.id && document.getElementById(frame.id.replace(/-Frame$/, ""))) || node.nextElementSibling;
        if (script?.matches('script[type^="math/tex"]')) {
          tex = script.textContent;
          display ||= /mode\s*=\s*display/i.test(script.type);
        }
      }
    }
    return typeof tex === "string" && tex.trim() ? { tex, display } : recoverSource(node, items);
  }

  function normalize({ tex, display }) {
    tex = tex.trim();
    if (tex.startsWith("$$") && tex.endsWith("$$") && tex.length > 4) {
      tex = tex.slice(2, -2).trim();
      display = true;
    } else if ((tex.startsWith("\\[") && tex.endsWith("\\]")) ||
               (tex.startsWith("\\(") && tex.endsWith("\\)"))) {
      display = tex.startsWith("\\[");
      tex = tex.slice(2, -2).trim();
    } else if (tex.startsWith("$") && tex.endsWith("$") && tex.length > 2) {
      tex = tex.slice(1, -1);
      display = false;
    }
    return { tex, display };
  }

  function delimit(source) {
    const { tex, display } = normalize(source);
    // A trailing TeX comment must not swallow the closing delimiter.
    const comment = /(^|[^\\])(\\\\)*%/.test(tex.split("\n").at(-1));
    return { text: display ? `$$\n${tex}\n$$` : `$${tex}${comment ? "\n" : ""}$`, tex, display };
  }

  function clickedFormula(event) {
    const target = element(event.composedPath()[0]);
    if (target?.closest(`${EDITOR},button`) || target?.isContentEditable) return null;
    const node = mathAncestor(target);
    if (!node) return null;
    const source = formula(node, mathJaxItems(node));
    // Clicking copies and edits the bare source; only selection copy adds the
    // Markdown delimiters.
    return source ? { node, math: normalize(source) } : null;
  }

  function fallbackCopy(text) {
    const selection = window.getSelection();
    const ranges = [];
    for (let i = 0; selection && i < selection.rangeCount; i++) ranges.push(selection.getRangeAt(i).cloneRange());
    const active = document.activeElement;
    const input = document.createElement("textarea");
    input.value = text;
    input.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    try {
      document.documentElement.append(input);
      input.focus({ preventScroll: true });
      input.select();
      pendingCopy = text;
      return document.execCommand("copy");
    } finally {
      pendingCopy = null;
      input.remove();
      active?.focus({ preventScroll: true });
      selection?.removeAllRanges();
      for (const range of ranges) selection.addRange(range);
    }
  }

  async function copyFormula(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // HTTP pages and restricted frames may only support user-initiated copy.
      try { return fallbackCopy(text); } catch { return false; }
    }
  }

  function shadowUI(host, css) {
    const shadow = host.attachShadow({ mode: "open" });
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    shadow.adoptedStyleSheets = [sheet];
    return shadow;
  }

  function darkTheme(node) {
    const rgb = getComputedStyle(node).color.match(/[\d.]+/g);
    return rgb && (+rgb[0] * 0.2126 + +rgb[1] * 0.7152 + +rgb[2] * 0.0722) > 160;
  }

  function rendererFor(node) {
    if (node.matches(".katex,.katex-display") || node.querySelector(".katex") || node.dataset.latexCopyEngine === "katex") return "katex";
    const mjx = node.matches("mjx-container") ? node : node.querySelector("mjx-container");
    if (mjx || node.matches(".MathJax,.MathJax_Display,.MathJax_SVG,.MathJax_SVG_Display") || node.dataset.latexCopyEngine?.startsWith("mathjax")) {
      const format = mjx?.getAttribute("jax") || window.MathJax?.startup?.output?.name || node.dataset.latexCopyEngine;
      return /chtml/i.test(format || "") ? "mathjax-chtml" : "mathjax-svg";
    }
    if (node.matches(SVG_MATH)) return "svg";
    if (window.katex?.render) return "katex";
    if (window.MathJax?.tex2chtmlPromise) return "mathjax-chtml";
    if (window.MathJax?.tex2svgPromise) return "mathjax-svg";
    return "unknown";
  }

  function formulaStyle(node) {
    const root = node.matches(".katex,.katex-display") ? node : node.querySelector(".katex-display,.katex") || node;
    const visual = root.matches(".katex") ? root : root.querySelector(".katex") || root.querySelector("mjx-container,.MathJax,.MathJax_SVG") || root;
    const parent = node.parentElement || node.getRootNode().host || node;
    const size = parseFloat(getComputedStyle(visual).fontSize);
    const outer = parseFloat(getComputedStyle(root).fontSize);
    const base = parseFloat(getComputedStyle(parent).fontSize);
    const em = ratio => `${Number.isFinite(ratio) && ratio > 0 ? ratio : 1}em`;
    const namespaced = !!visual.querySelector(".katex-base,.katex-strut");
    return {
      fontSize: em(outer / base), visualSize: em(size / base), mathSize: em(size / outer),
      output: visual.querySelector(".katex-mathml") ? "htmlAndMathml" : "html",
      aliases: ["base", "strut", "sizing"].filter(name => namespaced && !visual.querySelector(`.${name}`)),
      fleqn: root.classList.contains("fleqn"), leqno: root.classList.contains("leqno"),
      classes: [...root.classList].filter(name => !/^(katex(?:-display)?|fleqn|leqno|latex-copy-.*|mathjax_ignore|tex2jax_ignore)$/.test(name))
    };
  }

  function feedback(node, text) {
    if (!node.isConnected) return;
    toast?.remove();
    const host = document.createElement("span");
    toast = host;
    host.className = "latex-copy-toast";
    host.setAttribute("role", "status");
    host.setAttribute("aria-live", "polite");
    const rect = node.getBoundingClientRect();
    host.style.left = `${Math.max(42, Math.min(innerWidth - 42, rect.left + rect.width / 2))}px`;
    host.style.top = `${Math.max(32, rect.top - 7)}px`;
    const dark = darkTheme(node);
    const shadow = shadowUI(host, `
      :host{pointer-events:none!important}
      span{display:inline-flex;align-items:center;white-space:nowrap;
        font:500 11px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
        letter-spacing:0.01em;padding:5px 9px;border-radius:5px;
        color:${dark ? "#fafafa" : "#ffffff"};
        background:${dark ? "#27272ae6" : "#0f172ae6"};
        border:1px solid ${dark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)"};
        box-shadow:${dark ? "0 4px 14px rgba(0,0,0,0.45)" : "0 4px 14px rgba(15,23,42,0.16)"};
        animation:toast-pop .95s cubic-bezier(0.16,1,0.3,1) both}
      @keyframes toast-pop{
        0%{opacity:0;transform:translateY(3px) scale(0.96)}
        12%,70%{opacity:1;transform:translateY(0) scale(1)}
        100%{opacity:0;transform:translateY(-3px) scale(0.98)}
      }
    `);
    const label = document.createElement("span");
    label.textContent = text;
    shadow.append(label);
    document.documentElement.append(host);
    setTimeout(() => { host.remove(); if (toast === host) toast = null; }, 950);
  }

  function setHover(node) {
    if (node === hovered) return;
    hovered?.classList.remove("latex-copy-hover");
    hovered = node;
    hovered?.classList.add("latex-copy-hover");
  }

  window.addEventListener("pointerover", event => {
    if (event.pointerType === "touch") return;
    const target = element(event.composedPath()[0]);
    const node = mathAncestor(target);
    if (node === hovered) return;
    // Hover must stay cheap. Resolving a Markdown source can scan the page's
    // JSON and component tree, so only do it on click/contextmenu — but start
    // that scan in the background once a formula without a source is hovered.
    if (node && !hasInlineSource(node)) watchSources();
    setHover(node && !target?.isContentEditable && !target?.closest(EDITOR) && !target?.closest("button") ? node : null);
  }, true);
  window.addEventListener("pointerout", event => {
    if (hovered && mathAncestor(event.relatedTarget) !== hovered) setHover(null);
  }, true);

  function fallbackRender(target) {
    return new Promise((resolve, reject) => {
      const tex = target.dataset.latexCopyTex;
      const displayMode = target.dataset.latexCopyDisplay === "true";
      const fleqn = target.dataset.latexCopyFleqn === "true";
      const leqno = target.dataset.latexCopyLeqno === "true";
      const output = target.dataset.latexCopyOutput === "html" ? "html" : "htmlAndMathml";

      delete target.dataset.latexCopyRequest;
      delete target.dataset.latexCopyDisplay;
      delete target.dataset.latexCopyFleqn;
      delete target.dataset.latexCopyLeqno;
      delete target.dataset.latexCopyOutput;
      delete target.dataset.latexCopyStatus;
      delete target.dataset.latexCopyError;
      delete target.dataset.latexCopyTex;

      const katexObj = window.katex || self.katex;
      if (typeof katexObj?.render === "function") {
        try {
          katexObj.render(tex, target, {
            displayMode,
            output,
            throwOnError: true,
            trust: false,
            fleqn,
            leqno
          });
          resolve();
        } catch (e) {
          reject(e);
        }
      } else {
        reject(new Error("KaTeX 渲染引擎未就绪。"));
      }
    });
  }

  function finishKatex(target, style) {
    const root = target.firstElementChild;
    if (!root?.matches(".katex,.katex-display")) throw new Error("网页的 KaTeX 接口没有返回可用的公式。");
    target.classList.add(...root.classList, ...style.classes);
    for (const attr of root.attributes) {
      if (attr.name !== "class" && attr.name !== "style" && !target.hasAttribute(attr.name)) target.setAttribute(attr.name, attr.value);
    }
    target.replaceChildren(...root.childNodes);
    // Some HTML-only builds namespace these otherwise generic internal names.
    for (const name of style.aliases) {
      for (const node of target.querySelectorAll(`.${name}`)) node.classList.replace(name, `katex-${name}`);
    }
    // Keep the page's original KaTeX structure and a single display margin.
    target.style.fontSize = target.matches(".katex") ? style.visualSize : style.fontSize;
    if (target.matches(".katex-display")) target.querySelector(".katex").style.fontSize = style.mathSize;
  }

  async function renderEdited(target, source, engine, style) {
    if (engine === "katex") {
      const renderer = pageRenderers.get(target) || window.katex;
      if (renderer?.render) {
        await renderer.render(source.tex, target, {
          displayMode: source.display, output: style.output, throwOnError: true, trust: false,
          fleqn: style.fleqn, leqno: style.leqno
        });
      } else {
        // The page may keep its KaTeX API private. Use the same HTML format and
        // the page's existing KaTeX CSS/font faces, never native MathML layout.
        target.dataset.latexCopyTex = source.tex;
        target.dataset.latexCopyDisplay = String(source.display);
        target.dataset.latexCopyFleqn = String(style.fleqn);
        target.dataset.latexCopyLeqno = String(style.leqno);
        target.dataset.latexCopyOutput = style.output;
        await fallbackRender(target);
      }
      finishKatex(target, style);
    } else if (engine.startsWith("mathjax-")) {
      const method = engine === "mathjax-chtml" ? "tex2chtmlPromise" : "tex2svgPromise";
      const fn = window.MathJax?.[method] || window.MathJax?.tex2chtmlPromise || window.MathJax?.tex2svgPromise;
      if (fn) {
        const result = await fn.call(window.MathJax, source.tex, { display: source.display });
        const error = result.querySelector('[data-mml-node="merror"],merror');
        if (error) throw new Error(error.getAttribute("data-mjx-error") || error.textContent || "公式语法有误。");
        result.style.fontSize = "inherit";
        target.style.fontSize = style.visualSize;
        if (target.matches("mjx-container")) {
          for (const attr of result.attributes) {
            if (attr.name !== "style" && target.getAttribute(attr.name) !== attr.value) target.setAttribute(attr.name, attr.value);
          }
          target.replaceChildren(...result.childNodes);
        } else {
          target.append(result);
        }
        if (engine === "mathjax-chtml" && window.MathJax.chtmlStylesheet) {
          const sheet = window.MathJax.chtmlStylesheet();
          const previous = document.getElementById(sheet.id || "MJX-CHTML-styles");
          if (previous) previous.replaceWith(sheet);
          else document.head.append(sheet);
        }
        return;
      }
      const hub = window.MathJax?.Hub;
      if (hub?.Queue) {
        const frame = target.matches(".MathJax,.MathJax_SVG") ? target : target.querySelector(".MathJax,.MathJax_SVG") || target;
        let jax = hub.getJaxFor?.(frame);
        if (!jax && frame.id) {
          const script = document.getElementById(frame.id.replace(/-Frame$/, "")) || target.nextElementSibling;
          if (script?.matches?.('script[type^="math/tex"]')) jax = hub.getJaxFor?.(script);
        }
        if (jax?.Text) {
          const script = jax.SourceElement?.() ||
            (frame.id && document.getElementById(frame.id.replace(/-Frame$/, ""))) ||
            target.nextElementSibling;
          let errText = "";
          await new Promise(resolve => {
            hub.Queue(["Text", jax, source.tex], () => {
              const prev = script?.previousElementSibling;
              const err = (prev || target).querySelector?.(".MathJax_Error");
              if (err) errText = err.textContent || "公式语法有误。";
              resolve();
            });
          });
          const newTarget = (script?.previousElementSibling?.matches?.(MATH) && script.previousElementSibling) ||
            (script?.id && document.getElementById(script.id + "-Frame")) ||
            (target.id && document.getElementById(target.id)) ||
            target;
          if (errText) {
            const err = new Error(errText);
            err.nextTarget = newTarget;
            throw err;
          }
          return newTarget;
        }
      }
      throw new Error("当前网页未提供对应的 MathJax 渲染接口，已保留源码。");
    } else {
      throw new Error(engine === "svg" ? "网页未开放 SVG 渲染接口，源码与原公式已保留。" : "无法识别当前公式的渲染引擎，已保留源码。");
    }
  }

  function tetherEditor(host, anchor, lost, measure) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("latex-copy-connector");
    svg.setAttribute("aria-hidden", "true");
    const line = document.createElementNS(svg.namespaceURI, "line");
    const dot = document.createElementNS(svg.namespaceURI, "circle");
    dot.setAttribute("r", "2");
    svg.append(line, dot);
    svg.dataset.theme = darkTheme(anchor) ? "dark" : "light";
    document.documentElement.append(svg);
    let stopped = false;
    let offset = null;
    let drag = null;
    let manual = false;
    let needsFit = true;
    let applied = "";
    let fitDimensions = "";
    const clamp = (value, min, max) => Math.max(min, Math.min(Math.max(min, max), value));
    const clips = [];
    const scrollRoots = new Set([window]);
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = document.body && getComputedStyle(document.body);
    const bodyOverflowIsViewport = document.documentElement.localName === "html" &&
      rootStyle.overflowX === "visible" && rootStyle.overflowY === "visible" &&
      rootStyle.contain === "none" && bodyStyle?.contain === "none" && bodyStyle.display !== "none";
    let native = !anchor.matches(".MathJax,.MathJax_Display,.MathJax_SVG,.MathJax_SVG_Display") &&
      anchor.getRootNode() === document && CSS.supports("anchor-name", "--latex-copy") && CSS.supports("top", "anchor(top)");
    for (let node = anchor.parentElement || anchor.getRootNode().host; node; node = node.parentElement || node.getRootNode().host) {
      const style = getComputedStyle(node);
      const x = /auto|scroll|hidden|clip/.test(style.overflowX);
      const y = /auto|scroll|hidden|clip/.test(style.overflowY);
      // Root overflow, and body overflow propagated to the viewport, do not
      // clip to those elements' own boxes. A fixed app can leave body at 0px.
      // https://www.w3.org/TR/css-overflow-3/#overflow-propagation
      const viewport = node === document.documentElement || (node === document.body && bodyOverflowIsViewport);
      if ((x || y) && !viewport) clips.push({ node, x, y });
      if (style.getPropertyValue("anchor-scope").trim() === "all") native = false;
      const root = node.getRootNode();
      if (root !== document) scrollRoots.add(root);
    }
    const previousName = anchor.style.getPropertyValue("anchor-name");
    const previousPriority = anchor.style.getPropertyPriority("anchor-name");
    const name = `--latex-copy-${++requestId}`;
    if (native) {
      const names = getComputedStyle(anchor).getPropertyValue("anchor-name").trim();
      anchor.style.setProperty("anchor-name", names && names !== "none" ? `${names}, ${name}` : name, "important");
      for (const node of [host, svg]) {
        node.dataset.nativeAnchor = "";
        node.style.setProperty("position-anchor", name);
      }
      svg.style.setProperty("left", "anchor(left)", "important");
      svg.style.setProperty("top", "anchor(top)", "important");
    } else {
      // Document positioning scrolls natively with the outer page. Nested
      // scrollers are updated synchronously, without an extra animation frame.
      host.style.setProperty("position", "absolute", "important");
      svg.style.setProperty("position", "absolute", "important");
    }
    host.dataset.positioning = native ? "anchor" : "document";
    const visibility = r => {
      let left = Math.max(0, r.left), top = Math.max(0, r.top);
      let right = Math.min(document.documentElement.clientWidth || innerWidth, r.right);
      let bottom = Math.min(document.documentElement.clientHeight || innerHeight, r.bottom);
      for (const clip of clips) {
        const box = clip.node.getBoundingClientRect();
        if (clip.x) { left = Math.max(left, box.left); right = Math.min(right, box.right); }
        if (clip.y) { top = Math.max(top, box.top); bottom = Math.min(bottom, box.bottom); }
      }
      const visible = right > left && bottom > top;
      host.toggleAttribute("data-out-of-view", !visible);
      svg.toggleAttribute("hidden", !visible);
      return visible;
    };
    const paint = (r, w, h) => {
      if (native) {
        const next = `${offset.x},${offset.y}`;
        if (next !== applied) {
          host.style.setProperty("left", `calc(anchor(left) + ${offset.x}px)`, "important");
          host.style.setProperty("top", `calc(anchor(top) + ${offset.y}px)`, "important");
          applied = next;
        }
      } else {
        host.style.setProperty("left", `${r.left + scrollX + offset.x}px`, "important");
        host.style.setProperty("top", `${r.top + scrollY + offset.y}px`, "important");
        svg.style.setProperty("left", `${r.left + scrollX}px`, "important");
        svg.style.setProperty("top", `${r.top + scrollY}px`, "important");
      }
      const ox = offset.x, oy = offset.y;
      const padA = 3.5;
      const overlapW = Math.max(0, Math.min(r.width + padA, ox + w) - Math.max(-padA, ox));
      const overlapH = Math.max(0, Math.min(r.height + padA, oy + h) - Math.max(-padA, oy));
      if (overlapW > 0 && overlapH > 0) {
        line.setAttribute("x1", "0");
        line.setAttribute("y1", "0");
        line.setAttribute("x2", "0");
        line.setAttribute("y2", "0");
        dot.setAttribute("visibility", "hidden");
        return;
      }
      const cxA = r.width / 2, cyA = r.height / 2;
      const cxB = ox + w / 2, cyB = oy + h / 2;
      const dx = cxB - cxA, dy = cyB - cyA;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        dot.setAttribute("visibility", "hidden");
        return;
      }
      dot.removeAttribute("visibility");
      const hwA = r.width / 2 + padA, hhA = r.height / 2 + padA;
      const tA = Math.min(
        Math.abs(dx) > 1e-4 ? hwA / Math.abs(dx) : Infinity,
        Math.abs(dy) > 1e-4 ? hhA / Math.abs(dy) : Infinity
      );
      const pxA = clamp(cxA + dx * tA, -padA + 1, r.width + padA - 1);
      const pyA = clamp(cyA + dy * tA, -padA + 1, r.height + padA - 1);
      const hwB = w / 2, hhB = h / 2;
      const tB = Math.min(
        Math.abs(dx) > 1e-4 ? hwB / Math.abs(dx) : Infinity,
        Math.abs(dy) > 1e-4 ? hhB / Math.abs(dy) : Infinity
      );
      const pxB = clamp(cxB - dx * tB, ox + 2, ox + w - 2);
      const pyB = clamp(cyB - dy * tB, oy + 2, oy + h - 2);
      const dist = Math.hypot(pxB - pxA, pyB - pyA);
      if (dist < 4) {
        dot.setAttribute("visibility", "hidden");
        line.setAttribute("x1", "0");
        line.setAttribute("y1", "0");
        line.setAttribute("x2", "0");
        line.setAttribute("y2", "0");
        return;
      }
      host.dataset.side = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "below" : "above");
      line.setAttribute("x1", pxA.toFixed(1));
      line.setAttribute("y1", pyA.toFixed(1));
      line.setAttribute("x2", pxB.toFixed(1));
      line.setAttribute("y2", pyB.toFixed(1));
      dot.setAttribute("cx", pxA.toFixed(1));
      dot.setAttribute("cy", pyA.toFixed(1));
    };
    let scriptNode = (anchor.id && document.getElementById(anchor.id.replace(/-Frame$/, ""))) ||
      (anchor.nextElementSibling?.matches?.('script[type^="math/tex"]') ? anchor.nextElementSibling : null);
    const checkAnchor = () => {
      if (!host.isConnected) return false;
      if (anchor.isConnected) return true;
      const scriptId = scriptNode?.id || anchor.id?.replace(/-Frame$/, "");
      const fresh = (anchor.id && document.getElementById(anchor.id)) ||
        (scriptId && document.getElementById(scriptId + "-Frame")) ||
        (scriptNode?.isConnected && scriptNode.previousElementSibling?.matches?.(MATH) ? scriptNode.previousElementSibling : null);
      if (fresh?.isConnected && fresh !== anchor) { reanchor(fresh); return true; }
      return Boolean(scriptNode?.isConnected);
    };
    const place = (fit = false) => {
      if (stopped) return;
      if (!checkAnchor()) { lost(); return; }
      if (!anchor.isConnected) return;
      const r = anchor.getBoundingClientRect();
      const vw = document.documentElement.clientWidth || innerWidth;
      const vh = document.documentElement.clientHeight || innerHeight;
      const w = host.offsetWidth, h = host.offsetHeight, edge = 12, gap = 22;
      if (fit) {
        const next = `${r.width},${r.height},${w},${h},${vw},${vh}`;
        if (next !== fitDimensions) needsFit = true;
        fitDimensions = next;
      }
      const visible = visibility(r);
      if (!offset || (needsFit && visible && !drag)) {
        let x = offset ? r.left + offset.x : 0, y = offset ? r.top + offset.y : 0;
        if (!manual) {
          if (vw - r.right - gap - edge >= w) { x = r.right + gap; y = (r.top + r.bottom - h) / 2; }
          else if (r.left - gap - edge >= w) { x = r.left - gap - w; y = (r.top + r.bottom - h) / 2; }
          else if (vh - r.bottom - gap - edge >= h || vh - r.bottom >= r.top) { x = r.right - w; y = r.bottom + gap; }
          else { x = r.right - w; y = r.top - gap - h; }
        }
        x = clamp(x, edge, vw - w - edge);
        y = clamp(y, edge, vh - h - edge);
        if (!offset) {
          const occupied = [...openEditors.values()].filter(editor => editor.host !== host && !editor.host.hasAttribute("data-out-of-view"))
            .map(editor => editor.host.getBoundingClientRect());
          const overlap = (x, y, box) => Math.max(0, Math.min(x + w, box.right + 8) - Math.max(x, box.left - 8)) *
            Math.max(0, Math.min(y + h, box.bottom + 8) - Math.max(y, box.top - 8));
          const score = (x, y) => occupied.reduce((area, box) => area + overlap(x, y, box), 0) + overlap(x, y, r);
          const positions = [[x, y], ...occupied.flatMap(box => [[x, box.bottom + gap], [x, box.top - gap - h]]),
            [r.right + gap, (r.top + r.bottom - h) / 2], [r.left - gap - w, (r.top + r.bottom - h) / 2],
            [r.right - w, r.bottom + gap], [r.right - w, r.top - gap - h]];
          const startX = x, startY = y;
          let best = score(x, y), distance = 0;
          for (const [px, py] of positions.slice(1)) {
            const nextX = clamp(px, edge, vw - w - edge), nextY = clamp(py, edge, vh - h - edge);
            const area = score(nextX, nextY);
            const move = Math.hypot(nextX - startX, nextY - startY);
            if (area < best || (area === best && move < distance)) { x = nextX; y = nextY; best = area; distance = move; }
          }
        }
        offset = { x: x - r.left, y: y - r.top };
        needsFit = false;
      }
      if (offset && visible && !manual) {
        // Keep an automatically placed panel on screen while its formula moves
        // through the viewport. A manually dragged panel keeps its own offset.
        const x = clamp(r.left + offset.x, edge, vw - w - edge);
        const y = clamp(r.top + offset.y, edge, vh - h - edge);
        if (x !== r.left + offset.x || y !== r.top + offset.y) {
          offset = { x: x - r.left, y: y - r.top };
        }
      }
      paint(r, w, h);
    };
    let frame = 0, pendingFit = false;
    const schedule = fit => {
      if (stopped) return;
      pendingFit ||= fit;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const fitNow = pendingFit;
        pendingFit = false;
        if (fitNow) place(true);
        else place();
      });
    };
    const scrolled = () => {
      if (stopped) return;
      if (!checkAnchor()) { lost(); return; }
      if (!anchor.isConnected) return;
      if (native && offset) {
        if (visibility(anchor.getBoundingClientRect()) && needsFit) schedule(true);
      } else schedule(false);
    };
    const resized = () => { measure(); schedule(true); };
    const changed = () => schedule(true);
    const startDrag = event => {
      if (event.button !== 0 || !offset || event.composedPath().some(node => node.matches?.("textarea,input,button,select,a,[role=alert]"))) return;
      const r = anchor.getBoundingClientRect();
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, ax: r.left, ay: r.top, ox: offset.x, oy: offset.y };
      host.setAttribute("data-dragging", "");
      host.setPointerCapture(event.pointerId);
      event.preventDefault();
      event.stopPropagation();
    };
    const moveDrag = event => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!manual && Math.abs(dx) + Math.abs(dy) < 3) return;
      manual = true;
      const r = anchor.getBoundingClientRect();
      const w = host.offsetWidth, h = host.offsetHeight;
      const vp = getViewport();
      const minX = vp.left + 8;
      const maxX = vp.right - w - 8;
      const minY = vp.top + 8;
      const maxY = vp.bottom - h - 8;
      offset = {
        x: clamp(drag.ax + drag.ox + dx, minX, maxX) - r.left,
        y: clamp(drag.ay + drag.oy + dy, minY, maxY) - r.top
      };
      paint(r, w, h);
      event.preventDefault();
      event.stopPropagation();
    };
    const endDrag = event => {
      if (!drag || (event && event.pointerId !== drag.id)) return;
      const id = drag.id;
      drag = null;
      host.removeAttribute("data-dragging");
      if (host.hasPointerCapture(id)) host.releasePointerCapture(id);
    };
    host.addEventListener("pointerdown", startDrag);
    host.addEventListener("pointermove", moveDrag);
    host.addEventListener("pointerup", endDrag);
    host.addEventListener("pointercancel", endDrag);
    host.addEventListener("lostpointercapture", endDrag);
    const observer = new ResizeObserver(resized);
    observer.observe(host);
    observer.observe(anchor);
    if (anchor.parentElement) observer.observe(anchor.parentElement);
    // Inline math has no observable resize box. Watch only its ancestor chain
    // for removals/replacements, rather than observing the entire page subtree.
    const changes = new MutationObserver(changed);
    for (let node = anchor; node; node = node.parentNode || node.host) changes.observe(node, { childList: true });
    for (const root of scrollRoots) root.addEventListener("scroll", scrolled, { capture: true, passive: true });
    window.addEventListener("resize", resized);
    window.visualViewport?.addEventListener("resize", resized);
    window.visualViewport?.addEventListener("scroll", scrolled);
    place(true);
    const disconnect = () => {
      stopped = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      endDrag();
      observer.disconnect();
      changes.disconnect();
      for (const root of scrollRoots) root.removeEventListener("scroll", scrolled, true);
      window.removeEventListener("resize", resized);
      window.visualViewport?.removeEventListener("resize", resized);
      window.visualViewport?.removeEventListener("scroll", scrolled);
      host.removeEventListener("pointerdown", startDrag);
      host.removeEventListener("pointermove", moveDrag);
      host.removeEventListener("pointerup", endDrag);
      host.removeEventListener("pointercancel", endDrag);
      host.removeEventListener("lostpointercapture", endDrag);
      if (native && anchor.style.getPropertyValue("anchor-name").includes(name)) {
        if (previousName) anchor.style.setProperty("anchor-name", previousName, previousPriority);
        else anchor.style.removeProperty("anchor-name");
      }
      svg.remove();
    };
    const reanchor = newAnchor => {
      if (!newAnchor || newAnchor === anchor || stopped) return;
      if (native) {
        if (anchor.style.getPropertyValue("anchor-name").includes(name)) {
          if (previousName) anchor.style.setProperty("anchor-name", previousName, previousPriority);
          else anchor.style.removeProperty("anchor-name");
        }
        const names = getComputedStyle(newAnchor).getPropertyValue("anchor-name").trim();
        newAnchor.style.setProperty("anchor-name", names && names !== "none" ? `${names}, ${name}` : name, "important");
      }
      try { observer.unobserve(anchor); } catch {}
      anchor = newAnchor;
      scriptNode = (anchor.id && document.getElementById(anchor.id.replace(/-Frame$/, ""))) ||
        (anchor.nextElementSibling?.matches?.('script[type^="math/tex"]') ? anchor.nextElementSibling : scriptNode);
      try { observer.observe(anchor); } catch {}
      changes.disconnect();
      for (let node = anchor; node; node = node.parentNode || node.host) changes.observe(node, { childList: true });
      schedule(true);
    };
    return { connector: svg, disconnect, reanchor };
  }

  function stackEditors() {
    let layer = 2147483647 - openEditors.size * 2;
    for (const editor of openEditors.values()) {
      editor.connector?.style.setProperty("z-index", String(layer++), "important");
      editor.host.style.setProperty("z-index", String(layer++), "important");
    }
  }

  function raiseEditor(editor) {
    if (openEditors.get(editor.original) !== editor) return;
    openEditors.delete(editor.original);
    openEditors.set(editor.original, editor);
    stackEditors();
  }

  function captureFormula(node) {
    return node.cloneNode(true);
  }

  function restoreFormula(node, saved) {
    const names = new Set();
    for (const attr of saved.attributes) {
      names.add(attr.name);
      if (node.getAttribute(attr.name) !== attr.value) node.setAttribute(attr.name, attr.value);
    }
    for (const name of node.getAttributeNames()) if (!names.has(name)) node.removeAttribute(name);
    node.replaceChildren(...[...saved.childNodes].map(child => child.cloneNode(true)));
  }

  function editFormula(hit) {
    const existing = openEditors.get(hit.node);
    if (existing) { existing.focus(); return; }
    setHover(null);
    let original = hit.node;
    const style = formulaStyle(original);
    const engine = rendererFor(original);
    const renderer = engine === "katex" ? privateKatex(original) : null;
    // Snapshot before the first live render: later sessions reuse it, so 还原
    // always returns to what the page itself rendered.
    const pristine = formulaMarkup.get(original) || captureFormula(original);
    const pristineSource = pristineSources.get(original) || { tex: hit.math.tex, display: hit.math.display };
    formulaMarkup.set(original, pristine);
    pristineSources.set(original, pristineSource);
    if (renderer) pageRenderers.set(original, renderer);
    let previousFocus = document.activeElement;
    while (previousFocus?.shadowRoot?.activeElement) previousFocus = previousFocus.shadowRoot.activeElement;
    const host = document.createElement("span");
    host.className = "latex-copy-editor mathjax_ignore tex2jax_ignore";
    host.setAttribute("role", "dialog");
    host.setAttribute("aria-label", "编辑公式");
    host.setAttribute("aria-modal", "false");
    host.dataset.theme = darkTheme(original) ? "dark" : "light";
    host.dataset.display = String(hit.math.display);
    const shadow = shadowUI(host, `
      :host{
        --bg:#ffffff;--surface-subtle:#f8fafc;--ink:#0f172a;--muted:#64748b;--faint:#94a3b8;
        --border:#e2e8f0;--line-focus:#475569;--hover-bg:#f1f5f9;
        --primary:#0f172a;--primary-hover:#1e293b;--primary-ink:#ffffff;
        --shadow:0 6px 22px -2px rgba(15,23,42,0.09),0 2px 6px -1px rgba(15,23,42,0.04);
        --alert-bg:#fef2f2;--alert-border:#fee2e2;--alert-ink:#991b1b;
        --scroll-thumb:rgba(15,23,42,0.18);--scroll-thumb-hover:rgba(15,23,42,0.35);
        color:var(--ink);color-scheme:light;
      }
      :host([data-theme=dark]){
        --bg:#18181b;--surface-subtle:#202024;--ink:#f4f4f5;--muted:#a1a1aa;--faint:#71717a;
        --border:#2e2e33;--line-focus:#71717a;--hover-bg:#27272a;
        --primary:#f4f4f5;--primary-hover:#e4e4e7;--primary-ink:#18181b;
        --shadow:0 8px 28px -4px rgba(0,0,0,0.45),0 2px 8px -1px rgba(0,0,0,0.25);
        --alert-bg:#2b1717;--alert-border:#4c1d1d;--alert-ink:#fca5a5;
        --scroll-thumb:rgba(255,255,255,0.22);--scroll-thumb-hover:rgba(255,255,255,0.38);
        color-scheme:dark;
      }
      *{box-sizing:border-box}
      section{
        padding:9px 11px 10px;border:1px solid var(--border);border-radius:8px;
        background:var(--bg);box-shadow:var(--shadow);cursor:grab;touch-action:none;user-select:none;
      }
      :host([data-dragging]), :host([data-dragging]) section, :host([data-dragging]) header, :host([data-dragging]) footer, :host([data-dragging]) .hint{cursor:grabbing!important}
      header{
        display:flex;align-items:center;justify-content:space-between;padding:1px 2px 7px;
        cursor:grab;touch-action:none;user-select:none;
      }
      .meta{display:flex;align-items:center;gap:6px}
      .title{font:600 11px/1.2 system-ui,-apple-system,sans-serif;letter-spacing:0.02em;color:var(--muted)}
      .badge{font:400 11px/1.2 system-ui,-apple-system,sans-serif;color:var(--faint)}
      button.close{
        display:flex;align-items:center;justify-content:center;width:20px;height:20px;padding:0;
        border:0;border-radius:4px;background:transparent;color:var(--muted);cursor:default;
        touch-action:manipulation;transition:color .12s,background .12s;
      }
      button.close:hover{color:var(--ink);background:var(--hover-bg)}
      button.close:focus-visible{outline:1.5px solid var(--line-focus);outline-offset:1px}
      textarea{
        display:block;width:100%;min-height:46px;max-height:min(260px,45vh);padding:7px 9px;
        border:1px solid var(--border);border-radius:5px;
        font:12.5px/1.6 "JetBrains Mono",SFMono-Regular,Menlo,Monaco,Consolas,monospace;
        color:var(--ink);background:var(--surface-subtle);resize:none;cursor:text;outline:none;tab-size:2;
        touch-action:auto;user-select:text;transition:border-color .15s ease;
        overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:var(--scroll-thumb) transparent;
      }
      textarea:focus{border-color:var(--line-focus)}
      textarea::-webkit-scrollbar,[role=alert]::-webkit-scrollbar{width:5px;height:5px}
      textarea::-webkit-scrollbar-track,[role=alert]::-webkit-scrollbar-track{background:transparent}
      textarea::-webkit-scrollbar-thumb,[role=alert]::-webkit-scrollbar-thumb{background:var(--scroll-thumb);border-radius:999px}
      textarea::-webkit-scrollbar-thumb:hover,[role=alert]::-webkit-scrollbar-thumb:hover{background:var(--scroll-thumb-hover)}
      footer{
        display:flex;justify-content:space-between;align-items:center;padding-top:8px;
        margin-top:2px;cursor:grab;user-select:none;
      }
      .hint{font:11px/1.4 system-ui,-apple-system,sans-serif;color:var(--faint);cursor:grab}
      .actions{display:flex;gap:6px;align-items:center}
      footer button{
        padding:4px 9px;border:0;border-radius:4px;background:transparent;color:var(--muted);
        font:500 12px/1.4 system-ui,-apple-system,sans-serif;cursor:default;touch-action:manipulation;
        transition:color .12s,background .12s;
      }
      footer button:hover{color:var(--ink);background:var(--hover-bg)}
      footer button:focus-visible{outline:1.5px solid var(--line-focus);outline-offset:1px}
      footer button.primary{color:var(--primary-ink);background:var(--primary);font-weight:500}
      footer button.primary:hover{background:var(--primary-hover)}
      footer button:disabled{opacity:.4}
      [role=alert]{
        margin-top:8px;max-height:80px;overflow:auto;padding:6px 9px;border-radius:5px;
        background:var(--alert-bg);border:1px solid var(--alert-border);color:var(--alert-ink);
        font:11.5px/1.5 system-ui,-apple-system,sans-serif;white-space:pre-wrap;overflow-wrap:anywhere;
        cursor:text;user-select:text;touch-action:auto;
      }
      [hidden]{display:none!important}
      @media (pointer: coarse), (max-width: 768px) {
        button.close {
          width: 28px !important;
          height: 28px !important;
        }
        button.close svg {
          width: 14px !important;
          height: 14px !important;
        }
        textarea {
          font-size: 16px !important;
          line-height: 1.45 !important;
        }
        footer button {
          padding: 6px 12px !important;
          font-size: 13px !important;
        }
        .hint {
          display: none !important;
        }
      }
    `);
    const panel = document.createElement("section");
    const header = document.createElement("header");
    const meta = document.createElement("div");
    meta.className = "meta";
    const isLive = engine === "katex";
    const title = document.createElement("span");
    title.className = "title";
    title.textContent = engine === "katex" ? "KaTeX" : engine.startsWith("mathjax-") ? "MathJax" : "LaTeX";
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = hit.math.display ? "块级公式" : "行内公式";
    meta.append(title, badge);
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "close";
    closeBtn.title = "关闭 (Esc)";
    closeBtn.setAttribute("aria-label", "关闭 (Esc)");
    closeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
    header.append(meta, closeBtn);
    const input = document.createElement("textarea");
    input.setAttribute("aria-label", "LaTeX 源码");
    input.spellcheck = false;
    input.value = hit.math.tex;
    input.rows = Math.max(2, Math.min(8, input.value.split("\n").length));
    const footer = document.createElement("footer");
    const hint = document.createElement("span");
    hint.className = "hint";
    const isMobile = ("ontouchstart" in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 768;
    hint.textContent = isLive ? (isMobile ? "点击 × 关闭" : "Esc 关闭") : (isMobile ? "点击渲染" : "Ctrl+Enter 渲染");
    const actions = document.createElement("div");
    actions.className = "actions";
    const restore = document.createElement("button");
    restore.type = "button";
    restore.textContent = "还原";
    restore.title = "恢复最初渲染的公式";
    actions.append(restore);
    let renderBtn = null;
    if (!isLive) {
      renderBtn = document.createElement("button");
      renderBtn.type = "button";
      renderBtn.className = "primary";
      renderBtn.textContent = "渲染";
      renderBtn.title = "渲染并关闭 (Ctrl/⌘+Enter)";
      actions.append(renderBtn);
    }
    footer.append(hint, actions);
    const error = document.createElement("div");
    error.setAttribute("role", "alert");
    error.hidden = true;
    panel.append(header, input, footer, error);
    shadow.append(panel);
    original.classList.add("latex-copy-editing");
    document.documentElement.append(host);
    let inputWidth = 0;
    const fitInput = () => {
      input.style.height = "auto";
      const border = input.offsetHeight - input.clientHeight;
      input.style.height = `${input.scrollHeight + border}px`;
      inputWidth = input.clientWidth;
    };
    fitInput();
    const display = hit.math.display;
    let paintTimer = 0;
    let paintToken = 0;
    let painting = false;
    let paintAgain = false;
    const paint = async () => {
      const token = ++paintToken;
      const source = normalize({ tex: input.value, display });
      if (!source.tex.trim()) {
        error.textContent = "请输入公式。";
        error.hidden = false;
        return false;
      }
      const backup = captureFormula(original);
      if (source.display) original.classList.remove("katex");
      else original.classList.remove("katex-display");
      const adoptTarget = nextTarget => {
        if (!nextTarget || nextTarget === original) return;
        original.classList.remove("latex-copy-editing");
        nextTarget.classList.add("latex-copy-editing");
        openEditors.delete(original);
        openEditors.set(nextTarget, editor);
        editor.original = nextTarget;
        formulaMarkup.set(nextTarget, pristine);
        pristineSources.set(nextTarget, pristineSource);
        tether?.reanchor(nextTarget);
        original = nextTarget;
      };
      try {
        const nextTarget = await renderEdited(original, source, engine, style);
        if (token !== paintToken) return false;
        adoptTarget(nextTarget);
        editedSources.set(original, source);
        if (isLive && shadow.activeElement !== input) input.focus({ preventScroll: true });
        error.hidden = true;
        return true;
      } catch (cause) {
        if (token !== paintToken) return false;
        if (cause?.nextTarget) adoptTarget(cause.nextTarget);
        restoreFormula(original, backup);
        if (shadow.activeElement !== input) input.focus({ preventScroll: true });
        error.textContent = cause.message || "无法渲染这段公式。";
        error.hidden = false;
        return false;
      }
    };
    const schedulePaint = () => {
      clearTimeout(paintTimer);
      const run = async () => {
        if (disposed) return;
        if (painting) { paintAgain = true; return; }
        painting = true;
        try {
          await paint();
        } finally {
          painting = false;
          if (paintAgain) { paintAgain = false; schedulePaint(); }
        }
      };
      paintTimer = setTimeout(run, 180);
    };
    const commit = async () => {
      if (disposed || painting) return;
      clearTimeout(paintTimer);
      const source = normalize({ tex: input.value, display });
      if (source.tex === hit.math.tex && source.display === hit.math.display) {
        close();
        return;
      }
      painting = true;
      if (renderBtn) renderBtn.disabled = true;
      try {
        if (await paint()) close();
      } finally {
        painting = false;
        if (renderBtn && !disposed) renderBtn.disabled = false;
      }
    };
    input.addEventListener("input", () => {
      fitInput();
      if (isLive) schedulePaint();
      else error.hidden = true;
    });
    let disposed = false;
    let tether = null;
    const finish = () => {
      const focused = document.activeElement === host;
      clearTimeout(paintTimer);
      paintToken++;
      paintAgain = false;
      tether?.disconnect();
      host.remove();
      original.classList.remove("latex-copy-editing");
      openEditors.delete(original);
      editors.delete(host);
      stackEditors();
      if (focused) {
        if (previousFocus?.isConnected && previousFocus !== document.body && previousFocus !== document.documentElement) previousFocus.focus({ preventScroll: true });
        else [...openEditors.values()].filter(editor => !editor.host.hasAttribute("data-out-of-view")).at(-1)?.focus();
      }
    };
    const close = () => {
      if (disposed) return;
      disposed = true;
      finish();
    };
    const lost = () => {
      if (painting) return;
      close();
    };
    const revert = () => {
      if (disposed) return;
      disposed = true;
      clearTimeout(paintTimer);
      paintToken++;
      editedSources.delete(original);
      restoreFormula(original, pristine);
      const hub = window.MathJax?.Hub;
      if (hub?.Queue && engine.startsWith("mathjax-")) {
        const frame = original.matches(".MathJax,.MathJax_SVG") ? original : original.querySelector(".MathJax,.MathJax_SVG") || original;
        const scriptId = frame.id?.replace(/-Frame$/, "");
        const script = (scriptId && document.getElementById(scriptId)) || original.nextElementSibling;
        const jax = hub.getJaxFor?.(frame) || (script?.matches?.('script[type^="math/tex"]') && hub.getJaxFor?.(script));
        if (jax?.Text) {
          hub.Queue(["Text", jax, pristineSource.tex], () => {
            const restoredNode = (script?.previousElementSibling?.matches?.(MATH) && script.previousElementSibling) ||
              (script?.id && document.getElementById(script.id + "-Frame"));
            if (restoredNode) editedSources.delete(restoredNode);
          });
        }
      }
      finish();
    };
    const editor = {
      host, original, close,
      submit: () => { if (isLive) close(); else commit(); },
      focus: () => { raiseEditor(editor); input.focus({ preventScroll: true }); }
    };
    openEditors.set(original, editor);
    editors.set(host, editor);
    tether = tetherEditor(host, original, lost, () => { if (input.clientWidth !== inputWidth) fitInput(); });
    editor.connector = tether.connector;
    raiseEditor(editor);
    input.focus({ preventScroll: true });
    restore.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); revert(); });
    renderBtn?.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); commit(); });
    closeBtn.addEventListener("click", event => { event.preventDefault(); event.stopPropagation(); close(); });
  }

  window.addEventListener("focusin", event => {
    if (!openEditors.size) return;
    const host = event.composedPath().find(node => editors.has(node));
    if (host) raiseEditor(editors.get(host));
  }, true);

  window.addEventListener("keydown", event => {
    if (!openEditors.size) return;
    const host = event.composedPath().find(node => editors.has(node));
    if (!host) return;
    event.stopImmediatePropagation();
    if (event.isComposing || event.keyCode === 229) return;
    const editor = editors.get(host);
    if (event.key === "Escape") { event.preventDefault(); editor.close(); }
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); editor.submit(); }
  }, true);

  let longPressTimer = null;
  let longPressed = false;
  let preventNextClick = false;

  function cancelLongPress() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  window.addEventListener("pointerdown", event => {
    const host = event.composedPath().find(node => editors.has(node));
    if (host) raiseEditor(editors.get(host));
    cancelLongPress();
    longPressed = false;
    if (event.pointerType === "touch") setHover(null);
    if (event.button !== 0) {
      press = null;
      return;
    }
    const hit = clickedFormula(event);
    press = {
      id: event.pointerId,
      pointerType: event.pointerType,
      x: event.clientX,
      y: event.clientY,
      dragged: false,
      hit
    };
    if (hit) {
      const isTouch = event.pointerType === "touch" || event.pointerType === "pen";
      const delay = isTouch ? 460 : 550;
      longPressTimer = setTimeout(() => {
        longPressTimer = null;
        if (!press || press.dragged) return;
        longPressed = true;
        preventNextClick = true;
        try {
          if (typeof navigator.vibrate === "function") navigator.vibrate(35);
        } catch {}
        try {
          const sel = window.getSelection();
          if (sel && !sel.isCollapsed) sel.removeAllRanges();
        } catch {}
        editFormula(hit);
      }, delay);
    }
  }, true);

  window.addEventListener("pointermove", event => {
    if (!press || event.pointerId !== press.id) return;
    const dx = event.clientX - press.x;
    const dy = event.clientY - press.y;
    const isTouch = press.pointerType === "touch" || press.pointerType === "pen";
    const threshold = isTouch ? 10 : 4;
    if (Math.hypot(dx, dy) > threshold) {
      press.dragged = true;
      cancelLongPress();
    }
  }, true);

  window.addEventListener("pointerup", cancelLongPress, true);
  window.addEventListener("pointercancel", () => {
    cancelLongPress();
    press = null;
    longPressed = false;
  }, true);

  window.addEventListener("scroll", () => {
    cancelLongPress();
    if (press) press.dragged = true;
  }, { passive: true, capture: true });

  window.addEventListener("click", event => {
    cancelLongPress();
    if (preventNextClick || longPressed) {
      preventNextClick = false;
      longPressed = false;
      press = null;
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const gesture = press;
    press = null;
    if (event.button !== 0 || event.detail > 1 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    // Finishing a text selection must not overwrite the clipboard.
    if (gesture?.dragged || (!gesture && !window.getSelection()?.isCollapsed)) return;
    const hit = gesture?.hit || clickedFormula(event);
    if (!hit) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    void copyFormula(hit.math.tex).then(success => feedback(hit.node, success ? "Copied!" : "复制失败"));
  }, true);

  window.addEventListener("contextmenu", event => {
    cancelLongPress();
    const hit = clickedFormula(event);
    if (hit) {
      event.preventDefault();
      event.stopImmediatePropagation();
      preventNextClick = true;
      try {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed) sel.removeAllRanges();
      } catch {}
      if (!longPressed) {
        longPressed = true;
        editFormula(hit);
      }
    } else if (longPressed || preventNextClick) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  function serialize(range, root, items) {
    let text = "";
    let count = 0, total = 0;

    function line(n) {
      text = text.replace(/[ \t]+$/, "");
      if (text) {
        const trailing = text.match(/\n*$/)[0].length;
        text += "\n".repeat(Math.max(0, n - trailing));
      }
    }

    function append(value, whiteSpace) {
      if (!/^(pre|pre-wrap|break-spaces)$/.test(whiteSpace)) {
        value = whiteSpace === "pre-line"
          ? value.replace(/\r\n?/g, "\n").replace(/[\t\f ]+/g, " ").replace(/ *\n */g, "\n")
          : value.replace(/[\t\n\r\f ]+/g, " ");
        if (!text || /[\s]$/.test(text)) value = value.replace(/^ /, "");
      }
      text += value;
    }

    function visit(node, whiteSpace = "normal") {
      if (!range.intersectsNode(node)) return;
      if (node.nodeType === Node.TEXT_NODE) {
        const from = node === range.startContainer ? range.startOffset : 0;
        const to = node === range.endContainer ? range.endOffset : node.length;
        append(node.data.slice(from, to), whiteSpace);
        return;
      }
      if (node.nodeType !== Node.ELEMENT_NODE ||
          node.matches(`${SKIP},${EDITOR},button,.latex-copy-editor,.latex-copy-toast,[aria-hidden="true"]`) ||
          node.hidden) return;
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse") return;

      // Handle the complete formula before visiting its duplicated HTML/MathML.
      const source = formula(node, items);
      if (source) {
        const math = delimit(source);
        if (math.display) line(2);
        text += math.text;
        if (math.display) line(2);
        count++;
        total++;
        return;
      }
      // A formula without a recoverable source must not silently turn into its
      // visual glyphs. The copy handler will keep the browser's native copy
      // when count and total differ.
      if (node.matches(MATH)) { total++; return; }
      if (node.localName === "svg") return;
      if (node.localName === "br") {
        text += "\n";
        return;
      }
      const block = /^(block|flow-root|list-item|flex|grid|table|table-row|table-caption)$/.test(style.display);
      const spacing = /^(p|h[1-6]|blockquote|pre)$/.test(node.localName) ? 2 : 1;
      if (block) line(spacing);
      if (node.localName === "li") {
        const list = node.parentElement;
        if (list?.localName === "ol" || list?.localName === "ul") {
          let marker = "- ";
          if (list.localName === "ol") {
            const start = Number.parseInt(list.getAttribute("start") ?? "1", 10);
            let index = 0;
            for (let previous = node.previousElementSibling; previous; previous = previous.previousElementSibling) {
              if (previous.localName === "li") index++;
            }
            const value = Number.parseInt(node.getAttribute("value") ?? "", 10);
            marker = `${Number.isFinite(value) ? value : (Number.isFinite(start) ? start : 1) + index}. `;
          }
          text += marker;
          const box = node.firstElementChild;
          if (box?.matches('input[type="checkbox"]')) text += box.checked ? "[x] " : "[ ] ";
        }
      }
      for (const child of node.childNodes) visit(child, style.whiteSpace);
      if (block) line(spacing);
      if (style.display === "table-cell") text += "\t";
    }

    visit(root);
    return { text: text.replace(/\n+$/, ""), count, total };
  }

  window.addEventListener("copy", event => {
    if (!event.clipboardData || !event.cancelable) return;
    if (pendingCopy !== null) {
      event.clipboardData.clearData();
      event.clipboardData.setData("text/plain", pendingCopy);
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const active = element(event.composedPath()[0]);
    if (active?.closest(EDITOR) || active?.isContentEditable) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return;
    const chunks = [];
    let count = 0, total = 0;
    try {
      for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(i);
        const root = selectionRoot(range);
        if (!root || root.closest(EDITOR) || root.isContentEditable) return;
        const result = serialize(range, root, mathJaxItems(root));
        chunks.push(result.text);
        count += result.count;
        total += result.total;
      }
      // Partial conversion is worse than native copy: an unrecoverable
      // formula would otherwise contribute rendered glyphs to the clipboard.
      if (!count || count !== total) return;
      event.clipboardData.clearData();
      event.clipboardData.setData("text/plain", chunks.join("\n\n"));
      event.preventDefault();
      // Keep page copy handlers from adding the rendered math a second time.
      event.stopImmediatePropagation();
    } catch {
      // An unsupported page keeps the browser's normal copy behavior.
    }
  }, true);

  // Static pages get their payload scanned once the DOM is ready; pages that
  // build content later are picked up when a formula without a source is
  // hovered.
  if (typeof document.readyState === "string") {
    const start = () => { if (needsPageSources()) watchSources(); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
    else start();
  }

  // Optional hook for the local Node fixtures. It is inert unless a test page
  // installs the callback before this script runs.
  if (typeof globalThis.__latexCopyTestHook === "function") {
    globalThis.__latexCopyTestHook({ markdownMath, pageSignature, sourceSignature });
  }

  // Close open formula editor panels and clear hover on Material for MkDocs instant loading
  if (typeof window.document$ !== "undefined" && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => {
      for (const editor of [...openEditors.values()]) {
        try { editor.close(); } catch {}
      }
      setHover(null);
    });
  }
})();
