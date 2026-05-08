# Lecture 6: 算子范数，条件数和迭代法

## 矩阵范数

矩阵范数有两种常见的定义（详见《机器学习导论》）

### 算子范数

把矩阵当做一个变换

???+ success "Definition：矩阵算子范数（Matrix Operator Norm）"

    给定矩阵 $A\in \mathbb{R}^{m \times n}$，记矩阵算子范数为 $\lVert \cdot \rVert_{\text{op}, p}$，有：
    
    $$
    \lVert A \rVert_{\text{op}, p} \triangleq \max \left \lbrace \frac{ \lVert A \mathbf{x} \rVert_p}{\lVert \mathbf{x}\rVert_{p}}  \mathbf{x} \in \mathbb{R}^d, \mathbf{x} \neq 0 \right \rbrace
    $$

矩阵算子范数衡量矩阵对向量的最大化放大能力（最坏情况下，$A$ 能把一个单位向量拉长多少倍），比如：

- 列和范数：$\displaystyle \lVert A \rVert_{\text{op}, 1} = \max_{j \in [n]} \sum_{i=1}^{m} |A_{ij}|$
- 行和范数：$\displaystyle \lVert A \rVert_{\text{op}, \infty} = \max_{i \in [m]} \sum_{i=1}^{n} |A_{ij}|$
- 谱范数：$\displaystyle \lVert A \rVert_{\text{op}, 2} = \sqrt{\lambda_{\max} (A^{T}A)} = \max_{i \in [r]}|\sigma_{i}|$，其中 $\sigma_{i}$ 是 $A$ 从大到小第 $i$ 个奇异值，$r$ 是 $A$ 的秩
    - 特别的，对于列向量 $v\in \R^{m}$，其谱范数的定义退化为向量的欧几里得范数，定义为各个分量平方的和
    - $\lVert v \rVert_{2}^{2} = \sum_{i=1}^{m} v_i^{2}$


算子范数具有一个基于定义的性质：

- $\forall x \ne 0,\lVert A \rVert \geq \dfrac{\lVert Ax \rVert}{\lVert x \rVert}$
- 可以得到更常见的写法：$\lVert Ax \rVert \leq \lVert A \rVert \cdot \lVert x \rVert$

### 分量范数

把矩阵当做一个长向量，其定义基于向量范数

???+ success "Definition：矩阵分量范数（Matrix Entrywise Norm）"

    给定矩阵 $A\in \mathbb{R}^{m \times n}$，记矩阵分量范数为 $\lVert \cdot \rVert_{\text{en}, p}$，有：
    
    $$
    \lVert A \rVert_{\text{en}, p} \triangleq \left( \sum_{i=1}^{m} \sum_{j=1}^{n} |A_{ij}^{p}|\right)^{1/p}
    $$

矩阵分量范数衡量矩阵本身的“大小”，比如：

- $\displaystyle \lVert A \rVert_{\text{en}, 1} = \sum_{i=1}^{m} \sum_{j=1}^{n} |A_{ij}|$
- $\displaystyle \lVert A \rVert_{\text{en}, \infty} = \max_{i \in [m]} \max_{j \in [n]}  |A_{ij}|$
- $\displaystyle \lVert A \rVert_{\text{en}, 2} = \sqrt{\sum_{i=1}^{m} \sum_{j=1}^{n} A_{ij}^{2}}$，又记为 Frobenius 范数 $\lVert A \rVert_{F}$

### 矩阵范数与奇异值

对于常见的两种范数：Frobenius 范数与谱范数，我们有

$$
\lVert A \rVert_F = \sqrt{\sum_{i=1}^{m} \sum_{j=1}^{n} |a_{ij}|^2} = \sqrt{\sigma_1^2 + \sigma_2^2 + \dots + \sigma_r^2}
\newline
\lVert A \rVert_2 = \max_{\mathbf{x} \neq \mathbf{0}} \frac{\|A\mathbf{x}\|_2}{\|\mathbf{x}\|_2} = \sigma_{\max}(A)
$$

