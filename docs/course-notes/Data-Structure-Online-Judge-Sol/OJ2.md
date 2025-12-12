## A. 小蓝鲸排队

--> 题目描述

小蓝鲸们在需要决定先后顺序时，都会采用一个奇怪的排队规则。

$n$ 只小蓝鲸们（编号 $1, 2, 3, ..., n$）围坐在一张圆桌周围。由编号为 $1$ 的小蓝鲸开始依次报数，数到 $m$ 的那个小蓝鲸出列；他的**下一只**小蓝鲸又从 $1$ 开始报数，数到 $m$ 的那只小蓝鲸又出列；此外，在编号为 $k$ 的倍数的小蓝鲸出列之后，**反转**报数的方向。依此规律重复下去，直到圆桌周围的小蓝鲸全部出列，得到一个排队序列。请用**双向循环链表**模拟这个过程，并输出报数的结果。

--> 输入格式

每个测试用例包含一行，包含三个整数 $n,m,k\,(1 \le n \le 10^3，1\leq m \leq 10^3，1\leq k \leq n)$，

--> 输出格式

对于每个测试用例，输出一行，表示为按顺序出列的小蓝鲸编号序列，编号之间用空格分隔。

--> 样例1

**Input**

```
6 2 3
```

**Output**

```
2 4 6 3 1 5
```

--> 解释

> 对于样例1，一共有$6$只小蓝鲸，编号$1, 2, 3, 4, 5, 6$。从编号为$1$的小蓝鲸开始报数，报到$2$的小蓝鲸出列，然后接着从头开始报数。并且当编号为$3$、$6$的小蓝鲸出列之后，反转报数的方向。
>
> - 从$1$号开始报数，$1$号报数$1$，$2$号报数$2$，$2$号出列。
> - $3$号开始报数$1$，$4$号报数$2$，$4$号出列。
> - $5$号报数$1$，$6$号报数$2$，$6$号出列并反转方向。
> - $5$号报数$1$，$3$号报数$2$，$3$号出列并反转方向。
> - $5$号报数$1$，$1$号报数$2$，$1$号出列。
> - $5$号出列。

### Solution

约瑟夫环问题，但是多了一个反转操作，并且要求使用双向循环链表（需要实现插入、删除）

```c++ title="Solution"
#include <bits/stdc++.h>
using namespace std;

/* 双向链表模板 */
struct Node {
	int value;
	Node* left;
	Node* right;
	Node(int v): value(v), left(nullptr), right(nullptr) {}
};

void insertNode(Node*& head, int v) {
	Node* node = new Node(v);
	if (!head) {
		head = node;
		head->left = head;
		head->right = head;
	} else {
		Node* tail = head->left;
		tail->right = node;
		node->left = tail;
		node->right = head;
		head->left = node;
	}
}

// 删除节点函数会返回下一个节点的指针
Node* deleteNode(Node* cur, bool& shift, int k) {
	// 检查是否需要转向
	if (cur->value % k == 0) {
		shift = !shift;
	}
	
	// 获取下一个节点
	Node* next = shift ? cur->right : cur->left;
	
	// 删除当前节点
	if (cur->left == cur && cur->right == cur) {
		delete cur;	// 直接删除最后一个节点
		return nullptr;
	} else {
		cur->left->right = cur->right;
		cur->right->left = cur->left;
		delete cur;
		return next;
	}
}

signed main(){
	ios::sync_with_stdio(false);
	cin.tie(0); cout.tie(0);

	int n, m, k;
	cin >> n >> m >> k;
	
	// 初始化链表
	Node* head = NULL;
	for (int i = 1; i <= n; i++) {
		insertNode(head, i);
	}
	
	bool shift = false;	// 转向标记
	Node* cur = head;
	
	while (cur != nullptr) {
		// 模拟报数
		for (int i = 0; i < (m-1) % n; i++) {
			cur = shift ? cur->right : cur->left;
		}
		cout << cur->value << " ";
		// 删除节点
		cur = deleteNode(cur, shift, k);
		n--;
	}
	return 0;
}
```

---

## B. 小蓝鲸找位置

--> 题目描述

小蓝鲸们在中秋节来到博物馆参观。小蓝鲸们会领到一个幸运数字，并且按幸运数的大小排队（**递增序列**）。为了便于管理，博物馆的管理员让大家合并为一列，而且要变为按幸运数字从高到低的顺序（**递减序列**）。现在请你为每个小蓝鲸找好在新队列的位置吧！

--> 输入格式

输入的第一行给出了初始两列的幸运数字 $m,n$（$0 ≤ m,n ≤ 200$）

接下来的两行（如果均存在）分别给出两列中每个小蓝鲸的幸运数字 $h$（$0 < h < 1000$）

--> 输出格式

输出合并后的数组，一共 $1$ 行，共 $m + n$ 个数字，数字用空格分隔开

