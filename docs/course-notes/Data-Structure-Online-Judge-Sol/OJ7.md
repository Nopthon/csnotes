## A. Z字形打野

--> 题目描述

小蓝鲸最近在观看盛大的moba电竞比赛，他很喜欢研究比赛中”打野“选手的行动路线。

在一场比赛中，打野选手往往要在野区中来回穿梭，访问野区中的各个资源点获取资源。

野区可以被视作多行，每行有若干个资源点，小蓝鲸发现，一种比较高效的打野方式是“Z”字形打野。即以某个方向遍历完一行的所有资源点后，对下一行的资源点以相反的方向进行遍历，这样就能省去回到下一行起始端点的时间（譬如，先从左往右遍历第一行，再从右往左遍历第二行，再从左往右遍历第三行，……）。如此循环往复直到访问完每一行所有资源点。

野区的资源点分布以二叉树的方式给出，每个资源点用一个数字表示，树中同一深度的节点代表野区中处于同一行的资源点，请你按照上述“Z”字形路线输出小蓝鲸”打野“时，访问各个资源点的顺序。

约定树的根节点为第一行资源点，该行的遍历顺序为从左往右。

--> 输入

第一行为一个数字 $N$，表示第二行中数字的个数。

第二行为 $N$ 个数字，用空格隔开，代表该二叉树的前序遍历结果，$-1$ 代表空结点，其余数字代表野区中的资源点。

--> 输出

多行，每行若干个数字用空格隔开，代表小蓝鲸访问一行各个资源点的顺序，空结点无需输出，从根节点所在行开始输出。

--> 示例 1：

--> 输入

```
7
1 2 -1 -1 3 -1 -1
```

--> 输出

```
1
3 2
```

> 解释：树的形状如下
> 
> ```
>     1
>    / \
>   2   3
> ```
> 
> 从根结点开始，小蓝鲸先从左往右遍历第一行，输出1，然后从右往左遍历，依次访问3和2。

--> 示例 2：

--> 输入

```
11
1 2 -1 -1 3 4 -1 -1 5 -1 -1
```

--> 输出

```
1
3 2
4 5
```

> 解释：树的形状如下
> 
> 第一排：从左往右，输出1
> 
> 第二排：从右往左，输出3 2
> 
> 第三排：从左往右，输出4 5
> 
> ```
>     1
>    / \
>   2   3
>      / \
>     4   5
> ```

--> 数据规模与约定

$1 \leq n \leq 10^5$

时间限制： `1s`

空间限制： `128MB`

### Solution

层序遍历，添加 bool 转向变量标记，转向标记为 true 时调转队列的头尾，子节点入栈的顺序也要交换

