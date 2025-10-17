# `<vector>` reference

一个 `vector` 的 reference

初始化方法

```c++
vector<int> vec;							// 定义存储 int 类型数据的向量
vector<int> vec(len, x);					// 定义长度为 len ，每个元素全部初始化为 x
vector<int> vec = {1,2,3};					// 字面量初始化
vector<int> vec(v1);						// 将 v1 复制给 vec
vector<int> vec(v1.begin(), v1.begin() + k);// 将 v[0] ~ v[k] 初始化赋值给vec
```

内置函数

```c++
// 迭代器可以理解为容器的更智能的指针
// 范围操作时，区间基本是左闭右开的
vec.push_back(VALUE);						// 尾插值 VALUE
vec.pop_back();								// 删除尾端元素
vec.clear();								// 清空vec
vec.erase(it);								// 删除it指向的元素，返回值是被移除元素的后一个元素的迭代器
vec.erase(it1, it2);						// 删除[it1, it2)之间的元素（左闭右开），返回值是被移除范围之后元素的迭代器
vec.insert(it, VALUE);						// 在it指向的元素之前插入VALUE，返回值是被插入元素的迭代器
vec.insert(it, n, VALUE);					// 在it指向的元素之前插入n个VALUE，返回值是被插入的首个元素的迭代器
vec.insert(it, it1, it2);					// 在it指向的元素之前插入[it1, it2)对应的元素，返回值同上
vec.at(idx)									// 相当于 vec[idx]，但是有越界检查，会 throw error（因此更慢）

vec.size();									// 返回vec长度（int）
vec.empty();								// 返回vec是否为空（bool）

vec.front();								// 返回vec首元素的引用
vec.back();									// 返回vec尾元素的引用

vec.begin();								// 指向vec首元素的迭代器
vec.end();									// 指向vec尾元素之后的迭代器
vec.rbegin();								// 指向vec尾元素的迭代器
vec.rend();									// 指向vec首元素之前的迭代器

// 在下面的例子中，++rit 表示反向前进一格，而不是正向前进
for (auto rit = vec.rbegin(); rit != vec.rend(); ++rit) cout << *rit << " ";
```

