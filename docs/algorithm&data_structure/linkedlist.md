# 链表

链表是一种线性数据结构，允许非连续内存存储，针对于频繁增删操作的场景，不适用于需要频繁读写操作的场景

## 实现方式

链表有很多种实现方式：

1- 结构方式：这种实现分离节点与链表的逻辑，通过链表类操作节点结构体

```c++
struct ListNode {								// 单个链表节点的结构体
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}	// 结构体的构造函数
};

class LinkedList {								// 通过结构体实现的链表类
private:
    ListNode* head;								// 链表类的私有变量只有头指针
public:
    LinkedList() : head(nullptr) {}				// 链表类的构造函数
    void insertAtHead(int val) { ... }
	// ... 
};
```

2- 复合方式：在结构方式的实现基础上将节点定义为了独立的类，并通过友元形成与链表类的复合

```c++
class LinkedList;					// 前向声明

class ListNode {	        		// 链表结点类	
 	friend class LinkedList;	    // 友元声明，实现 LinkedList 对 ListNode 的直接访问
private:
    int val;
    ListNode* next;
public: 
    ListNode(int x): val(x), next(nullptr) {}
};

class LinkedList {					// 链表类		
private:
    ListNode* head;
public:
	LinkedList() : head(nullptr) {}
    void insertAtHead(int val) { ... }
    // ...
};
```

3- 嵌套方式：在复合方式的实现基础上将节点类定义为了链表类的子类，封装性更强

```c++
class LinkedList {
private:
    class ListNode { 	// 内部类
    public:
        int val;
        ListNode* next;
        ListNode(int x): val(x), next(nullptr) {}
    };

    ListNode* head;		// 头节点

public:
    LinkedList(): head(nullptr) {}
    void insertAtHead(int x) { ... }
    // ...
};

```

4- 继承方式：链表类成为节点类的继承子类，可以据此实现多态，但是难以维护，仅供理论实现

```c++
class ListNode {								// 链表节点基类
protected:
    int val;
    ListNode* next;
    
public:
    ListNode(int x) : val(x), next(nullptr) {}
    virtual ~ListNode() = default;				// 虚析构函数（在继承写法中为运行时多态的实现做准备）
};

class LinkedList : public ListNode {			// 链表类继承自节点类
private:
    ListNode* head;
    
public:
    LinkedList() : ListNode(), head(nullptr) {}	// 链表类构造函数

    void insertAtHead(int val);					// 在头部插入
    // ...
};
```

之后只会进行结构方式的实现，其他方式同理实现

---

## 手动实现

### 单向链表

以下为单向链表的手动实现：

```c++
struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}	// 构造函数
};

class LinkedList {
private:
    // 如果需要功能更强大的操作，可以储存其他的信息
    // 比如尾指针 ListNode* tail，链表长度 int len
    ListNode* head;

public:
    LinkedList() : head(nullptr) {}		// 构造函数
    ~LinkedList() { clear(); }			// 析构函数
    
    // 这里进行函数的实现
	
};
```

--> 判断链表是否为空

```c++
bool empty() const {
    return head == nullptr;
}
```

--> 插入到 `index` 的位置（0-index）（也就是在 `index` 前插入）

```c++
void insert(int index, int val) {
	if (index == 0 || !head) {
    	// 头插
	    ListNode* newNode = new ListNode(val);
	    newNode->next = head;
	    head = newNode;
        return;
	}
	
    // index = size 时即尾插入
	ListNode* cur = head;
	for (int i = 0; i < index - 1 && cur->next; i++)
	    cur = cur->next;
	ListNode* newNode = new ListNode(val);
	newNode->next = cur->next;
	cur->next = newNode;

}
```

--> 删除 `index` 位置的节点（0-index）

```c++
void removeNode(int index) {
    if (!head || index < 0) return;
    
    if (index == 0) {
        // 删除头节点
        ListNode* temp = head;
        head = head->next;
        delete temp;
        return;
    }
    
    ListNode* cur = head;
    // 找到要删除节点的前一个节点
    for (int i = 0; i < index - 1 && cur->next; i++) {
        cur = cur->next;
    }
    
    // 如果找到了有效节点且下一个节点存在
    if (cur->next) {
        ListNode* temp = cur->next;
        cur->next = cur->next->next;
        delete temp;
    }
}
```

--> 删除指定值的节点（删除第一个匹配项）

