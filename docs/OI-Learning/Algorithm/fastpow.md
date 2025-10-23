# 快速幂

快速幂分为递归式与非递归式，其核心递推式如下：

$$
a_n = \begin{cases}
1 & n = 0 \\\\
a^{\frac{n}{2}} \cdot a^{\frac{n}{2}} & n \bmod 2 = 0 \\\\
a \cdot a^{\frac{n-1}{2}} \cdot a^{\frac{n-1}{2}} & n \bmod 2 \neq 0
\end{cases}
$$


## 递归式快速幂（直白）

```c++
long long qpow(int a, int n)
{
	if (n == 0) return 1;				// 结束递归条件
	long long res = qpow(a, n / 2);
	if (n % 2)							// n为奇数
		return res * res * a;			// 指数减一后对半
	else								// n为偶数
		return res * res;				// 指数对半
}
```

## 非递归式快速幂（推荐）

```c++
long long qpow(int a, int n)
{
	long long res = 1;					// 设定初始值
    while (n > 0)
    {
        if(n % 2 == 1)					// if (n & 1)
        	res *= a;					// 取出一个底数相乘
        a *= a;							// 将a平方
        n /= 2;							// n >>= 1 指数对半（n是奇数时丢掉的余数在 res *= a 这里已经进行处理）
    }
    return res;
}
```

可以将高精度和快速幂结合在一起，实现大数的快速幂。

## 矩阵快速幂

进行快速幂计算的对象是矩阵，首先初始定义一个（`int`）矩阵：

```c++
struct Matrix{
	vector<vector<int>> mat;									// 矩阵
    int rows, cols;												// 行列数据
    
    // 构造函数，使得在创建Matrix的时候可以像STL容器一样指定行列
    // rows(rows), cols(cols) 是初始化列表，用于右侧的初始化（两个rows/cols实质不同）: mat(rows, vector<int>(cols))
	Matrix(int rows, int cols) : rows(rows), cols(cols), mat(rows, vector<int>(cols)) {}
    
    vector<int>& operator[](int index) {						// 重载[]运算符进行对矩阵元素的访问
        return mat[index];
    }
    
    // 如果定义了一个 const Matrix，必须要定义一个const版本的[]重载 （对*的重载就用到了const版本的[]重载）
    const vector<int>& operator[](int index) const {
        return mat[index];
    }
    
    void print() const {										// 打印矩阵操作
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                cout << mat[i][j] << " ";
            }
            cout << endl;
        }
    }
    
};

// 重载*运算符实现矩阵乘法运算
Matrix operator*(const Matrix& a, const Matrix& b) {
    Matrix result(a.rows, b.cols);
    // 这里忽略了行列合法性检查
    for (int i = 0; i < a.rows; i++) {
        for (int j = 0; j < b.cols; j++) {
            int sum = 0;
            for (int k = 0; k < a.cols; k++) {
                sum += a[i][k] * b[k][j];  			// 进行点积计算
            }
            result[i][j] = sum;
        }
    }
    return result;
}

// 使用例：
Matrix A(2,3);		// 定义一个 2 * 3 的矩阵；
Matrix B(3,2);
A[0][0] = 1; 		// 设定值
Matrix C = A * B;	// 矩阵乘法计算
C.print();			// 打印操作
```

然后采用非成员函数的方式定义 `pow()` 函数：

```c++
Matrix matrix_pow(Matrix base, long long exp) {
    
    if (base.rows != base.cols) {
        // error check
    }
    
    int n = base.rows;
    // 初始化单位矩阵
    Matrix result(n,n);
    for(int i = 0; i < n; i++) result[i][i] = 1;
    
    // 快速幂算法
    while (exp > 0) {
        if (exp & 1) {                     // 如果指数是奇数
            result = result * base;
        }
        base = base * base;  // 底数平方
        exp >>= 1;                         // 指数除以2
    }
    
    return result;
}
```

实现了矩阵快速幂

### 应用：计算斐波那契数列

!!! note "[斐波那契数列 - OI Wiki](https://oi-wiki.org/math/combinatorics/fibonacci/)"

学过线性代数之后不难计算，对于斐波那契数列 $F_n$ 有：

$$
\begin{aligned}\begin{pmatrix}F_n \\\\ F_{n-1}\end{pmatrix}=\begin{pmatrix}1 & 1 \\\\1 &0 \end{pmatrix}\begin{pmatrix}F_{n-1} \\\\ F_{n-2}\end{pmatrix},\ n\geq 3\end{aligned}
$$

进一步得到

$$
\begin{aligned}\begin{pmatrix}F_n \\\\ F_{n-1}\end{pmatrix}=\begin{pmatrix}1 & 1 \\\\1 & 0\end{pmatrix}^{n-1}
\begin{pmatrix}F_{1} \\\\ F_{0}\end{pmatrix},\ n\geq 3\end{aligned}
$$

对于 $\begin{pmatrix}1 & 1 \\\\1 & 0\end{pmatrix}^{n-1}$ 的计算，我们采用矩阵快速幂，然后进行一轮矩阵运算就可以得到单个 $F_n$ 的计算结果，时间复杂度 $O(\log n)$

```c++
// Luogu P1962 斐波那契数列
// 记得在矩阵乘法重载时 % MOD
void solve(){
    ll n; cin >> n; 
	if(n <= 1){
		cout << n; return;
    }
    
	Matrix A(2,2);
	A[0][0] = A[0][1] = A[1][0] = 1, A[1][1] = 0;
	A = matrix_pow(A, n-1);

	Matrix B(2,1);
	B[0][0] = 1; B[1][0] = 0;

	Matrix C = A * B;

	cout << C[0][0];
}
```

对于广义的斐波那契数列：$a_n = p \times a_{n-1} + q \times a_{n-2}$ 也有：
$$
\begin{aligned}\begin{pmatrix}a_n \\\\ a_{n-1}\end{pmatrix}=\begin{pmatrix}p & q \\\\1 &0 \end{pmatrix}\begin{pmatrix}a_{n-1} \\\\ a_{n-2}\end{pmatrix},\ n\geq 3\end{aligned}
$$
也有一道对应的 [P1349 广义斐波那契数列 - 洛谷](https://www.luogu.com.cn/problem/P1349) 

