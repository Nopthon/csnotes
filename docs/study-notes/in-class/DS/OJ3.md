## A. 括号消消乐

> 题目描述

小蓝鲸们正在玩一个名为"括号消消乐"的游戏，游戏规则如下：

给定一个括号集合 `S`，S只包含 `(` 和 `)`，根据以下规则计算 `S` 的得分：

1：`()`得1分。

2：对于括号集合 `A` 和 `B`，`AB` 的得分为 `A` 的得分加上 `B` 的得分。

3：对于括号集合 `A`，`(A)`得分为两倍的 `A` 的得分。

来编写程序，给小蓝鲸们计分吧。

> 输入格式

输入包含两行，第一行是括号集合的长度 $\text{len}\;(0 \leq \text{len} \leq 30)$，第二行是对应的括号集合。

> 输出格式

输出括号集合的得分

> 样例 1

输入：

```
2
()
```

输出：

```
1
```

> 样例 2

输入：

```
4
()()
```

输出：

```
2
```

> 样例 3

输入：

```
4
(())
```

输出：

```
2
```

> 样例 4

输入：

```
8
(()(()))
```

输出：

```
6
```

??? question "样例解释 #4"

    score = (1+2)*2 = 6

> 数据规模与约定

$\text{len}$ 为括号集合的长度，$0 \leq \text{len} \leq 30$

时间限制：$1 \text{s}$

空间限制：$128 \text{MB}$

### Solution

栈应用题，准备一个数字栈，左括号记为 `-1`，在遇到右括号时，向左寻找最近的左括号弹出，期间处理 S 的得分

<del>注意下面的解法中的栈并不是严格定义的栈（</del>

```c++ title="Solution"
#include <bits/stdc++.h>
#define MAX_SIZE 30
using namespace std;

int Stack [MAX_SIZE+1];
char input [MAX_SIZE+1];

signed main(){
	ios::sync_with_stdio(false);
	cin.tie(0); cout.tie(0);
	
	int len; cin >> len;
	for(int i = 0; i < len; i++){
		cin >> input[i];
	}
	
	int top = -1;
	for(int i = 0; i < len; i++){
		// 左括号入栈
		if(input[i] == '('){
			Stack[++top] = -1;
		}
		// 右括号处理
		else {
			// 如果栈不为空
			if(Stack[top] != -1){
			// 规则二：左括号右侧的数字乘 2
				int tmp = 2 * Stack[top];
				Stack[top] = 0;
				Stack[--top] = tmp;
			}
			// 栈空，对应规则一：'()' 得 1 分
			else {
				Stack[top] = 1;
			}
		}
		// 规则三：相邻的数字累加
		if(top > 0 && Stack[top] != -1 && Stack[top-1] != -1){
			Stack[top-1] += Stack[top];
			top--;
		}
	}
	// 最终栈顶元素为答案
	cout << Stack[top] << endl;

	return 0;
}
```

---

## B. 小蓝鲸要吃饭

> 题目背景