```c++
void removeVal(int val) {
    // 不复用 removeNode 函数的原因是 removeNode 函数需要重新遍历一遍链表
    if (!head) return;
    if (head->val == val) {
        ListNode* temp = head;
        head = head->next;
        delete temp;
        return;
    }
    ListNode* cur = head;
    while (cur->next && cur->next->val != val) {
        cur = cur->next;
    }
    if (cur->next) {
        ListNode* temp = cur->next;
        cur->next = cur->next->next;
        delete temp;
    }
}
```

--> 查找节点（返回第一个匹配节点的指针）

```c++
ListNode* find(int val) {
    ListNode* cur = head;
    while (cur) {
        if (cur->val == val)
            return cur;
        cur = cur->next;
    }
    return nullptr;
}
```

--> 反转链表

```c++
void reverse() {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    head = prev;
}
```

--> 打印链表

```c++
void print() const {
    ListNode* cur = head;
    while (cur) {
        cout << cur->val;
        if (cur->next) cout << " ";
        cur = cur->next;
    }
    cout << endl;
}
```

--> 清空链表，析构函数调用

```c++
void clear() {
    ListNode* cur = head;
    while (cur) {
        ListNode* temp = cur;
        cur = cur->next;
        delete temp;
    }
    head = nullptr;
}
```

### 双向循环链表

单向链表的操作具有一定的局限性，我们在单向链表的基础上加上双向指针（`next` 和 `prev`），并且支持首尾节点的循环连接：

以下是双向循环链表的手动实现：

```cpp
struct ListNode {
    int val;
    ListNode* next;
    ListNode* prev;
    ListNode(int x) : val(x), next(nullptr), prev(nullptr) {}  // 构造函数
};

class DoublyCircularLinkedList {
private:
    // 头指针，指向链表的第一个节点
    ListNode* head;
    // 尾指针，指向链表的最后一个节点
    // tail 就是 head->prev，对于非循环链表来说，tail 指针很有用
    // 出于统一性保留使用
    ListNode* tail;
    // 链表大小
    int size;

public:
    DoublyCircularLinkedList() : head(nullptr), tail(nullptr), size(0) {}  // 构造函数
    ~DoublyCircularLinkedList() { clear(); }  // 析构函数
    
    // 这里进行函数的实现
    
};
```

--> 判断链表是否为空

```cpp
bool empty() const {
    return head == nullptr;
}
```

--> 插入到 `index` 的位置（0-index）（也就是在 `index` 前插入）

```cpp
void insert(int index, int val) {
    // 防止访问 NULL 领域
    if (index < 0) index = 0;
    if (index > size) index = size;
    
    ListNode* newNode = new ListNode(val);
    
    if (empty()) {
        // 链表为空时的插入操作
        head = tail = newNode;
        head->next = head;
        head->prev = head;
    }
    else if (index == 0) {
        // 头插
        newNode->next = head;
        newNode->prev = tail;
        head->prev = newNode;
        tail->next = newNode;
        head = newNode;
    }
    else if (index == size) {
        // 尾插
        // 如果不考虑维护 tail 指针，可以与中间插入合并
        // 考虑到单独实现尾插会有更好的性能（不需要遍历链表），所以可以分离出尾插操作
        newNode->prev = tail;
        newNode->next = head;
        tail->next = newNode;
        head->prev = newNode;
        tail = newNode;
    }
    else {
        // 中间插入
        ListNode* cur = head;
        for (int i = 0; i < index; i++) {
            cur = cur->next;
        }
        newNode->next = cur;
        newNode->prev = cur->prev;
        cur->prev->next = newNode;
        cur->prev = newNode;
    }
    
    size++;
}
```

--> 删除 `index` 位置的节点（0-index）

```c++
void removeNode(int index) {
    if (empty() || index < 0 || index >= size) return;

    if (index == 0) {
        // 删除头节点
        if (head == tail) {
            // 单节点链表
            delete head;
            head = tail = nullptr;
        } else {
            // 更新头节点
            ListNode* temp = head;
            head = head->next;
            head->prev = tail;
            tail->next = head;
            delete temp;
        }
    } else if (index == size - 1) {
        // 删除尾节点
        ListNode* temp = tail;
        tail = tail->prev;
        tail->next = head;
        head->prev = tail;
        delete temp;
    } else {
        // 删除中间节点
        ListNode* cur = head;
        for (int i = 0; i < index; i++) {
            cur = cur->next;
        }
        // 更新前后节点的连接
        cur->prev->next = cur->next;
        cur->next->prev = cur->prev;
        delete cur;
    }
    
    size--;  // 更新链表大小
}
```

--> 删除指定值的节点（删除第一个匹配项）

