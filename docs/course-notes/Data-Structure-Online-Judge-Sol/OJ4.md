## A. 小蓝鲸的数列

> 题目背景

大数学家小蓝鲸偶然间发现一种有趣的自然数数列 `NJUdata`，对应以 $a$ 为基的 `NJUdata` 定义如下：

1. $a$ 是 `NJUdata` 的基，且 $a$ 是 `NJUdata` 的第一个元素；
2. 如果 $x$ 在集合 `NJUdata` 中，则 $2x+1$ 和 $3x+1$ 也都在集合 `NJUdata` 中；
3. 没有其他元素在集合 `NJUdata` 中了。

现在小蓝鲸想知道如果将集合 `NJUdata` 中元素按照升序排列，第 $n$ 个元素会是多少？（**请使用队列完成**）

> 输入

输入包括两个数字，集合的基 $a$ 以及所求元素序号 $n$。

> 输出

输出集合 `NJUdata` 的第 $n$ 个元素值。

> 样例输入 #1

```
1 6
```

> 样例输出 #1

```
10
```

??? question "样例解释 #1"

    以 1 为基的 `NJUdata`，数列前 6 个分别为：$1,3,4,7,9,10\cdots$，则第 6 个元素为 10。

> 样例输入 #2

```
28 5437
```

> 样例输出 #2

```
900585
```

> 数据范围及提示

- 对于100%的数据，$1 \le n \le 10^6$, $1 \le a \le 50$

时间限制： `1s`

空间限制： `128MB`

### Solution

两个队列分别存储 $2x+1$ 和 $3x+1$ 的生成元素，每次取两个队列尾部的较小值（`cur` 的值），生成新的元素置于对应的队首，重复直到取到了第 `n` 小的值

```c++ title="Solution"
#include <bits/stdc++.h>
#define MAX_SIZE 100000
using namespace std;

int queue2x[MAX_SIZE+1], queue3x[MAX_SIZE+1];

void solve(){
	int a,n; cin >>a>> n;
	if (n==1) {
		cout << a;
		return;
	}
	int head2 = 0, head3 = 0;
	int tail2 = 0, tail3 = 0;
    // 初始化队列
	queue2x[tail2++] = 2*a+1; queue3x[tail3++] = 3*a+1;
	
    // 从第二个元素开始生成
	int cur = a;
	for(int cnt = 2; cnt <= n; cnt++) {
        // 如果两个队列都不为空，取较小的队尾值为 cur
		if(head2 < tail2 && head3 < tail3) {
			if(queue2x[head2] < queue3x[head3])
				cur = queue2x[head2++];
			else if(queue2x[head2] > queue3x[head3])
				cur = queue3x[head3++];
            // 如果队尾相等的话，任意取一个，但是两个队列都要弹出元素
            else {
                cur = queue3x[head2++];
                head3++;
            }
		}
        // 否则取非空队尾为 cur
		else if(head2 < tail2)
			cur = queue2x[head2++];
		else
			cur = queue3x[head3++];
        
		// 生成新元素
		queue2x[tail2++] = 2 * cur + 1;
		queue3x[tail3++] = 3 * cur + 1;
	}
	cout << cur;
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

## B. 小蓝鲸与珍珠组合

> 题目背景

小蓝鲸最近在海底发现了一串编号为 $1,2,3,\dots,n$ 的珍珠。它打算从中挑选一些珍珠摆放成艺术组合。为了让作品更加和谐美观，小蓝鲸规定：每次挑选的珍珠个数必须恰好是 $k$ 个，并且挑选的顺序按照编号递增排列。

小蓝鲸想知道，所有可能的珍珠组合会是什么样子。作为它的好朋友，请你帮忙把这些组合都列出来，并且按照**字典序**输出。

> 题目描述

给定两个整数 $n$ 和 $k$，请输出从 $1,2,3,\cdots,n$ 中任取 $k$ 个数的所有组合。

输出的每组组合占一行，数之间用空格隔开，行与行之间按照字典序排列。

> 输入

输入两个整数 $n, k$（$0 < k \leq n$），数据用空格隔开。

> 输出

输出所有可能的组合，每组一行。

> 样例输入 #1

```
3 1
```

> 样例输出 #1

```
1
2
3
```

> 样例输入 #2

```
6 3
```

> 样例输出 #2

```
1 2 3
1 2 4
1 2 5
1 2 6
1 3 4
1 3 5
1 3 6
1 4 5
1 4 6
1 5 6
2 3 4
2 3 5
2 3 6
2 4 5
2 4 6
2 5 6
3 4 5
3 4 6
3 5 6
4 5 6
```

------

> 数据范围及提示

- $1 \leq n \leq 50$
- $1 \leq k \leq n$

时间限制：1s

空间限制：512MB

### Solution

$k$ 不重复元素组合顺序生成器

通过迭代的方法，从第一个组合 `[1,2,...,k]` 出发进行迭代生成，使用栈进行回溯

```c++ title="Solution 1"
#include <bits/stdc++.h>
#define MAX_SIZE 50
using namespace std;

