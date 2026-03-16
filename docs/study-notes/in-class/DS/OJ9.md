## A. 小蓝鲸查哈希表

> 题目描述

小蓝鲸在学习过哈希表后，对哈希表的查找十分感兴趣，给定 $n$，$prime$，$m$ 分别表示哈希表的长度，取模的素数，$m$ 个数字，求线性探测法的平均查找长度，和失败查找长度.

> 输入格式

第一行为 $n,prime,m$；第二行为 $m$ 个数字(数字范围 $1\sim 100000$)

> 输出格式

输出两个数字，一个是平均查找长度，一个是失败查找长度（均保留小数点后 3 位）

> 样例数据

**input 1**

```
10 7 8
2 4 5 6 7 9 12 14
```

**output 1**

```
1.500 6.000
```

??? question "样例解释"
    
    将 8 个数放入哈希表后：
    
    | 位置         | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    |
    | :----------- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
    | **关键字**   | 7    | 14   | 2    | 9    | 4    | 5    | 6    | 12   | -    | -    |
    | **查找成功** | 1    | 2    | 1    | 2    | 1    | 1    | 1    | 3    | -    | -    |
    | **查找失败** | 9    | 8    | 7    | 6    | 5    | 4    | 3    | -    | -    | -    |
    
    平均查找长度 = (1+2+1+2+1+1+1+3)/8=1.5
    
    失败查找长度 = (9+8+7+6+5+4+3)/7=6
    
    （注意：本题中*查找失败*是对每个哈希地址 $(0 ≤ i < prime)$ 的查找）

**input 2**

```
15 13 12
19 14 23 1 68 20 84 27 55 11 10 79
```

**output 2**

```
2.500 7.000
```

**input 3**

```
10 7 8
75 33 52 41 12 88 66 27
```

**output 3**

```
2.875 4.857
```

> 数据规模与约定

$1 \leq prime < n \leq 10000,\; 1\leq m \leq n-1$

时间限制： `1s`

空间限制： `128MB`

### Solution

线性探查法的应用

平均成功查找长度 `success / m`，平均失败查找长度 `failure / prime`

```c++ title="Solution"
#include <cstdio>

// #define int long long

using namespace std;
using ll = long long;


void solve(){
	int n, prime, m;
	scanf("%d %d %d", &n, &prime, &m);
	int *hash = new int[n];
	int *suc = new int[n];
	for(int i = 0; i < n; i++){
		hash[i] = suc[i] = -1;
	}
	for(int i = 0; i < m; i++){
		int tmp;
		scanf("%d", &tmp);
		int idx = tmp % prime;
		int suc_num = 1;
		while(hash[idx] != -1){
			suc_num++;
			idx = (idx + 1) % n;
		}
		hash[idx] = tmp;
		suc[idx] = suc_num;
	}
	
	int success = 0;
    for(int i = 0; i < n; i++){
        if(hash[i] != -1){
            success += suc[i];
        }
    }
    
    int failure = 0;
    
    for(int i = 0; i < prime; i++){
        int idx = i;
        int cnt = 1;
        
        while(hash[idx] != -1){
            cnt++;
            idx = (idx + 1) % n;
            if(cnt > n+1) break;
        }
        
        failure += cnt;
    }


	printf("%.3f %.3f", success /(double)m, failure / (double)prime);
	delete []hash;
	delete []suc;
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

## B. 小蓝鲸分组

> 题目描述

小蓝鲸要去旅游，现在要将他们分成任意大小的 **两组**。由于，每个小蓝鲸都有可能不喜欢其他小蓝鲸，这样的两个小蓝鲸不应该分到一个组里。

现在需要你来判断给定的 $n$ 个小蓝鲸（编号为 $1, 2, \cdots, n$）是否能成功的分到两个组中。（提示：本题要采用并查集的方法）

> 输入格式

第一行输入 $n,k$，分别表示小蓝鲸的个数和不能分在同一组的小蓝鲸对数

接下来 $k$ 行每行两个整数，代表小蓝鲸的编号

> 输出格式

输出一行，若能成功分为两组则输出 $true$，否则输出 $false$

> 样例1

**输入**

```
4 3
1 2
1 3
2 4
```

**输出**

```
true
```

??? question "样例解释 #1"

    第一个组为[1, 4]，
    
    第二个组为[2, 3]。

> 样例2

**输入**

```
3 3
1 2
1 3
2 3
```

**输出**

```
false
```

> 数据规模与约定

$ 1 \leq n \leq 2000 $

$ 1 \leq k \leq 10^4 $

每对编号 $a$、$b$， 保证 $1 \leq a, b \leq n$ 且 $ a \ne b $

时间限制：$1 \text{s}$

空间限制：$128 \text{MB}$

### Solution

本质上是二部图判断，采用染色法：

对于每一对给出的“不能分在同一组的节点”（初始值都为 -1）：

1- 如果两个节点都未被“染色”，分别染色为 0 和 1

2- 如果某一个节点已被“染色”，另一个节点“染色”成不一样的值

3- 如果两个节点都已被“染色”且颜色相同，说明无法划分，返回 `false`

否则完成所有结点的染色，返回 `true`

（并查集的写法先并后查即可）

```c++ title="Solution"
#include <iostream>
using namespace std;

