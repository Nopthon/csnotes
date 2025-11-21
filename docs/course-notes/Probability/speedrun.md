# 知识点速通

!!! success "太基础的知识点以至于高中就掌握熟练的不抄书了"

## 第一章 随机事件与概率

### De Morgan 律推广

$$
\overline{A_1 \cup A_2 \cup \cdots \cup A_n} = \overline{A_1} \cap \overline{A_2} \cap \cdots \cap \overline{A_n} \\\\{}\\\\
\overline{A_1 \cap A_2 \cap \cdots \cap A_n} = \overline{A_1} \cup \overline{A_2} \cup \cdots \cup \overline{A_n}
$$

<br>

### 事件的概率及性质

随机事件 $A$ 的频率 $f_n(A) = \dfrac{n_A}{n}$ ，定义样本空间 $\Omega$ 

如果集合函数 $P(·)$ 满足非负性（$P(A) \geq 0$），规范性（$P(\Omega) = 1$）与可列可加性，可称 $P(A)$ 为 $A$ 的概率

!!! abstract ""

    可列可加性：对于概率空间中**两两互不相容**（即互斥）的**可数无穷个**随机事件，这些事件**至少有一个发生**的概率，等于每个事件发生的概率之和


集合论中有容斥原理
$$
\left| \bigcup_{i=1}^{n} A_i \right| = \sum_{k=1}^{n} (-1)^{k-1} \sum_{1 \leq i_1 < \cdots < i_k \leq n} \left| A_{i_1} \cap \cdots \cap A_{i_k} \right|
$$
相应的，概率论中有加法原理
$$
P\left(\bigcup_{i=1}^{n} A_i\right) = \sum_{k=1}^{n} (-1)^{k-1} \sum_{1 \leq i_1 < \cdots < i_k \leq n} P\left( A_{i_1} \cap \cdots \cap A_{i_k} \right)\\
$$

<br>

### 古典概型常见模型

- 抽签模型：$N$ 个签中有 $M$ 个中签，有 $n\,(<M)$ 个人不放回抽签，对**任意**一个人抽中好签的概率都是 $\frac{M}{N}$ 
  

!!! abstract ""

    不放回地随机抽签，**等价于对所有的签进行一次随机排序**，那么排序后第 $n$ 个位置为好签的概率即为 $\frac{M}{N}$ 

- 不放回抽样：$N$ 个产品中有 $M$ 个次品，不放回取出 $n$ 件，恰取出 $k$ 件次品概率

$$
P(k) = \frac{C_M^k C_{N-M}^{n-k}}{C_{N}^{n}}
$$

- 放回抽样：$N$ 个产品中有 $M$ 个次品，放回取出 $n$ 件，恰取出 $k$ 次次品概率
  
  取出一次抽到正品 $p_0 =\frac MN$，抽 $k$ 次正品 $(p_0)^k$，抽 $n-k$ 次次品 $(1-p_0)^{n-k}$，然后进行组合 $C_n^k$ 
  

!!! abstract ""

    即 $n$ 重伯努利试验（独立重复实验模型）
    
    $$
    P(k) = C_n^k\Big(\frac MN\Big)^k \Big(1-\frac MN\Big)^{n-k}
    $$

<br>

### 条件概率

条件概率

$$
P(A|B) = \frac{P(AB)}{P(B)}
$$

由此可知乘法公式

$$
P(AB) = P(A)P(B|A)
$$

累加完备事件组 $\{A_i\}$ 有全概率公式 （$A_1,\cdots,A_i$ 互斥完备，即组成完备事件组，也就是说每次实验中必定发生且仅发生某一个 $A_i$ 事件）

$$
P(B)= \sum^{n}_{k=1} P(A_k)P(B|A_k)
$$

结合之前得到的条件概率公式可以得到贝叶斯公式

$$
P(A_i|B)= \frac{P(A_i)P(B|A_i)}{\sum^{n}_{k=1} P(A_k)P(B|A_k)} \Big( = \frac{P(A_iB)}{P(B)} \Big)
$$

条件概率也满足非负性（$P(A) \geq 0$），规范性（$P(\Omega) = 1$）与可列可加性

<br>

### 独立性

- $A,\;B$ 两事件相互独立当且仅当 $P(AB)=P(A)P(B)$，或者说 $P(A|B) = P(A)$ 

- 对于事件组 $\{A_i\}$ ：如果任取其中若干个事件，都满足 $\displaystyle P\left(\bigcap_{i=1}^{n} A_i\right) = \prod_{i=1}^{n} P\left( A_i\right)$

也就是满足总共 $2^n - n - 1$ 个条件

$$
\begin{cases}P\left(A_{i}A_{j}\right)=P\left(A_{i}\right)P\left(A_{j}\right),&1\leqslant i<j\leqslant n\\\\P\left(A_{i}A_{j}A_{k}\right)=P\left(A_{i}\right)P\left(A_{j}\right)P\left(A_{k}\right),&1\leqslant i<j<k\leqslant n\\\\\cdots\cdots\\\\P\left(A_{i_{1}}A_{i_{2}}\cdots A_{i_{m}}\right)=P\left(A_{i_{1}}\right)P\left(A_{i_{2}}\right)\cdots P\left(A_{i_{m}}\right),&1\leqslant i_{1}<i_{2}<\cdots<i_{m}\leqslant n\\\\\cdots\cdots\\\\P\left(A_{1}A_{2}\cdots A_{n}\right)=P\left(A_{1}\right)P\left(A_{2}\right)\cdots P\left(A_{n}\right)\end{cases}
$$

