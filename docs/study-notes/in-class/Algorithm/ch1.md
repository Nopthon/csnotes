# Ch1. Introduction

## Pseudo-Code

以“欧几里得算法”为例（计算两个非负整数的最大公约数）：

```pascal title="伪代码"
Algorithm: Euclidean(a, b)
Input: two non‑negative integers a, b (not both zero)
Output: GCD of a and b

while b > 0 do
	(a, b) ← (b, a mod b)
return a
```

作为对比，下面是 C++ 和 Python 版本：

```python title="Python"
def Euclidean(a, b):
    while b != 0:
        a, b = b, a % b
    return a
```

```c++ title="C++"
int Euclidean(int a, int b){
    int c;
    while (b > 0){
        c = b;
        b = a % b;
        a = c;
    }
    return a;
}
```

伪代码通常需要一个 Header（包含算法名称、输入、输出），以及简明的过程（非 C++ 编码风格，<u>更像 Python 编码风格</u>）

> 通常我们用 `←` 作为赋值运算符，`=` 或 `:=` 则用得较少

这里是另一个例子（插入排序，省略了算法头部）：

```pseudocode
for j ← 2 to n do
	key ← A[j]
	i ← j - 1
	while i > 0 and A[i] > key do
    	A[i+1] < A[i]
    	i ← i - 1
    A[i + 1] ← key
```

## Analyzing Running Time

我们将输入的规模定义为 `n`

- 如果输入是一个数组，整数的数量即为 `n`
- 如果是图中的“最短路径问题”，图中的边数即为 `n`
- ...

<u>不同的输入会导致运行时间的巨大差异</u>

- 对于插入排序，如果输入数组已经是升序排列，那么算法的运行速度会比降序排列时快得多

通常我们应该考虑<u>最坏情况分析</u>，它代表了算法的效率

### Asymptotic Analysis

渐近分析关注的是运行时间作为函数的增长趋势，而非任何特定的值（编程语言、计算机速度等）

???+ success "定义：渐近正函数"

    $f : \mathbb{N}\to \R$，如果：
    
    $$
    \exists n_{0} > 0, \forall n > n_{0}, f(n) > 0
    $$
    
    则称 $f$ 为渐近正函数，这意味着当 n 足够大时，该函数始终为正

**在渐近记号的定义中，我们只考虑渐近正函数**

---

非正式地，给定一个渐近正函数 $g(n)$，我们忽略<u>低阶项</u>和<u>首项常数</u>，以得到 **大 O 记号**的结果

> 当 $n$ 足够大时，低阶项和首项常数对运行时间的贡献都很小

???+ example "示例"

    $g(n) = 3n^{3} + 2n^{2} + n + 1 \in O(n^{3})$

我们使用如下约定：

- 用“$f(n) = O(g(n))$”来表示“$f(n) \in O(g(n))$”
- 用“$O(g(n)) = O(g'(n))$”来表示“$O(g(n)) \in O(g'(n))$”
- 不要使用“$O(g(n)) = f(n)$”，因为“=”是不对称的
    - $3n^{2} + 2n = O(3n^{2} + 2n) = O(n^{2})$
    - 不能颠倒顺序（“=”蕴含了顺序）

---

正式地，我们有三种重要的渐近记号

| 记号 | 名称 | **比较关系** | 形式化定义 |
| :------- | :--------------------------- | :----------------------- | :----------------------------------------------------------- |
| $O$ | 大 O<br />（上界） | $\le$ | $\exists c, n_0 > 0, \forall n \ge n_0 \newline 0 \le f(n) \le c \cdot g(n)$ |
| $\Omega$ | 大 Omega<br />（下界） | $\ge$ | $\exists c, n_0 > 0, \forall n \ge n_0: \newline 0 \le c \cdot g(n) \le f(n)$ |
| $\Theta$ | Theta<br />（紧界） | $=$ | $\exists c_1, c_2, n_0 > 0, \forall n \ge n_0: \newline c_1 g(n) \le f(n) \le c_2 g(n)$ |
| $o$ | 小 o | $<$ | $\exists n_0 > 0, \forall n \ge n_0 , c > 0:\newline 0 \le f(n) \le c \cdot g(n)$ |
| $\omega$ | 小 Omega | $>$ | $\exists, n_0 > 0, \forall n \ge n_0, c > 0: \newline 0 \le c \cdot g(n) \le f(n)$ |

> 小 o / 小 Omega 比其大版本更严格
>
> **小记号使用 $\forall c > 0$，而大记号使用 $\exists c > 0$**

如你所见，对于一个给定的函数，其所有渐近记号表示都**不是唯一的**，但**最佳实践**是选择**<u>最简单且最紧</u>**的表示，并且有：

$$
f(n) = \Theta(g(n)) \quad \text{iff} \quad f(n) = O(g(n)) \ \text{and} \ f(n) = \Omega(g(n))
$$

---

有时，我们使用两个或多个参数来指定输入规模

- 示例：对于一个图，`n` = 顶点数，`m` = 边数

所有可变参数都会影响计算规模，因此渐进复杂度表示中这些参数都需要出现

与单变量大 O 记号不同，多变量大 O 记号没有广泛接受的形式化定义

$$
\lbrace f(n,m) : ∃c,n_0,m_0 > 0, \text{ such that } 0 ≤f(n,m) ≤ cg(n,m),∀n ≥ n_0 {\color{red}{\text{ or }}} m ≥ m_0 \rbrace
$$

存在一些病态情况，使得使用“或”还是“且”会有所影响。然而在本课程的大多数情况下并无影响

### Common Running Time

将函数按渐近增长从小到大排序：

$$
\log n, n, \lbrace n \log n, \log(n!) \rbrace, n^2, 2^{n}, e^{n}, n!, n^{n}
$$

我们可以注意到 $n \log n$ 和 $\Theta(\log (n!))$ 之间的一个有趣关系：

???+ question "证明：$n \log n = \Theta(\log (n!))$"

    （如果不使用 Stirling 公式）
    
    **上界估计**
    
    $n! = n\cdot (n-1) \cdots 1 \leq n\cdot n \cdots n = n^{n}$
    
    所以 $n \log n = \log n^{n} \geq \log (n!)$
    
    **下界估计**
    
    缩放原式（使用 n/2 项）：
    
    $$
    \log (n!) = \sum_{k=1}^{n} \log k \geq \sum_{k=\lceil n/2 \rceil}^{n} \log k \geq (n - \lceil \dfrac{n}{2} + 1 \rceil ) (\log n - \log 2)
    $$
    
    即
    
    $$
    \log (n!) \geq \dfrac{n}{2} (\log n - \log 2)
    $$
    
    （考虑整数的右半部分。对于每一项，使用最小值 $log(n/2)$ 作为矩形的高。该矩形完全位于曲线下方）
    
    $\dfrac{n}{2} (\log n - \log 2) \geq \dfrac{1}{4} n \log n$ 对所有 $n \geq 4$ 成立（当 $n = 4$ 时取等号）
    
    所以对所有 $n \geq 4$，$\log (n!) \geq c \cdot n \log n$，其中 $c = \dfrac{1}{4}$
    
    因此，对所有 $n \ge 4$，我们有
    
    $$
    \frac{1}{4} \, n \log n \;\le\; \log (n!) \;\le\; n \log n,
    $$
    
    这证明了 $n \log n = \Theta(\log (n!))$
    
    证毕