??? question "证明"

    我们记 $A^{\ast}$ 为 $A$ 的共轭转置
    
    - Frobenius 范数
    
    由定义，
    
    $$
    \lVert A \rVert_F^2 = \sum_{i,j} |a_{ij}|^2 = \text{tr}(A^{\ast} A)
    $$
    
    对 A 作奇异值分解 $A = U \Sigma V^{\ast}$，代入得
    
    $$
    A^{\ast} A = V \Sigma^{\ast} \Sigma V^{\ast}, \quad \text{tr}(A^{\ast} A) = \text{tr}(\Sigma^{\ast} \Sigma) = \sum_{i=1}^r \sigma_i^2
    $$

    所以
    
    $$
    \lVert A \rVert_F = \sqrt{\sigma_1^2 + \cdots + \sigma_r^2}
    $$
    
    - 谱范数
    
    由定义，
    
    $$
    \lVert A \rVert_2 = \max_{\mathbf{x} \neq \mathbf{0}} \frac{\|A\mathbf{x}\|_2}{\|\mathbf{x}\|_2}
    $$
    
    任取 $\mathbf{x}$，用右奇异向量基展开 $\mathbf{x} = \sum c_i \mathbf{v}_i$，则
    
    $$
    \|A\mathbf{x}\|_2^2 = \sum \sigma_i^2 c_i^2 \leq \sigma_{\max}^2 \sum c_i^2 = \sigma_{\max}^2 \|\mathbf{x}\|_2^2
    $$
    
    因此
    
    $$
    \frac{\|A\mathbf{x}\|_2}{\|\mathbf{x}\|_2} \leq \sigma_{\max}
    $$

    取 $\mathbf{x} = \mathbf{v}_1$（最大奇异值对应的右奇异向量），则等号成立，故
    
    $$
    \lVert A \rVert_2 = \sigma_{\max}(A)
    $$

## 条件数

我们在 Lecture 1 时讨论过浮点数误差：