则这 $n$ 个事件相互独立

- 如果 $\{A_i\}$ 之间相互独立，那么将 $n$ 个事件划分为 $k$ 组，每组内进行任意事件运算，得到的新的 $k$ 个事件也互相独立

<br>

### 伯努利实验与泊松分布

已知 $n$ 重伯努利试验（有且仅有两种结果；$n$ 次实验独立）有：$P(k) = C_n^k p^k (1-p)^{n-k}$（一般令 $q = 1 - p$）

当 $n \to \infty$ 时有 $\displaystyle \lim _{n\to \infty}C_n^k p^k (1-p)^{n-k} = \frac{\lambda^k}{k!}e^{-\lambda}$ ，其中 $\lambda = np$，记为泊松分布

??? abstract "Proof"

    考虑将原式拆分为
    
    $$
    \frac{\lambda^k}{k!}\cdot\frac{n!}{(n-k)!\left.n^k\right.}\cdot\left(1-\frac{\lambda}{n}\right)^{n-k}
    $$
    
    对后两部分进行极限分析即可
    
    另外，不难发现 $\frac{\lambda^k}{k!}$ 满足 $e^x$ 的麦克劳林展开

泊松分布的应用：$n$ 很大 $p$ 很小时，二项分布可近似看作泊松分布，简化运算：
$$
\displaystyle C_n^k p^k (1-p)^{n-k} ≈ \frac{\lambda^k}{k!}e^{-\lambda}
$$

<br>

## 第二章 随机变量及其概率分布

### 随机变量

随机变量本质上来说是一个单值函数 $X=X(e)$，将样本空间中的样本点映射到实数轴上。随机变量的核心工作是为所有 “可能的结果” 分配一个唯一的数值

!!! abstract "" 

    比如硬币正反面分别量化为值 0 1

随机变量的分布函数旨在精确化体现随机变量的统计学规律

!!! abstract "" 

    比如将 0 1 分别对应到概率 $p = 50\%$。在上述情境（抛硬币）下，分布函数是：
    
    $$
    F(x) = \begin{cases}
    0 & \text{if } x < 0 \\\\
    0.5 & \text{if } 0 \leq x < 1 \\\\
    1 & \text{if } x \geq 1
    \end{cases}
    $$

分布函数的定义域是 $\R$，值域 $[0,1]$ 且左右边界一定分别是 $0, 1$ 

并且 $F(x_0+0) = \displaystyle \lim _{x\to x_0+0} F(x) = F(x_0)$ ，满足**右连续**


???+ abstract "如何简单理解分布函数有右连续性？"
    
    从定义上来说，$F(x)=P(X\le x)$ ，注意 $\le$ 这里有个等号，使其天然满足右连续
       
    > 如果 $F(x)=P(X < x)$，那它就应该是左连续了
       
    具体可以考虑在定义下，分布函数的间断点处情况
       
    体现在抛硬币这里，$\displaystyle \lim_{x\to 1^+} F(x) = F(1)\quad \lim_{x\to 1^-} F(x)\ne F(1)$ 

<br>

### 离散型随机变量

对于离散型随机变量 $X$（有限个/可列无限个取值），称 $P(X = x_k)=p_k,\;k=1,2,\cdots$ 为 $X$ 的分布律

分布律也可以用表格方式给出，有时也会以矩阵的方式出现，还是以抛硬币为例：

$$
\begin{array}{c|cc}
X & 0 & 1 \\\\
\hline
P & 0.5 & 0.5 \\\\
\end{array}
\qquad
X \sim \begin{pmatrix}
0  & 1\\\\
0.5  & 0.5
\end{pmatrix}
$$

#### 常见的离散型随机变量

- 0-1 分布：$X \in \{0,1\}$ 

- 二项分布 $B(n, p)$ ：$p_k = C_n^kp^k(1-p)^{n-k},\;k = 0,1,\cdots,n$

!!! abstract ""

    二项分布是独立进行了 $n$ 次 0-1 分布实验的结果

- 泊松分布 $P(\lambda)$ ：$p_k = \dfrac{\lambda^k}{k!}e^{-\lambda},\;k = 0,1,\cdots,$

!!! abstract ""

    泊松分布可以看作进行了**大量的 0-1 分布实验**的**近似描述**结果，虽然泊松分布对应描述的是泊松过程

- 几何分布 $g(p)$ ：$p_k = (1-p)^{k-1}p,\;k=1,2,\cdots,$

对于二项分布 $B(n, p)$，计算得到：

(1) 当 $(n + 1)p$ 为整数时，$p_k$ 在 $k = (n + 1)p - 1$ 和 $k = (n + 1)p$ 达到最大。

(2) 当 $(n + 1)p$ 不是整数时，$p_k$ 在 $k = ⌊(n + 1)p⌋$ 达到最大。

