## A. KMP裸题

--> 题目背景

小蓝鲸疲于换马甲，所以来做一道KMP裸题放松放松，给定字符串s1="ababaa"，s2="aba"，则s2一共在s1中出现两次。给定任意一对字符串s1，s2，小蓝鲸要找出s2在s1中出现多少次，s1和s2均为小写字母a-z组成的字符串。

--> 输入格式

输入的第一行给出字符串s1 输入第二行给出字符串s2

--> 输出格式

输出s2在s1中出现多少次

--> 样例数据

**input 1**

```
axbyczd
abc
```

**output 1**

```
0
```

**input 2**

```
abcabcabcabc
abc
```

**output 2**

```
4
```

--> 数据范围及提示

$ 1 \leq length(s1),length(s2) \leq 10^6 $

时间限制： `1s`

空间限制： `128MB`

### Solution

KMP 裸题，按照 OI-Wiki 的做法实现，所以不是 next 数组

```c
#include <bits/stdc++.h>
using namespace std;

// Subfunc: 计算前缀函数
void calc_pi(vi& pi, const string& s, int& n) {
    int j = 0;
    for (int i = 1; i < n; i++) {
        while (j > 0 && s[i] != s[j])
            j = pi[j - 1];
        if (s[i] == s[j]) j++;
        pi[i] = j;
    }
}

void solve() {
    string s1, s2;
    cin >> s1 >> s2;
    int len1 = s1.size(), len2 = s2.size(), ans = 0;
    vi pi(len2, 0);
    calc_pi(pi, s2, len2);
    for (int i = 0, j = 0; i < len1; i++) {
        while (j > 0 && s1[i] != s2[j]) j = pi[j - 1];
        if (s1[i] == s2[j]) j++;
        if (j == len2) {
            ans++;
            j = pi[j - 1];
        }
    }
	cout << ans;
}

signed main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    int t;
    // cin >> t;		// multi testcases
    t = 1;  // single testcase

    while (t--) {
        solve();
    }

    return 0;
}
```

---

## B. 小蓝鲸破译密码

--> 题目背景

小蓝鲸在海底探险时发现了一个神秘的密码箱，上面刻着一种特殊的编码规则。这种编码规则能够将信息压缩存储，小蓝鲸需要你的帮助来破解这些密码！

密码箱上的编码规则为：$k[encoded-string]$，表示方括号内部的 $encoded-string$ 需要重复 $k$ 次。其中 $k$ 保证为正整数。

小蓝鲸发现输入字符串总是有效的，没有额外的空格，且方括号总是符合格式要求。原始数据不包含数字，所有的数字只表示重复的次数 k。

请你帮助小蓝鲸编写一个程序，将这些编码后的字符串解码还原。

--> 输入

输入一个经过编码的字符串 $s$，且$s$由小写英文字母、数字和方括号 '[]' 组成。

--> 输出

输出解码后的字符串。

--> 样例输入 #1

```
3[a]2[bc]
```

--> 样例输出 #1

```
aaabcbc
```

--> 样例解释 #1

a 重复 3 次，bc 重复 2 次。

--> 样例输入 #2

```
3[a2[c]]
```

--> 样例输出 #2

```
accaccacc
```

--> 样例解释 #2

先解码内部的 2[c] 得到 cc，然后外部的 3[acc] 得到 accaccacc。

--> 样例输入 #3

```
2[abc]3[cd]ef
```

--> 样例输出 #3

```
abcabccdcdcdef
```

--> 数据范围及提示

- 对于100%的数据，$1 \le s.length \le 30$, $1 \le$ s中的整数 $\le 300$

时间限制： `1s`

空间限制： `128MB`

### Solution

准备一个字符栈（存储待处理字符）和一个数字栈（存储重复次数）进行解压操作

```c
#include <bits/stdc++.h>
#define MAX_SIZE 100000
using namespace std;

void solve(){
	char Stack[MAX_SIZE];
	int numStack[MAX_SIZE];
	int ptr = -1;
	int numptr = -1;
	string s; cin >> s;
	int n = s.size();
	for(int i = 0; i < n;){
		// '[' 或者字母，压入字符栈
		if(s[i] == '[' || (s[i] >= 'a' && s[i] <= 'z')){
			Stack[++ptr] = s[i];
			i++;
		}
		// 数字压入数字栈
		else if(s[i] >= '0' && s[i] <= '9'){
			string num = "";
			while(s[i] >= '0' && s[i] <= '9'){
				num += s[i];
				i++;
			}
			int Num = stoi(num);
			numStack[++numptr] = Num;
		}
		// ']' 进行解压操作
		else if(s[i] == ']'){
			int head = ptr;
			// 找到 '['
			while(Stack[ptr] != '['){
				ptr--;
			}
			// 括号内内容的起始点
			int tail = ptr + 1;
			// 弹出 '['
			ptr--;
			// 取出并弹出重复次数
			int topnum = numStack[numptr--];
			// 符号栈原地复制 topnum 次
			// 这里更好的方案是用额外的字符串临时存储
			
			// 第一次复制的本质是为了移位
			for(int i = 0; i < 1; i++){
				for(int j = tail; j <= head; j++){
					Stack[++ptr] = Stack[j];
				}
			}
			// 指针调整后进行接下来的复制
			tail--;head--;
			for(int i = 1; i < topnum; i++){
				for(int j = tail; j <= head; j++){
					Stack[++ptr] = Stack[j];
				}
			}
			i++;
		}
	}
	for(int i = 0; i <= ptr; i++){
		cout << Stack[i];
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

## C. 小蓝鲸找最大值

--> 题目背景

小蓝鲸拿到了一组数据，他想要知道每相邻 $k$ 个数据中的最大值。请你帮忙他设计一个算法实现这个功能。

提示：时间复杂度需要尽量小哦。你能想到 $O(n)$ 的解法吗？

--> 输入

第一行两个数字，分别是数据的个数 $n$，以及窗口大小 $k$

第二行n个数字，表示数据的值

--> 输出

一行数字，表示每个窗口中的最大值

--> 样例

**输入**

```
8 3
1 3 -1 -3 5 3 6 7
```

**输出**

```
3 3 5 5 6 7
```

--> 数据规模与约定

$ 1 \leq n \leq 1000000 $

$ 1 \leq k \leq n$

时间限制：$1 \text{s}$

空间限制：$128 \text{MB}$

### Solution

滑动窗口板子

```c
#include <bits/stdc++.h>
#define MAX_SIZE 1000000
using namespace std;

int arr[MAX_SIZE+1], que[MAX_SIZE+1];

void solve()
{
	int n, k;
	cin >> n >> k;
	for (int i = 0; i < n; i++) {
		cin >> arr[i];
	}
	int head = 0, tail = -1;
	for (int i = 0; i < n; i++)
	{
		// 维护单调性
		while (head <= tail && arr[que[tail]] <= arr[i])
			tail--;
		que[++tail] = i;
		// 输出最大值
		if (i >= k - 1)
		{
			while (que[head] <= i - k)
				head++;
			printf("%d ", arr[que[head]]);
		}
	}
}

signed main()
{
	ios::sync_with_stdio(false);
	cin.tie(0);
	cout.tie(0);

	int t;
	// cin >> t;			// multi testcases
	t = 1;				// single testcase

	while (t--)
	{
		solve();
	}
	return 0;
}
```