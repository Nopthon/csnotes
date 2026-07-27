# 差分隐私

将个人的敏感信息通过算法得到一个输出，这个输出可能是敏感信息的某个平均值、方差等信息，表面上它不会泄露单个人的隐私信息

但是根据差分攻击的原理，我们可以根据输出结果基于单个个体的数据变化，尝试反推出单个数据

> 考虑一个 Query-Answering 系统（SQL as an
>
>  example），通过二分查找搜索出任意单个人的数据

一种经典的隐私保护尝试是 k-Anonymity，即：如果查询涉及到的人数少于 $k$ 人，则算法拒绝回答，它只回答更加泛化的汇总结果。然而差分攻击可以通过“两次查询的涉及人数只相差单个人”来还原出单个人的结果

另一种尝试是 Adversary Cannot Select Queries，即：不能进行对特定范围数据的主动查询，而只能拿到特定范围的统计结果（由算法给定的特定统计量）。然而攻击者依旧可以通过求解方程组的形式尝试推导个体解（即使数据存在一定的噪声，也可以通过最小二乘法等给出最小化误差）

---

如何衡量一个模型是否泄露了隐私？我们通过对比实验 Relative Measure 量化隐私泄露风险：对输出结果计算一个隐私违规分数 $S$，并比较新的数据被加入前后，$S$ 的数值是否有大的变化

> 显然，如果变化较大，则说明有更大的可能推断出新的数据

而差分隐私的要求就是：新的数据被加入前后，$S$ 的数值必须几乎相同。具体的，我们有这样的要求：算法必须是随机化的（引入噪声）；输出结果的概率分布必须几乎相同（难以区分）

## Pure-DP

我们用这个数学公式来衡量上面提到的量化隐私违反（在离散情境下）

$$
\Pr[\mathcal{M}(X) = o] \leq e^\varepsilon \cdot \Pr[\mathcal{M}(X') = o]
$$

对于随机化算法 $\mathcal{M}$，给定相邻数据集 $X, X'$（增加数据前、后），对于任意可能的输出结果 $o$，计算出算法对两个数据集下，输出恰好为 $o$ 的概率，得到的比值不能超过 $e^{\varepsilon}$

其中 $\varepsilon$ 是隐私预算，如果一个随机算法满足上述内容，则这个算法是 $ε$-差分隐私的，进一步说，它是 Pure-DP

> 我们记 $X \asymp X'$ 为一对相邻数据集
>
> 相邻数据集指仅增删改了单条数据，以上我们记 $X'$ 为增加 / 修改后的

我们记下式为 Privacy loss

$$
L(o) = \ln \left( \frac{\Pr[\mathcal{M}(X) = o]}{\Pr[\mathcal{M}(X') = o]} \right)
$$

因此 Pure-DP 的等价写法为

$$
\forall o, \quad |L(o)| \leq \varepsilon
$$

在具体行为上，差分隐私的基本操作是：

$$
X = (x_1, \dots, x_n) \xrightarrow{\text{Analyzer}} g(X) + \text{Random Noise}
$$

输入通过分析器给出真实的查询结果，并给出精心计算的随机噪声

## Approximate-DP

近似 DP 将上述量化隐私违反的约束进行放宽

$$
\Pr[\mathcal{M}(X) = o] \leq e^\varepsilon \cdot \Pr[\mathcal{M}(X') = o] + \delta
$$

添加了 $\delta$ 的容错，这在有些时候是必要的，比如之后使用高斯噪声时，因为高斯分布的尾端延伸到无限远，产生很离谱的噪声值是不无可能的

## Discrete Laplace Mechanism

常见的差分隐私的核心逻辑在于：先计算查询函数的敏感度（单条记录能造成的最大影响），然后根据敏感度和隐私预算决定添加多少随机整数噪声，最后输出加噪后的结果

对于离散拉普拉斯机制，我们加入的 Random Noise 为离散拉普拉斯噪声

我们定义 $g$ 的全局灵敏度为

$$
\Delta (g) = \max_{X\sim X'} |g(X) - g(X')|
$$

它表示更改输入数据集中的单条记录（对应一对相邻数据集），函数输出结果最多能改变多少

离散拉普拉斯分布为

$$
\text{Pr}[i=\text{DLap}(b)] ∝ e^{-|i|/b}
$$

其中 $b=Δ(g)/\varepsilon$

我们定义上述随机噪声为 $\text{DLap}(b)$，就得到了离散拉普拉斯噪声

---

当我们需要输出的结果是一个向量时，我们给出多维拉普拉斯机制

我们定义 $g$ 的 k-灵敏度为（使用向量范数）

$$
\Delta (g) = \max_{X\sim X'} \|g(X) - g(X')\|_{p}
$$

则分析器的输出为

$$
g(X) + \text{DLap}(\Delta(g)/\varepsilon)^{\otimes d}
$$

> 这里的 $⊗d$ 表示在 $d$ 个维度上独立地添加离散拉普拉斯噪声

我们可以证明多维拉普拉斯机制满足 $\epsilon$-灵敏度，即 $|L(o)| \leq \varepsilon$

这里以使用 L1 向量范数的 L1 灵敏度为例

$$
\begin{align*}
\mathcal{L}_{M,X,X'}(o) &= \ln \left( \frac{\Pr[\mathcal{M}(X) = o]}{\Pr[\mathcal{M}(X') = o]} \right) \\
&= \ln \left( \frac{\prod_{i=1}^{d} \exp\left( - \frac{|o_i - g(X)_i|}{b} \right)}{\prod_{i=1}^{d} \exp\left( - \frac{|o_i - g(X')_i|}{b} \right)} \right) \\
&= \sum_{i=1}^{d} \frac{|o_i - g(X')_i| - |o_i - g(X)_i|}{b} \\
&\le \sum_{i=1}^{d} \frac{|g(X)_i - g(X')_i|}{b} \quad \text{(By Triangle Inequality)} \\
&= \frac{||g(X) - g(X')||_1}{b} \\
&\le \frac{\Delta_1(g)}{b} \quad \text{(By definition of L1-sensitivity)} \\
&= \frac{\Delta_1(g)}{\frac{\Delta_1(g)}{\epsilon}} \\
&= \epsilon
\end{align*}
$$

## Gaussian Mechanism

类似的，我们将离散拉普拉斯噪声修改为均值为 $0$，方差为 $\sigma^2$ 的高斯噪声

$$
\sigma = \frac{2\sqrt{2\ln(2/\delta)}}{\epsilon} \cdot \Delta_2(g) \\
\text{Random Noise} = \mathcal{N}(0,σ^2)
$$

> 其中 $\Delta_2$ 表示使用 L2 向量范数

可以证明它是近似 DP，证明略

## Post-Processing

差分隐私的一大性质在于：如果某一机制 $\mathcal{M}$ 满足近似 DP，那么这一机制再经过任意函数 $h$ 的处理，结果依旧满足近似 DP

也即：对输出结果进行任意的计算变换，结果始终是抗差分攻击的

$$
\text{Pr}[h(M(X)) \in S] \le e^\epsilon \cdot \text{Pr}[h(M(X')) \in S] + \delta
$$

<br>

后面讲了什么都没听了
