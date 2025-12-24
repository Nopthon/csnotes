## A. 存活时长

> 题目描述

在图的深度优先遍历（DFS）过程中，定义一个全局时刻变量 `current`，其初始值为 `0`。

- 每当**首次访问**一个尚未被访问的节点时，令 `current = current + 1`。
- 对于任意节点 $u$：
  - **开始遍历时刻**：第一次访问到节点 $u$ 时的 `current` 值
  - **结束遍历时刻**：在 DFS 过程中，从节点 $u$ 出发的所有递归访问完成、即遍历过程从该节点向其父节点返回时的 `current` 值
  - **存活时长**：存活时长 = 结束遍历时刻 - 开始遍历时刻

现给定一个无向图 $G$，图中共有 $n$ 个节点，节点编号为 $1 \sim n$。

从**节点 $1$**开始进行深度优先遍历，并按如下规则确定遍历顺序：

- 当遍历某个节点的相邻节点时，必须按照相邻节点编号**从小到大**依次访问

请计算并输出每个节点的存活时长。

> 输入格式

- 第一行包含两个整数 $n, m$，分别表示节点数和边数。
- 接下来 $m$ 行，每行包含两个整数 $a, b$，表示节点 $a$ 与节点 $b$ 之间存在一条无向边。

> 输出格式

输出一行，共 $n$ 个整数，用空格隔开，表示节点 $1 \sim n$ 的存活时长。

> 样例 #1

**input**

```
8 16
8 3
6 4
8 2
2 6
2 7
5 7
3 7
3 4
7 6
1 7
4 8
4 5
2 1
6 1
4 1
4 2
```

**output**

```
7 6 4 5 0 0 2 0
```

> 样例 #2

**input**

```
4 4
1 2
1 3
2 3
2 4
```

**output**

```
3 2 0 0
```

> 数据规模与约定

- $1 \le n \le 2000，1\le m\le 10^6$
- 保证图是连通的

### Solution

在 DFS 的基础上加上全局变量 cur 的维护即可

我喜欢 0-index 的图表示，因此**接下来的题解代码都手动改成了 0-index 节点**

```c++ title="Solution"
#include <iostream>
#include <vector>
#include <algorithm>

// #define int long long

using namespace std;
using ll = long long;
using vi = vector<int>;
using vvi = vector<vector<int>>;

void dfs(vvi& edges, vi& vis, vi& ans, int& cur, int u){
	if(vis[u] != 0) return;
    // 未遍历过的变量，cur++
	cur++; vis[u] = 1;

	int a = cur;
	
    // 排序
	sort(edges[u].begin(), edges[u].end());

	for(auto& v : edges[u]){
		dfs(edges, vis, ans, cur, v);
	}
	
    // 计算存活时长
	ans[u] = cur - a;
	return;
}


void solve(){
	int n, m;
	cin >> n >> m;
	vvi edges(n, vi());

	for(int i = 0; i < m; i++){
		int u, v;
		cin >> u >> v;
		edges[u-1].push_back(v-1);
		edges[v-1].push_back(u-1);
	}

	vector<int> vis(n, false);
	vector<int> ans(n, 0);
	int cur = 0;

	dfs(edges, vis, ans, cur, 0);

	for(auto& x : ans) cout << x << " ";

}


signed main(){
	ios::sync_with_stdio(false);
	cin.tie(0); cout.tie(0);
	
	int t; 
	// cin >> t;			// multi testcases
	t = 1;					// single testcase
	
	while (t--){
		solve();
	}
	return 0;
}

```

## B. 快递代取服务

> 问题描述

小蓝鲸擅智而不擅力，所以变得非常懒散，以至于快递都不想拿，幸亏校园里有快递代取服务。现有 $n-1$ 件小蓝鲸的快递要送， 快递站在节点 $1$。各个快递的目的地分别是节点 $2$ 到节点 $n$。所有的道路都是单行的，共有 $m$ 条道路。这个快递员每次只能带一件快递去送，运送每件快递后需要返回快递站取下一件要送的快递。小蓝鲸需要帮助快递员求出送完这 $n-1$ 件快递并且最终回到快递站最少需要的时间？

> 输入格式

第一行包括两个整数 $n$ 和 $m$，表示节点数量和道路数量。

接下来 $m$ 行，每行三个整数 $u,v,w$， 表示从 $u$ 到 $v$ 有一条通过时间为 $w$ 的道路。

输入保证任意两点都能互相到达。

> 输出格式

输出仅一行，包含一个整数，为最少需要的时间。

> 样例 #1

**输入**

