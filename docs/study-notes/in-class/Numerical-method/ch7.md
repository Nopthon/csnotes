# Lecture 7: 特征值与幂迭代

## （对称）正定矩阵

对于一个实对称方阵 $A \in \mathbb{R}^{d\times d}$：

- 如果取任意 $d$ 维**非零**列向量 $x \ne 0$，都有 $x^{T}Ax > 0$，则 $A$ 是正定矩阵（Positive Definite Matrix, PD），记为 $A \succ 0$
    - 等价为所有特征值为正数

- 如果取任意 $d$ 维列向量 $x \in \mathbf{R}^{d}$，都有 $x^{T}Ax \succeq 0$，则 $A$ 是半正定矩阵（Positive Semi-Definite Matrix, PSD），记为 $A \succeq 0$
    - 等价为所有特征值为非负数

??? abstract "回顾：法线方程"

    之前我们提到，求解方程组 $Ax=b$，理论上可以解法线方程
    $$
    A^{T}Ax = A^{T}b
    $$
    有这样的好性质：
    
    - $A^{T}A$ 是对称半正定方阵
    - $A^{T}A$ 在 $A$ 可逆时同样可逆
    
    但是也有对应的代价：
    
    - 条件数从 $\kappa(A)$ 翻倍为 $\kappa(A^{T}A) = \kappa^{2}(A)$，数值分析精确度降低

正定矩阵 $A$ 有一些性质：

$$
\|A\|_2 := \max_{x \neq 0} \frac{\|Ax\|_2}{\|x\|_2} = \max_{\|x\|_2 \leq 1} \sqrt{x^\top A^\top A x} = \sqrt{\lambda_{\max}(A^\top A)} = \lambda_{\max}(A) \newline \operatorname{cond}_2(A) = \|A\|_2 \cdot \|A^{-1}\|_2 = \lambda_{\max}(A)/\lambda_{\min}(A)
$$

---

之前我们提到了 $LU$ 分解，通过高斯消元的方式得到 $A = LU$，即
$$
L^{-1}A = U
$$
现在我们为 $A$ 逐步添加特殊性质：

- $A$ 是对称矩阵，即 $A^{T} = A$

此时我们可以用同一个矩阵 $L^{-1}$ 同时对 $A$ 进行行和列的变换
$$
L^{-1}A(L^{-1})^{T} = U(L^{-1})^{T} = D
$$
这个矩阵依旧满足对称性，可以在 $LU$ 分解的基础上对 $U$ 进一步分解，得到 $LDL^{T}$ 分解
$$
A = LDL^{T}
$$
其中 $L$ 是单位下三角矩阵（对角线元素为 1），$D$ 是对角矩阵

- $A$ 是对称正定矩阵

这意味着 $LU$ 分解中，$U$ 的对角元素都是正的，我们可以对 $D$ 进行开方拆分
$$
D = \text{diag}(d_{1}, \cdots, d_{n}) \newline
D^{1/2} = \text{diag}(\sqrt{d_{1}}, \cdots, \sqrt{d_{n}})
$$
代入 $LDL^{T}$ 分解的结果中
$$
A=LD^{1/2}D^{1/2}L^{T} = (LD^{1/2})(LD^{1/2})^{T}
$$
以上，我们定义 Cholesky 分解：

???+ success "Definition: Cholesky 分解"

    对于对称正定矩阵 $A$，我们存在唯一的下三角矩阵 $G$，使得
    $$
    A = GG^{T}
    $$
    $G = LD^{1/2}$ 为 Cholesky 因子，是下三角矩阵，且对角线元素为正数
    
    （也可以定义 Cholesky 因子为上三角矩阵为 $C$，分解为 $A=C^{T}C$）

### Loewner 序

对于同样大小的实数对称矩阵 $A, B$，我们定义偏序关系 $A \succeq B$，当且仅当 $A-B$ 是对称半正定矩阵（$A - B \succeq 0$）

这个偏序关系满足一系列性质：

- 自反性：$A \succeq A$
- 反对称性：若 $A \succeq B$ 且 $B \succeq A$，则 $A=B$
- 传递性：若 $A \succeq B$ 且 $B \succeq C$，则 $A \succeq C$

注意不满足全序性，也就是说，存在 $A, B$ 使得 $A \not\succeq B$ 且 $B \not\succeq A$（因为 $A-B$ 不一定是半正定的）