<br>

### 连续型随机变量

对于连续型随机变量 $X$（不可列无穷），其分布函数满足：

$$
P(X < x)=F(x) = \int_{-\infty}^x p(t)dt
$$

其中 $p(x)$ 为概率密度函数，一定有 $\int_{-\infty}^{\infty} p(t)dt = 1$

!!! abstract ""

    可以从离散化的角度去看这个式子：$\displaystyle\sum^{\infty} p_k = \lim_{x\to +\infty} F(x) = 1$，累加概率 $p(x)$ 得到 $F(x)$
    
    连续性来看，就是 $p(x)$ 在一个区间（无论开闭）的曲边梯形面积

不难发现 $P(X = x_0) = 0$，因此对应的事件为**概率为 0 的事件**，但并不是一个**不可能事件**

!!! abstract "**概率为 0 的事件** ≠ **不可能事件**"

根据这个性质，连续型随机变量 $X$ 在某一区间取值的概率与区间的开或闭无关，因此：

$$
P(a < X < b) = P(a \leq X < b) = P(a < X \leq b) = P(a \leq X \leq b) = \int_a^b p(x) \, dx
$$

#### 常见的连续型随机变量

- 均匀分布 $U[a,b]$：

$$
p(x) = \begin{cases}
\frac{1}{b-a},  & \text{ if } a<x<b\\\\
0  ,& \text{ if } else
\end{cases}
\qquad
F(x) = \begin{cases}
0,  & \text{ if } x<a\\\\
\frac{x-a}{b-a}  ,& \text{ if } a\leq x < b\\\\
1, & \text{ if }x \geq b
\end{cases}
$$

- 指数分布 $E(\lambda)$：

$$
p(x) = \begin{cases}
\lambda e ^{-\lambda x},  & \text{ if } x\geq 0\\\\
0  ,& \text{ if } x < 0
\end{cases}
\qquad
F(x) = \begin{cases}
1- e ^{-\lambda x}  ,& \text{ if } x \geq 0\\\\
0, & \text{ if } else
\end{cases}
$$

- 正态分布 $N(μ,σ^2)$：

$$
p(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{\left(x - \mu\right)^2}{2\sigma}},x\in\R\qquad F(x) = \int_{-\infty}^{\infty}\frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{\left(x - \mu\right)^2}{2\sigma}}dt
$$

对于正态分布图像：

$p(x)$ 图像以 $x=μ$ 为对称轴，$(μ,\frac{1}{\sigma\sqrt{2\pi}})$ 为极大值点，$x$ 轴为渐近线

固定 $μ$ 时：$σ$ 越小，最大值越大，图形越高越陡峭； $σ$ 越大，最大值越小，图形越低越平缓

固定 $σ$：$μ$ 变小时，曲线沿对称轴 $x= μ$ 向左平移；$μ$ 变大时，曲线沿对称轴 $x= μ$ 向右平移

<br>

#### 标准正态分布

有定理：$X\sim N(μ,σ^2) \to \frac{x-μ}{σ} \sim N(0,1)$ ，其中后者为标准正态分布，其密度函数和分布函数特别记为 $\varphi(x)$ 和 $\Phi(x)$ 
$$
\varphi(x) = \dfrac{1}{\sqrt{2\pi}} e^{-\frac{x^2}{2}}, \qquad
\Phi(x) = \int_{-\infty}^{x} \dfrac{1}{\sqrt{2\pi}} e^{-\frac{t^2}{2}} \, dt
$$
!!! abstract ""

    将其他的正态分布转化为标准正态分布可以方便查表计算
    
    操作是 $P(a<x<b) = P(\frac{a-μ}{σ} < \frac{x-μ}{σ} < \frac{b-μ}{σ}) = \Phi(\frac{b-μ}{σ}) - \Phi(\frac{a-μ}{σ})$ 
    
    实际题目中通常只会给出 $\Phi$ 值，因此通常需要先转化为标准二项分布再查表计算

<br>

### 无记忆性

对于非负随机变量 $X$，如果有

$$
P(X>s+t∣X>s)=P(X>t),\;∀s,t≥0
$$
我们称 $X$ 的分布具有**无记忆性**

对于连续型随机变量，只有**指数分布**具有无记忆性；对于离散型随机变量，只有**几何分布**具有无记忆性

指数分布的无记忆性在可靠性工程中具有重要价值。以电子元件寿命为例，若已知元件在1000小时工作后仍正常，其后续使用寿命仍遵循原指数分布规律，无需重新评估剩余寿命的分布参数。该特性简化了系统维护策略制定与剩余寿命预测的复杂度。

几何分布的无记忆性则体现在赌博策略分析中。假设赌徒连续经历 $n$ 次失败后，其后续需要再进行 $m$ 次尝试才能首次获胜的概率，与赌徒刚开始赌博时的概率分布完全一致。这种特性揭示了独立重复试验中概率规律的稳定性。

<br>

### 随机变量函数的分布

考虑已知概率分布的随机变量 $X$，求 $Y=g(X)$ （连续实函数映射）的概率分布：