```
5 10
2 3 5
1 5 5
3 5 6
1 2 8
1 3 8
5 3 4
4 1 8
4 5 3
3 5 6
5 4 2
```

**输出**

```
83
```

> 样例 #2

**输入**

```
3 6
1 2 4
1 3 1
2 1 1
2 3 5
3 1 4
3 2 2
```

**输出**

```
8
```

> 数据规模与约定

对于 100% 的数据，$1 \leq n \leq 10^3 ,\quad 0\leq m \leq 10^7,\quad 1 \leq w \leq 10^4$，输入保证任意两点都能互相到达。

### Solution

首先明确任务：求节点 $1$ 到其他节点的最短路 + 其他节点到节点 $1$ 的最短路就可以得到答案

一种很朴实无华的想法是使用 Floyd 求全源最短路，然后求 $\displaystyle \sum_{i=1}^{n} f[i][1] + f[1][i]$ 的值

提交后会发现 1 TLE 90pts，原因在于 Floyd 对所有的点求出了最短路径，这对于 $f[i][1]$ 部分的计算是非常多余的。因此我们需要一个能够剪枝的最短路算法，在得到 $f[i][1]$ 的值后可以及时停止多余的运算。考虑到数据规模中所有的边权为正，并且 Dijkstra 算法每次松弛操作都可以确定一个点的最短路，因此我们选择 $n$ 轮 Dijkstra 算法，并进行一定的剪枝操作

（$n$ 轮 SPFA 场上也试过，也是 1 TLE 90pts，可能并不是因为喜闻乐见的 “SPFA 似了”，而是 SPFA 需要逐渐求出所有终点的最短路本身依旧带来了巨大开销；相比 SPFA 对“何时确定最短路”的不确定性，Dijkstra 可以保证每轮松弛都确定一个最短路，方便剪枝）

**接下来的题解代码都是 0-index 节点**

```c++ title="Solution"
#include <iostream>
#include <vector>
#include <queue>
const int INF = 0x7fffffff;

using namespace std;
using ll = long long;
using vi = vector<int>;
using vvi = vector<vector<int>>;

struct edge_vw {
    int v; int w;
};

// 全局变量 ans
ll ans = 0;

void dijkstra(int n, int m, int s, vector<vector<edge_vw>>& edges){
    vector<int> dis(n, INF); dis[s] = 0;
    vector<bool> vis(n, false);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0,s});

    // 对于起点，需要找出所有终点的最短路
    if(s == 0){
        while(!pq.empty()){
            int u = (pq.top()).second;
            pq.pop();
            if(vis[u]) continue;
            vis[u] = true;

            for(auto& edge: edges[u]){
                if(dis[u] + edge.w < dis[edge.v]){
                    dis[edge.v] = dis[u] + edge.w;
                    pq.push({dis[edge.v], edge.v});
                }
            }
        }
        // 对所有的最短路累加
        for(int i = 1; i < n; i++) ans += dis[i];
    }

    
    else {
        // 对于非起点，只要找到起点的最短路即可
        while(vis[0] == false){
            int u = (pq.top()).second;
            pq.pop();
            if(vis[u]) continue;
            vis[u] = true;

            for(auto& edge: edges[u]){
                if(dis[u] + edge.w < dis[edge.v]){
                    dis[edge.v] = dis[u] + edge.w;
                    pq.push({dis[edge.v], edge.v});
                }
            }
        }
        // 只累加到起点的最短路
        ans += dis[0];
    }
}

void solve(){

    int n,m; cin >> n >> m;
    vector<vector<edge_vw>> edges(n);

    for(int i = 0; i < m; i++){
        int u,v,w; cin>>u>>v>>w;
        u-=1; v-=1;
        edges[u].push_back({v,w});
    }
    for(int s = 0; s < n; s++)
        dijkstra(n, m, s, edges);

    cout << ans;
}


signed main(){
    ios::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);

    int t; 
    // cin >> t;			// multi testcases
    t = 1;					// single testcase

    while (t--){
        solve();
    }
    return 0;
}
```

---

## C. 逆序对数量

> 题目描述

有 $n$ 个小蓝鲸排成一队要去兄弟院校团建，每个人有一个编号 $a_k(1\leq k \leq n)$。此时领队很头疼，因为队伍排得十分混乱。

对于小蓝鲸 $i$ 和小蓝鲸 $j$ $(1\leq i,j \leq n)$，若 $a_i > a_j$ 且 $i < j$，则称 $[a_i, a_j]$ 构成一个逆序对。领队想知道队伍中一共有多少个逆序对？

> 输入格式

第一行有一个整数 $n$，表示小蓝鲸人数。

第二行有 $n$ 个整数，以空格隔开，表示从前到后每个小蓝鲸的编号。

