## A. 建树

> 题目描述

请根据一棵树的后序和中序遍历顺序建树，并输出树的前序遍历顺序。

> 输入格式

第一行有一个数字 $n$，表示节点的个数

第二行有 $n$ 个数字 $a_i$，表示树的后序遍历顺序

第三行有 $n$ 个数字 $b_i$，表示树的中序遍历顺序

> 输出格式

$n$ 个数字，以空格隔开，表示树的前序遍历顺序。

> 样例输入 #1

```
4
4 2 3 1
4 2 1 3
```

> 样例输出 #1

```
1 2 4 3
```

??? question "样例解释 #1"

    ```
    树的结构如下所示
         1
        / \
       2   3
      /
     4
    ```

> 样例输入 #2

```
1
10
10
```

> 样例输出 #2

```
10
```

> 样例输入 #3

```
5
2 4 5 3 1
2 1 4 3 5
```

> 样例输出 #3

```
1 2 3 4 5
```

??? question "样例解释 #3"

     ```
     树的结构如下所示
          1
         / \
        2   3
           / \
          4   5
     ```

> 数据范围

- $1 \leq a_i \leq 10^5$，且 $a_i$ 互不相同。
- $1 \leq n \leq 10^4$

### Solution

第 7 次实验 T2 （B. 树的左视角）要求根据前序序列 + 中序序列建树，根据这个模板修改即可（考场上你会发现“树的左视角”这题被锁定了，所以不能直接 copy，得自己提前准备）

```c++ title="Solution"
#include <iostream>

using namespace std;

// #define int long long

struct treeNode
{
    int val;
    treeNode *leftChild, *rightChild;
    treeNode()
    {
        val = 0;
        leftChild = nullptr;
        rightChild = nullptr;
    }
    treeNode(int x, treeNode *l = nullptr, treeNode *r = nullptr)
    {
        val = x;
        leftChild = l;
        rightChild = r;
    }
};



treeNode *create(int *postOrder, int *inOrder, int size)
{
    if (size == 0)
        return nullptr;
    treeNode *root = new treeNode(postOrder[size - 1]);
    int k;
    // 这里有预查找优化空间，考场上懒得写优化了
    for( k = 0; k < size; k++){
        if(inOrder[k] == postOrder[size - 1]) break;
    }
    root->leftChild = create(postOrder, inOrder, k);
    root->rightChild = create(postOrder + k, inOrder + k + 1, size - k - 1);
    return root;
}

void PreOrder(treeNode *subTree, void (*visit)(treeNode *t))
{
    if (subTree != NULL)
    {
        visit(subTree);
        PreOrder(subTree->leftChild, visit);
        PreOrder(subTree->rightChild, visit);
    }
}

void solve(){
    int n; cin >> n;
    int* postOrder = new int[n];
    int* inOrder = new int[n];
    
    for(int i = 0; i < n; i++) cin >> postOrder[i];
    for(int i = 0; i < n; i++) cin >> inOrder[i];

    treeNode* root = create(postOrder, inOrder, n);

    PreOrder(root, [](treeNode* t){ cout << t->val << " "; });
}


signed main(){
	ios::sync_with_stdio(false);
	cin.tie(0); cout.tie(0);
	
	int t; 
	// cin >> t;			// multi testcases
	t = 1;				// single testcase
	
	while (t--){
		solve();
	}
	return 0;
}
```

---

## B. 翻转树

> 题目描述

在一棵二叉树上有若干个节点，每个节点具有一个初始值 $a_i(-10^5 \leq a_i \leq 10^5,\;a_i \neq 0)$，现可对任意节点进行**翻转**操作：将当前节点及其所在子树所有节点的值均变为相反数。

问：最少经过多少次**翻转**操作，可使树上所有结点的值均为正？

> 输入格式

第一行有一个数字 $n$，表示输入的长度

第二行有 $n$ 个数字 $a_i$，表示树的前序遍历过程中每个节点的初始值，空节点用 `0` > 表示

> 输出格式

输出一个整数，表示最少要进行的翻转次数。

> 样例输入 #1

```
9
-1 2 4 0 0 0 -3 0 0
```

> 样例输出 #1

```
2
```

??? question "样例解释 #1"

    ```
    树的结构如下所示
        -1
        / \
       2  -3
      /
     4
    第一次翻转 -1 节点所在子树，此时树变成了
         1
        / \
      -2   3
      /
    -4
    第二次翻转 -2 节点所在子树，此时树变成了
         1
        / \
       2   3
      /
     4
    ```

> 样例输入 #2

```
11
1 -2 3 0 5 0 0 4 0 0 0
```

