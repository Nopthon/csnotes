## A. 小蓝鲸建树

--> 题目描述

小蓝鲸在学习树的数据结构过程中，看到了树的带权路径长度的概念： 树的带权路径长度规定为所有叶子结点的带权路径长度之和，记为WPL(weighted path length)，即每个叶子节点的权值乘以从根节点到此叶子节点的路径长度之和。 于是小蓝鲸想给定 $n$ 个权值作为 $n$个叶子节点，构造一棵二叉树，使得二叉树的WPL最小。请你帮助小蓝鲸实现这个目的。

--> Input

第一行：一个正整数$n$，代表具有给定权值的叶子节点个数

第二行：$n$个整数，代表$n$个权值的具体数值

--> Output

一个整数，代表最小的带权路径长度

--> 样例

**输入1**

```
4
7 5 2 4
```

**输出1**

```
35
```

**解释**

$7 \times 1 + 5 \times 2 + 2 \times 3 + 4 \times 3 = 35$

```
             / \
            7  / \
              5  / \
                2   4            
```

**输入2**

```
2
1 2
```

**输出2**

```
3
```

--> 数据规模与约定

$1 \leq 叶子节点的权值 \leq 2000$

$2 \leq n \leq 1000$

### Solution

用一个最小堆实现 Huffman 树的构建，但是实际上不需要完成建树行为，只需要重复进行“从最小堆取出最小的两个值，累加后插入堆”的操作即可，期间累加插入的值，就能计算 WPL

```c
#include <iostream>

// #define int long long

using namespace std;
using ll = long long;

// template of minheap
#define MAX_SIZE 100000
int heap[MAX_SIZE];
int heap_size = 0;
int parent(int i) { return (i - 1) / 2; }
int left(int i) { return 2 * i + 1; }
int right(int i) { return 2 * i + 2; }
void push(int value) {
	int i = heap_size++;
	heap[i] = value;
	while (i > 0 && heap[parent(i)] > heap[i]) {
		int temp = heap[i];
		heap[i] = heap[parent(i)];
		heap[parent(i)] = temp;
		i = parent(i);
	}
}
int pop() {
	if (heap_size == 0) return -1;
	int minVal = heap[0];
	heap[0] = heap[--heap_size];
	int i = 0;
	while (1) {
		int smallest = i;
		int l = left(i), r = right(i);
		
		if (l < heap_size && heap[l] < heap[smallest]) smallest = l;
		if (r < heap_size && heap[r] < heap[smallest]) smallest = r;
		
		if (smallest == i) break;
		
		int temp = heap[i];
		heap[i] = heap[smallest];
		heap[smallest] = temp;
		i = smallest;
	}
	return minVal;
}
int top() {
	return heap_size > 0 ? heap[0] : -1;
}
int empty() {
	return heap_size == 0;
}
// end of template

void solve(){
	int n; cin >> n;

	for (int i = 0; i < n; i++) {
		int tmp;
		cin >> tmp;
		push(tmp);
	}
	int res = 0;
	// from floor to top
	for (int i = 0; i < n-1; i++) {
		int x = top(); pop();
		int y = top(); pop();
		int temp = x + y;
		res += temp;
		push(temp);
	}
	cout << res;
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

## B. 合并二叉树

--> 题目描述

给定两个二叉树，想象当你将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠。

你需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为 NULL 的节点将直接作为新二叉树的节点。

合并从根节点开始。输入输出均用前序遍历表示，其中空节点用-1表示。

--> 输入格式

共三行，第一行包括两个数字，分别代表两个二叉树的前序遍历表示的长度，第二行和第三行分别为两个二叉树的前序遍历表示

--> 输出格式

合并后二叉树的前序遍历表示

--> 输入

```
9 11
1 3 5 -1 -1 -1 2 -1 -1
2 1 -1 4 -1 -1 3 -1 7 -1 -1
```

--> 输出

```
3 4 5 -1 -1 4 -1 -1 5 -1 7 -1 -1
```

--> 解释

```
Tree 1            Tree2                                  
          1          2                                               
         / \        / \                                           
        3   2      1   3                                       
       /           \    \                               
      5             4    7

合并后的tree

         3
        / \
       4   5 
      / \   \ 
     5   4   7