1.  $X,Y$ 为离散型随机变量，此时根据分布律带值计算即可
2.  $X,Y$ 为连续型随机变量，此时的常见做法是：
    1. 先求 $\displaystyle F_Y(y) = P(g(X) \leq Y) = \int_{x:g(x)\leq y} p_X(x)dx$ 
    2. 然后求 $p_Y(y) = F'_Y(y)$ 

可以据此推导出定理：设随机变量 $X$ 的可能取值范围为 $(a, b)$，$X$ 的概率密度为 $p_X(x)$，$a < x < b$ (其中 $a$ 可为 $-\infty$，$b$ 可为 $+\infty$)，设函数 $y = g(x)$ 处处可导，且恒有 $g'(x) > 0$ [或恒有 $g'(x) < 0$]，则 $Y = g(X)$ 为连续型随机变量，其概率密度为
$$
p_Y(y) = 
\begin{cases} 
p_X[g^{-1}(y)] \cdot |[g^{-1}(y)]'|, & \alpha < y < \beta \\\\
0, & \text{else}
\end{cases}
$$
其中，$\alpha = \min(g(a), g(b))$，$\beta = \max(g(a), g(b))$，$g^{-1}(y)$ 为 $y = g(x)$ 的反函数。

<br>

## 第三章 二维随机变量及其分布

### 二维随机变量的分布函数

#### 联合分布

$F(x,y)=P\lbrace X\leq x,Y\leq y\rbrace$ 为二维随机变量的（联合）分布函数。如果将 $(X, Y)$ 看成平面上随机点的坐标，则分布函数 $F(x, y)$ 在$ (x , y)$ 处的函数值就是随机点 $(X, Y)$ 落入以 $(x , y)$ 为右上顶点的无穷矩形区域的概率

二维随机变量的分布函数和一维的性质相近

$F(x,y)$ 分别对于 $x,y$ 单调不减，$F(-\infty, y) = F(x, -\infty) = 0, \; F(+\infty, +\infty) = 1$ 

$F(x,y)$ 关于 $x,y$ 右连续

对于 $x_2>x_1,\;y_2>y_1$，由容斥原理得：

$$
F(x_2, y_2) - F(x_1, y_2) - F(x_2, y_1) + F(x_1, y_1) = P(x_1 < X \leq x_2,\;y_1 < Y \leq y_2) \geq 0
$$

<br>

#### 边缘分布

对于二维随机变量 $(X,Y)$，若只考虑其中一个变量的相关分布，称之为边缘分布：

$$
F_X(x) = F(x, +\infty) = \lim_{y \to + \infty} F(x,y) \\\\
F_Y(y) = F(+\infty, y) = \lim_{x \to + \infty} F(x,y)
$$

<br>

#### 随机变量的独立性

先回顾事件的独立性

> - $A,\;B$ 两事件相互独立当且仅当 $P(AB)=P(A)P(B)$，或者说 $P(A|B) = P(A)$ 
>
> - 如果 $\{A_i\}$ 之间相互独立，那么将 $n$ 个事件划分为 $k$ 组，每组内进行任意事件运算，得到的新的 $k$ 个事件也互相独立

同理我们也有：

- $X, Y$ 两随机变量相互独立当且仅当 $F(x, y) = F_X(x) \cdot F_Y(y)$ 

-->（这个结论只考虑连续型随机变量与离散型随机变量）

- $f(x),\;g(y)$ 为相互独立的 $X, Y$ 的连续或分段连续函数，则随机变量的函数 $f(X)$ 与 $g(Y)$ 也相互独立

<br>

### 二维离散型随机变量

对于离散型随机变量 $X,Y$（有限个/可列无限个取值对），称 

$$
P(X = x_i,\;Y = y_j)=p_{ij},\;i,j=1,2,\cdots
$$

为 $(X, Y)$ 的联合分布律，通常也可以用表格表示

同理也有边缘分布律，容易得到边缘分布律满足一维随机变量分布律的性质

这里给出二维离散型随机变量 $(X,Y)$ 的独立性条件
$$
\forall i ,j=1,2,\cdots,\quad P(X= x_i, y= y_j) = P(X = x_i)P(Y = y_j)
$$

<br>

#### 常见的二维离散型随机变量

- 三项分布 $T(n, p_1, p_2)$

从 $n$ 次 0-1 分布实验上升为 $n$ 次 "0-1-2" 分布实验
$$
P(X=i,Y=j)=\frac{n!}{i!j!(n-i-j)!}p_1^ip_2^j(1-p_1-p_2)^{n-i-j}\\\\i,j=0,1,\cdots,n,\quad i+j\leqslant n
$$

其实不是很常见，但是值得注意的是：三项分布的边缘分布是二项分布

$$
(X, Y) \sim T(n, p_1, p_2) \longrightarrow X \sim B(n,p_1),\; Y \sim B(n, p_2)
$$

- 二维超几何分布

$$
P(X = n_1, Y = n_2) = \dfrac{C_{N_1}^{n_1}C_{N_2}^{n_2}C_{N_3}^{n_3}}{C_{N_1+N_2+N_3}^{n_1+n_2+n_3}}
$$

容易扩展到 $n$ 维；二维超几何分布的边缘分布是超几何分布

<br>

### 二维连续型随机变量