> 输出格式

一个整数，表示队伍中逆序对的数量。

> 样例 #1

**输入**

```
4
2 1 3 2
```

**输出**

```
2
```

> 样例 #2

**输入**

```
6
7 4 4 3 1 5
```

**输出**

```
10
```

> 数据范围

- 对于 20% 的数据，$1 \le n \le 10^3$，$1 \le a_i \le 2\times 10^3$
- 对于 100% 的数据，$1 \le n \le 2\times 10^6$，$1 \le a_i \le 2\times 10^6$

### Solution

考虑一种最朴实无华的想法：

```c++ title="暴力解"
long long ans = 0;
for (int i = 0; i < n - 1; i++)
	for (int j = i + 1; j < n; arr[i] > arr[j++] ? ans++ : ans += 0) {}
```

时间复杂度 $O(n)$，交到[洛谷](https://www.luogu.com.cn/problem/P1908)上可以获得 25pts，我们需要一种更快的方法，考虑时间复杂度不慢于 $O(n \log  n)$

首先注意到：一个序列满足升序排列，当且仅当其逆序数为 $0$ 

因此，对一个任意序列进行排序的过程，可以看作减少其逆序数的过程（当逆序数减小到 $0$ 时序列有序），所以可以尝试结合某种时间复杂度较低的排序算法来得到原序列的逆序数。

考虑**归并排序**的归并过程，在对两个有序子序列（记为 $L,R$）合并，遇到 $L_i > R_j$ 的情况时，那么 $L$ 序列从 $L_i$ 开始的之后的所有元素都和 $R_j$ 构成了逆序对。

比如：合并 $\lbrace 1,3,5,7 \rbrace$ 和 $\lbrace 2,4,6,8 \rbrace$，将右侧序列的元素 $4$ 插入到左侧序列的元素 $3,5$ 之间时，跨过的 $5,7$ 和 $4$ 都是逆序关系，因此计算逆序数 $+2$ 

体现在归并过程中就是：

```c++
// ...
while (i < Llength && j < Rlength){
    if (L[i] <= R[j]){
        arr[k] = L[i];
        i++;
    }
    else{
        arr[k] = R[j];
        ans += Llength - i; // 在索引i右侧，属于L序列部分的所有元素都与这个交换的元素构成逆序对
        j++;
    }
    k++;
}
// ...
```

也就是说，**对原序列进行归并排序，期间记录逆序对的减少情况，就能得到逆序对的数量**

使用归并排序的好处在于，**逆序对的改变只出现在归并阶段，而每次归并的两个子序列都是有序的，降低了计算逆序对的难度**

（相比之下，快速排序的 `partition` 函数就不适合完成这个任务）

```c++ title="Solution" hl_lines="5"
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

ll ans = 0;

// 快速读入
int quickRead(){
    int num = 0; char ch;
    while ((ch = getchar()) < '0' || ch > '9') {}
    do num = num * 10 + (ch - '0');
    while ((ch = getchar()) >= '0' && ch <= '9');
    return num;
}

void merge(vector<int>& arr, int l, int mid, int r){
    int Llength = mid - l + 1;
    int Rlength = r - mid;

    int L[Llength], R[Rlength];

    for (int i = 0; i < Llength; i++)
        L[i] = arr[l + i];
    for (int j = 0; j < Rlength; j++)
        R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < Llength && j < Rlength){
        if (L[i] <= R[j]){
            arr[k] = L[i];
            i++;
        }
        else{
            arr[k] = R[j];
            ans += Llength - i; // 计算逆序对只添加了这一步，其他的部分都是标准的归并排序
            j++;
        }
        k++;
    }

    while (i < Llength){
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < Rlength){
        arr[k] = R[j];
        j++;
        k++;
    }
}

// 归并排序 
void mergeSort(vector<int>& arr, int l, int r){
    if (l < r){
        int mid = l + (r - l) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);

        merge(arr, l, mid, r);
    }
}


void solve(){
    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++)
        a[i] = quickRead();

    mergeSort(a, 0, n - 1);		// 归并排序，期间计算逆序数

    cout << ans;
}

signed main(){
    ios::sync_with_stdio(false);
    cin.tie(0); cout.tie(0);

    int t; 
    // cin >> t;            // multi testcases
    t = 1;                  // single testcase

    while (t--){
        solve();
    }
    return 0;
}
```

最后有一个提醒：**这题需要开 `long long` 存储答案，否则会 100pts → 20pts**（考场上 79 个人里有 51 个人 T3 20pts，警钟敲烂）

（洛谷不开 `long long` 也能得 50pts，助教给的数据太狠了）
