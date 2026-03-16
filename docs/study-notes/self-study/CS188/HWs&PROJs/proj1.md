# Project 1: Search

实现各种类型的搜索算法，让吃豆人可以找到目的地（一颗豆子）

## Before

为了理解如何实现搜索代码，我们先关注下面的样例代码，其通过硬编码路线完成一个特定迷宫：

```python
def tinyMazeSearch(problem):
    """
    Returns a sequence of moves that solves tinyMaze.  For any other maze, the
    sequence of moves will be incorrect, so only use this for tinyMaze.
    """
    from game import Directions
    s = Directions.SOUTH
    w = Directions.WEST
    return  [s, s, w, s, w, w, s, w]
```

函数返回一个完整的路径作为搜索后的结果，那么函数如何感知迷宫呢？我们关注这个虚拟类：

```python
class SearchProblem:
    """
    This class outlines the structure of a search problem, but doesn't implement
    any of the methods (in object-oriented terminology: an abstract class).

    You do not need to change anything in this class, ever.
    """

    def getStartState(self):
        """
        Returns the start state for the search problem.
        """
        util.raiseNotDefined()

    def isGoalState(self, state):
        """
          state: Search state

        Returns True if and only if the state is a valid goal state.
        """
        util.raiseNotDefined()

    def getSuccessors(self, state):
        """
          state: Search state

        For a given state, this should return a list of triples, (successor,
        action, stepCost), where 'successor' is a successor to the current
        state, 'action' is the action required to get there, and 'stepCost' is
        the incremental cost of expanding to that successor.
        """
        util.raiseNotDefined()

    def getCostOfActions(self, actions):
        """
         actions: A list of actions to take

        This method returns the total cost of a particular sequence of actions.
        The sequence must be composed of legal moves.
        """
        util.raiseNotDefined()
```

这是一个没有具体实现的虚拟类，搜索函数通过调用这些 "api" 来实时了解当前搜索问题的各种状态：

```python
# 返回起始坐标
def getStartState(self)

# 当且仅当 state 为目标位置，返回 true
def isGoalState(self, state)

# 获取当前位置的所有后继位置（可抵达的位置的相关信息）
# 返回三元组 (successor, action, stepCost) 的列表
# 分别表示后继坐标，移动方向，移动代价
def getSuccessors(self, state)

# 返回某个特定移动序列的总代价值
def getCostOfActions(self, actions)
```

另外在 `util.py` 中提供了栈、队列、单调队列的封装实现

---

## Q1 (3 pts): Finding a Fixed Food Dot using Depth First Search

我们先考虑这样的搜索问题：从某个位置出发，抵达左下角的最短路径。我们只需要考虑到左下角的最短路

DFS 的思路：将起始节点入栈，循环内始终取出栈顶元素直到栈空，对尚未访问过的后继节点（用 `#!python set()` 维护）进行访问。注意栈需要同时存储当前坐标和当前完整路径

```python title="Solution Q1"
def depthFirstSearch(problem: SearchProblem):
    """Search the deepest nodes in the search tree first."""
    "*** YOUR CODE HERE ***"
    st = util.Stack()
    vis = set()
    st.push((problem.getStartState(), []))
    
    while not st.isEmpty():
        state, path = st.pop()
        
        if problem.isGoalState(state):
            return path
        
        if state in vis:
            continue
        vis.add(state)
        
        for successor, action, _ in problem.getSuccessors(state):
            if(successor not in vis):
                st.push((successor, path + [action]))

    return []
```

## Q2 (3 pts): Breadth First Search

DFS 的思路：将起始节点入队，循环内始终取出队首元素直到队空，对尚未访问过的后继节点（用 `#!python set()` 维护）进行访问。注意队列需要同时存储当前坐标和当前完整路径

（和 DFS 代码除了边缘的数据结构表示以外完全相同）

