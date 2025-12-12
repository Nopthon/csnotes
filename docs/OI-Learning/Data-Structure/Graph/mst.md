# 最小生成树

这里讨论**无向连通图**的最小生成树 MST：连接所有顶点且总权重最小的树形子图

对于 $n$ 个顶点的无向连通图，其最小生成树应该有 $n$ 个顶点和 $n-1$ 条边

实现最小生成树主要有 Kruskal 和 Prim 两种算法，都是基于贪心的实现：

附 Luogu 模板题：[P3366 【模板】最小生成树 - 洛谷](https://www.luogu.com.cn/problem/P3366)

### Kruskal 算法

首先给出一个结论：无向连通图的最小生成树一定包含最短的边。

进而 MST 也一定包含倒数第二短的边（只要这两条边不是一对重边）。进一步的，只要不生成环或重边，就可以一直贪心取短边，对于 $n$ 个点的图取 $n-1$ 条短边，就能获得最小生成树（如果最后没有取到 $n-1$ 条边，说明不是连通图），这就是 Kruskal 的原理，其正确性不难证明

基于这个思路，我们不妨对所有的边按照边权排序，然后从小到大尝试加边（只要新边不与已选择的旧边生成环，就可以选择，否则跳过）

存边的方式是存储完整的边信息 `(u, v, w)`，判断两个边是否成环的方式是使用并查集查是否位于同一集合

```c++
// 边信息结构体
struct edge {
    int u; int v; int w;
};

// 并查集模板
int find(int x, vector<int>& dsu){
    return (dsu[x] == x ? x : (dsu[x] = find(dsu[x])) );
}

void unite(int src, int dst, vector<int>& dsu) {
    dsu[find(src)] = find(dst);		// 没有优化
}

// 主函数
void kruskal(int n, int m){
    // 初始化
    vector<int> dsu(n);
    vector<edge> edges(m);

    for(int i = 0; i < n; i++) dsu[i] = i;
    for(int i = 0; i < m; i++){
        int u,v,w; cin>>u>>v>>w;
        edges[i] = {u-1,v-1,w};	// 这里假设题给节点为 1-index
    }

    // 排序
    std::sort(edges.begin(), edges.end(), [](const edge& a, const edge& b) {
        return a.w < b.w;  // 按 w 升序
    });

    int total = 0, edge_cnt = 0;
    // 主逻辑
    for(int i = 0; i < m; i++){
        int u = edges[i].u, v = edges[i].v, w = edges[i].w;
        // 不成环则加边
        if(find(u) !+= find(v)){
            unite(u, v);
            total += w;
            edge_cnt++;
            /* 可以在这里存具体的边信息 */
            if (edge_cnt == n - 1) break;
        }
    }
    // 确保加了 n-1 条边
    cout << (edge_cnt == n-1 ? total : -1);
}
```

### Prim 算法

最小生成树最终会连通每一个节点，现在我们任意选择一个顶点 `root`，通过贪心策略逐步连通其他的顶点

具体来说，我们每次选取一个 “代价最低” 的新节点加入 MST（已建成的部分最小生成树上的某一个顶点能够一步到达这个新顶点，并且是所有可选顶点中对应边权最小的），重复 $n -1$ 次就能连接所有的点

基于这个思路，我们任意指定一个初始节点，将所有可一步抵达的边 `(u, v, w)` 存放到边权最小堆中，持续弹出权值最小边，考虑终点 `v` 不在当前的 MST 中时，将 `v` 加入 MST 并累加对应的边权，然后将 `v` 作为起点，加入所有以 `v` 为起点的边到最小堆中，直到堆空，且所有顶点都被加入（否则图不是连通图）

??? tip "图示"

    ```mermaid
    flowchart TD
        A([Start]) --> C["MST = {start}"]
        C --> D["Add all (s, _, _) to minheap"]
    
        D --> E{Heap empty?}
        E -->|Yes| F([total])
        E -->|No| G["Pop min (u, v, w)"]
    
        G --> H{v in MST?}
        H -->|Yes| E
        H -->|No| I[Add v to MST, Add w to total]
    
        I --> J["Add all (v, _, _) to minheap"]
        J --> E
    ```

### 时间复杂度分析

Kruskal 的时间开销分为三部分：

- 对边的排序 $O(E \log E)$
- 并查集的初始化 $O(V)$
- $E$ 轮并查集操作 $E \alpha{V} ≈ E$

不难得到连通图的 $E \geq V-1$（不然还求什么最小生成树），因此绝大多数情况下对边排序的时间开销起主导作用，Kruskal 的时间复杂度记为 $O(E \log E)$

Prim 的时间开销分为三部分：

- 数组初始化 $O(V)$
- 堆操作 $O((V+E) \log V)$
    - 按照“次数 × 每次代价”计算：堆插入 $O(E \log V)$；堆弹出 $O(V \log V)$
- 加入邻接边 $O(E)$

堆操作的时间开销起主导作用，Prim 的时间复杂度记为 $O((V+E) \log V)$，如果是邻接矩阵的朴素实现，时间复杂度由遍历邻接矩阵决定，时间复杂度 $O(V^2)$

简单地说：对于稀疏图来说，Kruskal 更优；对于稠密图来说，Prim 更优