void solve(){
	int n,k; cin >> n >> k;
    // 数组栈
	int stack[MAX_SIZE+1];
	int ptr = -1;
    
    // 初始化为 [1,2,...,k]
	for(int i = 1; i <= k; i++){
		stack[++ptr] = i;
	}
	
    // 先输出第一个组合
	for(int i = 0; i < k; i++) cout << stack[i] << " ";
	cout << "\n";
    
	// 只要没有栈空就继续生成组合
    // 当所有元素均因为递增和最大元素限制被弹出时，说明全部生成完毕
	while(ptr > -1){
        // 栈顶值没有达到最大
		if(stack[ptr] < n){
            // 可以继续累加
			stack[ptr]++;
            // 输出
			for(int i = 0; i < k; i++) cout << stack[i] << " ";
			cout << "\n";
		}
        // 栈顶值达到了最大，需要回溯
		else{
            // 找到最近的可以递增的位置
			ptr--;
			while(ptr > -1 && stack[ptr+1] - stack[ptr] == 1){
				ptr--;
			}
            // 递增
			if(ptr > -1) stack[ptr]++;
            // 重置之后的序列
			while(ptr != -1 && ptr < k-1){
				int tmp = stack[ptr];
				ptr++;
				stack[ptr] = tmp + 1;
			}
            // 如果构造合法，输出
			if(ptr > -1 && stack[ptr] <= n) {
				for(int i = 0; i < k; i++) cout << stack[i] << " ";
				cout << "\n";
			}
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

或者采用递归思路进行生成，函数递归栈也是栈

```c++ title="Solution 2"
void dfs(int arr[], int pos, int start, int n, int k) {
    // 完成了 k 个元素的选择，输出
    if (pos == k) {
        for (int i = 0; i < k; i++)
            cout << arr[i] << " ";
        cout << "\n";
        return;
    }
    
    // 选择元素
    for (int i = start; i <= n; i++) {
        arr[pos] = i;
        dfs(arr, pos + 1, i + 1, n, k);  // 递归选择下一个元素
    }
}
```

---

## C. 小蓝鲸食堂排队

终于下课啦！小蓝鲸们去食堂干饭，排起了一条长长的队列。队伍从前到后给出每只小蓝鲸的身高。每只小蓝鲸都想知道：向前看时，自己能看到多少只小蓝鲸？

可见性规则如下：

- 视线从当前位置向前延伸；
- 可以看到紧挨着的一段**连续的、更矮**的小蓝鲸；
- 如果这段之后紧接着有第一只**高度不小于自己**的小蓝鲸，那么这只也能被看到（但它会阻挡更远的视线）。

请你为队伍中的每只小蓝鲸计算可见的小蓝鲸数量。

> 输入

第一行包含一个整数 $n$，表示小蓝鲸的数量。

> 输出

输出一行 $n$ 个整数，第 $i$ 个数表示第 $i$ 只小蓝鲸向前所能看到的小蓝鲸数量（按照上述规则）。

> 样例输入 #1

```
10
5 5 2 2 2 6 1 1 1 1
```

> 样例输出 #1

```
0 1 1 1 1 5 1 1 1 1
```

??? question "样例解释 #1"

    - 位置 1 前方无人，答案为 0
    - 位置 2,3,4,5 前方的第一个小蓝鲸都不矮于自身，答案为 1
    - 位置 6 前方的小蓝鲸都矮于 6，答案为 5
    - 剩余位置前方的第一个小蓝鲸都不矮于自身，答案为 1

> 数据范围及提示

- 对于前 30% 的数据，$1 \le n \le 10^3$，$0\le a_i\le 10^9$；
- 对于 100% 的数据，$1\le n\le 5\times 10^5$，$0\le a_i\le 10^9$。

??? tip "**本题输入输出量较大，请使用高效的读写方式。**"

    如果你使用 `cin`、`cout` 进行读写出现超时，可以考虑使用 `scanf`、 `printf` 或者在程序开头增加如下代码:
    
    ```c++
    // 关闭 iostream 与 C 标准库的同步，加速 cin/cout
    ios::sync_with_stdio(false); 
    // 解除 cin 与 cout 的绑定，避免每次输入前自动刷新输出，提高 IO 性能
    cin.tie(0);
    ```
    
    **时间复杂度过高**的程序无论使用哪种读写方式都会超时。

时间限制：`1s`

空间限制：`512MB`

### Solution 

单调栈板子，维护单调递减栈（存下标），弹出下标时与待插入下标取差值作为答案

```c++ title="Solution"
#include <bits/stdc++.h>
using namespace std;

int height[500005];
int ans[500005] = {0};
int Stack[500005];

void solve(){
	int top = -1;
	int n; cin >> n;
	for (int i = n-1; i >= 0; i--){
		cin >> height[i];
	}
	
	for (int i = 0; i < n; i++){
		if(top <= -1 || height[i] < height[Stack[top]]){
			Stack[++top] = i;
		}
		else{
			while(top >= 0 && height[i] >= height[Stack[top]]){
				ans[Stack[top]] = i - Stack[top];
				top--;
			}
			Stack[++top] = i;
		}
	}
	
	while(top >= 0){
		ans[Stack[top]] = n-Stack[top]-1;
		top--;
	}
	
	for(int i = n-1; i >= 0; i--){
		cout << ans[i] << " ";
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