```cpp
void removeVal(int val) {
    if (empty()) return;
    
    ListNode* cur = head;
    
    // 单节点删除
    if (head == tail && head->val == val) {
        delete head;
        head = tail = nullptr;
        size = 0;
        return;
    }
    
    // 遍历链表，删除匹配的节点
    do {
        if (cur->val == val) {
            // 处理头节点
            if (cur == head) {
                head = head->next;
                head->prev = tail;
                tail->next = head;
            }
            // 处理尾节点
            else if (cur == tail) {
                tail = tail->prev;
                tail->next = head;
                head->prev = tail;
            }
            // 处理中间节点
            else {
                cur->prev->next = cur->next;
                cur->next->prev = cur->prev;
            }
            
            delete cur;  // 删除节点
            size--;  // 更新链表大小
            return;
        }
        cur = cur->next;
    } while (cur != head);  // 循环直到回到头节点
    
    return; // 表示没有找到待删除值
}
```

--> 查找节点（返回第一个匹配节点的指针）

```cpp
ListNode* find(int val) {
    if (empty()) return nullptr;
    
    ListNode* cur = head;
    do {
        if (cur->val == val) {
            return cur;
        }
        cur = cur->next;
    } while (cur != head);
    
    return nullptr;
}
```

--> 反转链表

```cpp
void reverse() {
    if (empty() || head == tail) return;  // 空链表或单节点无需反转
    
    ListNode* cur = head;
    ListNode* temp = nullptr;
    
    do {
        // 交换前后指针
        temp = cur->next;
        cur->next = cur->prev;
        cur->prev = temp;
        
        // 移动到下一个节点
        cur = temp;
    } while (cur != head);
    
    // 调整头尾指针
    temp = head;
    head = tail;
    tail = temp;
}
```

--> 打印链表

```cpp
void print() const {
    if (empty()) {
        cout << endl;
        return;
    }
    
    ListNode* cur = head;
    do {
        cout << cur->val;
        if (cur->next != head) cout << " ";
        cur = cur->next;
    } while (cur != head);
    
    cout << endl;
}
```

--> 清空链表，调用析构函数

```cpp
void clear() {
    if (empty()) return;
    
    ListNode* cur = head;
    ListNode* temp = nullptr;
    
    do {
        temp = cur;
        cur = cur->next;
        delete temp;
    } while (cur != head);
    
    head = tail = nullptr;
    size = 0;
}
```

---

## STL 实现

`<list>` 和 `<forward_list>` 分别是对双向链表和单向链表的模板实现：

初始化可以参考 `vector`，比如：

```c++
list<int> l1;                 	// 空链表
list<int> l2(3, 1);				// {1，1，1}
list<int> l3 = {1, 2, 3, 4}; 	// 列表初始化
list<int> l4(l3);             	// 拷贝构造
```

下面是 `<list>` 支持的函数/操作

```c++
list.begin(); list.end()	// 头尾节点迭代器
list.front(); list.back()	// 头尾节点值
list.size()					// 链表长度，高版本 C++ 要求 O(1) 实现
    
list.push_front(val);		// 头插入
list.push_back(val);		// 尾插入
list.insert(it, val);		// 在 it 迭代器指向的元素之前插入 val

list.remove(val)			// 删除所有值为 val 的元素
list.remove_if(UnaryPred)	// 删除所有满足一元谓词 UnaryPred 的元素，功能强大，参考 vector
list.pop_front();     		// 头删除
list.pop_back();      		// 尾删除
list.erase(it);				// 删除 it 指向的元素（也可以 erase(it1, it2) 范围删除）

list.reverse();       // 反转链表
list.sort();          // 排序（默认升序，不能指定排序范围，允许自定义排序函数）
list.unique();        // 去除连续重复的元素（比如 1 2 2 1 去重为 1 2 1），允许自定义函数

list.merge(other);    // 合并两个有序链表（合并在 list 上），允许自定义排序函数；other 会被清空
list.splice(pos, other, it1, it2); 	// 拼接链表，后两个参数可选，都不选表示一整个 other 链表被剪切
									// 将 other 链表 [it1, it2) 的部分剪切粘贴到 pos 之前的位置
									// 由于这一操作只涉及指针操作，所以会改变 other 的链接情况
```

对于 `<forward_list>`，由于其仅支持单项迭代器（`<list>` 为双向迭代器），因此：

`back()` `push_back()` `pop_back()` 均不可用；

`insert()` `erase()` `splice()` 函数均改为 `_after` 版本，比如 `insert_after(it, val)` 为在 `it` 指向元素的后面插入 `val`（双向链表是前插入）；

另外 `size()` 也不可用，单向链表的 `size()` 实现是 O(n) 的，不如手动实现

---

## Extras

### 哨兵

> 摘自《算法导论》原书第三版 P132~P133

