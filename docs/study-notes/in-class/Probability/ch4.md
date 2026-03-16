# 第四章 随机变量的数字特征

## 数学期望与方差

数学期望与方差通常针对的是单个随机变量

### 离散型

我们记

$$
EX = \sum _ {i= 1} ^ {+\infty} x_i \cdot P(X = x_i)
$$

为 $X$ 的数学期望，存在的前提是 $\sum _ {i= 1} ^ {+\infty} |x_i| \cdot P(X = x_i)$ 级数收敛，否则期望不存在

接下来记

$$
DX = E(X - EX)^2 = EX^2 - (EX)^2
$$

为 $X$ 的方差，同时记 $\sqrt{DX} = \sigma(X)$ 为标准差，存在的前提是 $EX^2 < +\infty$ 

方差 $DX$ 就是 $g(X) = (X-EX)^2$ 的数学期望

<br>

### 常见离散型随机变量的数字特征

- 几何分布 $X \sim g(p)$ 

$$
EX = \sum_{k= 0}^{n} k  p (1-p)^{k-1} ={\color{orange}{\frac{1}{p} }}\\
DX = \sum_{k= 0}^{n} k^2 p (1-p)^{k-1} - (\frac1p)^2 = {\color{orange}{\frac{1-p}{p^2}}}
$$

- 二项分布 $X \sim B(n,p)$ 

$$
EX = \sum_{k= 0}^{n} k C_n^k p ^k(1-p)^{n-k} \left(=\sum_{k= 1}^{n} E(X_k) \right) = {\color{orange}{np}} \\
DX = \sum_{k= 0}^{n} k^2 C_n^k p ^k(1-p)^{n-k} - (np)^2 \left(=\sum_{k= 1}^{n} D(X_k) \right)= {\color{orange}{np(1-p)}}
$$

（括号里的内容为通过期望/方差的性质进行的简化运算）

- 泊松分布 $X \sim P(\lambda)$ 

$$
EX = \sum_{k=1}^{+\infty} k \dfrac{\lambda^k}{k!}e^{-\lambda}= \lambda  \sum_{k=0}^{+\infty} \dfrac{\lambda^k}{k!}e^{-\lambda} = {\color{orange}{\lambda}} \\
DX = EX^2 - (EX)^2 = (\lambda^2 + \lambda) - (\lambda)^2 = {\color{orange}{\lambda}}
$$

<br>

### 连续型

我们记

$$
EX = \int_{-\infty}^{+\infty} xp(x)dx
$$

为 $X$ 的数学期望，存在的前提是 $ \int_{-\infty}^{+\infty} |x|p(x)dx$ 级数收敛，否则期望不存在

接下来记

$$
DX = E(X - EX)^2 = EX^2 - (EX)^2
$$

为 $X$ 的方差，同时记 $\sqrt{DX} = \sigma(X)$ 为标准差，存在的前提是 $EX^2 < +\infty$ 

方差 $DX$ 就是 $g(X) = (X-EX)^2$ 的数学期望

<br>

### 常见连续型随机变量的数字特征

- 均匀分布 $X \sim U[a,b]$ 

$$
EX = {\color{orange}{\frac{a+b}{2}}} \\
DX = EX^2 - (EX)^2 = \frac{a^2+ab+b^2}{3} - \left(\frac{a+b}{2}\right)^2 = {\color{orange}{\frac{(b-a)^2}{12}}}
$$

- 指数分布 $X \sim E(\lambda)$ 

$$
EX = \int_{-\infty}^{+\infty} x\lambda e^{-\lambda x} dx = {\color{orange}{\frac{1}{\lambda} }}\\
DX = \int_{-\infty}^{+\infty} x^2\lambda e^{-\lambda x} dx - \left(\frac{1}{\lambda} \right)^2 = {\color{orange}{ \frac{1}{\lambda^2}}}
$$

- 正态分布 $X \sim N(\mu, \sigma^2)$ 

$$
EX = {\color{orange}{\mu}} \\
DX = {\color{orange}{\rho^2}}
$$

（计算量偏大，并且需要借助高斯积分归一化）

<br>

## 期望的性质