```

--> 数据规模

$1 \leq 节点的值 \leq 10^6$

$0 \leq 二叉树非空节点数 \leq 10^4$

时间限制： 1s

空间限制： 128MB

### Solution

考虑将第二棵树接在第一棵树上，对两棵树同时进行前序遍历，首先将第二棵树的对应节点值加到第一棵树对应节点上，然后依次对左/右子树判断：

1- 都有左/右子树：向下进行递归

2- 第一棵树没有而第二棵树有：将第二棵树的对应子树接到第一棵子树下，结束向下的递归

3- 第一棵树有而第二棵树没有：结束向下的递归

```c
#include <iostream>

// #define int long long

using namespace std;
using ll = long long;

struct treeNode{
    int val;
    treeNode *leftChild, *rightChild;
    treeNode ()
        { val = 0; leftChild = nullptr;  rightChild = nullptr; }
    treeNode (int x, treeNode *l = nullptr, treeNode *r = nullptr)
        { val = x;  leftChild = l;  rightChild = r; }
};

treeNode* create(int Null, int& remain) {
    if (remain <= 0) return nullptr;

    int input;
    if (!(cin >> input)) return nullptr;
    remain--;

    if (input == Null) {
        return nullptr;
    }

    treeNode* root = new treeNode(input);
    root->leftChild = create(Null, remain);
    root->rightChild = create(Null, remain);
    return root;
}
treeNode* postmerge(treeNode* cur1, treeNode* cur2){
	if(cur1 == nullptr && cur2 == nullptr) return cur1;
    if(cur1 == nullptr && cur2 != nullptr) return cur2;
    if(cur1 != nullptr && cur2 == nullptr) return cur1;

	cur1->val += cur2->val;
	if(cur1->leftChild != nullptr && cur2->leftChild != nullptr){
		postmerge(cur1->leftChild, cur2->leftChild);
	}
	else if(cur1->leftChild == nullptr && cur2->leftChild != nullptr){
		cur1->leftChild = cur2->leftChild;
	}

	if(cur1->rightChild != nullptr && cur2->rightChild != nullptr){
		postmerge(cur1->rightChild, cur2->rightChild);
	}
	else if(cur1->rightChild == nullptr && cur2->rightChild != nullptr){
		cur1->rightChild = cur2->rightChild;
	}

	return cur1;
}
void PreOrder(treeNode* root) {
    if (root == nullptr) {
        cout << "-1 ";
        return;
    }
    cout << root->val << " ";
    PreOrder(root->leftChild);
    PreOrder(root->rightChild);
}