??? abstract "回顾"

    将单变量理想输入 $x$ 的某个浮点数问题记为 $f(x)$，由于绝对浮点误差 $\Delta x$ 实际被计算的值为 $f(x+\Delta x)$
    
    ??? success "中值定理"
    
        $$f\in C^1[x, x+\Delta x], \quad\exists ξ \in (x, x+\Delta x),\newline
        f(x + \Delta x) - f(x) = \Delta x \cdot f'(ξ)$$
    
    计算误差 $f(x+\Delta x) - f(x) \approx \Delta x f'(x)$，对应绝对误差 $\Delta x$ 的放大比例近似为 $f'(x)$
    
    此外，定义相对误差 $\dfrac{\Delta x}{x}$，相对误差的放大比例 $κ = \dfrac{xf'(x)}{f(x)}$，称之为**条件数**。条件数 $\kappa$ 描述了数值问题 $f$ 对输入误差的敏感程度。当 $\kappa$ 非常大时，称 $f$ 是病态的；当 $\kappa$ 接近 1 时，称 $f$ 是良态的。条件数 $\kappa$ 是数值问题本身的属性，与算法实现基本无关
    
    > 例如 $f(x) = ax$ 的条件数 $\kappa = 1$，相对误差在问题前后不变；$f(x) = x-c$ 的条件数 $\kappa = \dfrac{x}{x-c}$，相对误差在 $x\approx c$ 时变化巨大
    
    如果将单变量函数拓展到线性方程组，可以提出基于矩阵范数的条件数定义

假设我们要求 $Ax=b$ 的解，其中 $A$ 可逆。在数值计算中，输入数据（$A,b$ 等）会产生误差，我们需要判断，这个较小的误差会不会导致 $x$ 的解出现大的误差


我们定义矩阵 $A$ 的条件数：

$$
\text{cond}(A) = \lVert A \rVert \cdot \lVert A^{-1} \rVert
$$

这里我们使用**算子范数**，$\lVert A \rVert$ 衡量矩阵对向量的最大放大能力，$\lVert A^{-1} \rVert$ 衡量矩阵对向量的最大缩小能力。条件数越大，矩阵越病态（ill-conditioned），意味着小的输入误差会导致大的输出误差

条件数最小为 $1$，对应正交矩阵

???+ question "条件数的定义"

    假设 $b$ 的数值存在误差，变成了 $b+e$，则 $x = A^{-1}b$ 变成 $x = A^{-1} (b+e)$

    条件数的原始定义是相对误差的放大比例，即
    
    $$
    \text{cond} (A) = \dfrac{x \text{ 的相对误差}}{b \text{ 的相对误差}}
    $$
    
    代入
    
    $$
    \begin{aligned}
    \mathrm{cond}(A) 
    &= \max_{e, b \neq 0} \frac{\|A^{-1} e\| / \|A^{-1} b\|}{\lVert e \rVert / \lVert b \rVert} 
    = \max_{e, b \neq 0} \frac{\|A^{-1} e\|}{\lVert e \rVert} \cdot \frac{\lVert b \rVert}{\|A^{-1} b\|} \newline
    &= \max_{e \neq 0} \frac{\|A^{-1} e\|}{\lVert e \rVert} \cdot \max_{b \neq 0} \frac{\lVert b \rVert}{\|A^{-1} b\|} 
    = \max_{e \neq 0} \frac{\|A^{-1} e\|}{\lVert e \rVert} \cdot \max_{x \neq 0} \frac{\|A x\|}{\|x\|}
    \end{aligned}
    $$
    
    代入算子范数的定义，则 $\text{cond}(A) = \lVert A \rVert \cdot \lVert A^{-1} \rVert$

条件数有一个性质

- $\text{cond}(c\cdot A) = \text{cond}(A)$

可以由定义直接得到。这个性质的意义是：整体缩放矩阵不改变条件数

## 线性迭代方法


线性迭代方法的核心是将解方程组的问题转化为寻找一个映射的不动点问题

在根求解问题问题中，我们构造过迭代式。对于线性方程组的计算，我们也有类似的写法：

$$
A\mathbf{x}=\mathbf{b} \to \mathbf{x} = T\mathbf{x} + \mathbf{c}
$$


因此 $\mathbf{x}_{k+1} = T\mathbf{x}_{k} + \mathbf{c}$ 就是一个迭代式。如果迭代收敛，满足 $\mathbf{x}_{\ast} = T\mathbf{x}_{\ast} + \mathbf{c}$ 的解就是一个不动点

### Jacobi 迭代法

将矩阵 $A$ 拆解为

$$
A = L+D+U
$$

其中 $D$ 是对角矩阵，$L,U$ 是严格下 / 上三角矩阵

因此我们有

$$
\mathbf{x} = D^{-1} (\mathbf{b} - (L+U) \mathbf{x})
$$

得到迭代式（前提是 $a_{ii} \ne 0$）

$$
\mathbf{x}_{k+1} = D^{-1} (\mathbf{b} - (L+U) \mathbf{x}_{k})
$$

即：

$$
x_{i}^{(k+1)} = \dfrac{1}{a_{ii}} \left( b_{i} - \sum_{j\ne i} a_{ij} x_{j}^{(k)} \right)
$$

> 把线性方程组的第 $i$ 行方程：
>
> $$
> a_{i1}x_1 + \dots + a_{ii}x_i + \dots + a_{in}x_n = b_i
> $$
> 
> 进行移项，就是上面的结果
>
> 因此 Jacobi 迭代法的对于每一个 $x_{i}^{(k+1)}$，都用全部的 $\mathbf{x}^{(k)}$ 去迭代计算

### Gauss-Seidel

回顾 Jacobi 迭代法（将 $i\ne j$ 的范围拆成两个部分）

$$
x_i^{(k+1)} =
\frac{1}{a_{ii}}\Bigl(b_i - \sum_{j < i} a_{ij} {x_j^{(k)}} - \sum_{j > i} a_{ij} {x_j^{(k)}}\Bigr)
$$

注意到，Jacobi 迭代法的对于每一个 $x_{i}^{(k+1)}$，都只用上一轮的全部的 $\mathbf{x}^{(k)}$ 去迭代计算。事实上，当计算第 $k+1$ 轮迭代的 $x_{i}^{(k+1)}$，其中 $i$ 较大时，对应 $i$ 更小的迭代结果已经算出来了（也就是 $\displaystyle \sum_{j < i} a_{ij} {x_j^{(k)}}$ 的部分）

如果能直接用本轮已经迭代的值代替上一轮已经迭代的值，则迭代效率会有很大的提升

这就是 Gauss-Seidel 的改进之处：

$$
x_i^{(k+1)} =
\frac{1}{a_{ii}} \left( b_i - \sum_{j < i} a_{ij} x_j^{\textcolor{orange}{(k+1)}} - \sum_{j > i} a_{ij} x_j^{(k)} \right)
$$

对应的迭代式中，$\mathbf{x}_{k}$ 只与 $U$ 左乘

$$
\mathbf{x}_{k+1} = (D+L)^{-1} (\mathbf{b} - U \mathbf{x}_{k})
$$

Gauss-Seidel 迭代法有一个非常良好的定理：


???+ success "定理"

    如果 $A \in \mathbb{R}^{n \times n}$ 是严格对角占优的，那么
    
    1. $A$ 是可逆的（非奇异）
    2. 对任意右端向量 $\mathbf{b}$ 和任意初始猜测 $\mathbf{x}^{(0)}$，解 $A\mathbf{x} = \mathbf{b}$ 的 Gauss–Seidel 迭代都收敛到唯一解
    
    其中严格对角占优指每行的对角线元素在绝对值上严格大于该行其余所有元素绝对值之和
        
    $$
    |a_{ii}| > \sum_{j \neq i} |a_{ij}|, \quad \forall i = 1, 2, \dots, n
    $$

    ??? question "证明"
    
        对于第一个性质，证明采用反证法，假设存在 $\mathbf{x} \ne \mathbf{0}$ 使 $A\mathbf{x} = \mathbf{0}$
    
        考虑 $|x_{k}|$ 为 $\mathbf{x}$ 中绝对值最大的分量，第 $k$ 个方程满足
        
        $$
        a_{kk}x_{k} = - \sum_{j\ne k} a_{kj}x_{j}
        $$
        
        取绝对值，放缩
        
        $$
        |a_{kk}| \cdot |x_k| = \left| \sum_{j \neq k} a_{kj} x_j \right|
        \le \sum_{j \neq k} |a_{kj}| \cdot |x_j|
        \le \sum_{j \neq k} |a_{kj}| \cdot |x_k|
        $$
        
        约去 $|x_{k}|$ 发现 $|a_{kk}| \le \sum_{j \neq k} |a_{kj}|$，产生矛盾
    
        ---

        对于第二个性质，需要借助之后的谱半径分析

## 线性迭代的收敛性


我们已知不动点满足（$A$ 不是原系数矩阵，而是迭代矩阵）

$$
\mathbf{x}_{\ast} = A \mathbf{x}_{\ast} + \mathbf{b}
$$

我们令计算误差项 $e_{k} = x_{k} - x^{\ast}$，则递归下的误差传播为

$$
e_{k} = A^{k} (x_{0} - x^{\ast})
$$

以上，我们给出一个对于任意初始值 $x_{0}$，迭代都收敛的充分必要条件

$$
k\to \infty \text{ 时 }, A^{k} \to \mathbf{0}
$$

> 当然，即使这个条件不满足，如果我们选取好的 $x_{0}$，也有可能实现收敛

---

如何判断矩阵幂 $A^{k}$ 是否趋于 0？我们定义谱半径为矩阵所有特征值的模的最大值

$$
\rho(A) := \max \lbrace |\lambda_{1}|, \cdots, |\lambda_{n}| \rbrace
$$

并指出，$\displaystyle \lim_{k \to \infty} A^k = 0$ 的充分必要条件是 $\rho(A) < 1$

> 如果 $A$ 可以对角化，则 $A = P \Lambda P^{-1}$，$A^k = P \Lambda^k P^{-1}$。当且仅当对角阵 $\Lambda$ 上的每个特征值的 $k$ 次幂趋于 0（即 $|\lambda_i| < 1$）时，$A^k$ 趋于 0
>
> 如果 $A$ 不能对角化，则用 Jordan 标准型推广，或者利用可对角化矩阵的稠密性论证，此处略

### Jacobi / Gauss-Seidel 的收敛性

我们只以 Jacobi 为例进行分析，迭代式

$$
\mathbf{x}_{k+1} = D^{-1} (\mathbf{b} - (L+U) \mathbf{x}_{k})
$$

因此 $A = -D^{-1}(L+U)$，收敛的充要条件是 $\rho (-D^{-1}(L+U)) < 1$

我们很难求出等价地充要条件，但是好消息是，我们可以给出一个充分条件：


> **对角占优保证收敛**

??? question "证明：若原矩阵严格对角占优，则 Jacobi 迭代的谱半径小于1"


    设 $\lambda$ 为 $A = -D^{-1}(L+U)$ 的特征值，$v$ 为对应的特征向量，并令 $\lVert v \rVert_{\infty} = 1$
    
    取最大分量位置满足 $\lVert v_{m} \rVert = 1$，取对应的线性方程组 $(L+U)v = \lambda Dv$ 的分量
    
    $$
    \sum_{j \neq m} a_{mj} v_j = \lambda a_{mm} v_m = \lambda a_{mm}
    $$
    
    左边取绝对值：
    
    $$
    \left|\sum_{j \neq m} a_{mj} v_j\right| \leq \sum_{j \neq m} |a_{mj}| \cdot |v_j| \leq \sum_{j \neq m} |a_{mj}|
    $$
    
    根据严格对角占优：
    
    $$
    \sum_{j \neq m} |a_{mj}| < |a_{mm}|
    $$
    
    所以 $|\lambda a_{mm}| < |a_{mm}|$，即 $|\lambda| < 1$ 对任意特征值都满足，故 $\rho < 1$

对于 Gauss-Seidel 的收敛性，性质完全相同，此处略