```python title="Solution Q2"
def breadthFirstSearch(problem: SearchProblem):
    """Search the shallowest nodes in the search tree first."""
    "*** YOUR CODE HERE ***"
    q = util.Queue()
    vis = set()
    q.push((problem.getStartState(), []))
    
    while not q.isEmpty():
        state, path = q.pop()
        
        if problem.isGoalState(state):
            return path
        
        if state in vis:
            continue
        vis.add(state)
        
        for successor, action, _ in problem.getSuccessors(state):
            if(successor not in vis):
                q.push((successor, path + [action]))

    return []
```

## Q3 (3 pts): Varying the Cost Function

UCS 的思路：将起始节点入优先队列，优先队列按照总 cost 排序，循环内始终取出队首元素直到队空，对尚未访问过的后继节点（用 `#!python set()` 维护）进行访问。注意优先队列需要同时存储当前坐标、当前完整路径、当前总 cost，同时还要存储 priority（虽然等于 cost 但是需要单独存储，`#!python pop()` 时也不会弹出 priority）

```python title="Solution Q3"
def uniformCostSearch(problem: SearchProblem):
    """Search the node of least total cost first."""
    "*** YOUR CODE HERE ***"
    pq = util.PriorityQueue()
    vis = set()
    pq.push((problem.getStartState(), [], 0), 0)
    
    while not pq.isEmpty():
        state, path, cost = pq.pop()
        
        if problem.isGoalState(state):
            return path
        
        if state in vis:
            continue
        vis.add(state)
        
        for successor, action, stepCost in problem.getSuccessors(state):
            if(successor not in vis):
                pq.push((successor, path + [action], cost + stepCost), cost + stepCost)

    return []
```

上述实现在下面的两个用例下差异巨大：

```
python pacman.py -l mediumDottedMaze -p StayEastSearchAgent
python pacman.py -l mediumScaryMaze -p StayWestSearchAgent
```

因为其成本函数的设计不同，前者尽量向东走，后者尽量向西走。以 `StayEastSearchAgent()` 为例，这个成本函数对靠西的位置惩罚更大，因此 Agent 总会尝试选择靠东的路径：

```python hl_lines="10 22"
class StayEastSearchAgent(SearchAgent):
    """
    An agent for position search with a cost function that penalizes being in
    positions on the West side of the board.

    The cost function for stepping into a position (x,y) is 1/2^x.
    """
    def __init__(self):
        self.searchFunction = search.uniformCostSearch
        costFn = lambda pos: .5 ** pos[0]
        self.searchType = lambda state: PositionSearchProblem(state, costFn, (1, 1), None, False)

class StayWestSearchAgent(SearchAgent):
    """
    An agent for position search with a cost function that penalizes being in
    positions on the East side of the board.

    The cost function for stepping into a position (x,y) is 2^x.
    """
    def __init__(self):
        self.searchFunction = search.uniformCostSearch
        costFn = lambda pos: 2 ** pos[0]
        self.searchType = lambda state: PositionSearchProblem(state, costFn)
```



## Q4 (3 pts): A* search

在 UCS 的基础上，对 priority 加上 `heuristic(successor)`

```python title="Solution Q4"
def aStarSearch(problem: SearchProblem, heuristic=nullHeuristic):
    """Search the node that has the lowest combined cost and heuristic first."""
    "*** YOUR CODE HERE ***"
    pq = util.PriorityQueue()
    vis = set()
    pq.push((problem.getStartState(), [], 0), 0)
    
    while not pq.isEmpty():
        state, path, cost = pq.pop()
        
        if problem.isGoalState(state):
            return path
        
        if state in vis:
            continue
        vis.add(state)
        
        for successor, action, stepCost in problem.getSuccessors(state):
            if(successor not in vis):
                weigh = cost + stepCost
                pq.push((successor, path + [action], weigh), weigh + heuristic(successor, problem))

    return []
```

## Q5 (3 pts): Finding All the Corners

