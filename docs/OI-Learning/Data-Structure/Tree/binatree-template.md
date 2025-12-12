# 二叉树 Template

For Online Judge,  **STL used**

## 节点框架

不含父节点，必要时构造 parent 一维数组单独维护

```c++
struct treeNode{
    int val;
    treeNode *leftChild, *rightChild;
    treeNode ()
        { val = 0; leftChild = nullptr;  rightChild = nullptr; }
    treeNode (int x, treeNode *l = nullptr, treeNode *r = nullptr)
        { val = x;  leftChild = l;  rightChild = r; }
};
```

## 读入

### 根据前序遍历 + 中序遍历信息构建二叉树

时间复杂度 $O(n)$ 

注意到前序遍历序列的第一个元素提供根节点，中序遍历序列的每个元素的左侧为左子树元素，右侧为右子树元素，根据这些信息就可以构建唯一二叉树

第一步是提前记录中序遍历中每个元素的位置（值 -->下标，逆映射 $f^{-1}(f(x)) = x$）

第二步是一个递归函数，根据前序遍历的第一个元素确定子树的根节点，找出其在中序遍历数组的位置，左右递归构造子树

```c++
unordered_map<int, int> indexMap;

// subfunc: 建立中序遍历的逆映射
void createIndex(const vector<int>& in) {
    indexMap.clear();
    indexMap.reserve(in.size());
    for (int i = 0; i < (int)in.size(); i++) {
        indexMap[in[i]] = i;   // O(1) 插入
    }
}

// l r 分别表示参与递归的区间范围
treeNode* create(const vector<int>& pre, int preL, const vector<int>& in, int inL, int size){
    // 结束递归
    if (size <= 0) return nullptr;
    // 根节点是前序遍历的第一个元素
    treeNode* root = new treeNode(pre[preL]);
    // 获取左子树的节点个数
    int k = indexMap[pre[preL]] - inL;
    // 构建左子树：
    root->leftChild = create(pre, preL + 1, in, inL, k);
    // 构建右子树：
    root->rightChild = create(pre, preL + k + 1, in, inL + k + 1, size - k - 1);
    return root;
}
```

如果不追求时间复杂度（$O(n^2)$），只保留 `create` 函数

```c++
treeNode* create(const vector<int>& pre, int preL, const vector<int>& in, int inL, int size){
    if (size <= 0) return nullptr;
    treeNode* root = new treeNode(pre[preL]);

    int k = 0;
    for (int i = inL; i < inL + size; i++) {
        if (in[i] == pre[preL]) {
            k = i - inL;  // 计算左子树节点数
            break;
        }
    }

    root->leftChild = create(pre, preL + 1, in, inL, k);
    root->rightChild = create(pre, preL + k + 1, in, inL + k + 1, size - k - 1);
    return root;
}
```

### 根据前/后序遍历 + 空节点信息构建二叉树

定义 `Null` 为空节点代表的值（比如 `-1` `0`），`remain` 为输入的总长度而非有效节点个数

如果可以保证遍历序列之后没有其他输入，可以删除 `remain` 检查

```c++
// 前序
int remain = n;    // n 是输入节点数，含空节点

treeNode* create(int Null, int& remain) {
    if (remain <= 0) return nullptr;
    
    int input;
    if (!(cin >> input)) return nullptr;
    remain--;

    if (input == Null) {
        return nullptr;
    }
    
    // 前序遍历
    treeNode* root = new treeNode(input);
    root->leftChild = create(Null, remain);
    root->rightChild = create(Null, remain);
    return root;
}

------------------------------------------------------------------
// 后序
// 右子树 ← 左子树 ← 根节点
int remain = n;  // n 是输入节点数，含空节点

treeNode* create(int Null, int& remain) {
    if (remain <= 0) return nullptr;
    
    // 先递归构造右子树，然后是左子树
    treeNode* rightChild = create(Null, remain);
    treeNode* leftChild = create(Null, remain);
    
    // 最后读取根节点
    int input;
    if (!(cin >> input)) return nullptr;
    remain--;
    
    if (input == Null) {
        return nullptr;
    }
    
    // 创建根节点并连接子树
    treeNode* root = new treeNode(input);
    root->leftChild = leftChild;
    root->rightChild = rightChild;
    return root;
}
```

### 根据层序遍历 + 空节点信息构建二叉树

队列实现，在入队根节点之后循环操作：出队一个节点，非空左右子节点依次链接并入队

```c++
treeNode* create(int n, int Null) {
    // valid check
    if (n <= 0) return nullptr;
    
    // 构建一个单向队列
    queue<treeNode*> q;
    
    // 先将根节点入队
    int rootval; if (!(cin >> rootval)) return nullptr;
    treeNode* root = new treeNode(rootval);
    q.push(root);
    
    int index = 1, data;
    while(!q.empty() && index < n) {
        // 出队一个节点
        treeNode* cur = q.front();
        q.pop();
        
        // 链接并入队非空左节点
        if(index < n) {
            if (!(cin >> data)) break;
            if(data != Null) {
                cur->leftChild = new treeNode(data);
                q.push(cur->leftChild);
            }
            // 节点是否为空都要 index++
            index++;
        }
        // 链接并入队非空右节点
        if(index < n) {
            if (!(cin >> data)) break;
            if(data != Null) {
                cur->rightChild = new treeNode(data);
                q.push(cur->rightChild);
            }
            index++;
        }
    }
    return root;
}
```

