# STL 算法库 reference

## 排序相关STL

给出一些实用的排序相关函数。

#### `sort()`

通常采用内省排序（Introsort），其混合了快速排序、插入排序、堆排序，根据递归的数据量与层次自动选择，平均时间复杂度 $O(n \log n)$

```c++
sort(a, a + n)									// 对C风格数组排序
sort(vec.begin(), vec.end())					// 对vector排序
```

`sort` 函数附带一个可选参数，用来自定义排序规则：

```c++
sort(vec.begin(), vec.end(), greater<int>())	// 降序排序
sort(vec.begin(), vec.end(), cmp)				// 自定义函数排序（函数名可以不是cmp）
    
// greater<int> 是一个类模板，本质是重载了 greater 运算符
// greater<int>() 创建了这个类的一个临时对象（函数对象）
```

自定义函数的返回值作为判断大小的标准，比如：

```c++
bool cmp(int x, int y){								// 两个 int 降序排序
    return x > y;									// 不能是 x >= y
}
bool cmp(struct node x, struct node y) {			// 两个链表的节点存储的值的序升序排序
    return x.val < y.val;
}
bool cmp(const string &a, const string &b){			// 解决拼接字符串字典序最大化问题，比如 Luogu P1012
    return a + b > b + a;
}
```

`cmp` 函数还可以用 `Lambda` 表达式代替：

```c++
sort(vec.begin(), vec.end(), [](int a, int b) { return a > b; });	// 降序排序
```

事实上 `cmp` 可以是任何的可调用对象，只要满足：接受两个输入；返回值 `bool`；比较关系满足严格弱序。