```c++ title="Solution"
#include <iostream>
using namespace std;

struct treeNode{
	int val;
	treeNode *leftChild, *rightChild;
	treeNode ()
		{ val = 0; leftChild = NULL;  rightChild = NULL; }
	treeNode (int x, treeNode *l = NULL, treeNode *r = NULL)
		{ val = x;  leftChild = l;  rightChild = r; }

};

// treeNode 双向队列实现
class Deque {
private:
	static const int MAX_SIZE = 100000;
	treeNode* data[MAX_SIZE];
	int Front;
	int Back;
	int count;

public:
	Deque() {
		Front = 0;
		Back = -1;
		count = 0;
	}
	
	~Deque() {}
	

	void push_front(treeNode* value) {
		if (!full()) {
			Front = (Front - 1 + MAX_SIZE) % MAX_SIZE;
			data[Front] = value;
			count++;
		}
	}
	

	void push_back(treeNode* value) {
		if (!full()) {
			Back = (Back + 1) % MAX_SIZE;
			data[Back] = value;
			count++;
		}
	}
	

	void pop_front() {
		if (!empty()) {
			Front = (Front + 1) % MAX_SIZE;
			count--;
		}
	}
	

	void pop_back() {
		if (!empty()) {
			Back = (Back - 1 + MAX_SIZE) % MAX_SIZE;
			count--;
		}
	}
	

	treeNode* front() {
		if (!empty()) {
			return data[Front];
		}
		return nullptr;
	}
	
	treeNode* back() {
		if (!empty()) {
			return data[Back];
		}
		return nullptr;
	}
	
	bool empty() {
		return count == 0;
	}
	
	bool full() {
		return count == MAX_SIZE;
	}
	
	int size() {
		return count;
	}
	
	void clear() {
		Front = 0;
		Back = -1;
		count = 0;
	}
};

// 根据前序遍历建树
void create(istream& in, treeNode*& subTree, int Null, int &cnt) {
	int i;
	if(!(in >> i)) return;
	
	if(i == Null){
		subTree = nullptr; return;
	}

	cnt++;
	subTree = new treeNode(i);
	create(in, subTree->leftChild, Null, cnt);
	create(in, subTree->rightChild, Null, cnt);
}

// 层序遍历输出
void Print(treeNode* root){
	Deque q;
	q.push_back(root);
	bool is_switch = false;
	while(!q.empty()){
		int Size = q.size();
		for(int i = 0; i < Size; i++){
			// 如果转向
			if(is_switch){
				treeNode* cur = q.back();	// diff1
				q.pop_back();
				cout << cur->val << " ";
				// diff2
				if (cur->rightChild != nullptr){
					q.push_front(cur->rightChild);
				}
				if (cur->leftChild != nullptr){
					q.push_front(cur->leftChild);
				}
			}
			// 如果没转向
			else{
				treeNode* cur = q.front();	//
				q.pop_front();
				cout << cur->val << " ";
				//
				if (cur->leftChild != nullptr){
					q.push_back(cur->leftChild);
				}
				if (cur->rightChild != nullptr){
					q.push_back(cur->rightChild);
				}
			}
	
		}
		// 切换转向状态
		is_switch = !is_switch;
		cout << "\n";
	}
}

void solve(){
	int n; cin >> n;
	treeNode* root;
	int cnt = 0;
	create(cin, root, -1, cnt); 
	Print(root);
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

## B. 树的左视角

--> 题目描述

小蓝鲸看到了一棵二叉树，他现在站在树的左边，你能猜到他看到了什么吗？需要注意的是，你先需要根据**前序序列**和**中序序列**，构建二叉树

--> 输入格式

输入包含三行：

- 第一行包含一个整数N ，$1 \leq N \leq 10^4$
- 第二行输入前序序列 , 各结点值范围 $-10^4 \leq val \leq 10^4$ 且不重复
- 第三行输入中序序列 , 各结点值范围 $-10^4 \leq val \leq 10^4$ 且不重复

--> 示例

1. 输入

```
6
1 2 4 3 5 6
4 2 1 5 3 6
```

输出

```
1 2 4
```

> 解释
> 
> ```
> ->      1 
>        / \
> ->    2   3
>      /   / \
> ->  4   5   6
> ```

2. 输入

```
5
1 2 3 4 5
1 3 2 4 5
```

输出

```
1 2 3 5
```

> 解释
> 
> ```
> ->   1 
>       \
> ->     2
>       / \
> ->   3   4
>           \ 
> ->         5
> ```

3. 输入

```
5
1 2 3 4 5
2 1 3 5 4
```

输出

```
1 2 4 5
```

> 解释
> 
> ```
> ->	 1 
>       / \
> ->   2   3
>           \
> ->         4
>           / 
> ->       5
> ```

### Solution

分两步：

1- 根据前序遍历和中序遍历的结果建树

2- 根据层序遍历输出，注意只输出每层第一个元素

```c++ title="Solution"
#include <iostream>
using namespace std;

struct treeNode{
	int val;
	treeNode *leftChild, *rightChild;
	treeNode ()
	{ val = 0; leftChild = NULL;  rightChild = NULL; }
	treeNode (int x, treeNode *l = NULL, treeNode *r = NULL)
	{ val = x;  leftChild = l;  rightChild = r; }

};

class Deque {
	private:
	static const int MAX_SIZE = 10000;
	treeNode* data[MAX_SIZE];
	int Front;
	int Back;
	int count;

	public:
	Deque() {
		Front = 0;
		Back = -1;
		count = 0;
	}

	~Deque() {}


	void push_front(treeNode* value) {
		if (!full()) {
			Front = (Front - 1 + MAX_SIZE) % MAX_SIZE;
			data[Front] = value;
			count++;
		}
	}


	void push_back(treeNode* value) {
		if (!full()) {
			Back = (Back + 1) % MAX_SIZE;
			data[Back] = value;
			count++;
		}
	}


	void pop_front() {
		if (!empty()) {
			Front = (Front + 1) % MAX_SIZE;
			count--;
		}
	}


	void pop_back() {
		if (!empty()) {
			Back = (Back - 1 + MAX_SIZE) % MAX_SIZE;
			count--;
		}
	}