---

## 遍历

非递归版的前/中/后序遍历以及层序遍历

`visit` 是函数指针，规定遍历的输出方式，比如：

```c++
void printNode(treeNode* node) {
        if (node != nullptr) {
            cout << node->val << " ";
        }
    }
```

主函数：

```c++
/* 前序遍历 */
// 根节点 --> 左子树 --> 右子树
// 从根节点开始一路沿左子树向下遍历
// 期间直接 visit 沿路节点（确保根节点最先被 visit），栈存储沿路节点的右子节点
// 每次抵达尽头时，取出栈顶，转移到右子节点重复左子树遍历的过程
void PreOrder(treeNode* root, void (*visit)(treeNode* t)) {
    if (root == nullptr) return;

    stack<treeNode*> s;    // 存的是待处理的右子树节点
    treeNode* p = root;    // p 是遍历指针，初始化为 root

    while (p != nullptr || !s.empty()) {
        // DFS 遍历左子树
        // PreOrder(subTree->leftChild, visit);
        while (p != nullptr) {
            // 从根节点开始深入访问
            visit(p);
            // 右节点入栈
            // 因为栈先进后出的特性，最后进栈（递归最深）的右节点会最先出栈处理
            if (p->rightChild)
                s.push(p->rightChild);
            // 向左子树深入
            p = p->leftChild;
        }
        // 左节点遍历结束后，取栈顶元素（最近的右节点）
        // PreOrder(subTree->rightChild, visit);
        if (!s.empty()) {
            p = s.top();
            s.pop();
        }
    }
}

/* 中序遍历 */
// 左子树 --> 根节点 --> 右子树
// 从根节点开始一路沿左子树向下遍历
// 期间存储所有的沿路节点（子树的根节点）
// 每次抵达尽头时，弹出栈顶的根节点 visit，然后转向该结点的右子树重复左子树遍历
void InOrder(treeNode* root, void (*visit)(treeNode* t)) {
    if (root == nullptr) return;

    stack<treeNode*> s;  // 存的是沿途的根节点路径
    treeNode* p = root;  // 遍历指针

    while (p != nullptr || !s.empty()) {
        // DFS 遍历到最左节点，沿途压入所有节点
        // InOrder(subTree->leftChild, visit);
        while (p != nullptr) {
            s.push(p);          // 为了在访问左子树后访问根节点，将 p 入栈
            p = p->leftChild;   // 继续向左深入
        }

        // 到达最左端，开始回溯访问
        if (!s.empty()) {
            p = s.top();        // 取出栈顶节点
            s.pop();
            
            visit(p);           // 中序遍历：在左子树之后访问根节点

            // 转向右子树继续中序遍历
            // InOrder(subTree->rightChild, visit);
            p = p->rightChild;
        }
    }
}

/* 后序遍历 */
// 左子树 --> 右子树 --> 根节点
// 从根节点开始一路沿左子树向下遍历
// 期间存储所有的沿路节点（子树的根节点）
// 每次抵达尽头时，查看栈顶节点，根据 lastVisited 判断这个节点的右子树情况
// 如果右子树还未被访问，先转移到栈顶节点的右子树重复过程
// 如果右子树上一次被 visited 了或者没有右子树，visit 该节点并弹出
void PostOrder(treeNode* root, void (*visit)(treeNode* t)) {
    if (root == nullptr) return;

    stack<treeNode*> s;  // 暂存待处理的节点
    treeNode* p = root;  // 当前遍历指针
    treeNode* lastVisited = nullptr;     // 需要记录上次访问的节点
    // 为了判断某一个右子树是否已被遍历

    while (p != nullptr || !s.empty()) {
        // 深度优先遍历到最左节点，沿途压入所有节点
        // PostOrder(subTree->leftChild, visit);
        while (p != nullptr) {
            s.push(p);          // 当前节点入栈
            p = p->leftChild;   // 继续向左深入
        }

        // 查看栈顶节点（不立即弹出，因为接下来要转向右子树）
        if (!s.empty()) {
            p = s.top();

            // 如果右子树存在且未被访问，先处理右子树
            // PostOrder(subTree->rightChild, visit);
            if (p->rightChild != nullptr && p->rightChild != lastVisited) {
                p = p->rightChild;  // 转向右子树
            } else {
                // 右子树已处理或不存在，可以访问当前节点
                visit(p);
                
                s.pop();
                lastVisited = p;    // 记录上次访问的节点
                p = nullptr;        // 重置p，强制从栈中取下一个节点
            }
        }
    }
}

/* 层序遍历 */
// 借助先进先出的队列实现逐层遍历
void LevelOrder(void (*visit)(treeNode* t)) {
    // 如果树为空，直接返回
    if (root == nullptr) return;

    // 使用队列进行层次遍历
    queue<treeNode*> q;
    q.push(root);

    while (!q.empty()) {
        // 取出队首节点
        treeNode* cur = q.front();
        q.pop();

        // 访问当前节点
        visit(cur);

        // 将左子节点入队（如果存在）
        if (cur->leftChild != nullptr) {
            q.push(cur->leftChild);
        }

        // 将右子节点入队（如果存在）
        if (cur->rightChild != nullptr) {
            q.push(cur->rightChild);
        }
    }
}
```
