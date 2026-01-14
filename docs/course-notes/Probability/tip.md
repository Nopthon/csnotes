# 概率论 Tips

一些解题的方法和“二级结论”，更适合高中生体质

（鸽了）

- 连续型随机变量的分布函数的分布函数满足均匀分布 $U(0,1)$ 

记连续型随机变量 $X$ 分布函数为 $F_X(x)$，$Y =F_X(X)$，已知 $F_X(x)$ 是一个在 $(0,1)$ 上严格单调递增的连续函数，一定存在反函数 $F_X^{-1}$ 

$F_Y(y) = P(F_X(X) \leqslant y) = P(X \leqslant F_X^{-1}(y)) = F_X(F_X^{-1}(y)) = y$ 

因此
$$
F_Y(y) = 
\begin{cases}
0, & y \leqslant 0 \\
y, & 0 < y \leqslant 1 \\
1, & y > 1
\end{cases}
$$
