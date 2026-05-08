## A. 树上旅行

> 题目描述

 地图上有 $n$ 个城市，编号分别为 $1$ 到 $n$，若以 $1$ 为根节点，则城市之间恰好构成一颗二叉树。

 小蓝鲸和它的朋友们分布在这 $n$ 个城市中，每个城市中的人数记为 $a_i$。它们计划外出旅游，从当前各自所在的城市出发，最终在编号为 $1$ 的城市汇合。

 每个城市都有通向其他城市的大巴车，发车时间不限。同时，大巴车是统一规格的，即每个大巴车上的座位数量都是 $k$。小蓝鲸和它的朋友们可以选择在一些城市进行换乘。相邻城市之间一辆车的过路费是 $1$。

 请你帮忙规划一下，小蓝鲸和它的所有朋友在城市 $1$ 汇合所需要的最小花费是多少？

> 输入

输入包含三行

- 第一行包含两个整数 $n \ (1 \le n \le 2 \times 10^5)$ 和 $k \ (1 \le k \le 10^5) $
- 第二行包含 $2n + 1$ 个整数序列，表示以 $1$ 为根节点的层次遍历序列，其中 $-1$ 表示空节点
- 第三行包含 $n$ 个整数，$a_1, a_2, ..., a_i$，其中 $a_i \ (0 \le a_i \le 100)$ 表示在城市 $i \ (1 \le i \le n)$ 中的人数

> 输出

- 输出包含一行，表示小蓝鲸和它的所有朋友在城市 $1$ 汇合所需要的最小花费。

> 样例

- 输入

```
5 2
1 2 5 3 -1 -1 -1 -1 4 -1 -1
1 1 1 1 1
```

- 输出

```
5
```

??? question "样例解释"

    对应的树状结构如下图所示
    
    ```
          1
         / \
        2   5  
       /		 
      3			
       \
        4
    ```
    
    一种最优策略如下：
    
    - 城市 $4$ 的 $1$ 个人到达城市 $3$，花费 $1$（此时城市 $3$ 有 $2$ 个人）
    - 城市 $3$ 的 $2$ 个人直接到达城市 $1$，花费 $2$
    - 城市 $2$ 的 $1$ 个人直接到达城市 $1$，花费 $1$
    - 城市 $5$ 的 $1$ 个人直接到达城市 $1$，花费 $1$
    
    因此总的花费为 $1 + 2 + 1 + 1 = 5$

### Solution

对二叉树自底向上进行后序遍历（DFS），期间自底向上累加节点值（贪心）

```c++ title="Solution"
#include <bits/stdc++.h>
using namespace std;

struct treeNode{
	int val;
	treeNode *leftChild, *rightChild;
	treeNode ()
		{ val = 0; leftChild = NULL;  rightChild = NULL; }
	treeNode (int x, treeNode *l = NULL, treeNode *r = NULL)
		{ val = x;  leftChild = l;  rightChild = r; }

};

// 建树函数
void create(treeNode* root, int n, int Null) {
	int rootval; cin >> rootval;
	root = new treeNode(rootval);

	treeNode** queue = new treeNode*[n];
	int front = 0, rear = 0;

	queue[rear++] = root;

	int index = 1, data;

	while(front < rear && index < n) {
		treeNode* cur = queue[front++];
		
		if(index < n) {
			cin >> data;
			if(data != Null) {
				cur->leftChild = new treeNode(data);
				queue[rear++] = cur->leftChild;
			}
			index++;
		}
		
		if(index < n) {
			cin >> data;
			if(data != Null) {
				cur->rightChild = new treeNode(data);
				queue[rear++] = cur->rightChild;
			}
			index++;
		}
	}
	
	delete[] queue;
}

void postSum(int& cost, int* b, treeNode* node, int& k){
	if (node == NULL) return;

	postSum(cost, b, node->leftChild, k);
	postSum(cost, b, node->rightChild, k);

	if(node->leftChild){
		int val = b[node->leftChild->val];
		// 向上累加 cost
		cost += ((val + k - 1) / k);
		b[node->val] += val;

	}

	if(node->rightChild){
		int val = b[node->rightChild->val];
		// 向上累加 cost
		cost += ((val + k - 1) / k);
		b[node->val] += val;
	}
}

void solve(){
	int n, k; cin >> n >> k;

	treeNode* root;
	create(root, 2*n+1,-1);

	int* cost = new int[n+1];

	for(int i = 1; i <=n; i++) cin >> cost[i];

	int ans = 0;

	postSum(ans, cost, T.root, k);

	cout << ans;

	delete[] b;
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

```