--> 输入样例1

```
3 3
1 2 3
2 5 6
```

--> 输出样例1

```
6 5 3 2 2 1
```

--> 输入样例2

```
1 0
1
```

--> 输出样例2

```
1
```

--> 限制

- 时间限制：**1s**
- 内存限制：**256MB**

### Solution

实现线性复杂度的 merge 操作，并且倒序输出，这里考虑从右往左进行 merge 操作

```c++ title="Solution"
#include <bits/stdc++.h>
#define MAX_SIZE 200
using namespace std;

int a[MAX_SIZE+1], b[MAX_SIZE+1], merged[MAX_SIZE+2];

signed main(){
	ios::sync_with_stdio(false);
	cin.tie(0); cout.tie(0);
	
	int m, n; cin >> m >> n;
	for(int i = 0; i < m; i++){
		cin >> a[i];
	}
	for(int i = 0; i < n; i++){
		cin >> b[i];
	}
	
	int top = -1;
	
	int a_ptr = m-1; int b_ptr = n-1;
	
	// 两个数组都没遍历结束
	while (a_ptr != -1 && b_ptr != -1){
		if(a[a_ptr] > b[b_ptr]){
			merged[++top] = a[a_ptr];
			a_ptr--;
		}
		else {
			merged[++top] = b[b_ptr];
			b_ptr--;
		}
	}
	
	// 某一个数组遍历结束
	if(a_ptr != -1){
		while (a_ptr != -1){
			merged[++top] = a[a_ptr];
			a_ptr--;
		}
	}
	else if(b_ptr != -1){
		while (b_ptr != -1){
			merged[++top] = b[b_ptr];
			b_ptr--;
		}
	}
	for(int i = 0; i <= top; i++){
		cout << merged[i] << " ";
	}
	return 0;
}
```

---

## C. 小蓝鲸乘法

--> 题目描述

小蓝鲸们在玩一个乘法游戏。游戏玩法如下：小蓝鲸们初始组成一个队列，并且每个人有一个号码牌 $\text{num}\,(0\leq \text{num} \leq 9)$。希望将初始队列划分成 $2$ 个队伍，给定一个划分值 $x$，所有大于或者等于 $x$ 的号码牌都放到所有小于 $x$ 的后面，同时保证每个节点的初始相对位置不变。得到两个队伍后，将两个队伍对应的号码牌组成的值相乘，并输出。

------

--> 输入格式

第一行为小蓝鲸人数$n$，第二行为划分值$x$，第三行为划分前初始号码牌队列，每两个数据之间用空格隔开。

--> 输出格式

输出最后的相乘值

--> 样例数据

**input 1**

```
6
3
1 4 3 2 5 2
```

**output 1**

```
53070
```

> 解释：初始队列根据划分值3划分为了两个队列 $(1,2,2),\,(4,3,5)$，两个队列对应的数字为 $122\times435=53070$ 

**input 2**

```
5
3
5 1 2 8 1
```

**output 2**

```
7018
```

> 解释：初始队列根据划分值3划分为了两个队列 $(1,2,1),\,(5,8)$，两个队列对应的数字为 $121\times 58=7018$

--> 数据规模与约定

$1 \leq n \leq 5000$

时间限制： `2s`

空间限制： `128MB`


### Solution

主要任务是实现高精度乘法

```c++ title="Solution"
#include <bits/stdc++.h>
#define MAX_SIZE 5000
// #define int long long
using namespace std;

int a[MAX_SIZE+1], b[MAX_SIZE+1], c[MAX_SIZE+3];

signed main(){
	ios::sync_with_stdio(false);
	cin.tie(0); cout.tie(0);
	
	int n, x; cin >> n >> x;
	int atop = 0, btop = 0;
	// 输入与划分，采用 1-index
	for(int i = 0; i < n; i++){
		int tmp; cin >> tmp;
		if(tmp < x){
			a[++atop] = tmp;
			// 舍弃前导零
			if(a[1] == 0) atop--;
		}
		else {
			b[++btop] = tmp;
			if(b[1] == 0) btop--;
		}
	}
	
	// 特判：其中一个乘数为 0，结果为 0
	if (a[1] == 0 || b[1] == 0){
		cout << "0";
		return 0;
	}
	
	// 高精度乘法
	for(int i = btop; i >= 1; i--){
		// 变量作用参考变量名
		int jinwei = 0;
		for(int j = atop; j >= 1; j--){
			int tmp = a[j] * b[i] + jinwei + c[i+j];
			c[i+j] = tmp % 10;
			jinwei = tmp / 10;
		}
		if(jinwei != 0){
			c[i] += jinwei;
		}
	}
	int i = 0;
	// 跳过前导零
	while(c[i] == 0) i++;
	// 输出结果
	for(; i <= atop+btop; i++){
		cout << c[i];
	}
	
	
	 
	return 0;
}
```