哨兵（sentinel）是一个不存储实际信息的哑对象，其作用是简化边界条件的处理。

我们在初始化链表时不使用 `head` 指针，而是构造一个 `L.nil` 哨兵节点，`L.nit.next` 代替 `head` 使用（始终指向表头）；对于双向链表，`L.nit.prev` 代替 `tail` 使用（始终指向表尾）

--> 也就是说不需要再维护 `head` `tail` 了，由哨兵节点进行统一管理

哨兵对于构造循环链表有很大的优势，循环闭合的操作可以通过哨兵节点的指针操作快速实现

更加方便的是：对于涉及到边界操作的链表操作，`L.nil` 本身作为一个完整的节点可以消除一些边界情况：以双向循环链表中插入某一结点的操作为例

```c++
void insert(int index, int val) {
    // 防止访问 NULL 领域
    if (index < 0) index = 0;
    if (index > size) index = size;
    
    ListNode* newNode = new ListNode(val);
    
    if (empty()) {
        // 链表为空时的插入操作
        head = tail = newNode;
        head->next = head;
        head->prev = head;
    }
    else if (index == 0) {
        // 头插
        newNode->next = head;
        newNode->prev = tail;
        head->prev = newNode;
        tail->next = newNode;
        head = newNode;
    }
    else if (index == size) {
        // 尾插
        newNode->prev = tail;
        newNode->next = head;
        tail->next = newNode;
        head->prev = newNode;
        tail = newNode;
    }
    else {
        // 中间插入
        ListNode* cur = head;
        for (int i = 0; i < index; i++) {
            cur = cur->next;
        }
        newNode->next = cur;
        newNode->prev = cur->prev;
        cur->prev->next = newNode;
        cur->prev = newNode;
    }
    
    size++;
}
```

我们引入哨兵后不再需要维护单独的 `head` `tail` 指针，并且简化逻辑为：

```c++
void insert(int index, int val) {
    if (index < 0) index = 0;
    if (index > size) index = size;
    
    ListNode* newNode = new ListNode(val);
    
    // 找到插入位置的前驱节点
    ListNode* prevNode = L.nil;
    
    for (int i = 0; i < index; i++) {
        prevNode = prevNode->next;
    }
    
    // 插入操作完全统一化
    ListNode* nextNode = prevNode->next;
    
    newNode->prev = prevNode;
    newNode->next = nextNode;
    prevNode->next = newNode;
    nextNode->prev = newNode;
    
    size++;
}
```

个人角度看，哨兵的使用消除了 “空链表” 的特殊操作，并且统一了头尾节点的设置；但是哨兵的使用优化不明显（其作用倾向于简化实现），并且有额外一个节点的内存开销。所以《算法导论》的建议是 “慎用哨兵，尤其是存在很多短链表的时候，会造成严重的存储浪费”

### 异或链表

> 摘自 [链表 - OI Wiki](https://oiwiki.org/ds/linked-list/)

双向链表的另一种实现。常规的双向链表实现需要用到 `prev` 和 `next` 两个指针，而异或链表借助异或计算实现了两个指针的合并：`ptr = prev ^ next`，使得双向链表和单向链表可以实现相同的内存占用

异或计算的特性是：`a xor 0 = a`，`a xor a = 0`，`a xor b xor a = b`，满足交换律，结合律

因此异或计算是可逆的，常见的应用是实现两个数字的原地交换：

```c++
a=a^b;
b=a^b;
a=a^b;
```

我们以双向**不**循环链表为例：

```c
        +----------+    +----------+    +----------+
        |  Node A  |--->|  Node B  |--->|  Node C  |
head--->|          |    |          |    |          | --...->
        |  ptr_A   |<---|  ptr_B   |<---|  ptr_C   |
        +----------+    +----------+    +----------+
```

构建链表的时候，`ptr_A` 作为头节点的指针，储存 `Node B` 的地址；`ptr_B` 储存的是 `Node A` 和 `Node C` 的地址的异或值，以此类推，直到尾节点 `ptr_last` 存储上一个节点的地址值

正向遍历链表的时候，`cur` 指针从 `head` 出发，先记录 `Node A` 的地址，通过 `ptr_A` 到达 `Node B`，然后将 `ptr_B` 与 `Node A` 的地址进行异或计算，得到 `Node C` 的地址并且到达 `Node C`，以此类推，直到 `ptr_last` 指向的地址恰好为倒数第二个节点的地址，表示到达了尾节点，遍历结束

如果有 `tail` 指针，同理可以实现反向遍历链表

（头尾节点的 `ptr` 不存储异或值，因此可以作为遍历开始/终止的标识）