对于二维连续型随机变量 $(X,Y)$，其分布函数满足：

$$
P(X < x, Y < y)=F(x,y) = \int_{-\infty}^x \int_{-\infty}^y p(u,v)dudv
$$

其中 $p(x,y)$ 为联合概率密度函数，一定有 $\displaystyle \int_{-\infty}^{\infty}\int_{-\infty}^{\infty} p(x,y)dxdy = 1$ 

性质大致参考一维情形，有一条 $\displaystyle P((X,Y)\in D) = \iint\limits_{D} p(x,y) dxdy$ 比较常用

$p(x, y)$ 的大小反映了 $(X,Y)$ 落在点 $(x, y)$ 附近的概率大小。

<br>

#### 边缘密度及独立性条件

$$
p_X(x) = F^\prime_X(x) = \int_{-\infty}^{+\infty} p(x,y) dy \\\\
p_Y(y) = F^\prime_Y(y) = \int_{-\infty}^{+\infty} p(x,y) dx
$$

之前提到 $X, Y$ 两随机变量相互独立当且仅当 $F(x, y) = F_X(x) \cdot F_Y(y)$，对于二维连续性随机变量 $(X,Y)$，又有：

$$
p(x, y) = p_X(x) \cdot p_Y(y)
$$
这也是等价的独立性条件，可推广至 $n$ 维随机变量

<br>

#### 常见的二维连续型随机变量

- 二维均匀分布

$$
p(x) = \begin{cases}
\frac{1}{S_D},  & \text{ if } (x,y) \in D\\\\
0  ,& \text{ if } else
\end{cases}
\qquad
P((X,Y)\in D_k) = \dfrac{S_{D_k}}{S_D} (D_k \subseteq D)
$$

- 二维正态分布 $N(\mu_1, \mu_2, \sigma_1^2, \sigma_2^2, \rho)$ 

!!! abstract ""

    这是一维正态分布：$p(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{\left(x - \mu\right)^2}{2\sigma}},x\in\R$

$$
\begin{aligned}p(x,y)&=\frac{1}{2\pi\sigma_1\sigma_2\sqrt{1-\rho^2}}\exp\bigg(-\frac{1}{2(1-\rho^2)}\bigg[ \bigg(\frac{x-\mu_1}{\sigma_1}\bigg)^2\\\\&-2\rho\left(\frac{x-\mu_1}{\sigma_1}\right)\left(\frac{y-\mu_2}{\sigma_2}\right)+\left(\frac{y-\mu_2}{\sigma_2}\right)^2\bigg]\bigg)\end{aligned}
$$

$X, Y$ 服从二维正态分布，则相互独立的充要条件是 $\rho  = 0$ 

???+ question "如果真的需要记忆二维正态分布的密度函数表达式？"

    先考虑 $\rho = 0$ 的情况，这个式子很对称：
    
    $$
    \begin{aligned}p(x,y)&=\frac{1}{2\pi\sigma_1\sigma_2}\exp\left(-\frac{1}{2}\left[\frac{\left(x-\mu_1\right)^2}{\sigma_1^2}+\frac{\left(y-\mu_2\right)^2}{\sigma_2^2}\right]\right)\end{aligned}
    $$
    
    然后加上 $\rho$ 相关的参数，进一步补全为完整的算式，注意右侧的式子很像平方展开
    
    $$
    \begin{aligned}
    p(x,y)&=\frac{1}{2\pi\sigma_1\sigma_2{\color{yellow}{\sqrt{1-\rho^2}}}}\exp\left(-\frac{1}{2{\color{yellow}{(1-\rho^2)}}}\left[\frac{\left(x-\mu_1\right)^2}{\sigma_1^2}{\color{yellow}{-\frac{{2\rho}\left(x-\mu_1\right)\left(y-\mu_2\right)}{\sigma_1\sigma_2}}}+\frac{\left(y-\mu_2\right)^2}{\sigma_2^2}\right]\right)
    \end{aligned}
    $$

<br>

### 条件分布

定义 $F(x|A) = P(X \leq x | A)$ 为随机事件 $A = \lbrace X \in S\rbrace$ 发生条件下 $X$ 的条件分布函数

#### 离散型随机变量

根据分布律手动计算即可

$$
P(X = x_i|Y=y_j) = \dfrac{P(X = x_i,Y=y_j)}{P(Y = y_j)}
$$

#### 连续型随机变量

$$
P(X \leq x|Y = y) = F_{X|Y = y}(x) = \int_{-\infty}^{x} \dfrac{p(u,y)}{p_Y(y)} du
$$