---

## B. 垂序遍历

> 题目描述

给你二叉树的根结点 root ，请你设计算法计算二叉树的 垂序遍历 序列。

我们通过以下规则定义树上节点的坐标：树的根结点位于 (0, 0) ；对坐标为 (row, col) 的结点，其左右子结点的坐标分别为 (row + 1, col - 1) 和 (row + 1, col + 1) 。

二叉树的 **垂序遍历** 从最左边的列开始直到最右边的列结束，按列索引每一列上的所有结点，形成一个按值大小排序的有序列表。

返回二叉树的 **垂序遍历** 序列。

> 输入描述

第一行一个数字，表示二叉树层序表示的数组长度。

第二行树的层序表示数组 `A`，非空节点为不重复的正整数，空节点使用 `-1` 表示。

> 输出描述

输出二叉树的垂序遍历序列，同一列表中的数字用' '隔开，两个有序列表间用 `|` 隔开。

> 样例一

> 输入

```
5
1 -1 3 6 7
```

> 输出

```
1 6 | 3 | 7   #字符之间有空格
```

??? question "样例解释 #1"

    ```
          1(0,0)
           / \
        -1  3(1,1)
       /        \
     6(2,0)    7(2,2)
    ```
    
    列 0：有节点1 和节点 6，二者按值大小排序为1,6
    
    列 1：有节点3，为3
    
    列 2：有节点7，为7

> 样例二

> 输入

```
7
1 2 3 -1 4 5 -1
```

> 输出

```
2 | 1 4 5 | 3   #字符之间有空格
```

??? question "样例解释 #2"

    ```
          1（0,0）
         /       \
     2(1,-1)    3(1,1)
       \           /  
       4(2,0)  5(2,0)
    ```
    
    列 -1：有节点2
    
    列 0：有节点1,4,5，二者按值大小排序为1,4,5
    
    列 1：有节点3

> 数据范围

$0 < n < 705$

### Solution

利用结构体额外记录节点的二维坐标，遍历时进行记录，排序输出

