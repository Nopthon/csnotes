# 队列 && 单调队列

队列是满足**先进先出**的线性数据结构，即 FIFO 表

### 简易的数组队列

```c++
#define MAX_SIZE 10000

// 需要两个指针 l, r 记录队列的左右边界

// 初始化
int que[MAX_LEN];
int l = 1, r = 0 // l = 1, r = 0 表示空队列，而不是 l = r = 0
// push 操作
que[++r] = val;
// pop 操作
l++;
// 取队首元素
int front_val = que[l];
// 取队尾元素
int back_val = que[r];
// 判断队列是否为空
bool empty = (l > r);
// 清空队列
l = 1, r = 0;
```

我们发现这个栈的问题在于，`l` 与 `r` 一直在向右前进，没有合理利用 `l` 左侧被释放的数组空间，此时我们有两个方案：

- 使用循环队列：指针右移时取模 `% MAX_SIZE`，这样数组空间可以被循环使用，但是我们需要额外关注队列的前后指针是否会因为队列溢出而出现错乱，因此相比栈实现，队列实现需要记录队列长度

​	下面的封装栈实现采用的是循环队列写法

- 使用双栈模拟：栈 A 为队尾栈（栈顶为队尾元素），栈 B 为队首栈，push 时数据在 A 中入栈，pop 时数据在 B 中 出栈，进行 push ↔ pop 切换时，将  A/B 中的数据全部弹出再依次插入到 B/A 中（实现队尾操作与队首操作的切换）

​	单次切换操作是 $O(n)$，但是均摊到每个元素是 $O(1)$ 复杂度（因为每个元素从入队列到出队列最多只会被转移一次），常数较大

### 简易的封装队列

省去了部分操作队列满时的操作；使用了 `count` 变量方便判断队列长度

```c++
#define MAX_SIZE 10000

class Queue {
private:
    int data[MAX_SIZE];
    int Front;  // 队首指针
    int Back;   // 队尾指针
    int count;  // 队列元素个数

public:
    // 构造函数
    Queue() {
        Front = 0;
        Back = -1;
        count = 0;
    }
    // 析构函数
    ~Queue() {}

    // 入队操作
    void push(int value) {
        if (!full()){
            Back = (Back + 1) % MAX_SIZE;
        	data[Back] = value;
        	count++;
        }
    }

    // 出队操作
    void pop() {
        if (!empty()){
            Front = (Front + 1) % MAX_SIZE;
        	count--;
        }
    }

    // 获取队首元素
    int front() {
        if (empty())
        	return data[Front];
    }

    // 获取队尾元素
    int back() {
        if (empty())
        	return data[Back];
    }

    // 判断队列是否为空
    bool empty() {
        return count == 0;
    }

    // 判断队列是否已满
    bool full() {
        return count == MAX_SIZE;
    }

    // 获取队列大小
    int size() {
        return count;
    }

    // 清空队列
    void clear() {
        Front = 0;
        Back = -1;
        count = 0;
    }
};
```



### STL `<queue>` `<deque>` 库

对于普通队列 `queue`，有下面的操作：

```
q.front();
q.back();

q.push();
q.pop();
q.empty();
q.size();
```

对于双端队列 `deque`，其不仅可以队尾进队首出，还可以队首进队尾出，即两个方向都可以进出元素，有

```
q.front();
q.back();

q.push_front();
q.pop_front();
q.push_back();
q.pop_back();
q.empty();
q.size();

q.insert();
q.erase();
```

与 `queue` 不同的是，`deque` 支持 `[]` 访问元素，其实现很接近 `vector` 

两者都支持 `=` 等赋值/初始化操作

!!! tip "`deque` 的原理"

    `deque` 的元素不是一块连续空间，而是多段定长连续空间，因此 `deque` 进行随机元素访问时（`deque[i]`）需要两次指针解引用
    
    `deque` 有比 `vector` 更有优势的地方：相比于 `vector`，其头插入的时间复杂度为 $O(1)$，但是中间插入的复杂度也是 $O(n)$ 级别。`vector` 扩容操作复杂，而 `deque` 只需要申请新的内存加入即可
    
    也因此 `deque` 的迭代器实现非常复杂，除非存在大量的头插入/删除操作，否则建议使用 `vector`（比如对 `deque` 的排序操作，可以先内存拷贝到 `vector` 上，排序后再拷贝回 `deque`，这是一种基于连续内存的缓存优化策略）

