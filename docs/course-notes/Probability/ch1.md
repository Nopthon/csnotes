# 第一章 随机事件与概率

## De Morgan 律推广

$$
\overline{A_1 \cup A_2 \cup \cdots \cup A_n} = \overline{A_1} \cap \overline{A_2} \cap \cdots \cap \overline{A_n} \\\\{}\\\\
\overline{A_1 \cap A_2 \cap \cdots \cap A_n} = \overline{A_1} \cup \overline{A_2} \cup \cdots \cup \overline{A_n}
$$

<br>

## 事件的概率及性质

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

## 古典概型常见模型

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

## 条件概率

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

## 独立性

- $A,\;B$ 两事件相互独立当且仅当 $P(AB)=P(A)P(B)$，或者说 $P(A|B) = P(A)$ 

- 对于事件组 $\{A_i\}$ ：如果任取其中若干个事件，都满足 $\displaystyle P\left(\bigcap_{i=1}^{n} A_i\right) = \prod_{i=1}^{n} P\left( A_i\right)$

也就是满足总共 $2^n - n - 1$ 个条件

$$
\begin{cases}P\left(A_{i}A_{j}\right)=P\left(A_{i}\right)P\left(A_{j}\right),&1\leqslant i<j\leqslant n\\\\P\left(A_{i}A_{j}A_{k}\right)=P\left(A_{i}\right)P\left(A_{j}\right)P\left(A_{k}\right),&1\leqslant i<j<k\leqslant n\\\\\cdots\cdots\\\\P\left(A_{i_{1}}A_{i_{2}}\cdots A_{i_{m}}\right)=P\left(A_{i_{1}}\right)P\left(A_{i_{2}}\right)\cdots P\left(A_{i_{m}}\right),&1\leqslant i_{1}<i_{2}<\cdots<i_{m}\leqslant n\\\\\cdots\cdots\\\\P\left(A_{1}A_{2}\cdots A_{n}\right)=P\left(A_{1}\right)P\left(A_{2}\right)\cdots P\left(A_{n}\right)\end{cases}
$$

则这 $n$ 个事件相互独立

- 如果 $\{A_i\}$ 之间相互独立，那么将 $n$ 个事件划分为 $k$ 组，每组内进行任意事件运算，得到的新的 $k$ 个事件也互相独立

<br>

## 伯努利实验与泊松分布

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
