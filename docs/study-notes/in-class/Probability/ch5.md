# 第五章 极限理论

包含大数定律和中心极限定理两部分内容

## 大数定律

大数定律是研究随机现象统计规律性的理论，揭示了随机变量平均值的收敛规律

### 随机变量收敛

大数定理表明，当独立随机试验的次数 $n$ 很大时，样本均值（频率）会以某种确定的方式<u>趋近于</u>某个期望（概率）。我们需要为这里的“趋近于”下严格定义，因此需要先给出随机变量收敛的定义：

设 $Y_1, Y_2, \cdots, Y_n, \cdots$ 为随机变量序列，若存在常数 $a$，对任意给定的 $\varepsilon > 0$ 有

$$
\lim_{n \to \infty} P(|Y_n - a| \geq \varepsilon) = 0
$$

则称随机变量序列 $Y_1, Y_2, \cdots, Y_n, \cdots$ **依概率收敛**于 $a$，记为 $Y_n \stackrel{P}{\longrightarrow} a$

!!! abstract ""

    $|Y_n - a| \geq \varepsilon$ 表示观察频率 $Y_n$ 与理论概率 $a$ 的差值绝对值，$\varepsilon$ 是容差极限。整体来看这是一个事件：观察频率与理论概率的差距超过了任意小的容差极限 $\varepsilon$
    
    $\lim_{n \to \infty} P(|Y_n - a| \geq \varepsilon) = 0$ 表示 $n$ 非常大时，上述事件的发生概率趋于 0，也就是说 $n$ 足够大时，观察频率与理论概率的差距超过任意小的容差极限的概率趋于 0（不是为 0）
    
    等价表示为 $\lim_{n \to \infty} P(|Y_n - a| < \varepsilon) = 1$

!!! warning "一些误解"

    依概率收敛只意味着“不接近的概率趋于0”，但理论上仍可能发生；
    
    $|Y_n - a| \geq \varepsilon$ 不是单调递减的

有了随机变量收敛的定义，接下来给出三种常见的大数定律

<br>

### 切比雪夫大数定律

设 $X_1, X_2, \cdots $ 为两两互不相关（协方差为 0 即可）的随机变量序列，其方差一致有界，即存在常数 $C$ 使得 $DX_k < C$ 对一切 $k=1,2,\cdots$ 成立，则 $\lbrace X_n \rbrace$ 服从大数定律，即对任意给定的 $\varepsilon > 0$ 有：

$$
\lim_{n \to \infty} P\left( \left| \frac{1}{n} \sum_{k=1}^n X_k - \frac{1}{n} \sum_{k=1}^n EX_k \right| \geq \varepsilon \right) = 0
$$

按照依概率收敛的表示方法，等价于：

$$
\frac{1}{n} \sum_{k=1}^n X_k - \frac{1}{n} \sum_{k=1}^n EX_k \stackrel{P}{\longrightarrow} 0
$$

!!! abstract ""

    切比雪夫大数定律描述的是任意随机变量序列的均值的稳定性：样本均值与期望均值的差收敛于 0

<br>

### 独立同分布大数定律

设 $X_1, X_2, \cdots $ 为相互独立且分布相同的随机变量序列，数学期望存在，$EX_N = \mu$，则 $\lbrace X_n \rbrace$ 服从大数定律，即对任意给定的 $\varepsilon > 0$ 有：

$$
\lim_{n \to \infty} P\left( \left| \frac{1}{n} \sum_{k=1}^n X_k- \mu \right| \geq \varepsilon \right) = 0
$$

按照依概率收敛的表示方法，等价于：

$$
\frac{1}{n} \sum_{k=1}^n X_k \stackrel{P}{\longrightarrow} \mu
$$

!!! abstract ""

    独立同分布大数定律描述的是独立同分布随机变量序列的均值的稳定性：样本均值依概率收敛于共同期望

<br>

### 伯努利大数定律

设 $n_A$ 是 $n$ 重伯努利试验中 $A$ 发生的次数，$A$ 发生的概率为 $p$，则对任意给定的 $\varepsilon > 0$ 有：