对于离散型随机变量

- $\displaystyle E(g(X))  = \sum _ {i= 1} ^ {+\infty} g(x_i) \cdot P(X = x_i)$ 

对于连续型随机变量

- $\displaystyle E(g(X)) = \int_{-\infty}^{+\infty} g(x)p(x)dx$ 

上述结论可以推广到 $Z = g(X,Y)$ 的数学期望，对应二重求和 / 积分

对于任意随机变量

- $E(a) = a$ 
- $E(aX+bY) = aEX+bEY$ 
- $X,Y$ 相互独立 $\longrightarrow E(XY)=EX\cdot EY$ 

## 方差的性质

对于任意随机变量

- $D(a) = 0$
- $D(aX+b) = a^2DX$ 
- $D(X ± Y) = DX + DY ± 2E[(X-EX)(Y-EY)]$，当 $X,Y$ 相互独立时化简为 $D(X ± Y) = DX + DY$ 

（$D(X ± Y) = DX + DY ± 2 \text{cov}(X,Y)$）

上面的结论可扩展到 $n$ 维

## 切比雪夫不等式

设随机变量 $X$ 的期望 $EX$ 和方差 $DX$ 均存在，则对任意 $ε > 0$：

$$
{\color{orange}P(|X - EX| \geq ε) \leq \dfrac{DX}{ε^2}}
$$

???+ abstract "Proof"

    $$
    P\left(\left|X-EX\right|\geqslant\varepsilon\right)=\int\limits_{\lbrace x:\left|x-EX\right|\geqslant\varepsilon\rbrace}p(x)dx\leqslant\int\limits_{\lbrace x:\left|x-EX\right|\geqslant\varepsilon\rbrace}\frac{(x-EX)^2}{\varepsilon^2}p(x)dx\\ \leqslant\frac{1}{\varepsilon^2}\int_{-\infty}^{+\infty}(x-EX)^2p(x)dx=\frac{DX}{\varepsilon^2}
    $$

可以借助证明：$DX = 0 \longrightarrow X = c$ 



## 协方差

如果 $EX, EY, E(XY)$ 存在，则

$$
\text{cov}(X,Y) = E[(X-EX)(Y-EY)] = E(XY) - EX\cdot EY
$$

为 $X,Y$ 的协方差

有以下性质和结论：

- $\text{cov} (X,X) = D(X)$ 
- $\text{cov} (X,Y) = \text{cov}(Y,X)$ 
- $\text{cov} (aX+c,bY+d) = ab\text{cov}(X,Y)$ 
- $\text{cov} (X_1 + X_2,Y) = \text{cov}(X_1,Y) + \text{cov}(X_2,Y)$ 
- $X,Y$ 相互独立 $\longrightarrow \text{cov}(X,Y) = E(XY) - EX\cdot EY = 0$ 

- 二维正态分布 $(X,Y)\sim N(\mu_1, \mu_2, \sigma_1^2, \sigma_2^2, \rho)$ 的协方差为 $\sigma_1\sigma_2\rho$ 

<br>

### 柯西 · 施瓦兹不等式的概率论形式

若  $X,Y$ 方差存在，则

$$
[\text{cov}(X,Y)]^2 \leqslant DX\cdot DY
$$

取等条件是存在 $a,b$ 不全为零，$P(Y= aX+b) = 1$ 

一个更基础的形式是：若  $X^2,Y^2$ 期望存在，则

$$
[E(XY)]^2 \leqslant E(X^2)\cdot E(Y^2)
$$

取等条件是存在 $t_0$ 不为零，$P(Y= t_0X) = 1$ 

!!! abstract ""

    积分形式：若 $\displaystyle \int_a^b f^2 dx, \int_a^b g^2 dx$ 存在，则
    
    $$
    \left( \int_a^b f(x)g(x) \, dx \right)^2 \leq \left( \int_a^b [f(x)]^2 \, dx \right) \left( \int_a^b [g(x)]^2 \, dx \right)
    $$
    
    取等条件是存在 $a,b$ 不全为零，$af(x) = bg(x)$ 几乎处处成立

## 相关系数

