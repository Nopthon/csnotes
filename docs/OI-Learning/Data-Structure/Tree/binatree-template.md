# 二叉树 Template

For Online Judge,  STL unused

## 框架

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

注意到前序遍历序列的第一个元素提供根节点，中序遍历序列的每个元素的左侧为左子树元素，右侧为右子树元素

第一步是记录中序遍历中每个元素的位置（值 -->下标）

第二步是一个递归函数，根据前序遍历的第一个元素确定子树的根节点，找出其在中序遍历数组的位置，左右进行二分

`preOrder + 1, inOrder, k` 表示左子树对应的遍历信息的指针起点与节点个数

`preOrder + k + 1, inOrder + k + 1, size - k - 1` 表示右子树对应的遍历信息的指针起点与节点个数

```c++
int* indexForMapping;

void createIndex(int* inOrder, int size) {
    indexForMapping = new int[size];
    for (int i = 0; i < size; ++i) {
        indexForMapping[inOrder[i]] = i;
    }
}

treeNode* create(int* preOrder, int* inOrder, int size) {
    if (size == 0) return nullptr;
    treeNode* root = new treeNode(preOrder[0]);
    
    int k = index[preOrder[0]];	// rootIndex
    root->leftChild = create(preOrder + 1, inOrder, k);
    root->rightChild = create(preOrder + k + 1, inOrder + k + 1, size - k - 1);
    return root;
}

delete[] indexForMapping
```

如果不追求时间复杂度（$O(n^2)$），只保留 `create` 函数，将 `k` 的赋值换成注释的语句

```c++
treeNode* create(int* preOrder, int* inOrder, int size) {
    if (size == 0) return nullptr;
    treeNode* root = new treeNode(preOrder[0]);
    int k = 0;
    while (k < size && inOrder[k] != preOrder[0]) k++;
    root->leftChild = create(preOrder + 1, inOrder, k);
    root->rightChild = create(preOrder + k + 1, inOrder + k + 1, size - k - 1);
    return root;
}
```

### 根据前序遍历 + 空节点信息构建二叉树

定义 `Null` 为空节点代表的值（比如 `-1` `0`），`size` 为输入的长度而非有效节点个数

如果可以保证前序遍历序列之后没有其他输入，可以删除 `size` 检查

```c++
int size = n;

treeNode* create(istream& in, int Null, int& size) {
	if(size <= 0) return nullptr;
    int input;
	if(!(in >> input)) return nullptr;
    size--;
	if(input == Null){
		return nullptr;
	}
	treeNode* root = new treeNode(input);
	root->leftChild = create(in, Null, size);
	root->rightChild = create(in, Null, size);
    return root;
}
```

### 根据层序遍历 + 空节点信息构建二叉树

队列实现，在入队根节点之后循环操作：出队一个节点，非空左右子节点依次链接并入队

```c++
treeNode* create(int n, int Null) {
    if (n <= 0) return nullptr;
    int rootval; cin >> rootval;
    treeNode* root = new treeNode(rootval);
    treeNode** queue = new treeNode*[(n + 1) / 2];
    int front = 0, rear = 0;
    queue[rear++] = root;
    int index = 1, data;
    while(front < rear && index < n) {
        treeNode* cur = queue[front++];
        if(index < n) {
            if (!(cin >> data)) break;
            if(data != Null) {
                cur->leftChild = new treeNode(data);
                queue[rear++] = cur->leftChild;
            }
            index++;
        }
        if(index < n) {
            if (!(cin >> data)) break;
            if(data != Null) {
                cur->rightChild = new treeNode(data);
                queue[rear++] = cur->rightChild;
            }
            index++;
        }
    }
    delete[] queue;
    return root;
}
```

---