确认 $A \succeq B$ 的一个充分不必要条件是：$A$ 的最小特征值不小于 $B$ 的最大特征值

> $x^{T}Ax \geq \lambda_{\min}(A) \lVert x \rVert^{2} \geq \lambda_{\max}(B) \lVert x \rVert^{2} \geq x^{T}Bx$
>
> 这个充分条件很强大，但是确实不是必要条件

## 特征值与特征向量

众所周知，如果存在常量 $\lambda$ 和对应的向量 $v$，使得 $Av = \lambda v$，则我们记 $\lambda, v$ 分别为 $A$ 的一个特征值，以及对应的特征向量（特征向量不能是零向量，但特征值可以是零）

特征值与特征向量的存在性表明，存在某个向量 $v$，矩阵 $A$ 对其进行的线性变换，作用效果等价于对 $v$ 的缩放，不改变直线方向，缩放系数为 $|\lambda|$

为了求特征值，我们将 $Av=\lambda v$ 改写为 $(A-\lambda I)v = 0$，注意到 $v \ne 0$，因此必须有
$$
\det(A-\lambda I) = 0
$$
这个关于 $\lambda$ 的 $n$ 次多项式记为特征多项式

### 常用等式

- $\text{tr}(A) = \sum_{i=1}^{n} \lambda_{i}$
- $\text{det}(A) = \prod_{i=1}^{n} \lambda_{i}$
- $\lVert A \rVert_{F}^{2} = \text{tr}(A^{T}A)$

### 重数

我们记：

- 代数重数：特征值作为特征多项式根的重根个数
    - 比如特征多项式 $(\lambda -1)^{3}$，则 $\lambda = 1$ 的代数重数为 $3$
    - 代表理论上的独立特征向量个数
- 几何重数：特征值的最大线性无关特征向量的个数
    - 即 $(A-\lambda I)v = 0$ 解空间的维度
    - 代表实际上的独立特征向量个数

几何重数一定不会超过代数重数；当且仅当几何重数等于代数重数时，矩阵可对角化

### 实对称矩阵的特征值

令 $A$ 为 $n\times n$ 的实数对称矩阵，则存在一组正交、归一化的特征向量，满足所有特征值均为实数，且张成完整的 $\R^{n}$ 空间

??? question "部分证明"

    $A$ 为 $n\times n$ 的实数对称矩阵，对于 $Av = \lambda v$，取共轭转置，右乘 $v$ 得：
    $$
    \overline{v}^{T} A v= \overline{\lambda} \overline{v}^{T} v
    $$
    对于 $Av = \lambda v$，直接左乘 $\overline{v}^{T}$ 得：
    $$
    \overline{v}^{T} A v= \lambda \overline{v}^{T} v
    $$
    因此
    $$
    \overline{\lambda} \overline{v}^{T} v = \lambda \overline{v}^{T} v
    $$
    内积 $\langle v, v \rangle > 0$，因此 $\lambda = \overline{\lambda}$，即 $\lambda$ 一定是实数
    
    对张成完整的 $\R^{n}$ 空间证明略

> 事实上，对于实对称矩阵，不同特征值对应的特征向量自动正交

根据这个定理，我们可以对实对称矩阵 $A$ 进行正交对角化：
$$
A = VDV^{T}
$$
其中 $D = \text{diag}(\lambda_{1}, \cdots, \lambda_{n})$，$V = (v_{1}, \cdots, v_{n})$，满足 $V^{T}V =I$

在此基础上，我们特殊化 $A$ 为（半）正定矩阵，可以得到之前提到的特征值性质

---

如果我们换一种写法，得到：
$$
A = \sum_{i=1}^n \lambda_i \, v_i v_i^T
$$
这个式子称为 $A$ 的谱分解 / 特征分解

> 当然，如果将所有特征向量排成矩阵，所有特征值排成对角矩阵，就得到 $A = VDV^{T}$ 的等价写法

相应的，对于 $A^{-1}$ 也有类似分解
$$
A^{-1} = \sum_{i=1}^n \lambda_i^{-1} \, v_i v_i^T
$$
即使 $A$ 不可逆，对于伪逆 $A^{+}$ 也有对应的分解
$$
A^{+} = \sum_{\lambda_{i} \ne 0} \lambda_i^{-1} \, v_i v_i^T
$$
$v_{i}v_{i}^{T}$ 是一个 $n\times n$ 的矩阵，它的作用是“投影”：
$$
(v_{i}v_{i}^{T})x = (v_{i}^{T}x)v_{i}
$$
先计算 $v_{i}^{T}x$ 得到 $x$ 在 $v_{i}$ 方向上的分量，然后乘以 $v_{i}$ 得到投影向量