$$
\lim _ {n \to \infty} P\left( \left| \frac{n_A}{n} - p\right|  \geq \varepsilon \right) = 0
$$

按照依概率收敛的表示方法，等价于：

$$
\frac{n_A}{n} \stackrel{P}{\longrightarrow} p
$$

!!! abstract ""

    伯努利大数定律描述的是 $n$ 重伯努利试验频率的稳定性：频率依概率收敛于成功的概率

<br>

!!! tips "三种大数定律的联系与区分"

    独立同分布大数定律和切比雪夫大数定律是互不包含的：
    
    - 独立同分布大数定律要求随机变量序列同分布，但是只要求期望存在，不要求方差一致有界
    - 切比雪夫大数定律不要求随机变量序列同分布，但是要求方差一致有界
    
    伯努利大数定律是独立同分布大数定律的特例（取 $X_k \sim B(p)$）

<br>

## 中心极限定理 CLT

??? abstract "标准化随机变量的定义"

    已知随机变量 $X$ 的期望和方差，我们令
    
    $$
    X^{*} = \dfrac{X - EX}{\sqrt{D(X)}}
    $$
    
    计算得到 $EX^\ast = 0,\; DX^\ast = 1$，此时称 $X^*$ 为 $X$ 的标准化随机变量

中心极限定理 CLT 指出：当样本量足够大时，无论原始随机变量的分布形态如何，独立同分布的随机变量的均值（或总和）经过标准化后，其分布将趋近于标准正态分布。这意味着即使原始数据不是正态分布，样本均值的分布也会接近正态分布。

给出独立同分布中心极限定理：

设 $X_1, X_2, \cdots $ 为相互独立且分布相同的随机变量序列，数学期望和方差都存在，$EX_k = \mu,\;DX_k = \rho ^ 2 > 0$，则对任意 $x$ 有：

$$
\lim_{n\to \infty} P \left( \dfrac{\displaystyle \sum_{k=1}^{n} X_k - n \mu}{\sqrt{n}\sigma} \leq x \right) = \int_{-\infty}^{x} \dfrac{1}{\sqrt{2\pi}} e^{-\frac{t^2}{2}} \text{d} t = \varPhi (x)\\
$$

!!! abstract ""

    也即：
    
    $$
    \frac{\sum_{i=1}^n X_i - n\mu}{\sqrt{n} \, \sigma} \stackrel{P}{\longrightarrow} N(0,1), \quad n \to \infty \\
    \frac{\bar{X}_n - \mu}{\sigma / \sqrt{n}} \stackrel{P}{\longrightarrow} N(0,1), \quad n \to \infty
    $$

不难发现 $\dfrac{\displaystyle \sum_{k=1}^{n} X_k - n \mu}{\sqrt{n}\sigma}$ 为 $\displaystyle \sum_{k=1}^{n} X_k$ 的标准化随机变量（记为 $Y_n$），也就是说：

$$
\lim_{n\to \infty} F_n(x) = \lim_{n\to \infty} P(Y_n \leq x) = \varPhi(x)
$$

随机变量的和 $\displaystyle \sum_{k=1}^{n} X_k$ 在标准化为 $Y_n$ 后，极限分布满足标准正态分布：

$$
Y_n \sim N(0,1) \\
\sum_{k=1}^n X_k \sim N(n\mu, n\sigma ^2)
$$

对于 $n$ 重伯努利实验，我们有**拉普拉斯中心极限定理**的特例：

设 $\mu_n$ 是 $n$ 重伯努利试验中 $A$ 发生的次数，每次实验中 $A$ 发生的概率为 $p$，不发生的概率为 $q = 1- p$，则对任意 $x$ 有

$$
\lim_{n\to \infty} P \left( \dfrac{\mu_n - np}{\sqrt{npq}} \leq x \right) = \int_{-\infty}^{x} \dfrac{1}{\sqrt{2\pi}} e^{-\frac{t^2}{2}} \text{d} t = \varPhi (x)
$$

这也进一步说明了服从二项分布的随机变量，在 $n$ 充分大时近似服从正态分布

$$
n\to \infty,\; \mu_n \sim B(n,p) \sim N(np, npq)
$$