```c++ title="Solution"
#include <iostream>

// #define int long long

using namespace std;
using ll = long long;

// 定义树节点
struct treeNode{
	int val;
	treeNode *leftChild, *rightChild;
	treeNode ()
		{ val = 0; leftChild = nullptr;  rightChild = nullptr; }
	treeNode (int x, treeNode *l = nullptr, treeNode *r = nullptr)
		{ val = x;  leftChild = l;  rightChild = r; }

};

// 定义排序结构体
struct nodeInfo{
	int row, col, val;
};

// 根据层序遍历建树，返回值为有效节点数
int create(treeNode* root, int n, int Null) {
	int rootval; cin >> rootval;
	root = new treeNode(rootval);

	treeNode* queue[1000] = {};
	int front = 0, rear = 0;

	queue[rear++] = root;

	int index = 1, data, nodeCounter = 1;

	while(front < rear && index < n) {
		treeNode* cur = queue[front++];
		
		if(index < n) {
			cin >> data;
			if(data != Null) {
				cur->leftChild = new treeNode(data);
				queue[rear++] = cur->leftChild;
				nodeCounter++;
			}
			index++;
		}
		
		if(index < n) {
			cin >> data;
			if(data != Null) {
				cur->rightChild = new treeNode(data);
				queue[rear++] = cur->rightChild;
				nodeCounter++;
			}
			index++;
		}
	}
	
	return nodeCounter;
}

void dfs(treeNode *node, int row, int col, nodeInfo* nodes, int& index){
	if(node == NULL) return;
	nodes[index++] = {row, col, node->val};
	dfs(node->leftChild, row + 1, col - 1, nodes, index);
	dfs(node->rightChild, row + 1, col + 1, nodes, index);
}

// 排序规则：列升序，列相同则值升序
bool cmp(nodeInfo node_a, nodeInfo node_b){
	if (node_a.col != node_b.col) return node_a.col < node_b.col;
	return node_a.val < node_b.val;
}

// 手动快速排序
void swap(nodeInfo& a, nodeInfo& b) {
	nodeInfo temp = a;
	a = b;
	b = temp;
}
void quickSort(nodeInfo arr[], int left, int right) {
	if (left >= right) return;
	
	int i = left, j = right;
	nodeInfo pivot = arr[(left + right) / 2];
	
	while (i <= j) {
		while (cmp(arr[i], pivot)) i++;
		while (cmp(pivot, arr[j])) j--;
		if (i <= j) {
			swap(arr[i], arr[j]);
			i++;
			j--;
		}
	}
	
	quickSort(arr, left, j);
	quickSort(arr, i, right);
}

void solve(){
	int n; cin >> n;
	treeNode* root; int nodeCounter = create(root, n, -1);
	int index = 0;
	nodeInfo nodes[1000] = {};

	dfs(T.root, 0,0 ,nodes,index);

	quickSort(nodes, 0, nodeCounter-1);

	for(int i = 0; i < nodeCounter; i++){
		cout << nodes[i].val << " ";
		if(i != nodeCounter-1 && nodes[i].col != nodes[i+1].col){
			cout << "| ";
		}
	}

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

## C. 小蓝鲸摘叶子

> 题目描述

小蓝鲸们发现学校马路中间长出一颗二叉树，影响大家正常走路了，于是小蓝鲸们想要通过不断摘除叶子的方式移除这颗树。但这颗树有点奇怪，只有当前所有的节点按序被摘除的时候，才能把树摘空。

摘叶子的规则如下：

1. 按轮次进行叶子的摘除，当前轮次要摘除的叶子，是进入这个轮次时该树所有的叶子节点；
2. 当前轮次产生的新叶子节点，在当前轮次不可被摘除；
3. 叶子节点要从左往右摘除，摘除完当前轮次的所有叶子时，进入下一个轮次；
4. 树空时，表明成功移除这颗树。

求摘除叶子的正确顺序。

> 输入格式

第一行一个数字，表示二叉树层序表示的数组长度 $n$

第二行，树的层序表示数组 $A$，非空节点为不重复的正整数，空节点使用 $0$ 表示

> 输出格式

按摘除顺序输出节点

> 样例数据

> 样例1

**输入**

```
5
1 0 2 3 4
```

**输出**

```
3 4 2 1
```

??? question "样例解释 #1"

    当前树可表示为
    
    ```
        1
         \
          2
         / \
        3   4
    ```

> 样例2

**输入**

```
6
1 2 3 4 0 5
```

**输出**

```
4 5 2 3 1
```

??? question "样例解释 #2"

    当前树可表示为
    
    ```
          1
         / \
        2   3
       /   /   
      4   5
    ```

> 数据规模与约定

$ 3 \leq n \leq 600000 $

$A[i]$ (节点值的范围) $\in [0,600000]$

时间限制：$1 \text{s}$

空间限制：$128 \text{MB}$

### Solution

两种思路：

1- 建树时记录每个节点的 parent，准备一个队列，然后进行一轮后序遍历，（恰好是从左到右）取出叶节点并输出，期间如果遇到了非叶节点在摘除叶节点后变成了叶结点的情况，就将这些节点插入队列，在一轮叶节点摘除以后取出队列中的节点继续摘除，期间入队新的叶节点，直到根节点被摘除

时间复杂度 $O(n)$，空间复杂度 $O(n)$

2- 依旧是后序遍历，准备一个二维的 `height` 数组，后序遍历时计算每个节点的 “最大高度” `h`（到所有可到达的叶节点的简单路径中的最长路径长度），并将该节点存入 `height[h][]` 中，最后按照 `height` 从小到大的顺序依次输出数组元素

??? tip "递归计算高度：当前节点高度 = max (左子节点高度, 右子节点高度) + 1"

时间复杂度 $O(n)$，纯数组实现 `height` 需要 $O(n^2)$ 的空间复杂度，链表数组实现空间复杂度 $O(n)$，常数不如解法 1

场上写的是第二种

```c++ title="Solution"
#include <iostream>
using namespace std;