??? quote "完整的推导过程"

    $$
    \begin{aligned}F_{X|Y=y}(x)\;&\begin{aligned}=\lim_{\varepsilon\to0}\frac{P(X\leqslant x,y\leqslant Y<y+\varepsilon)}{P(y\leqslant Y<y+\varepsilon)}=\lim_{\varepsilon\to0}\frac{F(x,y+\varepsilon)-F(x,y)}{F_Y(y+\varepsilon)-F_Y(y)}\end{aligned}\\\\&=\frac{\lim_{\varepsilon\to0}\frac{F(x,y+\varepsilon)-F(x,y)}{\varepsilon}}{\lim_{\varepsilon\to0}\frac{F_Y(y+\varepsilon)-F_Y(y)}{\varepsilon}}=\frac{\frac{\partial F(x,y)}{\partial y}}{\frac{d}{dy}F_Y(y)}\\\\&\begin{aligned}&=\frac{\frac{\partial}{\partial y}\int_{-\infty}^x\int_{-\infty}^yp(u,v)dudv}{p_Y(y)}=\frac{\int_{-\infty}^xp(u,y)du}{p_Y(y)}=\int_{-\infty}^x\frac{p(u,y)}{p_Y(y)}du\end{aligned}\end{aligned}
    $$

因此
$$
p_{X|Y= y} = \dfrac{p(u,y)}{p_Y(y)}
$$
很像随机事件的条件概率式 $P(A|B) = \frac{P(AB)}{P(B)}$

$X,Y$ 相互独立时，$p(x, y) = p_X(x) \cdot p_Y(y)$，因此 $p_{X|Y= y} = p_X(x), \; p_{Y|X= x} = p_Y(y)$

<br>

### 二维随机变量函数的分布

考虑已知概率分布的二维随机变量 $(X,Y)$，求 $Z=g(X,Y)$ （连续实函数映射）的概率分布：

1-  $X,Y$ 为离散型随机变量，此时根据分布律带值计算即可

!!! abstract ""

    - 这里有一个结论：**泊松分布**和**二项分布**具有可加性：
    
    $$
    \forall k = 1,\cdots,n,\;X_k \sim P(\lambda_k) \longrightarrow \sum_{i=1}^n X_i \sim P(\sum_{i=1}^n \lambda_i) \\\\
    \forall k = 1,\cdots,n,\;X_k \sim B(\lambda_k) \longrightarrow \sum_{i=1}^n X_i \sim B(\sum_{i=1}^n \lambda_i)
    $$

2-  $X,Y$ 为连续型随机变量，此时的常见做法依旧是分布函数法：

1) 先求 $\displaystyle F_Z(z) = P(g(X,Y) \leq Z) = \iint\limits_{D_z} p(x,y)dxdy, \quad D_z = \lbrace(x,y)|g(x,y) \leq z\rbrace$ （固定 $z$ 为一个常值，通常作图进行分类讨论）

2) 然后求 $p_Z(z) = F'_Z(z)$ 

!!! abstract ""

    - 这里有一个结论：**正态分布**具有可加性

3- $X,Y$ 一个为离散型，一个为连续型

	依旧采用分布函数法，把离散型随机变量的所有取值，看成样本空间的划分，由全概率公式求解

!!! abstract ""

    比如 $X$ 为离散型，$Y$ 为连续型，$\displaystyle F_Z(z) = P(g(X,Y) \leq Z) = \sum_{k = 1}^{n} P(X = k)\cdot P(g(X,Y)\leq z | X = k)$

??? info "一个具体的题目例子"

    !!! question ""
    
        随机变量 $X,Y$ 相互独立，$P(X=1) = P(X=2) = 0.5,\;Y\sim E(1)$，求 $Z=X+Y$ 的概率密度函数
    
    根据全概率公式：$\displaystyle p_Z(z) = \sum_x p_Y(z-x) \cdot P(X = x)$ （$z$ 视作常值，$y$ 换元为 $x$ 相关）
    
    带入 $X = 1,2$ 得 $\displaystyle p_Z(z) = P(X=1) \cdot p_Y(z-1) + P(X=2) \cdot p_Y(z-2) = \dfrac{1}{2} (p_Y(z-1) + p_Y(z-2))$
    
    因为 $p_Y(y) = e^{-y},\;y\geqslant 0$，因此分类讨论：
    
    $z \geqslant 2$，$p_Z(z) = \dfrac{1}{2}(e^{1-z} + e^{2-z})$ 
    
    $1 \leqslant z < 2$，$p_Z(z) = \dfrac{1}{2}(e^{1-z} + 0)$ 
    
    $z < 1$，$p_Z(z) = 0$ 

<br>

### 常见的一维函数 $Z=g(X,Y)$ 的分布

--> $Z=X±Y$ 

**连续型：**

对于 $Z = X+Y$：

$$
p_Z(z) = \int_{-\infty}^{+\infty} p(x,z-x)dx = \int_{-\infty}^{+\infty} p(z-y,y)dy
$$

如果 $X,Y$ 独立，还可以转换为：（称下面的公式为**卷积公式**）
$$
p_Z(z) = \int_{-\infty}^{+\infty} p_X(x) \cdot p_Y(z-x)dx = \int_{-\infty}^{+\infty} p_X(z-y) \cdot p_Y(y) dy
$$
同理对于 $Z=X-Y$：
$$
p_Z(z) = \int_{-\infty}^{+\infty} p(x,x-z)dx = \int_{-\infty}^{+\infty} p(z+y,y)dy
$$

