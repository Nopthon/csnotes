# C++ 面向对象 intro

### Chapter 1 封装

在 C 语言中构造数据结构通常使用 **“结构体存储 + 函数操作”** 的方案，比如：

!!! note "接下来的链表实现都只涉及节点的实现，并没有实现具体的链表类进行管理"

``` c
// 一个简易的单向链表节点结构
struct ListNode {
    int val;
    struct ListNode* next;
};

// 以及对应的操作函数
void listInit(struct ListNode** head);
void listAppend(struct ListNode** head, int value);
// 其他函数...
```

问题是，在这种构造情况下，我可以不加约束地访问数据结构的内容，这在有的时候非常不安全；另外，数据本身和数据操作行为并没有被很好地捆绑在一起，这使得修改数据的行为不是很直观：


```c
struct ListNode* node = createNode(10);
node->val = 114;		// exposed
node->next = nullptr;	// 直接对数据操作
```

!!! quote "以防自己忘记：`#!c++ pointer->member ==  (*pointer).member` ，这里和接下来的 `#!c++ node` 都是指针"

于是有了**封装**。

下面是封装后的 C++ Ver. 链表示例，不难发现 “结构体+函数” 现在被整合到了一个 “Class”，也就是类中：

```c++
class ListNode {
private:    // 私有成员，只能由本类内部访问
    int val;
    ListNode* next;
    
protected: 	// 受限制成员，可以被本类 && 子类访问
    
public:     // 公共成员，可任意访问
    ListNode(int val) : val(val), next(nullptr) {}		// 构造函数，花括号里可以写其他函数，比如 cout << "created!";
    ~ListNode() {}		// 析构函数
    // 具体的函数实现
    int getData() const { return val; }					// 取值函数
    void setNext(ListNode* node) { next = node; }		// 连接函数
    // 其他函数...
};
```

这里额外提一下构造函数与析构函数：

- 构造函数用于创建一个新的 ListNode，可以进行初始化，比如：

  ```c++
  // ListNode(int val) : val(val), next(nullptr) {}
  ListNode* node = new ListNode(114);
  ```

  在上面的例子中，这个 ListNode 节点的 `val` 值被成功初始化为 `114`，`next` 指针指向 `nullptr`

- 析构函数在对象被销毁时自动调用，用于清理这个对象在生命周期内利用过的资源

  `~ListNode() {}` 花括号中的内容取决于对象在生命周期内有没有进行新的内存动态分配（也包括文件读），下面是一个非空析构函数的例子：

  ```c++
  class ListNode {
  private:
      int* data;  		// 和前面的实现不相同，这里的 data 采用了与 val 不一样的存储方式，指针指向堆内存
      ListNode* next;
  public:
      ListNode(int data) : data(new int(data)), next(nullptr) {}	// 构造函数时为动态分配内存
      ~Node() { delete data; }									// 析构函数中也要释放对应的内存
      
      // 额外的提醒：在这个例子中如果想拷贝数据，必须使用深拷贝，否则使用浅拷贝会导致多个指针指向同一块数据的问题
  };
  ```

对于现代 C++，你可以使用智能指针，此时不需要写析构函数

封装处理后的数据结构在访问数据，数据操作方面都有了非常直观的变化：

- 访问 `#!c++ private` 参数只能通过 `#!c++ public` 函数操作，避免了 “不加约束地访问”（安全性）；

> 举个例子：我有一个模拟 ATM 机的程序，我希望使用者只能通过 `#!c++ deposit(val)` 函数进行存钱（我可以在这个函数里进行合法性判断），而不是 `#!c++ myAccount->balance += val` ；
>
> 当然我也不希望任何人通过 `#!c++ othersAccount->balance` 去“偷窥”其他人的余额信息，我就可以在 `#!c++ getBalance()` 函数里设置账号密码的检查，并且这个函数是唯一能访问余额的函数
>
> 这就是写保护和读保护

- `#!c++ node->val` 这样的访问操作由专门的函数 `#!c++ getData()` 进行处理（统一性）；

> 举个例子：我有一个变量 `#!c++ val` 因为命名冲突问题需要修改变量名为 `#!c++ value`，在 C 语言的环境下，我通常需要把所有的 `#!c++ node->val` 之类的语句修改为 `#!c++ node->value`，在使用了封装之后我只需要修改一次 `#!c++ getData()` 函数即可

- 并且可维护性++了（所有的数据结构相关操作都在一个 `#!c++ Class` 里）

> 举个例子：我现在有若干个各不相同的数据结构 `#!c++ A, B, C, ...` ，它们都有一个对应的函数叫做 `#!c++ fun()`，在没有封装的情况下我可能需要 `#!c++ funA, funB, funC, ...` 等若干个函数（万一你是个起名废呢），在封装的情况写我可以在每个数据结构的 `#!c++ Class` 里写一个 `fun` 并且互不打扰
>
> 这一好处在之后还会有体现

- 而且对程序的使用者（而非开发者）来说，他只需要了解相关的 `#!c++ Public` 接口就能使用程序，他不需要去深入研究 “黑盒子里究竟发生了什么”（抽象化与 "黑盒子" 化）