> 样例输出 #2

```
3
```

??? question "样例解释 #2"

    ```
    树的结构如下所示
         1 
        /
      -2
     /  \
    3    4
     \
      5
    第一次翻转 -2 节点所在子树，此时树变成了
         1 
        /
       2
      / \
    -3   -4
      \
      -5
    第二次翻转 -3 节点所在子树，此时树变成了
         1 
        /
       2
      / \
     3   -4
      \
       5
    第三次翻转 -4 节点所在子树，此时树变成了
         1 
        /
       2
      / \
     3   4
      \
       5
    ```

> 数据范围

- $-10^5 \leq a_i \leq 10^5, a_i \neq 0$。
- $1 \leq n \leq 2 \times 10^5$

### Solution

需要意识到：

1- 问题可以自顶向下进行处理，因为每次反转操作对当前节点及其子树生效，不会再向上影响。因此遍历树采用前序遍历

2- 虽然每次翻转影响到子树的节点，导致子树的状态看上去不是很好维护，但是事实上反转操作可以看作 “零次 or 一次” 的循环，在前序遍历时传递一个 `bool switch` 就可以很好的维护子树状态

```c++ title="Solution"
#include <iostream>

// #define int long long

using namespace std;
using ll = long long;

// 答案直接设置全局变量了，比较方便
int ans = 0;

struct treeNode
{
    int val;
    treeNode *leftChild, *rightChild;
    treeNode()
    {
        val = 0;
        leftChild = nullptr;
        rightChild = nullptr;
    }
    treeNode(int x, treeNode *l = nullptr, treeNode *r = nullptr)
    {
        val = x;
        leftChild = l;
        rightChild = r;
    }
};

treeNode *create(int Null, int &remain)
{
    if (remain <= 0)
        return nullptr;

    int input;
    if (!(cin >> input))
        return nullptr;
    remain--;

    if (input == Null)
    {
        return nullptr;
    }

    treeNode *root = new treeNode(input);
    root->leftChild = create(Null, remain);
    root->rightChild = create(Null, remain);
    return root;
}

// 核心逻辑在这里
void PreOrder(treeNode *subTree, bool switched)
{
    if (subTree != nullptr)
    {
        // 当前节点需要翻转
        // if( switched ^ (subTree->val < 0) )
        if(  (switched == 0 && subTree->val < 0) || (switched == 1 && subTree->val > 0) ){
            ans++;
            // 子树也一起翻转，只需要反转 switched 即可
            PreOrder(subTree->leftChild, !switched);
            PreOrder(subTree->rightChild, !switched);
        }
        else {
            PreOrder(subTree->leftChild, switched);
            PreOrder(subTree->rightChild, switched);
        }
        
        
    }
}

void solve(){
    int n; cin >> n;
    int remain = n;
    treeNode* root = create(0, remain);

    PreOrder(root, false);

    cout << ans;
}


signed main(){
	ios::sync_with_stdio(false);
	cin.tie(0); cout.tie(0);
	
	int t; 
	// cin >> t;			// multi testcases
	t = 1;				// single testcase
	
	while (t--){
		solve();
	}
	return 0;
}

```

---

## C. 小蓝鲸组队

> 题目背景

在一年一度的 C++ 创新杯中，许多聪明的小蓝鲸报名参赛。比赛允许自由组队，但每只小蓝鲸都提出了一些关于组队的愿望：

- 有些小蓝鲸彼此是好朋友，**约定好一定要在同一队**；
- 有些小蓝鲸性格不合，**明确表示不想和对方在同一队**。

现在，赛事组委会希望知道：是否存在一种分队方案，能够同时满足所有小蓝鲸的这些愿望？

> 题目描述

给定 $n$ 条约束，每条形如：

- 小蓝鲸 $i$ 和 $j$ 约定好组队（记为 $e = 1$）
- 小蓝鲸 $i$ 和 $j$ 不想与对方组队（记为 $e = 0$）

判断是否存在一种分组方式，使得所有约束同时成立。

输入包含 $t$ 个独立的问题。对每个问题，若存在合法方案，输出 `YES`，否则输出 `NO`。

> 输入格式

第一行包含一个正整数 $t$，表示需要判定的问题个数。

对于每个问题：

- 第一行包含一个正整数 $n$，表示该问题中的约束条件数量；
- 接下来 $n$ 行，每行包含三个整数 $i, j, e$，表示一条约束：
  - 若 $e = 1$，表示小蓝鲸 $i$ 和 $j$ **必须在同一队**；
  - 若 $e = 0$，表示小蓝鲸 $i$ 和 $j$ **不能在同一队**。

