# 栈 && 单调栈

栈是满足**后进先出**的线性数据结构，即 LIFO 表

### 简易的数组栈

```c++ hl_lines="1 16"
// 显式使用栈顶指针的写法
// 初始化
int st[MAX_LEN];
int top = -1;		// top = -1 表示为空栈
// 压栈
st[++top] = val;	// cin >> st[++top];
// 弹栈
if(top >= 0) --top;
// 检测是否空栈
bool empty = (top < 0);
// 取栈顶元素
int top_val = st[top];
// 清空栈
top = -1;

// 隐式使用栈顶指针的写法
// 初始化，这里使用 st[0] (即 *st) 代表栈中元素数量，同时也是栈顶下标
// 也就是说 st[0] = top，栈为 1-index，*st = 0 表示为空栈
int st[MAX_LEN];
// 压栈
st[++*st] = var1;
// 弹栈 
if (*st) --*st;
// 检测是否空栈
bool empty = (*st <= 0);
// 取栈顶元素
int top_val = st[*st];
// 清空栈
*st = 0;
```



### 简易的封装栈

省去了栈溢出的检测，没有使用动态大小栈

```c++
#define MAX_SIZE 10000

class Stack {
private:
    int data[MAX_SIZE];
    int top;

public:
    // 构造函数 && 析构函数
    Stack() { top = -1; }
    ~Stack(){};
    
    // 压栈
    void push(int value) {
        data[++top] = value;
    }

    // 弹栈
    void pop() {
        if (!empty())
            --top;
    }

    // 检测是否空栈
    bool empty() {
        return top == -1;
    }

    // 取栈顶元素（引用）
    int& top() {
    	if (!empty())
    		return data[top];
	}
    
    // 清空栈
    void clear() {
        top = -1;
    }
    
    // 获取栈大小
    int size() {
        return top+1;
    }
};
```



### STL `#!c++ <stack>` 库

支持的函数/操作有：

```c++
// 具体含义参照封装实现
st.push(val);
st.pop();
st.empty();
st.top();
// 没有 clear 操作
st.size();

st1 = st2 // 拷贝操作
stack<int> st2 (st1); // 拷贝初始化
```

### 单调栈

单调栈的特性在于，在插入新的元素前，可能需要弹出部分元素以满足栈元素的单调性：

比如单调递增栈 `[1 2 3 4 5] <-top` 在插入元素 `3` 时，需要先弹出 `4` `5` 再插入 `3`，确保插入后栈满足单调性 `[1 2 3 3] <-top`

以下是实现：

```c++
vector<int> nums = {...};
stack<int> st;
for (int i = 0; i < n; i++) {
    while (!st.empty() && nums[i] > st.top()) {
        // int val = st.top()
        st.pop();
    }
    st.push(nums[i]);
}
```

在实际运用中，我们有时不会将数值存入单调栈，而是将下标存入单调栈（在单调性比较时会比较数值），因为下标记录了数组栈中每个值的位置，这一额外信息在某些题目中非常重要

这里举三个具体的例子，其中最后一个例子并不是典型的单调栈，但是具有单调栈的思想：

> Luogu P5788 【模板】单调栈
>
> 给出项数为 $n$ 的整数数列 $a_{1 \dots n}$。
>
> 定义函数 $f(i)$ 代表数列中第 $i$ 个元素之后第一个大于 $a_i$ 的元素的**下标**，即 $f(i) = \min _{i < j \leq n, a_j > a_i} \{ j \}$。若不存在，则 $f(i)=0$。
>
> 试求出 $f(1\dots n)$。

这个例子是单调栈模板

```c++
void solve() {
    int n; cin >> n;
    vector<int> a(n + 1);  // 1-index
    vector<int> f(n + 1, 0);
    stack<int> st;  // 单调栈，题目已经非常明确为存储下标
    
    for (int i = 1; i <= n; i++) cin >> a[i];

    for (int i = 1; i <= n; i++) {
        // 当 当前元素 大于 栈顶元素 时，说明找到了栈顶元素的下一个更大元素
        while (!st.empty() && a[i] > a[st.top()]) {
            f[st.top()] = i;  // 记录结果
            st.pop();
        }
        st.push(i);  // 将当前下标入栈
    }
    
    // 栈中剩余的元素都没有右边更大的元素，f[i] 保持为 0
    for (int i = 1; i <= n; i++) cout << f[i] << " ";
}
```

> LeetCode 84. 柱状图中最大的矩形
>
> 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。
>
> 求在该柱状图中，能够勾勒出来的矩形的最大面积。

这个例子中，我们需要为单调栈构造结尾的结束标识符 / 对遗留在栈中的元素进行清理

```c++
class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        // 一个矩形的确定方式是：选定一个柱子作为固定高度，尝试向两边延伸宽度，宽乘高得到面积
        // 考虑维护一个由高度值决定的单调递增栈，栈本身存储下标值：
        // 对于栈中的每一个下标值，其左侧的值就是 “左边界下标 l”
        // 当一个下标被弹出时，使它被弹出的下标就是 “右边界下标 r”
        // 对每一个高为 h 的柱子，其向两边延伸的最大宽度为 (r-l-1)
        // （为了确保每根柱子都被弹出，最后面要加一个高度为 0 的柱子，
        // 或者在一轮扫描结束后加上额外的清空栈操作）
        int ans = 0;
        heights.push_back(0);
        stack<int> st; st.push(0);
        for(int i = 1; i < heights.size(); i++){
            while (!st.empty() && heights[i] < heights[st.top()]){
                int h = heights[st.top()];
                st.pop();
                // 注意空栈的特殊处理
                int width = i - (st.empty() ? -1 : st.top()) - 1;
                ans = max(ans, h * width);
            }
            st.push(i);
        }

        // 如果不加上高度为 0 的柱子
        // while (!st.empty()) {
        //     int h = heights[st.top()];
        //     st.pop();
        //     int width = heights.size() - (st.empty() ? 0 : st.top() + 1);
        //     ans = max(ans, h * width);
        // }
        
        return ans;
    }
};
```

> Luogu P1175 表达式的转换
>
> 给定一个仅包含 `0123456789+-*/^()` 的中缀表达式，将其转换为后缀表达式后输出，并且进一步输出计算后缀表达式的过程，要求输出的每一个数据间都留一个空格。
>
> 规定 `/` 为整除，乘方计算 `^` 为右结合运算且幂次不为负，表达式中的数字都是一位数，不出现 `2*-3` 的形式
>
> 比如：`8-(3+2*6)/5+4` 这个输入的正确输出为：
>
> ```c++
> 8 3 2 6 * + 5 / - 4 + 
> 8 3 12 + 5 / - 4 + 
> 8 15 5 / - 4 + 
> 8 3 - 4 + 
> 5 4 + 
> 9
> ```