!!! abstract ""

    推广： $Z = aX+bY$ 的分布：
    
    $$
    p_{Z}(z)= \frac{1}{{\color{yellow}{|b|}}} \int_{-\infty}^{+\infty} p\left( x, \frac{z - {\color{yellow}{a}} x}{{\color{yellow}{b}}} \right) dx= \frac{1}{{\color{yellow}{|a|}}} \int_{-\infty}^{+\infty} p\left( \frac{z - {\color{yellow}{b}} y}{{\color{yellow}{a}}}, y \right) dy
    $$
    
    $X,Y$ 独立时同理得到卷积公式的推广

**离散型：**

考虑分布列 $P(X=i, Y=j) = p_{ij}$，则：

$$
P(X+Y = k) = \sum_{i=0}^{k} p_{i,k-i},\;k=0,1,2,\cdots
$$

如果 $X,Y$ 独立，考虑分布列 $P(X = k) = a_k,\;k = 0,1,2,\cdots;\;P(Y = k) = b_k,\;k = 0,1,2,\cdots$，则：

$$
P(X+Y = k) = \sum_{i=0}^k a_ib_{k-i} = \sum_{i=0}^k b_ia_{k-i},\;k=0,1,2,\cdots 
$$

<br>

--> $Z = XY ,\; Z = X/Y\;(Y/X)$

对于 $Z = XY$ 

$$
p_Z(z) = \int_{-\infty}^{+\infty} p \left( x, \frac{z}{x} \right) \frac{1}{|x|} \, dx = \int_{-\infty}^{+\infty} p \left( \frac{z}{y}, y \right) \frac{1}{|y|} \, dy
$$

对于 $Z =X/Y\;(Y/X)$

$$
\begin{aligned}
p_Z(z) &= \int_{-\infty}^{+\infty} p(x, zx) |x| \, dx \quad(Z = Y/X) \\\\ &= \int_{-\infty}^{+\infty} p(zy, y) |y| \, dy \quad(Z = X/Y)
\end{aligned}
$$



<br>

--> $Z = \max(X,Y),\; Z = \min(X,Y)$

对于 $Z = \max(X,Y)$ 

$$
F_Z(z) = F_X(z)F_Y(z)
$$

对于 $Z = \min(X,Y)$ 

$$
F_Z(z) = 1-[1-F_X(z)][1-F_Y(z)]
$$

上面两个式子都可以进行 $n$ 维推广

<br>

## 第四章 随机变量的数字特征

### 数学期望与方差

数学期望与方差通常针对的是单个随机变量

#### 离散型

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

#### 常见的离散型随机变量的数字特征

- 几何分布 $X \sim g(p)$ 

$$
EX = \sum_{k= 0}^{n} k  p (1-p)^{k-1} ={\color{yellow}{\frac{1}{p} }}\\\\
DX = \sum_{k= 0}^{n} k^2 p (1-p)^{k-1} - (\frac1p)^2 = {\color{yellow}{\frac{1-p}{p^2}}}
$$

- 二项分布 $X \sim B(n,p)$ 

$$
EX = \sum_{k= 0}^{n} k C_n^k p ^k(1-p)^{n-k} \left(=\sum_{k= 1}^{n} E(X_k) \right) = {\color{yellow}{np}} \\\\
DX = \sum_{k= 0}^{n} k^2 C_n^k p ^k(1-p)^{n-k} - (np)^2 \left(=\sum_{k= 1}^{n} D(X_k) \right)= {\color{yellow}{np(1-p)}}
$$

（括号里的内容为通过期望/方差的性质进行的简化运算）

- 泊松分布 $X \sim P(\lambda)$ 

$$
EX = \sum_{k=1}^{+\infty} k \dfrac{\lambda^k}{k!}e^{-\lambda}= \lambda  \sum_{k=0}^{+\infty} \dfrac{\lambda^k}{k!}e^{-\lambda} = {\color{yellow}{\lambda}} \\\\
D(X) = EX^2 - (EX)^2 = (\lambda^2 + \lambda) - (\lambda)^2 = {\color{yellow}{\lambda}}
$$

<br>

#### 连续型

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

#### 常见的连续型随机变量的数字特征

- 均匀分布 $X \sim U[a,b]$ 

$$
EX = {\color{yellow}{\frac{a+b}{2}}} \\\\
DX = EX^2 - (EX)^2 = \frac{a^2+ab+b^2}{3} - \left(\frac{a+b}{2}\right)^2 = {\color{yellow}{\frac{(b-a)^2}{12}}}
$$

- 指数分布 $X \sim E(\lambda)$ 

$$
EX = \int_{-\infty}^{+\infty} x\lambda e^{-\lambda x} dx = {\color{yellow}{\frac{1}{\lambda} }}\\\\
DX = \int_{-\infty}^{+\infty} x^2\lambda e^{-\lambda x} dx - \left(\frac{1}{\lambda} \right)^2 = {\color{yellow}{ \frac{1}{\lambda^2}}}
$$

- 正态分布 $X \sim N(\mu, \sigma^2)$ 

$$
EX = {\color{yellow}{\mu}} \\\\
DX = {\color{yellow}{\rho^2}}
$$

（计算量偏大，并且需要借助高斯积分归一化）

<br>

### 期望的性质

对于离散型随机变量

- $\displaystyle E(g(X))  = \sum _ {i= 1} ^ {+\infty} g(x_i) \cdot P(X = x_i)$ 

对于连续型随机变量