void solve(){
	int n1, n2; cin >> n1 >> n2;
	int remain1 = n1 ,remain2 = n2;
	treeNode* root1 = create(-1, remain1);
	treeNode* root2 = create(-1, remain2);

	// add root2 to root1
	PreOrder(postmerge(root1, root2));

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

## C. 小蓝鲸打怪

--> 背景描述

某日，小蓝鲸收到了一封没有署名的信件，里面夹带着一张卡片，在小蓝鲸念起卡片上的文字时，突然一道强光闪过，在这一瞬间，小蓝鲸穿越到了异世界。异世界充满着妖魔鬼怪，其中大BOSS是大魔王。小蓝鲸由于之前解决问题的优异表现，被赋予了勇者身份，使命是找到并打败大魔王。但是异世界冒险的路途必然充满艰难险阻，想要完成使命，小蓝鲸必须完成许多挑战。

小蓝鲸开始冒险，但是异世界的征途会遇到各种妖魔鬼怪，小蓝鲸如果想要走得更远，必须提高自己的战力值。小蓝鲸为了能够存活下来并且继续冒险，来到了小怪的聚集地，决定通过打小怪的方式来积攒经验并且提升战力值。

每当小蓝鲸击败一个小怪时，小蓝鲸的战力值都会发生改变。具体而言，每个小怪也同样具有一个战力值，假设已经有`x`个小怪被小蓝鲸战胜，那么小蓝鲸的战力值就会变为这些小怪中战力第`⌈x/M⌉`大的战力值。

小蓝鲸需要知道每当他战胜一个小怪时，自己的战力值是多少？

--> Input

第一行两个数字，`M`和`N`，`M`的含义如题目所示，`N`代表小蓝鲸总共战胜的小怪的数量

第二行`N`个数字，代表每个被战胜的小怪的战力值

--> Output

`N`个数字，代表每次战胜一个小怪后，小蓝鲸的战力值

--> 样例1

**输入**

```
2 4 
1 2 4 3
```

**输出**

```
1 2 2 3
```

**解释** 当数组为[1]，第`⌈1/2⌉`大的数就是1，当数组为[1,2]，第 `⌈2/2⌉` 大的数就是2，当数组为[1,2,4]，第`⌈3/2⌉`大的数就是2，当数组为[1,2,4,3]，第`⌈4/2⌉`大的数就是3

--> 样例2

**输入**

```
3 5
1 2 4 3 5
```

**输出**

```
1 2 4 3 4
```

**解释**

当数组为[1]，第`⌈1/3⌉`大的数是1，当数组为[1,2]，第`⌈2/3⌉`大的数是2，当数组为[1,2,4]，第`⌈3/3⌉`大的数是4，当数组为[1,2,4,3]，第`⌈4/3⌉`大的数是3，当数组为[1,2,4,3,5]，第`⌈5/3⌉`大的数是4

--> 数据规模与约定

对于100%的数据，$M \leq 5，N \leq 10^6，0 \leq 每个小怪的战力值 \leq 10^6$

时间限制：2s

空间限制：128MB

### Solution

第 k 大的数理解为 “前 k 大的数中的最小值”，据此维护一个对顶堆，确保最小堆的内容是前 k 大的数，堆顶为第 k 大的数

堆的函数写的比较抽象（

```c
#include <iostream>

// #define int long long

using namespace std;
using ll = long long;

// template of minheap
#define MAX_SIZE 1000005
int minHeap[MAX_SIZE];
int min_heap_size = 0;
int parent(int i) { return (i - 1) / 2; }
int left(int i) { return 2 * i + 1; }
int right(int i) { return 2 * i + 2; }
void minPush(int value) {
	int i = min_heap_size++;
	minHeap[i] = value;
	while (i > 0 && minHeap[parent(i)] > minHeap[i]) {
		int temp = minHeap[i];
		minHeap[i] = minHeap[parent(i)];
		minHeap[parent(i)] = temp;
		i = parent(i);
	}
}
int minPop() {
	if (min_heap_size == 0) return -1;
	int minVal = minHeap[0];
	minHeap[0] = minHeap[--min_heap_size];
	int i = 0;
	while (1) {
		int smallest = i;
		int l = left(i), r = right(i);
		
		if (l < min_heap_size && minHeap[l] < minHeap[smallest]) smallest = l;
		if (r < min_heap_size && minHeap[r] < minHeap[smallest]) smallest = r;
		
		if (smallest == i) break;
		
		int temp = minHeap[i];
		minHeap[i] = minHeap[smallest];
		minHeap[smallest] = temp;
		i = smallest;
	}
	return minVal;
}
int minTop() {
	return min_heap_size > 0 ? minHeap[0] : -1;
}
int minEmpty() {
	return min_heap_size == 0;
}
// end of template

// template of maxheap
// now used
int maxHeap[MAX_SIZE];
int max_heap_size = 0;
void maxPush(int value) {
    int i = max_heap_size++;
    maxHeap[i] = value;
    while (i > 0 && maxHeap[parent(i)] < maxHeap[i]) {
        int temp = maxHeap[i];
        maxHeap[i] = maxHeap[parent(i)];
        maxHeap[parent(i)] = temp;
        i = parent(i);
    }
}

int maxPop() {
    if (max_heap_size == 0) return -1;
    int maxVal = maxHeap[0];
    maxHeap[0] = maxHeap[--max_heap_size];
    int i = 0;
    while (1) {
        int largest = i;
        int l = left(i), r = right(i);
        
        if (l < max_heap_size && maxHeap[l] > maxHeap[largest]) largest = l;
        if (r < max_heap_size && maxHeap[r] > maxHeap[largest]) largest = r;
        
        if (largest == i) break;
        
        int temp = maxHeap[i];
        maxHeap[i] = maxHeap[largest];
        maxHeap[largest] = temp;
        i = largest;
    }
    return maxVal;
}
int maxTop() {
    return max_heap_size > 0 ? maxHeap[0] : -1;
}
int maxEmpty() {
    return max_heap_size == 0;
}
// end of template

void solve(){
	int n,m; cin >> m >> n;
	for(int i = 1; i <= n; i++){
		int tmp;
		cin >> tmp;
		int k = (i + m - 1) / m;

		maxPush(tmp);

		while(min_heap_size < k && !maxEmpty()){
			minPush(maxTop());
			maxPop();
		}

		if(maxTop() > minTop() && !minEmpty() && !maxEmpty()){
			int a = minTop(), b = maxTop();
			minPop(); maxPop();
			minPush(b); maxPush(a); 
		}

		cout << minTop() << " ";
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