# Ch2. Basic Graph Algorithms

## Graph

We use $G = (V, E)$ to simply describe a graph.

- $V$: set of vertices (nodes)
- $E$: pairwise relationships among $V$

Accordingly:

- $n$: number of vertices
- $m$: number of edges
    - usually $n - 1 \leq m \leq n(n-1)/2$
    - for connected simple graph (without multi-edges)
- $d_{v}$: number of neighbors of $v$

We can use "Adjacency Matrix" or "Linked Lists" to store a graph.

- Adjacency Matrix: a $n\times n$ matrix, $A[u, v] = 0$ i.f.f. $(u, v) \not\in E$, else $A[u, v] = \text{weigh}(u, v)$
- Linked Lists: for every $v$, there is a linked list containing all neighbours of $v$

|                            | Matrix     | Linked Lists |
| -------------------------- | ---------- | ------------ |
| memory usage               | $O(n^{2})$ | $O(m)$       |
| time to check $ (u,v) ∈ E$ | $O(1)$     | $O(d_{u})$   |
| time to list $v$ neighbors | $O(n)$     | $O(d_{v})$   |

## Connectivity && Traversal

We can use BFS or DFS to traverse a graph, and check its connectivity.

```pseudocode
Connectivity Problem
Input: graph G = (V,E), (using linked lists) two vertices s,t ∈ V
Output: whether there is a path connecting s to t in G
```

```title="BFS"
head ← 1,tail ← 1,queue[1] ← s
mark s as "visited" and all other vertices as "unvisited"
while head ≤ tail do
	v ← queue[head], head ← head+1
	for all neighbours u of v do
		if u is "unvisited" then
			tail ← tail + 1, queue[tail] = u
			mark u as "visited"
```

```title="DFS"
mark all vertices as "unvisited"

recursive DFS(v):

    mark v as "visited"
    for each neighbour u of v do
        if u is "unvisited" then DFS(u)

DFS(s)
```

Both BFS and DFS costs $O(n + m)$ time and $O(n)$ space.

### Bipartiteness

A graph $ G = (V, E) $ is a **bipartite graph** (二分图) if there is a partition of $ V $ into two sets $ L $ and $ R $ such that for every edge $ (u, v) \in E $, we have either $ u \in L, v \in R $ or $ v \in L, u \in R $.

That is, you can color all vertices using only two colors such that no two adjacent vertices share the same color.

So we can traverse the graph. For $u$'s neighbor $v$, if it is uncolored, color it with opposite color to $u$. If it is colored, and has the same color of $u$, then stop the traversal, confirm the graph is not bipartite. If the traversal finishes without conflict, the graph is bipartite.

BFS is a better choice than DFS, because BFS traverses the graph level by level, where vertices in the same level share the same color, and vertices in adjacent levels have different colors.

## Topological Ordering

For a DAG (directed acyclic graph), we can always find an order, where if $(u, v) \in E$ then $u$ appears before $v$ in that order. We call this order "Topological Order".

We use <u>Kahn Algorithm</u> to construct a topological order. By the way, it can check if a graph is a DAG as well.

```title="Toposort"
topological-sort(G)

let d[v] ← 0 for every v ∈ V
for every v ∈ V do
	for every u such that (v,u) ∈ E do
		d[u] ← d[u] + 1
S ← {v : d[v] = 0}, i ← 0
while S ̸≠ ∅ do
	v ← arbitrary vertex in S, S ← S \ {v}
	i ← i + 1, π(v) ← i
	for every u such that (v,u) ∈ E do
    	du ← du − 1
    	if du = 0 then add u to S				# core code
if i < n then output "not a DAG"				# find a circle
```

S can be represented using a queue or a stack.

Running time = $O(n+m)$, as every vertice and edge need to be processed once.

## DFS tree

Consider a DFS tree of a connected graph. Take directed DFS tree as an example.

![image-20260420192024157](images/image-20260420192024157.png)

We can classify the graph edges to four types:

- **Tree edge**, which contributes to the DFS tree. (Otherwise the edge are not in the DFS tree)
- <font color="#FF0000">**Back edge**</font>, which goes from child node to ancestor node.
- <font color="#00FF00">**Forward edge**</font>, which goes from ancestor node to child node, but not in the DFS tree.
    - a.k.a. "vertical edge" (back + forward)
- <font color="#0000FF">**Cross edge**</font>, which don't belongs to the other three types above.
    - a.k.a. "horizontal edge"

> For all cross edge $(u, v)$, we can prove that $v$ is visited earlier than $u$
>
> (Prove that if $v$ is visited later than $u$, it can only be tree edge or forward edge)

> For <u>undirected</u> DFS tree, we can prove that cross edge (horizontal edge) don't exist.
>
> (For undirected graph $(u, v) = (v, u)$, if $(u, v)$ is a cross edge, then $(v, u)$ must be a tree node, inconsistently.)

### Bridge

Given $G = (V,E)$, $e ∈E$ is called a bridge if the removal of $e$ from $G$ will increase its number of connected components.

![image-20260420195845968](images/image-20260420195845968.png)

A graph $G = (V,E)$ is 2-edge-connected if for every two $u, v ∈ V$ , there are two edge disjoint paths connecting $u$ and $v$.

> Let $B$ be the set of bridges in a graph $G = (V,E)$. Then, every connected component in $(V,E \backslash B)$ is 2-edge-connected. Every such component is called a 2-edge-connected component of $G$.

### Find bridges

It's clear that, if an edge contributes to a circle, it must not be a bridge. Or it is a bridge.

That's to say, a candidate bridge maybe becomes non-bridge, because of certain vertical edge.

![image-20260420200745646](images/image-20260420200745646.png)

To code the solution, we need to define some values:

- $v.l$: the level of vertex $v$ in DFS tree
- $T_v$: subtree rooted at $v$
- $v.r$: the smallest level that can be reached by a vertical edge from $T_v$
- $(parent(u),u)$ is a bridge if and only if $u.r ≥ u.l$
    - because a certain vertical edge make $(v, u)$ a part of circle

![image-20260420201435999](images/image-20260420201435999.png)

Then give the pseudo-code:

```title="recursive-DFS"
recursive-DFS(v)

mark v as "visited"
v.r ← ∞
for all neighbours u of v do
	if u is unvisited then						▷ u is a child of v
		u.l ← v.l + 1								▷ add the level of child
		recursive-DFS(u)
		if u.r ≥ u.l then claim (v,u) is a bridge	▷ found a circle
		if u.r < v.r then v.r ← u.r					▷ update v.r = min(u.r, v.r)
	else if u.l < v.l − 1 then					▷ u is ancestor but not parent
		if u.l < v.r then v.r ← u.l					▷ update v.r = min(u.l, v.r)
		
finding-bridges

mark all vertices as “unvisited”
for every v ∈ V do
	if v is unvisited then
	v.l ← 0
	recursive-DFS(v)
```

### Cut vertex

Vertex version of "bridge".

A vertex is a cut vertex of $G=(V,E)$ if its removal will increase the number of connected components of $G$.

![image-20260420202502631](images/image-20260420202502631.png)

A graph $G = (V,E)$ is 2-(vertex-)connected (or biconnected) if for every $u,v ∈ V$ , there are 2 internally-disjoint paths between $u$ and $v$.

> A graph $G=(V,E)$ with $|V| ≥ 3$ does not contain a cut vertex, if and only if it is biconnected.

### Find cut vertex