$v_{i}v_{i}^{T}$ 因其正交归一性有一些性质：

- $(v_{i}v_{i}^{T})^{2}$ = $v_{i}v_{i}^{T}$
- $\sum v_{i}v_{i}^{T} = I$
- $\forall i \ne j,\; (v_{i}v_{i}^{T})(v_{j}v_{j}^{T}) = 0$

我们已知，任意一个向量都可以表示成一组正规正交基 ${v_i}$ 的线性组合

谱分解的几何意义是，将任意向量拆解到若干个特征方向，在特征基上展开

## 特征值的估算与刻画

### 盖尔圆定理 (Gershgorin Circle Theorem)

令 $A$ 为一个 $n\times n$ 的矩阵，定义一个半径 $R$
$$
R_{i} := \sum_{j\ne i} |a_{ij}|
$$
矩阵 $A$ 的每一个特征值 $λ$ 至少位于一个盖尔圆盘 $D(a_{ii}, R_{i})$ 中

??? question "证明"

    任取 $ A $ 的一个特征值 $ \lambda $，其对应的特征向量为 $ v $
    
    设 $ i $ 使得 $ v_i $ 是 $ v $ 中绝对值最大的元素
    
    由 $ A v = \lambda v $，可得：
    $$
    \sum_j a_{ij} v_j = \lambda v_i
    $$
    移项，将 $ j = i $ 项分离：
    $$
    \sum_{j \neq i} a_{ij} v_j = (\lambda - a_{ii}) v_i
    $$
    因此
    $$
    |\lambda - a_{ii}| = \left| \sum_{j \neq i} \frac{a_{ij} v_j}{v_i} \right|
    $$
    利用绝对值不等式及 $ |v_j / v_i| \leq 1 $：
    $$
    \left| \sum_{j \neq i} \frac{a_{ij} v_j}{v_i} \right| \leq \sum_{j \neq i} \left| \frac{a_{ij} v_j}{v_i} \right| \leq \sum_{j \neq i} |a_{ij}|
    $$
    记
    $$
    R_i = \sum_{j \neq i} |a_{ij}|
    $$
    于是得到：
    $$
    |\lambda - a_{ii}| \leq R_i
    $$

### Min-Max 刻画

#### 前置：瑞利商

对于一个 $n$ 阶实对称矩阵 $A$ 和一个非零向量 $x \in \mathbb{R}^n$，Rayleigh Quotient，即瑞利商 $R(A, x)$ 定义为一个标量：
$$
R(A, x) = \frac{\langle Ax , x\rangle}{\langle x , x\rangle} = \frac{x^T Ax}{x^T x}
$$

它实际上是矩阵 $A$ 在向量 $x$ 方向上的加权平均

$R(A, cx) = R(A, x)$（其中 $c \neq 0$）。这意味着瑞利商的值只取决于向量 $x$ 的方向，而与其长度无关。因此，我们通常假设 $\lVert x \rVert_2  = 1$，此时 $R(A, x) = x^T Ax$

瑞利商具有以下性质（这个表格由 LLMs 直接生成）：

| 性质         | 描述                                                   | 数学表达                                                     |
| :----------- | :----------------------------------------------------- | :----------------------------------------------------------- |
| **有界性**   | 瑞利商的值被矩阵的最小和最大特征值所限定。             | $\lambda_{\min} \leq R(A, x) \leq \lambda_{\max}$<br />（注意到这里与 Min-Max 刻画有关） |
| **取值点**   | 当且仅当 $x$ 是特征向量时，瑞利商等于对应的特征值。    | 若 $Ax = \lambda x$，则 $R(A, x) = \lambda$                  |
| **变分特性** | 瑞利商的**驻点**（梯度为 0 的点）正是 $A$ 的特征向量。 | $\nabla R(A, x) = 0 \iff x$ 是特征向量                       |

#### Courant-Fischer 定理

Courant-Fischer 极小极大定理（Min-Max Theorem）是对称矩阵特征值的一个变分刻画，尝试将特征值求解问题转换为一系列优化问题，而不需要依赖于特征多项式的计算

