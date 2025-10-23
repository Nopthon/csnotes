# 哈希表

一种理想情况下能够实现 $O(1)$ 复杂度的键 -> 值搜索的数据结构

简单来说（不考虑哈希冲突）就是实现这样的过程：$key -> array[f(key)] -> value$，其中第一步是哈希函数的实现，用来将 key 映射到内存中的对应位置，然后 $O(1)$ 取 $value$

## 哈希函数

最简单的 hash 函数：对于任意的 $key$ 为正整数，哈希函数 $f(key) =key$，索引 $a[f(key)] = value$，这其实就是一个普通数组

假设键值是非常大的整数，直接对 $array$ 取大下标不可取，此时选择一个较大质数 $N$，哈希函数 $f(key) = key \bmod N$ 

为了实现对任意的数据类型都能达到像普通数组一样的效果，需要将不同类型的 $key$ 通过哈希函数映射到内存对应位置（也就是 $array[f(key)]$）

比如 $key$ 为字符串 $s$，我们有若干种哈希函数的构造方案：

1 -  $f(key) =(𝑠_0 ⋅127^0 +𝑠_1 ⋅127^1 +𝑠_2 ⋅127^2 +⋯ +𝑠_𝑛 ⋅127^𝑛) \bmod 2^{64}$ 

2 - 先对单个字符进行映射，每个字符映射到一个不同的小质数：$g[char] = N_{char}$

​	$f(key) = (s_0 \cdot N_0 \cdot s_1 \cdot N_1 \cdot s_2 \cdot N_2 \cdot \cdots \cdot s_n \cdot N_n) \bmod 2^{64}$ 

## 哈希冲突

因为哈希函数通常是压缩实现，不同的 $key$ 有可能映射到相同的 $f(key)$ 

比如 $f(key) = (s_0 \cdot N_0 \cdot s_1 \cdot N_1 \cdot s_2 \cdot N_2 \cdot \cdots \cdot s_n \cdot N_n) \bmod 2^{64}$ 的字符串哈希函数，容易发现函数对同一组异位词（比如 listen 与 silent）都返回相同的哈希值，此时会出现哈希冲突

这里考虑<u>**拉链法**</u>：$array[f(key)]$ 不存储单个值，而是存储 $[key, value, next]$ 链表，在构造哈希表时，对于相同的哈希值采用插入链表节点的方式储存值（注意键和值都要插入），在搜索时，遇到哈希冲突的情况就可以在链表中遍历搜索（埋下伏笔）

（也就是说，拉链法的哈希桶存储的是链表指针，而不是 $value$）

## STL `unordered_map` 库

`unordered_map` 是哈希表的实现，相对于 `map`，其不保证元素有序，但是理想查询速度为 $O(1)$ 

在应对哈希冲突的时候采用拉链法：

```c++
// 创建
unordered_map<A, B> hashmap;	// A,B 是两种数据类型

// 插入
// 重复插入不会覆盖先前的值
hashmap.insert({A,B});
hashmap[A] = B;
hashmap.insert(make_pair(A,B));

// 删除
hashmap.erase(A);

// 查找
int val = hashmap[A];	// 如果 A 从未插入，会自动创建 {A,0} 的键值对
// 更安全的查找
auto it = hashmap.find(A);
if(it != hashmap.end()) int val = it->second;

// 遍历
// 类似于 vector，这里采用 range 写法
// 也可以结构化绑定
for (const auto& pair : hashmap) {
    cout << pair.first << "->" << pair.second << endl;
}
```

`unordered_map` 的缺点在于其常数因子高（建立哈希表开销），某些情况下效率不如 `map`

## 哈希爆破

注意到对于一个哈希函数，如果人为构造一系列哈希冲突，就会在哈希表的同一个点生成一条很长的链表，在链表上的查询最坏退化到 $O(n)$ 

`[某一个哈希值] -> key1 -> key2 -> key3 -> ... -> keyBIG` 

!!! tip "[这个很著名的 blog](https://codeforces.com/blog/entry/62393) 解释了为什么不要直接使用 `unordered` 容器"

一种好的解决方法是：如果数据不是很大，使用 `<map>`，用法和 `<unordered_map>` 是一样的

还有一种方式是使用 gnu 编译器的 pbds 库：

## `pb_ds` 库的哈希表

```c++
#include <ext/pb_ds/hash_policy.hpp>
// 部分环境中可以引用 #include<bits/extc++.h> 万能头 for pb_ds
using namespace __gnu_pbds;

cc_hash_table<A,B> h;		// 拉链法的哈希表
gp_hash_table<A,B> h;		// 探查法的哈希表，首选
```

赛场上通常更倾向于使用 `gp_hash_table`，其性能比原生 `unordered_map` 更优，也更难被爆破

追求极限可以以时间戳作为随机化参数：（引用：[C++ pb_ds 食用教程 - 洛谷专栏](https://www.luogu.com.cn/article/tk8rh0c9)）

```c++
#include <ext/pb_ds/hash_policy.hpp>
#include <chrono>
const int RANDOM = time(NULL);
// const int RANDOM = std::chrono::steady_clock::now().time_since_epoch().count();
struct MyHash {
	int operator() (int x) const {return x ^ RANDOM;}
};

__gnu_pbds::gp_hash_table <int, int, MyHash> Table;
```