学校的自助午餐提供米饭和面条，分别用数字 $0$ 和 $1$ 表示。所有学生站在一个队列里（初始队列学生的编号从头到尾依次编号 $(0\sim n-1$），每个学生要么喜欢米饭要么喜欢面条。 餐厅里自助午餐的数量与学生的数量相同。所有午餐都放在一个栈里，每一轮：

如果队列最前面的学生喜欢栈顶的午餐，那么会拿走它并离开队列。否则，这名学生会放弃这个午餐并回到队列的尾部重新排队。这个过程会一直持续到队列里所有学生都不喜欢栈顶的午餐为止。

> 题目描述

给你两个整数数组 `students` 和 `lunch`，其中 `lunch[i]` 是栈里面第 `i` 个午餐的类型（`i = 0` 是栈的顶部），`students[j]` 是初始队列里第 `j` 名学生对午餐的喜好（`j = 0` 是队列的最开始位置）。请你返回每个学生的排队次数（初始队列的排队次数为 `1`，回到队列尾部则次数 `+1`），若无法吃上午餐则次数为 `-1`。

> 输入

第一行一个数字 `n` 表示学生人数和午餐数量，

第二行一个数字序列表示学生的喜好，数字之间用空格隔开，

第三行一个数字序列表示午餐的栈，数字之间用空格隔开。

> 输出

每个学生的排队次数，若无法吃上午餐则次数为 `-1`。

> 示例

输入：

```
4 
1 1 0 0
0 1 0 1
```

输出：

```
2 3 1 2
```

> 数据规模

- `1 <= n <= 100`
- `students.length == lunch.length == n`
- `students[i]` 要么是 `0`，要么是 `1`
- `lunch[i]` 要么是 `0`，要么是 `1`

### Solution

直接用队列进行模拟，当某一轮模拟时队列中没有一个人吃上午餐，此时遍历结束

或者直接遍历 `n` 次后输出结果，因为每次遍历的结果一定为：要么有人吃上了午餐；要么剩下的所有人都吃不上午餐，因此最多 `n` 轮遍历一定能得出结果

另外我们发现，最终吃不上午餐的人数取决于 `students[]` 和 `lunch[]` 元素 `0` 个数的差值的绝对值（`1` 也可以），所以也可以在读入时记录这个差值 `diff`，如果某一轮遍历时发现了只剩下 `diff` 个人没有午餐吃（说明剩下的人都没有午餐吃），那么可以直接结束遍历

```c++ title="Solution"
#include <bits/stdc++.h>
using namespace std;

int stu[105];
int lunch[105];
int ans[105];
bool vis[105];

int main() {
	ios::sync_with_stdio(false);
	cin.tie(0); cout.tie(0);
	
	int n; cin >> n;
	
	int count1 = 0;
	for (int i = 0; i < n; i++) {
		cin >> stu[i];
		if (stu[i] == 1) count1++;
	}
	for (int i = 0; i < n; i++) {
		cin >> lunch[i];
		if (lunch[i] == 1) count1--;
	}
	
	for(int i = 0; i < n; i++) {
		ans[i] = 0; vis[i] = false;
	}
	
	int diff = abs(count1);
	int top = 0;
	
	for (int round = 0; round <= n; round++) {
		int nolunch = 0;
		for (int i = 0; i < n; i++) {
			if (!vis[i]) {
				ans[i]++;
				if (lunch[top] == stu[i]) {
					top++;
					vis[i] = true;
				} else {
					nolunch++;
				}
			}
		}
		if (nolunch <= diff) break;
	}
	
	int tmp = -1;
	for (int i = 0; i < n; i++) {
		cout << (vis[i] ? ans[i] : tmp) << " ";
	}
	return 0;
}
```

---

## C. 中缀表达式求值

> 题目描述

中缀表达式是人们常用的算术逻辑公式表达方法，算符以中缀形式处于操作数的中间。

小蓝鲸想设计一个中缀表达式的求值器。除了常见的**加法**( `+` )、**减法**( `-` )、**乘法**( `*` )、**整数除法**( `/` )与**左右括号**( `(` , `)` )外，小蓝鲸还想支持**单目取相反数**运算符( `~` )和**乘幂**( `^` )运算符。

**取相反数运算符** `~` 如果作用在操作数 $E$ 上，得到的结果 $R$ 满足：$R = (-E)$

**乘幂**运算符 `^` 如果作用在左右操作数 $E_1,E_2$ 上，得到的结果 $R$ 满足：$R = E_1^{E_2}$

求值器的算符优先级为：*括号表达式* > `~` > `^` > `*` = `/` > `+` = `-`

你可以帮助小蓝鲸设计出这个求值器吗？

> 数据范围

表达式长度 $L$ 满足：$L < 10^4$

表达式中出现的数字 $Num$ 满足：$ 0 \le Num \le 9 $ （表达式中出现的数字至多只有一位）

运算结果（包括中间结果）$Result$ 满足：$-2^{63} < Result < 2^{63}-1$

> 输入格式

一行，包含一个符合题目描述的中缀表达式。

> 输出格式

一行，包含一个整数，包含输入中缀表达式的求值结果。

> 输入/输出样例

**输入**

```
8-~~6+(1-~9^4)
```

**输出**

```
-6558
```

??? question "样例解释"

    对于该测试用例，可以转化为数学表达式：$8-(-(-6))+(1-(-9)^4)$，求值得$-6558$。

> 补充说明

除数（包括中间结果）保证不为0。

乘幂运算符的右操作数（指数）不会出现负数。

双目运算符遇到同优先级算符时，遵循**左结合原则**，即从左到右运算。 例如：`9/3/3 = (9/3)/3 = 1`，而非 `9/3/3 = 9/(3/3) = 9`。

整数除法`/`算符遵循**整除结果向0舍入原则**，而非向负无穷舍入原则。例如：`-11/4`的真实值是`-2.75`。若向0舍入，则整除结果为`-2`；若向负无穷舍入，则整除结果为`-3`。 C/C++语言遵循**向0舍入原则**。

### Solution

中缀表达式求值一般的方案是：转后缀然后进行后缀表达式计算

这里在转换过程中直接进行了求值，转换原理参考课件

（话说在写 ICSPA 2-3 的时候还会学到一种递归求值的方法，那个我觉得很好用）

```c++ title="Solution"
#include <bits/stdc++.h>
#define MAX_SIZE 10000
using namespace std;

int numstack[MAX_SIZE];
char calstack[MAX_SIZE];
int numtop, top;	// 栈顶指针

// 运算符优先级比较
bool pk(char a, char b){
	int a_score, b_score;
	if(a == '+' || a == '-') a_score = 1;
	else if(a == '*' || a == '/') a_score = 2;
	else if(a == '^') a_score = 3;
	else if(a == '~') a_score = 4;
	
	if(b == '+' || b == '-') b_score = 1;
	else if(b == '*' || b == '/') b_score = 2;
	else if(b == '^') b_score = 3;
	else if(b == '~') b_score = 4;
	
	// 这里有对涉及右结合运算符的比较的特判
	// 非常关键
	if(a == '^' || a == '~')
		return a_score > b_score;
	else
		return a_score >= b_score;
}

// 整数幂运算
// 已知乘幂运算符的右操作数（指数）不会出现负数
int intpow(int a, int b) {
	int res = 1;
	while (b > 0) {
		if (b & 1) res *= a;
		a *= a;
		b >>= 1;
	}
	return res;
}

// 单次计算操作
void once_cal(){
	char op = calstack[top--];
	// 单目（右结合）运算符
	if(op == '~'){
		int b = numstack[numtop--];
		b = -b;
		numstack[++numtop] = b;
	}
	// 双目运算符
	else {
		int b = numstack[numtop--];
		int a = numstack[numtop--];
		if(op == '+') numstack[++numtop] = a+b;
		else if(op == '-') numstack[++numtop] = a-b;
		else if(op == '*') numstack[++numtop] = a*b;
		else if(op == '/') numstack[++numtop] = a/b;
		else if(op == '^') numstack[++numtop] = intpow(a,b);
	}
}


signed main(){
	ios::sync_with_stdio(false);
	cin.tie(0); cout.tie(0);
	
	numtop = -1, top = -1;
	string expr; cin >> expr;
	// 确保运算完全，可以简化一些边界处理
	expr = '(' + expr + ')';
	
	for(char &c : expr){
		// 数字压入数字栈
		if(c >= '0' && c <= '9'){
			numstack[++numtop] = (int)(c-'0');
		}
		else{
			// 符号压入运算符栈
			if(top < 0 || c == '('){
				calstack[++top] = c;
			}
			else {
				// 如果是右括号，计算括号内所有运算
				if(c == ')'){
					while (top >= 0 && calstack[top] != '(')
					once_cal();
					// 弹出左括号
					top--;
				}
				// 否则只计算优先级更高或相等的运算
                // 需要额外考虑右结合运算符
				else {
					while (top >= 0 && calstack[top] != '(' && pk(calstack[top],c))
					once_cal();
					// 压入当前的运算符
					calstack[++top] = c;
				}
			}
		}
	}
	while (top >= 0)
		once_cal();

	cout << numstack[numtop];
	
	return 0;
}
```