!!! abstract ""

    回顾：正态分布的标准化：$X\sim N(μ,σ^2) \to \frac{x-μ}{σ} \sim N(0,1)$，标准正态分布的期望为 $0$，方差为 $1$

已知随机变量 $X$ 的期望和方差，我们令

$$
X^{*} = \dfrac{X - EX}{\sqrt{D(X)}}
$$

计算得到 $EX^\ast = 0,\; DX^\ast = 1$，此时称 $X^*$ 为 $X$ 的标准化随机变量

上式中记 $EX = \mu,\;DX = \sigma^2$ 

在此基础上定义 $X,Y$ 的相关系数：设 $DX, DY > 0$，则

$$
\rho_{X\,Y} = \dfrac{\text{cov}(X,Y)}{\sqrt{D(X)D(Y)}} = \text{cov}(X^{\ast}, Y^{\ast})
$$

记 $\rho_{X\,Y}$ 为 $X,Y$ 的相关系数，根据柯西 · 施瓦兹不等式 $[\text{cov}(X,Y)]^2 \leqslant DX\cdot DY$，得到 $|\rho_{X\,Y}| \leqslant 1$，取等条件是存在 $a,b$ 不全为零，$P(Y= aX+b) = 1$ 

上面的性质表明，相关系数 $ρ_{X\,Y}$ 刻画了 $X$ 和 $Y$ 间的线性相关特征。$|ρ_{X\,Y}|$ 越大，表明 $X$ 和 $Y$ 之间线性关系越密切，当 $|ρ_{X\,Y}| = 1$ 时表明 $X$ 和 $Y$ 以概率 $1$ 线性相关。反之，若 $|ρ_{X\,Y}|$ 越小，表明 $X$ 和 $Y$ 的线性关系越弱。

!!! abstract ""

    $\rho_{X\,Y}$ 描述了两个随机事件的线性相关特征；独立性描述了两个随机事件的相关性

特别地，若 $ρ_{X\,Y} = 0$，我们称 $X,Y$ 线性无关（不相关），容易得到以下等式

$$
ρ_{X\,Y} = 0 \Leftrightarrow \text{cov}(X,Y) = 0 \Leftrightarrow E(XY)=EX\cdot EY \Leftrightarrow D(X±Y) = DX ± D(Y)
$$

独立性和不相关并非等价，但是正态分布的独立性和不相关性等价，比如 $(X,Y)\sim N(\mu_1,\mu_2,\sigma_1^2, \sigma_2^2,\rho)$ 中 $\rho_{X\,Y} = \rho$，而 $X,Y$ 相互独立的充要条件即 $\rho = 0$ 

## 矩和协方差阵

矩可以看作期望的推广：对于随机变量 $X$，$X^k$ 的数学期望 $EX^k$ 为 $X$ 的 $k$ 阶（原点）矩；标准化后 $E(X-EX)^k$ 为 $X$ 的 $k$ 阶**中心**矩

（矩的存在性类比 $EX$ 的存在性）

将随机变量标准化后的三阶矩 $E\left(\dfrac{X-EX}{\sqrt{D(X)}}\right)^3 = \dfrac{E(X-\mu)^3}{\sigma^3}$ 记为偏度；$\dfrac{E(X-EX)^4}{\sigma^4}$ 记为峰度

<br>

对于 $n$ 维随机向量 $X = (X_1,\cdots,X_n)^T$，称

$$
EX = (EX_1,\cdots,EX_n)^T
$$

为 $X$ 的数学期望；记 $c_{ij} = \text{cov}(X_i, X_j)$ ，称矩阵

$$
\Sigma =
\begin{pmatrix}
c_{11} & c_{12} & \cdots & c_{1n} \\
c_{21} & c_{22} & \cdots & c_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
c_{n1} & c_{n2} & \cdots & c_{nn}
\end{pmatrix}
$$

为 $X$ 的协方差阵，它是一个对称矩阵，比如二维正态分布的协方差阵为 $\begin{bmatrix}\sigma_1^2 & \sigma_1 \sigma_2 \rho \\ \sigma_1 \sigma_2 \rho & \sigma_2^2\end{bmatrix}$ 