### 单调队列

和单调栈一样，满足队列内数据的单调性，但是在维护单调性时弹出元素的位置不一样

一个比较典型的针对单调队列的模板如下（比如RMQ问题）:

```c
for (int i = 0; i < n; i++) {
    // 维护队列头部（移除过期元素）
    while (!dq.empty() && dq.front() < i - k + 1) {
        dq.pop_front();
    }
    
    // 维护队列尾部（维护单调性）
    while (!dq.empty() && check(dq.back(), i)) {
        dq.pop_back();
    }
    // 存下标
    dq.push_back(i);
    
    if (i >= k - 1) {
        // 记录区间最值
    }
}
```

单调队列的题目通常限制在 RMQ 问题（区间最值问题）及其变种；单调队列还可以用来优化动态规划

## Examples

> **Luogu P10059 Choose**
>
> 定义 $C(a,l,r)$ 为序列 $a$ 的连续子序列 $[a_l,a_{l+1}, \cdots a_r], \; 1 \leq l \leq r \leq a.size()$ 
>
> 选出 $a$ 的 $k$ 个不同的长为 $L$ 的连续子序列 $C(a,l,l+L-1)$ ：
>
> 1 - 记 $k$ 个子序列的极差最小值为 $X$，最大化 $X$ 
>
> 2 - 最大化 $X$ 的情况下，求 $L$ 的最小值

首先给出一个结论： $C(a,l,r)$ 的极差一定不小于其任何一个子序列的极差

所以只要 $L$ 足够长，就一定能最大化 $X$ （$X$ 和 $L$ 一定是正相关的，直到 $X_{max}$）

我们先一轮遍历得到 $L_{max}$ 下的 $X_{max}$

接下来二分 $L$ 找第二问答案，对于每一个 $L$，我们要找到连续子序列中的极差，即维护一个长度为 $L$ 的滑动窗口，每次移动求 (最大值 - 最小值)，这就回到了 RMQ 问题，使用单调队列，甚至可以直接解决本题的加强版

代码略，不难发现此处单调队列的使用依旧是基于 RMQ 问题



另外给一个和滑动窗口有关的例题

> **[蓝桥杯 2018 省 B] 日志统计** 
>
> 给定一系列 `ts id` 数据表示 $id$ 帖子在 $ts$ 时刻收到一个赞，找到所有的帖子 $id$，满足在某个连续的长度为 $D$ 的时间段内点赞量不小于 $K$

对于同一个 $id$ 的帖子，按照 $ts$ 大小排序构造滑动窗口，根据 $data[r].ts - data[l].ts$ 的大小伸缩窗口长度，如果存在窗口元素 $\geq k$ 的时刻，那么这个帖子被选中

对于多个 $id$ 的帖子，我们先按照 $id$ 对数据排序（对于同 $id$ 数据按照 $ts$ 大小排序），然后额外增加一个逻辑：当滑动窗口右边界 $r$ 与左边界 $l$ 的 $id$ 不同时，立刻停止右边界扩展，在判断一次点赞量后清空窗口（$l = r$）；为了减少计算，当计算出某个 $id$ 的点赞量满足时，直接将 $r$ 移动到下一个 $id$ 并清空窗口。这样就实现了用一个滑动窗口进行所有 $id$ 帖子的判断

!!! tip "**注意滑动窗口的构造左闭右开 $[l,r)$，这种构造方式可以简化边界情况的处理**"

```c++
typedef struct {
    int ts;
    int id;
} post;

bool cmp (post a, post b){
    return ( (a.id < b.id) || (a.id == b.id) && (a.ts < b.ts));
}

void solve() {
    int n, d, k; cin >>n>>d>>k;
    vector<post> a(n);
    for(int i = 0; i < n; i++) cin >> a[i].ts >> a[i].id
    sort(all(a), cmp);

    int l = 0, r = 0;
    while (r < n){
        if(a[l].id != a[r].id){
        	l = r;
        	continue;
        }
		while(r < n && a[l].id == a[r].id && a[r].ts - a[l].ts < d) r++;
		// 注意 r 遵循左闭右开
		if(r-l >= k) {
			cout << a[l].id << "\n";
			while(r < n && a[l].id == a[r].id) r++;
			l = r;
			continue;
		} l++;
    }
}
```