> 输出格式

输出共 $t$ 行。 第 $k$ 行输出一个字符串 `YES` 或 `NO`（全部大写）：

- `YES` 表示第 $k$ 个问题存在满足所有约束的分队方案；
- `NO` 表示不存在。

> 输入输出样例 #1

> 输入

```
2
2
1 2 1
1 2 0
2
1 2 1
2 1 1
```

> 输出

```
NO
YES
```

> 输入输出样例 #2

> 输入

```
2
3
1 2 1
2 3 1
3 1 1
4
1 2 1
2 3 1
1 4 0
3 4 1
```

> 输出

```
YES
NO
```

> 输入输出样例 #3

> 输入

```
4
9
24 234 1
2837 1 1
242 78 0
23 1 1
223 977 0
254 76 1
235 877 0
235 987 0
877 987 0
4
8 2 0
2 9 1
2 7 1
9 7 0
2
1 1 1
2 2 1
3
9 2 0
1 3 1
2 3 1
```

> 输出

```
YES
NO
YES
YES
```

> 说明/提示

??? question "样例解释 #1 && #2"

    - 样例 1：
    
        - 第一个问题中，要求 1 和 2 同队，又要求不同队，矛盾 → `NO`。
        - 第二个问题中，两条约束均要求 1 和 2 同队，无冲突 → `YES`。
      
    - 样例 2：
    
        - 第一个问题：可全分到一队 → `YES`。
        - 第二个问题：由 1,2,4 条可知 4 个小蓝鲸需要同队，但第 3 条要求 1 与 4 不同队，矛盾 → `NO`。

> 数据范围

- 对于 30% 的数据，$1 \le n \le 100$，$1 \le i, j \le 10^4$
- 对于 60% 的数据，$1 \le n \le 10^5$，$1 \le i, j \le 10^4$
- 对于 100% 的数据，$1 \le n \le 10^5$，$1 \le i, j \le 10^9$，$1 \le t \le 10$，$e \in \{0,1\}$

??? tip "**本题输入输出量较大，请使用高效的读写方式。**"
    
    如果你使用 `cin`、`cout` 进行读写出现超时，可以考虑使用 `scanf`、 `printf` 或者在程序开头增加如下代码:
    
    ```c++
    // 关闭 iostream 与 C 标准库的同步，加速 cin/cout
    ios::sync_with_stdio(false); 
    // 解除 cin 与 cout 的绑定，避免每次输入前自动刷新输出，提高 IO 性能
    cin.tie(0);
    ```
    
    **时间复杂度过高**的程序无论使用哪种读写方式都会超时。

### Solution

利用并查集，先并后查

具体来说，先把必须为同一队伍的人进行合并，然后根据不能在同一队伍的约束情况进行合法性判断。如果合并操作后出现了 “两个不应该在同一组的人被分到同一组” 的情况，输出 `NO`，否则输出 `YES` 

注意到数据范围 $1 \le i, j \le 10^9$ 不小，需要考虑[离散化](https://oi-wiki.org/misc/discrete/)，或者用 `unordered_map` 存并查集（据说找个大质数用取模哈希也可以过）

```c++ title="Solution"
#include <iostream>
#include <unordered_map>
#include <vector>

using namespace std;
using ll = long long;

// #define int long long

// 并查集模板
unordered_map<int,int> dsu;

int find(int x) {
	return (dsu[x] != x) ? ( dsu[x] = find(dsu[x])) : dsu[x];
}

void unite(int x, int y) {
	int rx = find(x);
	int ry = find(y);
	if (rx != ry) {
		dsu[rx] = ry;
	}
}

typedef struct {
	int i;
	int j;
} Pair;

void solve(){
	int n; cin >> n;
    // 用两个数组分别存储 e=0 or e=1 的两种限制，方便先并后查
	vector<Pair> like;
	vector<Pair> dislike;
	for(int p = 0; p < n; p++){
		int i,j,e; cin >>i>>j>>e;
		if(e == 1) like.push_back({i,j});
		else dislike.push_back({i,j});
		// 并查集初始化在这里
		dsu[i] = i; dsu[j] = j;
	}

	for(Pair &x : like){
		unite(x.i, x.j);
	}

	for(Pair &x : dislike){
		if(find(x.i) == find(x.j)){
			cout << "NO\n"; return;
		}
	}

	cout << "YES\n"; return;
}


signed main(){
	ios::sync_with_stdio(false);
	cin.tie(0); cout.tie(0);
	
	int t; 
	cin >> t;			// multi testcases
	// t = 1;				// single testcase
	
	while (t--){
		solve();
	}
	return 0;
}
```