// 定义树节点
struct treeNode{
	int val;
	treeNode *leftChild, *rightChild;
	treeNode ()
		{ val = 0; leftChild = NULL;  rightChild = NULL; }
	treeNode (int x, treeNode *l = NULL, treeNode *r = NULL)
		{ val = x;  leftChild = l;  rightChild = r; }

};

// 定义排序结构体
struct nodeInfo{
	int tag, height, id;
};


// 根据层序遍历建树
int create(treeNode* root, int n, int Null) {
	int rootval; cin >> rootval;
	root = new treeNode(rootval);

	treeNode** queue = new treeNode*[n+1];
	int front = 0, rear = 0;

	queue[rear++] = root;

	int index = 1, data, nodeCounter = 1;

	while(front < rear && index < n) {
		treeNode* cur = queue[front++];

		if(index < n) {
			cin >> data;
			if(data != Null) {
				cur->leftChild = new treeNode(data);
				queue[rear++] = cur->leftChild;
				nodeCounter++;
			}
			index++;
		}

		if(index < n) {
			cin >> data;
			if(data != Null) {
				cur->rightChild = new treeNode(data);
				queue[rear++] = cur->rightChild;
				nodeCounter++;
			}
			index++;
		}
	}
	delete[] queue;
	return nodeCounter;
}

// 利用后序遍历函数递归求 “最长高度” ，顺带实现 id 的更新
int postOrder(treeNode* node, nodeInfo* a, int& index){
	if (node == NULL) return -1;

	int leftHeight = postOrder(node->leftChild, a, index);
	int rightHeight = postOrder(node->rightChild, a, index);
	
	int curHeight = 0;
	if(leftHeight == -1 && rightHeight == -1) curHeight = 0;
	else if(leftHeight == -1) curHeight = rightHeight + 1;
	else if(rightHeight == -1) curHeight = leftHeight + 1;
	else curHeight = max(leftHeight, rightHeight) + 1;
	
	a[index] = {node->val, curHeight, index};
	index++;
	return curHeight;
}

bool cmp(nodeInfo a, nodeInfo b){
	return a.height < b.height || (a.height == b.height && a.id < b.id);
}

// 手动快速排序
void swap(nodeInfo& a, nodeInfo& b) {
	nodeInfo temp = a;
	a = b;
	b = temp;
}
void quickSort(nodeInfo arr[], int left, int right) {
	if (left >= right) return;
	
	int i = left, j = right;
	nodeInfo pivot = arr[(left + right) / 2];
	
	while (i <= j) {
		while (cmp(arr[i], pivot)) i++;
		while (cmp(pivot, arr[j])) j--;
		if (i <= j) {
			swap(arr[i], arr[j]);
			i++;
			j--;
		}
	}
	
	quickSort(arr, left, j);
	quickSort(arr, i, right);
}


// 主函数
void solve(){
	int n; cin >> n;
	treeNode* root;
	int* id = new int[n+1];  
	int nodeConuter = create(root, n, 0);
	
	nodeInfo* ans = new nodeInfo[nodeConuter];
	
	int index = 0;
	postOrder(root, ans, index);
	
	quickSort(ans, 0, nodeConuter-1);

	for(int i = 0; i < nodeConuter; i++) {cout << ans[i].tag << " ";}

	delete[] ans;
	delete[] id;
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