- $\displaystyle E(g(X)) EX = \int_{-\infty}^{+\infty} g(x)p(x)dx$ 

上述结论可以推广到 $Z = g(X,Y)$ 的数学期望，对应二重求和 / 积分

对于任意随机变量

- $E(a) = a$ 
- $E(aX+bY) = aEX+bEY$ 
- $X,Y$ 相互独立 $\longrightarrow E(XY)=EX\cdot EY$ 



### 方差的性质

对于任意随机变量

- $D(a) = 0$
- $D(aX+b) = a^2DX$ 
- $D(X ± Y) = DX + DY ± 2E[(X-EX)(Y-EY)]$，当 $X,Y$ 相互独立时化简为 $D(X ± Y) = DX + DY$ 

（$D(X ± Y) = DX + DY ± 2 \text{cov}(X,Y)$）

上面的结论可扩展到 $n$ 维



### 切比雪夫不等式

设随机变量 $X$ 的期望 $EX$ 和方差 $DX$ 均存在，则对任意 $ε > 0$：
$$
P(|X - EX| \geq ε) \leq \dfrac{DX}{ε^2}
$$

???+ abstract "Proof"

    $$
    P\left(\left|X-EX\right|\geqslant\varepsilon\right)=\int\limits_{\lbrace x:\left|x-EX\right|\geqslant\varepsilon\rbrace}p(x)dx\leqslant\int\limits_{\lbrace x:\left|x-EX\right|\geqslant\varepsilon\rbrace}\frac{(x-EX)^2}{\varepsilon^2}p(x)dx\\\\ \leqslant\frac{1}{\varepsilon^2}\int_{-\infty}^{+\infty}(x-EX)^2p(x)dx=\frac{DX}{\varepsilon^2}
    $$

可以借助证明：$DX = 0 \longrightarrow X = c$ 



### 协方差

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

#### 柯西 · 施瓦兹不等式的概率论形式

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

### 相关系数

!!! abstract ""

    回顾：正态分布的标准化：$X\sim N(μ,σ^2) \to \frac{x-μ}{σ} \sim N(0,1)$，标准正态分布的期望为 $0$，方差为 $1$

已知随机变量 $X$ 的期望和方差，我们令

$$
X^{*} = \dfrac{X - EX}{\sqrt{D(X)}}
$$

计算得到 $EX^\ast = 0,\; DX^\ast = 1$， 此时称 $X^*$ 为 $X$ 的标准化随机变量

上式中记 $EX = \mu,\;DX = \sigma^2$ 

在此基础上定义 $X,Y$ 的相关系数：设 $DX, DY > 0$，则

$$
\rho_{X\,Y} = \dfrac{\text{cov}(X,Y)}{\sqrt{D(X)D(Y)}} = \text{cov}(X^{\ast}, Y^{\ast})
$$

记 $\rho_{X\,Y}$ 为 $X,Y$ 的相关系数，根据柯西 · 施瓦兹不等式 $[\text{cov}(X,Y)]^2 \leqslant DX\cdot DY$，得到 $|\rho_{X\,Y}| \leqslant 1$，取等条件是存在 $a,b$ 不全为零，$P(Y= aX+b) = 1$ 

上面的性质表明，相关系数 $ρ_{X\,Y}$ 刻画了 $X$ 和 $Y$ 间的线性相关特征。 $|ρ_{X\,Y}|$ 越大，表明 $X$ 和 $Y$ 之间线性关系越密切，当 $|ρ_{X\,Y}| = 1$ 时表明 $X$ 和 $Y$ 以概率 $1$ 线性相关。反之，若 $|ρ_{X\,Y}|$ 越小，表明 $X$ 和 $Y$ 的线性关系越弱。

!!! abstract ""

    $\rho_{X\,Y}$ 描述了两个随机事件的线性相关特征；独立性描述了两个随机事件的相关性

特别地，若 $ρ_{X\,Y} = 0$，我们称 $X,Y$ 线性无关（不相关），容易得到以下等式

$$
ρ_{X\,Y} = 0 \Leftrightarrow \text{cov}(X,Y) = 0 \Leftrightarrow E(XY)=EX\cdot EY \Leftrightarrow D(X±Y) = DX ± D(Y)
$$

独立性和不相关并非等价，但是正态分布的独立性和不相关性等价，比如 $(X,Y)\sim N(\mu_!,\mu_2,\sigma_1^2, \sigma_2^2,\rho)$ 中 $\rho_{X\,Y} = \rho$，而 $X,Y$ 相互独立的充要条件即 $\rho = 0$ 

### 矩和协方差阵

!!! warning ""

    考试不考，写的简单一点

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
c_{11} & c_{12} & \cdots & c_{1n} \\\\
c_{21} & c_{22} & \cdots & c_{2n} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
c_{n1} & c_{n2} & \cdots & c_{nn}
\end{pmatrix}
$$

为 $X$ 的协方差阵，它是一个对称矩阵，比如二维正态分布的协方差阵为 $\begin{bmatrix}\sigma_1^2 & \sigma_1 \sigma_2 \rho \\\\\sigma_1 \sigma_2 \rho & \sigma_2^2\end{bmatrix}$ 