设 $A$ 为 $n \times n$ 实对称矩阵，特征值按从小到大排列：
$$
\lambda_1 \le \lambda_2 \le \cdots \le \lambda_n
$$
则对每个 $k = 1, 2, \dots, n$：
$$
\lambda_k = \min_{\dim(U) = k} \;\max_{x \in U, x \neq 0} \frac{x^T A x}{x^T x}
\newline
\text{Specially, } \lambda_n = \max_{x \in U, x \neq 0} \frac{x^T A x}{x^T x}
$$


等价形式：
$$
\lambda_k = \max_{\dim(U) = n-k+1} \;\min_{x \in U, x \neq 0} \frac{x^T A x}{x^T x}
\newline
\text{Specially, } \lambda_1 = \min_{x \in U, x \neq 0} \frac{x^T A x}{x^T x}
$$
注意到最右侧的分式即瑞利商。

我们不妨证明 $\lambda_{n}$ 的结论：

??? question "证明：对实数对称矩阵 $A$，最大特征值满足 $\lambda_n(A) = \max_{x \neq 0} \frac{x^T A x}{x^T x}$"

    首先容易得到等号可取（取 $x$ 为 $\lambda_n$ 对应的特征向量）
    
    因此我们只需要证明不等式  
    $$
    \frac{x^\top A x}{x^\top x} \leq \lambda_n(A)
    $$
    对任意非零 $x$ 成立
    
    由于 $A$ 是实数对称矩阵，根据谱定理，存在一组两两正交的单位特征向量 $v_1, v_2, \dots, v_n$，对应的特征值为 $\lambda_1, \lambda_2, \dots, \lambda_n$（非减排列）
    
    于是任意向量 $x$ 可在这组基下唯一展开为  
    $$
    x = a_1 v_1 + a_2 v_2 + \cdots + a_n v_n
    $$
    其中 $a_i = v_i^T x$
    
    计算二次型：  
    $$
    x^\top A x = (a_1 v_1 + \cdots + a_n v_n)^\top A (a_1 v_1 + \cdots + a_n v_n)
    $$
    利用 $A v_i = \lambda_i v_i$ 及 $v_i^T v_j = \delta_{ij}$，得  
    $$
    x^\top A x = \sum_{i=1}^n \lambda_i a_i^2
    $$
    同时  
    $$
    x^\top x = \sum_{i=1}^n a_i^2
    $$
    因为 $\lambda_i \leq \lambda_n$ 对所有 $i$ 成立，所以  
    $$
    \sum_{i=1}^n \lambda_i a_i^2 \leq \lambda_n \sum_{i=1}^n a_i^2
    $$
    即  
    $$
    x^\top A x \leq \lambda_n \cdot x^\top x
    $$
    由于 $x^T x > 0$，两边除以 $x^T x$ 即得  
    $$
    \frac{x^\top A x}{x^\top x} \leq \lambda_n
    $$
    完成证明

## 矩阵多项式

已知 $Av = \lambda v$，不难发现：
$$
A^{2}v = \lambda^{2} v \newline
A^{3}v = \lambda^{3} v \newline
\cdots \newline
p(A)v = p(\lambda)v
$$
其中 $p(x)$ 是任意给定的多项式

在这种映射下，特征向量（特征空间）不变，而特征值被多项式映射（不改变方向，只改变大小）

考虑将 $x\in \R^{n}$ 展开为一组能张成 $\R^{n}$ 的基向量 $\lbrace v_{i} \rbrace_{i=1}^{n}$，有：
$$
x = \alpha_{1}v_{1} + \cdots + \alpha_{n}v_{n}
\newline
p(A) x = p(\lambda_{1})\alpha_{1}v_{1} + \cdots + p(\lambda_{n})\alpha_{n}v_{n}
$$

## 幂迭代

计算特征值与特征向量时，会出现比较多的数值不稳定问题，因此我们想要尝试对 $Ax = \lambda x$ 进行迭代法求解：

考虑可对角化方阵 $A$，<u>绝对值从大到小</u>排列特征值：$\lambda_{1}, \cdots, \lambda_{n}$，对应的特征向量为 $v_{1}, \cdots, v_{n}$

我们想求占优特征值 $\lambda_{1}$ 与对应的特征向量 $v_{1}$