> 什么是抽象化与 "黑盒子" 化？举个例子：你在QQ里和群u水群的时候，不需要去了解计算机网络等底层原理，这些底层原理最终被抽象化为了一个 Send 按钮，而你在正常情况下也不会知道按下 Send 按钮之后发生的事情

---

### Chapter 2 继承

在封装的帮助下，我现在有了一个单向链表的模板：

```c++
class ListNode {
private:
    int val;
    ListNode* next;
    
public:
    ListNode(int val) : val(val), next(nullptr) {}		// 构造函数
    virtual ~ListNode() {}								// 虚析构函数（这是个啥）
    int getData() const { return val; }					// 取值函数
    void setNext(ListNode* node) { next = node; }		// 连接函数
    // 其他函数...
};
```

现在我又想实现一个双向链表的模板，考虑到单向链表和双向链表具有结构相似的地方，我如果重新再写一个崭新的模板，显得有些费事，而且如果我对单向链表和双向链表的实现有所区别，在进行混合使用时可能不太方便

于是引入**继承**：

```c++
class DoublyListNode : public ListNode {
private:
    DoublyListNode* prev;  // 指向前一个节点的指针
public:
    DoublyListNode(int val) : ListNode(val), prev(nullptr) {}  // 构造函数
    DoublyListNode* getPrev() const { return prev; }
    void setPrev(DoublyListNode* node) { prev = node; }
    void setNext(DoublyListNode* node) {
        ListNode::setNext(node);  // 调用基类的 setNext
        if (node != nullptr) {
            node->setPrev(this);  // 新节点的 prev 指向当前节点
        }
    }
    // 其他函数...
};
```

我们将 `#!c++ DoublyListNode` 设置为 `#!c++ ListNode` 这个基类的继承子类，我们只需要在 `#!c++ ListNode` 的已有基础上加上 `#!c++ DoublyListNode` 的特有元素就完成了双向链表的实现

!!! warning "既然 `#!c++ private` 不对子类开放，那么我的 `#!c++ DoublyListNode` 还能使用 `#!c++ ListNode` 中的 `#!c++ val` 和 `#!c++ next` 吗？"

    确实，`#!c++ private` 的限制使得不能直接对 `#!c++ val` 与 `#!c++ next` 进行访问，但是基类成员里存在 `#!c++ getData()` 公共函数，在 `#!c++ setNext()` 时也直接调用了父函数，因此规避了直接访问 `#!c++ private` 变量的问题
    
    这也是封装的体现

!!! warning "为什么析构函数变成了虚析构函数？"

    析构函数只对基类有效，对子类无效；而虚析构函数对基类、子类都有效
    
    如果不使用 `#!c++ virtual` 关键字，子类会造成内存泄漏

这样写有什么好处呢？

一是可以复用很多代码，减少重复劳动成本，并且更加容易维护

> 举个例子：我以单向链表为基类构建了一个 “链表帝国”，实现了各种各样的链表，这期间我只需要写一次 `#!c++ getData()` 函数，而不是 Ctrl C+V 若干遍
>
> 在测试时我惊奇地发现自己把所有的 `#!c++ getData()` 函数写错了，如果我使用了继承式写法，我只需要修改一次基类的 `getData()` 即可，而不是每个 `#!c++ Class` 都进行重复修改

二是统一了接口

> 举个例子：`#!c++ getData()` 如果在不同的相似的数据结构中因为非常随意的命名习惯被命名为 `#!c++ getValue()` `#!c++ getVal()` `#!c++ get()` ，这一杀伤力相当于 “我的手机应该使用 Type-C 还是 Micro-USB 还是 Lightning 接口进行充电”

三是方便扩展

> 举个例子：我有一个 `#!c++ Player` 基类记录了一个游戏中角色的所有基本实现，现在我想开发很多不同的游戏角色，分别有不同的角色数据与技能（属性与方法），此时继承基类模板的优势就能体现出来了（生命值攻击力等数据无需改动直接继承，同时我可以较为自由的进行扩展）
>
> 其实这个例子可以一次体现以上三个优点

---

### Chapter 3 模板

还是单向链表的模板：

```c++
class ListNode {
private:
    int val;
    ListNode* next;
    
public:
    ListNode(int val) : val(val), next(nullptr) {}		// 构造函数
    virtual ~ListNode() {}								// 虚析构函数
    int getData() const { return val; }					// 取值函数
    void setNext(ListNode* node) { next = node; }		// 连接函数
    // 其他函数...
};
```

我发现这个链表的 `#!c++ val` 只能存储 `#!c++ int` 值，我希望可以扩展到更多的数据类型，但是我又不希望另外写 k 个函数分别对应 k 个数据类型

于是有了**模板**。

```c++
template <typename T>
class ListNode {
private:
    T val;
    ListNode<T>* next;
    
public:
    ListNode(T val) : val(val), next(nullptr) {}		// 构造函数
    virtual ~ListNode() {}								// 虚析构函数
    T getData() const { return val; }					// 取值函数
    void setNext(ListNode<T>* node) { next = node; }	// 连接函数
    // 其他函数...
};
```

