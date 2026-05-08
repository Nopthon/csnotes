# Ch1. Introduction

## Pseudo-Code

Take "Euclidean algorithm" as an example (calculate GCD of two non‑negative integers):

```pseudocode title="Pseudo code"
Algorithm: Euclidean(a, b)
Input: two non‑negative integers a, b (not both zero)
Output: GCD of a and b

while b > 0 do
	(a, b) ← (b, a mod b)
return a
```

To make comparision, here are C++ && Python version:

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

Usually, we need an algorithm header (contains algo-name, inpiut, output), along with simple procedures (not in C++ coding-style, <u>more like Python coding-style</u>).

> Usually we use "←" as assignment operator, and "=" or ":=" use less.

Here gives another example (Insertion-sort, algorithm header omitted):

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

We define the size of input as `n`.

- If the input is one array, the num of integers is `n`.
- If "shortest-path problem" in a graph, the num of edges in graph is `n`.
- ...

<u>Different input can lead to vast difference in running time.</u>

- For insertion-sort, if input array is already sorted in ascending order, then algorithm runs much faster than when it is sorted in descending order.

We should consider <u>worst-case analysis</u>, which stands for the effeciency of algorithm.

### Asymptotic Analysis

Asymptotic Analysis (渐进分析) focus on growth of running-time as a function, not any particular value (programming language, computer speed, ...).

???+ success "Definition: Asymptotically Positive Function (渐近正函数)"

    $f : \mathbb{N}\to \R$, if:
    
    $$
    \exists n_{0} > 0, \forall n > n_{0}, f(n) > 0
    $$
    
    then we call $f$ an asymptotically positive function, which means this function is always positive when n is big enough.

**We only consider asymptotically positive functions in definitions of asymptotic notations.**

---

Informally, give an asymptotically positive function $g(n)$ ,we ignore <u>lower-order terms</u> && <u>leading constants</u>, to get a **O-notation** result.

> When $n$ is big enough, both lower-order terms and leading constants make little contribution to the running time.

???+ example "Example"

    $g(n) = 3n^{3} + 2n^{2} + n + 1 \in O(n^{3})$

We use the following conventions:

- Use "$f(n) = O(g(n))$" to denote "$f(n) \in O(g(n))$"
- Use "$O(g(n)) = O(g'(n))$" to denote "$O(g(n)) \in O(g'(n))$"
- Do not use "$O(g(n)) = f(n)$", as "=" is asymmetric
    - $3n^{2} + 2n = O(3n^{2} + 2n) = O(n^{2})$
    - You cannot reverse the order ("=" implies the order)

---

Formally, we have three important asymptotic notations

| Notation | Name                         | **Comparison Relations** | Formal Definition                                            |
| :------- | :--------------------------- | :----------------------- | :----------------------------------------------------------- |
| $O$      | Big-O<br />(upper bound)     | $\le$                    | $\exists c, n_0 > 0, \forall n \ge n_0 \newline 0 \le f(n) \le c \cdot g(n)$ |
| $\Omega$ | Big-Omega<br />(lower bound) | $\ge$                    | $\exists c, n_0 > 0, \forall n \ge n_0:  \newline 0 \le c \cdot g(n) \le f(n)$ |
| $\Theta$ | Theta<br />(tight bound)     | $=$                      | $\exists c_1, c_2, n_0 > 0, \forall n \ge n_0:  \newline c_1 g(n) \le f(n) \le c_2 g(n)$ |
| $o$      | Little-O                     | $<$                      | $\exists n_0 > 0, \forall n \ge n_0 , c > 0:\newline 0 \le f(n) \le c \cdot g(n)$ |
| $\omega$ | Little-Omega                 | $>$                      | $\exists, n_0 > 0, \forall n \ge n_0, c > 0:  \newline 0 \le c \cdot g(n) \le f(n)$ |

> Little-O / Little-Omega is more strict than its Big-version.
>
> **Little-notation use $\forall c > 0$, while Big-notation use $\exists c > 0$**

As you can see, for a given function, all of its asymptotic notation representations are **not unique**, but the **best practice** is to choose the **<u>simplest and tightest</u>** representation.

And we have:

$$
f(n) = \Theta(g(n)) \quad \text{iff} \quad f(n) = O(g(n)) \ \text{and} \ f(n) = \Omega(g(n))
$$

---

Sometimes, we use two/more parameters to specify input size.

- Example: for a graph, n = number of vertices, m = number of edges.

Unlike single-variable O-notation, there is no widely accepted formal definition of multi-variable O-notation.

$$
\lbrace f(n,m) : ∃c,n_0,m_0 > 0, \text{such that } 0 ≤f(n,m) ≤ cg(n,m),∀n ≥ n_0 {\color{red}{\text{ or }}} m ≥ m_0 \rbrace
$$

There are pathological cases, where using "or" or "and" matters. However, most of the time in this course, it does not matter.

### Common Running Time

Sort the functions from smallest to largest asymptotically:

$$
\log n, n, \lbrace n \log n, \log(n!) \rbrace, n^2, 2^{n}, e^{n}, n!, n^{n}
$$

We can notice an interesting relationship between $n \log n$ and $\Theta(\log (n!))$:

???+ question "Prove: $n \log n = \Theta(\log (n!))$"

    (If we don't use Stirling Formula)
    
    **Upper bound estimate**
    
    Trivially $n! = n\cdot (n-1) \cdots 1 \leq n\cdot n \cdots n = n^{n}$
    
    So $n \log n = \log n^{n} \geq \log (n!)$
    
    **Lower bound estimate**
    
    Scale the original expression (using n/2 term):
    
    $$
    \log (n!) = \sum_{k=1}^{n} \log k \geq \sum_{k=\lceil n/2 \rceil}^{n} \log k \geq (n - \lceil \dfrac{n}{2} + 1 \rceil ) (\log n - \log 2)
    $$
    
    
    i.e.
    
    $$
    \log (n!) \geq \dfrac{n}{2} (\log n - \log 2)
    $$
    
    (Consider the right half of the integers. For each term, use the smallest value
    $log(n/2)$ as the height of a rectangle. This rectangle lies entirely under the curve. That's how we scale it.)
    
    Trivially $\dfrac{n}{2} (\log n - \log 2) \geq \dfrac{1}{4} n \log n$ for all $n \geq 4$ (equal when $n = 4$)
    
    So for all $n \geq 4$, $\log (n!) \geq c \cdot n \log n$, where $c = \dfrac{1}{4}$
    
    
    Therefore, for all $n \ge 4$, we have
    
    $$
    \frac{1}{4} \, n \log n \;\le\; \log (n!) \;\le\; n \log n,
    $$
    
    which proves $n \log n = \Theta(\log (n!))$.
    
    Q.E.D.