> 占优特征值的定义是，这个特征值的绝对值必须严格大于其他特征值的
>
> 因此占优特征值不一定存在，比如 $\begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$ 矩阵

对矩阵 $A$ 对角化，任意初始向量可用特征向量基展开

代入矩阵多项式 $p(\cdot) = (\cdot)^{k}$，使得：
$$
A^{k} x = \lambda_{1}^{k}\alpha_{1}v_{1} + \cdots + \lambda_{n}^{k}\alpha_{n}v_{n}
$$
提取公因子
$$
A^k x = \lambda_1^k \left( \alpha_1 v_1 + \left(\frac{\lambda_2}{\lambda_1}\right)^k \alpha_2 v_2 + \cdots + \left(\frac{\lambda_n}{\lambda_1}\right)^k \alpha_n v_n \right)
$$
当 $k \to \infty$ 时，因为：
$$
\left(\frac{\lambda_i}{\lambda_1}\right)^k \to 0 \quad (i \ge 2)
$$
所以：
$$
A^k x \to \lambda_1^k \alpha_1 v_1
$$
当 $k$ 很大时，更大的常数 $\left(\frac{\lambda_2}{\lambda_1}\right)^k$ 主导了非 $v_1$ 方向的分量大小，其余特征值项衰减更快，所以整体收敛速度由 $|\lambda_2/\lambda_1|$ 决定

计算过程中，可能会遇到浮点数的上溢或下溢（取决于 $|\lambda_{1}|$ 的值），解决方案是在迭代过程中进行归一化：
$$
w_{k+1} = Ax_{k} \newline
x_{k+1} = \dfrac{w_{k+1}}{\lVert w_{k+1} \rVert}
$$
这里取任何范数都可以，但是通常用 2-范数或 ∞-范数

---

随着幂迭代的进行，得到了一个近似的特征向量方向之后，如何求解近似的特征值？

即，给定 $A$ 和近似特征向量 $x$，求 $\lambda$ 使得 $Ax \approx \lambda x$

这就是对 $\lVert Ax - \lambda x \rVert$ 的最小二乘法问题，最终可以得到：
$$
\lambda = \frac{x^T Ax}{x^T x} = R(A, x)
$$
解为瑞利商 $R(A, x)$

---

如果我有一个近似的特征向量 $x$，并用 Rayleigh 商算出一个 $\lambda$，这个 $\lambda$ 的可信度如何？

对于实对称矩阵 $A$，假设有一个近似的归一化特征向量 $x$，满足 $|x|_2 = 1$，并且有一个实数 $\lambda$，使得残差满足：

$$
\lVert Ax - \lambda x\rVert_2 < \epsilon
$$

那么，一定存在 $A$ 的某个真实特征值 $\lambda_j$，使得：
$$
\min_{1 \le j \le n} |\lambda_j - \lambda| < \epsilon
$$

??? question "证明"

    由 $A v_j = \lambda_j v_j$，分别进行谱分解
    $$
    Ax = \sum_{j=1}^n \alpha_j \lambda_j v_j
    \newline
    \lambda x = \sum_{j=1}^n \alpha_j \lambda v_j
    $$
    相减得
    $$
    Ax - \lambda x = \sum_{j=1}^n \alpha_j (\lambda_j - \lambda) v_j
    $$
    因为 $\{v_j\}$ 正交归一，$\|v_j\|_2 = 1$ 且 $v_i^T v_j = 0 \ (i \ne j)$，所以
    $$
    \lVert Ax - \lambda x\rVert_2^2 = \sum_{j=1}^n |\alpha_j|^2 |\lambda_j - \lambda|^2
    $$
    令 $\delta = \min_{1 \le j \le n} |\lambda_j - \lambda|$，则对所有 $j$，有 $|\lambda_j - \lambda| \ge \delta$
    
    因此
    $$
    \lVert Ax - \lambda x\rVert_2^2 \ge \delta^2 \sum_{j=1}^n |\alpha_j|^2 = \delta^2 \cdot 1 = \delta^2
    $$
    又已知 $\lVert Ax - \lambda x\rVert_2 < \epsilon$，则 $\delta < \epsilon$，即
    $$
    \min_{1 \le j \le n} |\lambda_j - \lambda| < \varepsilon
    $$
    存在某个特征值 $\lambda_j$ 使得 $|\lambda_j - \lambda| < \varepsilon$