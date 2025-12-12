# 第三章 二维随机变量及其分布

## 二维随机变量的分布函数

### 联合分布

$F(x,y)=P\lbrace X\leq x,Y\leq y\rbrace$ 为二维随机变量的（联合）分布函数。如果将 $(X, Y)$ 看成平面上随机点的坐标，则分布函数 $F(x, y)$ 在$ (x , y)$ 处的函数值就是随机点 $(X, Y)$ 落入以 $(x , y)$ 为右上顶点的无穷矩形区域的概率

二维随机变量的分布函数和一维的性质相近

$F(x,y)$ 分别对于 $x,y$ 单调不减，$F(-\infty, y) = F(x, -\infty) = 0, \; F(+\infty, +\infty) = 1$ 

$F(x,y)$ 关于 $x,y$ 右连续

对于 $x_2>x_1,\;y_2>y_1$，由容斥原理得：

$$
F(x_2, y_2) - F(x_1, y_2) - F(x_2, y_1) + F(x_1, y_1) = P(x_1 < X \leq x_2,\;y_1 < Y \leq y_2) \geq 0
$$

<br>

### 边缘分布

对于二维随机变量 $(X,Y)$，若只考虑其中一个变量的相关分布，称之为边缘分布：

$$
F_X(x) = F(x, +\infty) = \lim_{y \to + \infty} F(x,y) \\\\
F_Y(y) = F(+\infty, y) = \lim_{x \to + \infty} F(x,y)
$$

<br>

### 随机变量的独立性

先回顾事件的独立性

> - $A,\;B$ 两事件相互独立当且仅当 $P(AB)=P(A)P(B)$，或者说 $P(A|B) = P(A)$ 
>
> - 如果 $\{A_i\}$ 之间相互独立，那么将 $n$ 个事件划分为 $k$ 组，每组内进行任意事件运算，得到的新的 $k$ 个事件也互相独立

同理我们也有：

- $X, Y$ 两随机变量相互独立当且仅当 $F(x, y) = F_X(x) \cdot F_Y(y)$ 

-->（这个结论只考虑连续型随机变量与离散型随机变量）

- $f(x),\;g(y)$ 为相互独立的 $X, Y$ 的连续或分段连续函数，则随机变量的函数 $f(X)$ 与 $g(Y)$ 也相互独立

<br>

## 二维离散型随机变量

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

### 常见的二维离散型随机变量

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

## 二维连续型随机变量

对于二维连续型随机变量 $(X,Y)$，其分布函数满足：

$$
P(X < x, Y < y)=F(x,y) = \int_{-\infty}^x \int_{-\infty}^y p(u,v)dudv
$$

其中 $p(x,y)$ 为联合概率密度函数，一定有 $\displaystyle \int_{-\infty}^{\infty}\int_{-\infty}^{\infty} p(x,y)dxdy = 1$ 

性质大致参考一维情形，有一条 $\displaystyle P((X,Y)\in D) = \iint\limits_{D} p(x,y) dxdy$ 比较常用

$p(x, y)$ 的大小反映了 $(X,Y)$ 落在点 $(x, y)$ 附近的概率大小。

<br>

### 边缘密度及独立性条件

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

### 常见的二维连续型随机变量

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
    p(x,y)&=\frac{1}{2\pi\sigma_1\sigma_2{\color{orange}{\sqrt{1-\rho^2}}}}\exp\left(-\frac{1}{2{\color{orange}{(1-\rho^2)}}}\left[\frac{\left(x-\mu_1\right)^2}{\sigma_1^2}{\color{orange}{-\frac{{2\rho}\left(x-\mu_1\right)\left(y-\mu_2\right)}{\sigma_1\sigma_2}}}+\frac{\left(y-\mu_2\right)^2}{\sigma_2^2}\right]\right)
    \end{aligned}
    $$

<br>

## 条件分布

定义 $F(x|A) = P(X \leq x | A)$ 为随机事件 $A = \lbrace X \in S\rbrace$ 发生条件下 $X$ 的条件分布函数

### 离散型随机变量

根据分布律手动计算即可

$$
P(X = x_i|Y=y_j) = \dfrac{P(X = x_i,Y=y_j)}{P(Y = y_j)}
$$

### 连续型随机变量

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

## 二维随机变量函数的分布

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

## 常见的一维函数 $Z=g(X,Y)$ 的分布

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

    推广：$Z = aX+bY$ 的分布：
    
    $$
    p_{Z}(z)= \frac{1}{{\color{orange}{|b|}}} \int_{-\infty}^{+\infty} p\left( x, \frac{z - {\color{orange}{a}} x}{{\color{orange}{b}}} \right) dx= \frac{1}{{\color{orange}{|a|}}} \int_{-\infty}^{+\infty} p\left( \frac{z - {\color{orange}{b}} y}{{\color{orange}{a}}}, y \right) dy
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