void solve(){
	int n, k; cin >>n>>k;
	// bi-graph check
	// 0's neighbor is 1; 1's neighbor is 0;
	// if cannot make it, return false
	int *Bit = new int[n+1];
	for(int i = 0; i <= n; i++){
		Bit[i] = -1;
	}
    
	for(int i = 0; i < k; i++){
		int a, b; cin >>a>>b;

		if(Bit[a] == -1 && Bit[b] == -1){
			Bit[a] = 0; Bit[b] = 1;
		}

		if(Bit[a] != -1){
			if(Bit[a] == Bit[b]) {
				cout << "false"; return;
			}
			else Bit[b] = !Bit[a];
		}

		if(Bit[b] != -1){
			if(Bit[a] == Bit[b]) {
				cout << "false"; return;
			}
			else Bit[a] = !Bit[b];
		}
	}
	cout << "true";
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

## C. 小蓝鲸做任务

> 题目描述

临近期中，小蓝鲸面前有很多任务，每个任务都有一个可以完成的时间区间。

具体来说，第 $i$ 个任务可以在第 $start_i$ 天到第 $end_i$ 天（包含两端）中的任意一天完成。

但是小蓝鲸每天只能完成**一个**任务。

现在，小蓝鲸想知道自己最多能完成多少个任务。请你帮小蓝鲸计算出他最多可以完成的任务数量。

> 输入格式

第一行输入一个整数 $n$，表示任务的数量。

接下来 $n$ 行中，每行包含两个整数 $start_i$ 和 $end_i$，表示第 $i$ 个任务可以完成的起止日期。

> 输出格式

输出一个整数，表示小蓝鲸最多能完成的任务数量

> 样例1

**输入**

```
3
1 2
2 3
3 4
```

**输出**

```
3
```

??? question "样例解释 #1"

    小蓝鲸可以：
    
    - 第 1 天完成任务 1
    - 第 2 天完成任务 2
    - 第 3 天完成任务 3
    
    共完成 3 个任务。

> 样例2

**输入**

```
4
1 2
2 3
3 4
1 2
```

**输出**

```
4
```

??? question "样例解释 #2"
    
    小蓝鲸可以：
    
    - 第 1 天完成任务 1
    - 第 2 天完成任务 4
    - 第 3 天完成任务 2
    - 第 4 天完成任务 3
    
    共完成 4 个任务。

> 数据规模与约定

$1 \leq n \leq 10^5 $

$1\leq start_i \leq end_i \leq 10^5$

### Solution

按照起始日期前后进行排序，每天取截止日期最早的事项（最小堆维护）完成

容易错的自测数据点：（原因是起始日期早而结束日期晚的任务不应该优先完成）

```
3
1 2
1 114
2 2
```

（这题也可以对结束日期排序，然后维护并查集）

```c++ title="Solution"
#include <iostream>
using namespace std;

typedef struct event{
	int start;
	int end;
} event;

bool cmp(event& a, event& b){
	if(a.start != b.start) return a.start < b.start;
	else return a.end < b.end;
}

void swap(event& a, event& b) {
	event temp = a;
	a = b;
	b = temp;
}
void quickSort(event arr[], int left, int right) {
	if (left >= right) return;
	
	int i = left, j = right;
	event pivot = arr[(left + right) / 2];
	
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
	event* timetable = new event[n];
	int daymax = -1;
	for(int i = 0; i < n; i++){
		cin >> timetable[i].start >> timetable[i].end;
		daymax = max(daymax, timetable[i].end);
	}

	quickSort(timetable, 0, n-1);
	
	// 遍历每一天
	int idx = 0, ans = 0;
	for(int i = 1; i <= daymax; i++){
		while (idx < n && timetable[idx].start <= i) {
			// 取 ddl 最早的任务完成
			push(timetable[idx].end);
			idx++;
		}
		while (!empty() && top() < i) {
			pop();
		}

		if (!empty()) {
			pop();
			ans++;
		}
	}
	cout << ans;

	delete []timetable;
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