// external-links
document.addEventListener("DOMContentLoaded", function() {
  const externalLinks = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');

  const currentHost = window.location.hostname;
  
  externalLinks.forEach(link => {
    try {
      const url = new URL(link.href);
      if (url.hostname !== currentHost) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    } catch (e) {
      // neglect
    }
  });
});

// KaTeX

document$.subscribe(({ body }) => {
 renderMathInElement(body, {
   delimiters: [
     { left: "$$", right: "$$", display: true },
     { left: "$", right: "$", display: false },
     { left: "\\(", right: "\\)", display: false },
     { left: "\\[", right: "\\]", display: true }
   ],
 });
});

// MathJax

// window.MathJax = {
//   tex: {
//     inlineMath: [["\\(", "\\)"]],
//     displayMath: [["\\[", "\\]"]],
//     processEscapes: true,
//     processEnvironments: true
//   },
//   options: {
//     ignoreHtmlClass: ".*|",
//     processHtmlClass: "arithmatex"
//   }
// };

// document$.subscribe(() => { 
//   MathJax.startup.output.clearCache()
//   MathJax.typesetClear()
//   MathJax.texReset()
//   MathJax.typesetPromise()
// })