`#!c++ template <typename T>` 表示接下来的这个类可以接受一个类型参数，而这个参数在声明时指定：

```
ListNode<int>* node1 = new ListNode<int>(114);
ListNode<double>* node2 = new ListNode<double>(5.14);
ListNode<string>* node3 = new ListNode<string>("hm");
```

这样我们构造了三个 `#!c++ val` 类型不同的链表

!!! warning "这些 Node 的类是否完全不相同？"

    `#!c++ ListNode<int>` `#!c++ ListNode<double>` 是完全不同的两个类，你应当将这两个 Node 视为不相关的类，只是它们共用了同一套类模板
    
    类的好处在于我不需要为每种数据类型单独写一套模板，但是如果要使不同的类之间产生交互（比如将 `#!c++ ListNode<int>` 与 `#!c++ ListNode<double>` 链接），参见后面的 “多态”

### Chapter 4 多态

在 “继承” 中，我们提到了 “虚函数”，虚函数是一个可以在“运行时根据对象的实际类型”决定调用哪个版本的函数。比如虚析构函数可以根据当前对象的类型（基类 or 子类）实行对应的析构操作

在 “模板” 中，我们意识到不同模板所建立的类是独立区分的，不同模板产生的类之间不能进行交互

我们发现虚函数可以区分 “不同模板所建立的类”，从而决定调用不同版本的函数，实现不同模板类之间的链接

上面所说的就是**运行时多态**，在程序运行时根据对象的实际类型决定调用哪个版本的函数

实际上，当我们在上一个 Chapter 中使用 template 时，我们已经实现了另一类多态：**编译时多态**：编译器在编译时就根据 `#!c++ ListNode<T> n1` 这样的实例化语句去生成对应的 `#!c++ ListNode<T>` 类（出现了几种数据结构就生成几种类）。然而此时的多态并不能延续到运行时状态（比如链接混合了多种不同类型的 `#!c++ val` 的链表）

而现在我们要利用虚函数进一步完成运行时多态：

首先，我们首先需要一个 “抽象类”：

```c++ hl_lines="13"
class BaseListNode {
private:
    BaseListNode* next;
    // 没有 val 变量，这个变量应该在模板子类中定义
public:
    BaseListNode() : next(nullptr) {}	// 构造函数，注意这个函数并没有实现初始化
    virtual ~BaseListNode() {}			// 虚析构函数
    									// 注意没有取值函数，因为这个函数需要 template 下实现
    void setNext(BaseListNode* node) { next = node; }	// 连接函数
    
    // 为了体现运行时多态，我们需要一个纯虚函数的实现
    // 这里以 print() 打印 val 为例
    virtual void print() const = 0;
};
```

这个类可以理解为一个 “大框架”，由于纯虚函数的存在，属于一个抽象类，因此写出 `#!c++ BaseListNode node` 的实例化是不被允许的

!!! warning "抽象类中必须有至少一个纯虚函数：`#!c++ virtual void func() = 0;`"

    在 `#!c++ virtual void print() const = 0;` 的例子中：
    
    `#!c++ virtual` 表示它是一个虚函数；
    
    `#!c++ const` 表示函数的实现是只读的；
    
    `#!c++ = 0` 进一步表明它是一个纯虚函数
    
    当你在基类定义了一个纯虚函数，你就必须在每一个子类中去单独实现它

在抽象类的基础上，我们构造模板子类：

```c++ hl_lines="12"
template <typename T>
class ListNode : public BaseListNode {
private:
    T val;
    // 指针在基类中已经声明
public:
    ListNode(const T& value) : val(value) {}	// 在 template 下重写构造函数，实现初始化
    
    T getData() const { return val;}		// 借助 template 实现
    
    // 这里是 print() 在模板类中的覆写化实现
    void print() const override { cout << val; }
};

```

上面的例子中如何体现**多态**？在 `#!c++ print()` 函数的实现中：

```c++
class BaseListNode {
public:
    virtual void print() const = 0;
};

template<typename T>
class ListNode : public BaseListNode {
public:
    void print() const override { std::cout << val; }
};
```

编译时，根据程序中实例化的情况，编译器会自动生成需要用到的各种 `#!c++ ListNode<T>`，这就是编译时多态的体现，此时不同的 `#!c++ ListNode<T>` 隶属于不同的类。

运行时，通过虚函数的调用接口，程序可以在运行时根据对象实际类型决定调用哪个实现，这一操作使得不同的 `#!c++ ListNode<T>` 类通过虚函数进行统一处理，比如使用同一个 `#!c++ print()` 函数，对不同数据类型的 `#!c++ val` 进行打印

通常来说，编译时多态的性能更好（开销低），类型更安全；而运行时多态的实现更为清晰。它们的优缺点比较可以 STFW

至此我们对多态有了初步的印象，当然，多态的形式有很多种，以上只是对多态的一种举例实现

---

<del>写完这篇 note 后，我入门了面向对象编程（了吗）</del>