	treeNode* front() {
		if (!empty()) {
			return data[Front];
		}
		return nullptr;
	}

	treeNode* back() {
		if (!empty()) {
			return data[Back];
		}
		return nullptr;
	}

	bool empty() {
		return count == 0;
	}

	bool full() {
		return count == MAX_SIZE;
	}

	int size() {
		return count;
	}

	void clear() {
		Front = 0;
		Back = -1;
		count = 0;
	}
};

treeNode* create(int* preorder, int* inorder, int preSize, int inSize){
	if(inSize == 0) return nullptr;
	treeNode* subTree = new treeNode (preorder[0]);
	int idx;
	for(idx = 0; idx < inSize; idx++){
		if(inorder[idx] == subTree->val) break;
	}
	subTree->leftChild = create(preorder + 1, inorder, idx, idx);
	subTree->rightChild = create(preorder + idx + 1, inorder + idx + 1, preSize - idx - 1, inSize - idx - 1);
	return subTree;
}

void Print(treeNode* root){
	Deque q;
	q.push_back(root);
	while(!q.empty()){
		int Size = q.size();
		for(int i = 0; i < Size; i++){
			treeNode* cur = q.front();
			q.pop_front();
			if(i==0) cout << cur->val << " ";
			if (cur->leftChild != nullptr){
				q.push_back(cur->leftChild);
			}
			if (cur->rightChild != nullptr){
				q.push_back(cur->rightChild);
			}
		}
	}
}

int a1[10005];
int a2[10005];

void solve(){
	int n; cin >> n;
	for(int i = 0; i < n; i++){
		cin >> a1[i];
	}
	for(int i = 0; i < n; i++){
		cin >> a2[i];
	}
	
	treeNode* root = create(a1,a2,n,n);
	Print(root);
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

## C. 小蓝鲸装监控

--> 题目描述

给定一个二叉树，小蓝鲸需要在树的结点上安装摄像头。结点上的每个摄像头都可以监控其父结点，子结点和自己。为了能够监控树的所有结点，请计算小蓝鲸需要安装的最小摄像头数量。

--> Input

第一行输入整数 $n$，表示树中结点的个数。

第二行按照层次遍历输入树的 $n$ 个节点，$0$ 代表该结点存在，$-1$ 表示该结点为空。

--> Output

输出监控树的所有结点所需的最少摄像头数量

--> 样例

**输入1**

```
5
0 0 -1 0 0
```

**输出1**

```
1
```

> 解释：
> 
> ```
>       0
>      /	 
>     0 (camera)
>    / \
>   0   > 0
> ```
> 
> （camera）为监控安装的位置

**输入2**

```
9
0 0 -1 0 -1 0 -1 -1 0
```

**输出1**

```
2
```

> 解释：
> 
> ```
>         0
>        /	 
>       0 (camera)
>      /  
>     0
>    /
>   0 (camera)
>    \
>     0
> ```
> 
> （camera）为监控安装的位置

--> 限制约束

- $1 \leq n \leq 1000$
- 时间: 1s
- 空间: 256MB

### Solution

定义节点状态：

0 - 未覆盖；1 - 被监控覆盖；2 - 安装了监控

后序遍历进行状态转移更新即可，注意根节点需要多一次判断

```c++ title="Solution"
#include <iostream>

// #define int long long

using namespace std;
using ll = long long;

struct treeNode{
	int val;
	treeNode *leftChild, *rightChild;
	treeNode ()
		{ val = 0; leftChild = NULL;  rightChild = NULL; }
	treeNode (int x, treeNode *l = NULL, treeNode *r = NULL)
		{ val = x;  leftChild = l;  rightChild = r; }

};

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

int ans = 0;

// post_dfs
// 0 if not included
// 1 if included
// 2 if puts the monitor
// 最终返回的是根节点的状态
int dfs(treeNode* subTree) {
	if(subTree == nullptr){
		return 1;
	}
		
	int l = dfs(subTree->leftChild);
	int r = dfs(subTree->rightChild);

	if(l == 0 || r == 0){
		ans++;
		return 2;
		
	}

	if(l == 2 || r == 2){
		return 1;
	}

	return 0;
}
		
void solve(){
	int n; cin >> n ;
	treeNode* root;
	create(root, n,-1);

	ans += (dfs(root) == 0 ? 1 : 0);

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