!!! caution "关于排序规则 `cmp`"

    排序规则 `cmp` 必须满足对比较元素的[严格弱序（Strict Weak Ordering）](https://oi-wiki.org/basic/stl-sort/#%E4%B8%A5%E6%A0%BC%E5%BC%B1%E5%BA%8F)，这对 [所有涉及 Compare 的函数都有效](https://en.cppreference.com/w/cpp/named_req/Compare#Standard_library) 
    
    如果 `cmp` 不满足严格弱序（比如 `return x <= y`），会出现不可预料的错误
    
    题目举例：[P2123 皇后游戏](https://www.luogu.com.cn/problem/P2123)，作为一道贪心排序题，cmp 函数的构造需要考虑到严格弱序的约束，很有趣的题目，调了两天


另外，`sort` 函数用到了快速排序，所以是不稳定的；可以使用 `stable_sort` 函数，其通过牺牲空间复杂度确保了排序的稳定性



#### `partial_sort()` 

相比 `sort` 函数，`partial_sort` 函数可以指定将排序进行到部分程度便停止，比如：

```c++
partial_sort(vec.begin(), vec.begin() + k, vec.end())			// 也可以使用自定义cmp函数
```

此时的排序结果只有 `vec[0] ~ vec[k]` 是有序的 ，在此之后的序列不保证有序

底层采用堆排序，对从较大的数据量中找到小部分最值结果的搜索很有用，时间复杂度  $O(n \log l)$，$l$ 为待排序部分的长度

该函数有一个变种 `partial_sort_copy()` ，可以将部分排序的结果存入另一个容器中：

```c++
// 将source向量中的前 k 个最大元素按降序存入target中， k 的值为target向量的当前长度；greater<int>() 用于降序排序
partial_sort_copy(source.begin(), source.end(), target.begin(), target.end(), greater<int>());
```

`partial_sort()` 是不稳定的，并且没有稳定版本。



#### `nth_element()`

只将第 `k + 1` 小的元素放在正确的排序位置 `vec[k]`，并且这个元素左侧的其他元素都比它小（ ≤ ），右侧的其他元素都比它大（ ≥ ）。时间复杂度 $O(n)$

（类似于快速排序算法中 `partition` 的实现，但是后者没有“找到第 k 小的元素”这一步，后者的 `pivot` 没有限制条件）

比如：

```c++
nth_element(vec.begin(), vec.begin() + k, vec.end())	// 可以使用自定义比较函数
```

令 `k = 2` ，这样的排序只有 `vec[2]` 的位置一定是正确的：

``` c++
{9,7,8,6,4,5,3,1,2} -> {2,1,"3",4,9,5,6,8,7}	// 只有 vec[2] 的位置是一定正确的（与在完整排序的数组中的位置一样）
					-> {1,2,"3",4,5,6,7,8,9}	// 对照完全排序的数组
{2,1} < {3} < {4,9,5,6,8,7}						// 这里可以发现结果和快速排序的partition是一样的
```



#### `is_sorted()`

判断是否有序，返回 `true / false` 。

```c++
bool sorted = is_sorted(vec.begin(), vec.end(), cmp);
```



#### `is_sorted_until()`

查找最长的已排序区间，返回的是不再排序的第一个元素的迭代器。

```c++
auto it = is_sorted_until(vec.begin(), vec.end(), cmp);
```

可以通过 `if (it == vec.end())` 判断是否完全排序（`vec.end()` 指向的并不是容器最后一个元素）；

可以通过 `distance(vec.begin(), it)` 获取第一个未排序元素的下标；

（`it` 可以看作指针， `*it` 就是迭代器指向元素的值）



#### `partition()`

将所有满足谓词 `p` 的元素放到容器前面，返回一个迭代器，指向第一个不满足筛选规则的元素。

```c++
auto it = partition(vec.begin(), vec.end(), p);
```

比如（`p` 通常采用 Lambda 表达式，也可以用独立函数表示）：

```c++
{1, 2, 3, 4, 5, 6, 7}
auto it = partition(vec.begin(), vec.end(), [](int x) {return x % 2 == 0;});
{6, 2, 4, 3, 5, 1, 7}
it:		  ↑
```

`partition()` 具有稳定版本 `stable_partition()` 可以保证元素的相对顺序



## 查找相关STL

给出一些实用的查找相关函数。

#### `find()`

在一个无需排序的范围内查找第一个等于给定值的元素，返回的是迭代器。

```c++
auto it = find(vec.begin(), vec.end(), VALUE);
```



#### `find_if()` 

在一个无需排序的范围内查找第一个满足给定谓词的元素，返回的是迭代器。

```c++
auto it = find_if(vec.begin(), vec.end(), p);
```

（还有一个 `find_if_not()` 的变种，查找第一个**不**满足给定谓词的元素）



#### `binary_search()`

在一个**已经**排序的范围内查找是否包含等于给定值的元素，返回的是 `bool` 值。

```
bool found = binary_search(vec.begin(), vec.end(), VALUE);
```

可以采用自定义函数 `cmp` 决定排序规则，要求原排序范围的排序规则也是 `cmp` ；

可以通过 `if (it == vec.end())` 判断是否找到需求的元素。



#### `equal_range()`

在一个**已经**排序的范围内查找所有等于给定值的元素的范围，返回的是 `std::pair<it,it>` （包含了两个迭代器的模板类）

```cpp
auto range = equal_range(vec.begin(), vec.end(), VALUE);
// range.first , range.second 分别表示等于给定值的元素的范围的左右边界的迭代器
```

可以采用自定义函数 `cmp` 决定排序规则，要求原排序范围的排序规则也是 `cmp` ；

可以通过 `if (it == vec.end())` 判断是否找到需求的元素。



#### `lower_bound()` 和 `upper_bound()`

在一个**已经**排序的范围内查找第一个**不小于（lower）** / **大于（upper）** 给定值的元素，返回的是迭代器。

```c++
auto lower = lower_bound(vec.begin(), vec.end(), VALUE);
auto upper = upper_bound(vec.begin(), vec.end(), VALUE);
```

可以采用自定义函数 `cmp` 决定排序规则，要求原排序范围的排序规则也是 `cmp` ；

可以通过 `if (it == vec.end())` 判断是否找到需求的元素。