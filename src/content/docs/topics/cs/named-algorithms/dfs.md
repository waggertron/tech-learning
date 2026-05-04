---
title: "Depth-First Search"
description: "Graph and grid traversal that commits to one path until forced to backtrack: recursive and iterative implementations, cycle detection, topological sort, and when DFS beats BFS."
parent: named-algorithms
tags: [algorithms, graphs, dfs, traversal, recursion, backtracking, interviews]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it does

Depth-First Search explores a graph by plunging as deep as possible down one branch before backing up and trying the next. It commits to a neighbor, then commits to *that* node's neighbors, recursing until it hits a dead end, then unwinds and tries alternatives. The result is that DFS visits every node reachable from a given start, but it explores the shape of the graph in depth order rather than distance order.

That commitment-first behavior makes DFS the natural fit for problems that require exhaustive exploration of one path at a time: cycle detection, topological ordering, connected components, and backtracking search. It is also the intuitive shape of recursive tree traversal, which most programmers encounter before they encounter graphs.

## The core idea, in one sentence

> Commit fully to one neighbor, recurse until blocked, then backtrack and try the next.

## Two implementations

### Recursive (clean, natural)

```python
def dfs_recursive(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)
    return visited
```

The call stack *is* the DFS stack. When `dfs_recursive` calls itself on a neighbor, Python pushes a frame; when that call returns, the frame pops and control returns to the loop, which tries the next neighbor. The recursion depth equals the longest path explored so far, so on graphs with thousands of nodes this can overflow Python's default stack limit (~1000 frames). For large inputs, use the iterative version.

### Iterative (explicit stack)

```python
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)
    return visited
```

**Why the neighbor order is reversed vs recursive:** The recursive version processes neighbors left-to-right (first neighbor is visited first). The iterative version pushes all neighbors onto the stack and pops from the top, so the *last* neighbor pushed is visited first. To match recursive order exactly, push neighbors in reverse:

```python
        for neighbor in reversed(graph[node]):
            if neighbor not in visited:
                stack.append(neighbor)
```

For most applications, the order doesn't matter: DFS correctness only requires that every reachable node gets visited. The reversal only matters when the problem asks for a specific traversal order that matches the recursive formulation.

## Why DFS visits every reachable vertex

Proof sketch by induction: at any moment, every node in `visited` was reachable from `start` (the algorithm only follows edges). Conversely, every node reachable from `start` eventually gets marked: if a reachable node `v` is not yet visited, there is a path `start -> ... -> u -> v` where `u` is already visited. When `u` was processed, `v` was pushed (or recursed into), so it will be visited. Termination is guaranteed because `visited` grows by at least one each iteration and is bounded by `|V|`.

## Step-by-step trace

Consider this graph (undirected, adjacency list):

```
A: [B, C]
B: [A, D, E]
C: [A, F]
D: [B]
E: [B]
F: [C]
```

Visually:

```
    A
   / \
  B   C
 / \   \
D   E   F
```

Recursive DFS starting at A, visiting neighbors left-to-right:

```
Call dfs(A)
  visited = {A}
  Neighbor B -> call dfs(B)
    visited = {A, B}
    Neighbor A -> already visited, skip
    Neighbor D -> call dfs(D)
      visited = {A, B, D}
      Neighbor B -> already visited, skip
      return  [D done]
    Neighbor E -> call dfs(E)
      visited = {A, B, D, E}
      Neighbor B -> already visited, skip
      return  [E done]
    return  [B done]
  Neighbor C -> call dfs(C)
    visited = {A, B, D, E, C}
    Neighbor A -> already visited, skip
    Neighbor F -> call dfs(F)
      visited = {A, B, D, E, C, F}
      Neighbor C -> already visited, skip
      return  [F done]
    return  [C done]
  return  [A done]

Final visited order: A, B, D, E, C, F
```

Iterative DFS starting at A (neighbors pushed in given order, last-in-first-out):

```
stack = [A],  visited = {}

Pop A  -> visited = {A},  push B, C  -> stack = [B, C]
Pop C  -> visited = {A, C},  push F  -> stack = [B, F]
Pop F  -> visited = {A, C, F},  no new neighbors  -> stack = [B]
Pop B  -> visited = {A, C, F, B},  push D, E  -> stack = [D, E]
Pop E  -> visited = {A, C, F, B, E},  no new neighbors  -> stack = [D]
Pop D  -> visited = {A, C, F, B, E, D},  no new neighbors  -> stack = []

Final visited order: A, C, F, B, E, D
```

The iterative version explored C before B because C was pushed after B and sits on top of the stack. Same nodes, different traversal order.

## Complexity

| Metric | Cost | Why |
| --- | --- | --- |
| Time | O(V + E) | Each vertex visited once; each edge examined once (or twice in undirected graphs) |
| Space (recursive) | O(V) worst case | Call stack depth equals longest DFS path, up to V on a chain graph |
| Space (iterative) | O(V) worst case | Explicit stack holds at most V nodes |
| Space (visited set) | O(V) | One entry per vertex |

The O(V + E) time bound holds for both directed and undirected graphs, and for both adjacency list and adjacency matrix representations (though adjacency matrix costs O(V^2) to scan all neighbors).

## Application 1: Cycle detection

Plain `visited` tracking cannot detect cycles in directed graphs. Consider: you visit node A, then B, then C. When C points back to B, B is already in `visited`, so you'd skip it. But that skip hides the cycle B -> C -> B.

The fix: track three states instead of two.

- **unvisited** (white): not yet reached
- **in-progress** (gray): currently on the DFS call stack, in the active path
- **done** (black): fully processed, all descendants explored

A back edge, which marks a cycle, is an edge from a gray node to another gray node.

```python
def has_cycle_directed(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node: WHITE for node in graph}

    def dfs(u):
        color[u] = GRAY
        for v in graph[u]:
            if color[v] == GRAY:
                return True        # back edge: cycle found
            if color[v] == WHITE:
                if dfs(v):
                    return True
        color[u] = BLACK
        return False

    return any(dfs(u) for u in graph if color[u] == WHITE)
```

For **undirected** graphs, cycle detection is simpler: if you reach a node that is already visited and it is not the node you came from, there is a cycle. Pass the parent as an extra argument to avoid false positives on the edge you just traversed.

```python
def has_cycle_undirected(graph):
    visited = set()

    def dfs(u, parent):
        visited.add(u)
        for v in graph[u]:
            if v not in visited:
                if dfs(v, u):
                    return True
            elif v != parent:
                return True        # back edge to non-parent: cycle
        return False

    return any(dfs(u, -1) for u in graph if u not in visited)
```

## Application 2: Topological sort

A topological sort orders the nodes of a directed acyclic graph (DAG) so that every edge `u -> v` has `u` before `v` in the result. This is the ordering you want for task scheduling, build systems, and course prerequisites.

**DFS post-order reversal:** when DFS finishes processing a node (all its descendants are done), append it to a list. After the full DFS, reverse the list. The reversal works because a node is appended only after everything it depends on has been appended first, so in the reversed list, dependencies come before dependents.

```python
def topological_sort(graph):
    visited = set()
    order = []

    def dfs(u):
        visited.add(u)
        for v in graph[u]:
            if v not in visited:
                dfs(v)
        order.append(u)    # post-order: append after all descendants

    for u in graph:
        if u not in visited:
            dfs(u)

    return order[::-1]    # reverse gives topological order
```

Example with course prerequisites:

```
courses: 0, 1, 2, 3
edges (prereq -> course): 0->1, 0->2, 1->3, 2->3

DFS from 0:
  Visit 0, recurse to 1
    Visit 1, recurse to 3
      Visit 3, no unvisited neighbors -> append 3
    Back at 1, done -> append 1
  Back at 0, recurse to 2
    Visit 2, 3 already visited -> append 2
  Back at 0, done -> append 0

order (post-order):  [3, 1, 2, 0]
reversed:            [0, 2, 1, 3]  <- topological order
```

Check: 0 before 1 (edge 0->1), 0 before 2 (edge 0->2), 1 before 3 (edge 1->3), 2 before 3 (edge 2->3). All edges respected.

Note: Kahn's algorithm (BFS-based, using in-degree counts) produces the same result via a different mechanism. The DFS post-order approach and Kahn's are equally valid; DFS post-order tends to show up more naturally when you are already doing cycle detection.

## Application 3: Connected components

An undirected graph may be split into several disconnected pieces. To count them or label each node by component, run DFS repeatedly: whenever you find an unvisited node, start a new DFS from it and increment a counter.

```python
def count_components(n, edges):
    graph = {i: [] for i in range(n)}
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set()
    count = 0

    def dfs(u):
        visited.add(u)
        for v in graph[u]:
            if v not in visited:
                dfs(v)

    for u in range(n):
        if u not in visited:
            dfs(u)
            count += 1

    return count
```

Each top-level call to `dfs(u)` fully explores one connected component before the outer loop moves to the next unvisited node. Time is still O(V + E) total because each node and edge is touched once across all DFS calls.

## DFS on grids (flood fill)

A 2-D grid is an implicit graph where each cell is a node and each cell is adjacent to its up, down, left, and right neighbors (sometimes diagonals too). DFS on grids is often called flood fill.

The standard pattern: instead of a separate `visited` set, mutate the grid directly by marking visited cells with a sentinel value. This saves space and avoids the overhead of hashing coordinates.

```python
def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != '1':
            return
        grid[r][c] = '#'    # mark visited in-place
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1

    return count
```

The in-place mutation approach works when the grid is allowed to be modified. If you need to preserve the grid, use a `visited` set of `(row, col)` tuples instead.

Grid DFS is also the core of "surrounded regions" problems: flood-fill from the border to mark cells that are safe, then scan the whole grid treating unmarked cells as trapped.

## When DFS beats BFS

- **Memory on deep or wide graphs:** BFS holds the entire frontier in a queue, which can be O(V) in the worst case at every level. DFS holds only the current path, so for very deep graphs with narrow branching, DFS uses far less memory.
- **Backtracking problems:** when you need to explore all solutions (word search, N-queens, permutations), DFS with backtracking is the natural fit. BFS cannot backtrack because it processes nodes level by level without maintaining path state.
- **Cycle detection:** the "in-progress" gray-node trick requires the call stack to reflect the active path. DFS provides this naturally; BFS does not.
- **Topological sort:** DFS post-order directly produces a topological ordering. BFS (Kahn's) requires computing and maintaining in-degrees separately.
- **Maze solving when any path is acceptable:** DFS finds *a* path quickly. BFS finds the *shortest* path, which is extra work when you don't need it.
- **Tree traversal (pre, in, post-order):** all three are DFS variants. BFS on trees gives level-order, which is rarely what traversal problems want.

## When BFS beats DFS

- **Shortest path in unweighted graphs:** BFS visits nodes in order of their distance from the source. The first time it reaches a node is guaranteed to be via the shortest path. DFS has no such guarantee; it may take a long winding path to a nearby node.
- **Level-by-level processing:** when the problem requires knowing which "level" (hop count) a node is at, BFS is the direct tool. Roto-equivalent with DFS requires tracking depth explicitly.
- **Avoiding deep recursion:** on graphs with long chains, recursive DFS will stack-overflow in Python. BFS avoids this completely.
- **Finding nodes closest to a source first:** BFS radiates outward uniformly. DFS plunges down one branch and may visit a distant node before a nearby one.

Quick reference:

```
Need shortest path?           -> BFS
Need any path / all paths?    -> DFS
Cycle detection (directed)?   -> DFS (gray-node coloring)
Topological sort?             -> DFS post-order (or Kahn's BFS)
Connected components?         -> Either (DFS is slightly simpler)
Grid flood fill?              -> DFS (recursive, in-place mark)
Backtracking?                 -> DFS always
Memory limited, deep graph?   -> DFS
```

## LeetCode exercises

| Problem | What to practice |
| --- | --- |
| [200. Number of Islands](../leetcode-150/graphs/200-number-of-islands/) | Grid DFS, flood fill, in-place marking |
| [130. Surrounded Regions](../leetcode-150/graphs/130-surrounded-regions/) | Border-anchored flood fill, inverse marking |
| [207. Course Schedule](../leetcode-150/graphs/207-course-schedule/) | Cycle detection in directed graph, gray-node coloring |
| [210. Course Schedule II](../leetcode-150/graphs/210-course-schedule-ii/) | Topological sort via DFS post-order |
| [79. Word Search](../leetcode-150/backtracking/079-word-search/) | Grid DFS with backtracking, path state restoration |

## Test cases

```python
from collections import defaultdict

# --- core DFS ---

def dfs_recursive(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)
    return visited

def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)
    return visited

# --- cycle detection ---

def has_cycle_directed(graph):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node: WHITE for node in graph}

    def dfs(u):
        color[u] = GRAY
        for v in graph[u]:
            if color[v] == GRAY:
                return True
            if color[v] == WHITE:
                if dfs(v):
                    return True
        color[u] = BLACK
        return False

    return any(dfs(u) for u in graph if color[u] == WHITE)

# --- topological sort ---

def topological_sort(graph):
    visited = set()
    order = []

    def dfs(u):
        visited.add(u)
        for v in graph[u]:
            if v not in visited:
                dfs(v)
        order.append(u)

    for u in graph:
        if u not in visited:
            dfs(u)

    return order[::-1]

# --- connected components ---

def count_components(n, edges):
    graph = {i: [] for i in range(n)}
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set()
    count = 0

    def dfs(u):
        visited.add(u)
        for v in graph[u]:
            if v not in visited:
                dfs(v)

    for u in range(n):
        if u not in visited:
            dfs(u)
            count += 1

    return count

# --- grid flood fill ---

def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != '1':
            return
        grid[r][c] = '#'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                count += 1

    return count

# --- tests ---

def _run_tests():
    # basic graph for DFS reachability
    graph = {
        'A': ['B', 'C'],
        'B': ['A', 'D', 'E'],
        'C': ['A', 'F'],
        'D': ['B'],
        'E': ['B'],
        'F': ['C'],
    }
    assert dfs_recursive(graph, 'A') == {'A', 'B', 'C', 'D', 'E', 'F'}
    assert dfs_iterative(graph, 'A') == {'A', 'B', 'C', 'D', 'E', 'F'}

    # disconnected graph: only half reachable from A
    graph2 = {'A': ['B'], 'B': ['A'], 'C': ['D'], 'D': ['C']}
    assert dfs_recursive(graph2, 'A') == {'A', 'B'}
    assert dfs_iterative(graph2, 'A') == {'A', 'B'}

    # cycle detection: directed acyclic graph
    dag = {0: [1, 2], 1: [3], 2: [3], 3: []}
    assert has_cycle_directed(dag) == False

    # cycle detection: graph with a cycle 0->1->2->0
    cyclic = {0: [1], 1: [2], 2: [0], 3: []}
    assert has_cycle_directed(cyclic) == True

    # self-loop counts as a cycle
    self_loop = {0: [0], 1: []}
    assert has_cycle_directed(self_loop) == True

    # topological sort: course prereqs
    prereqs = {0: [1, 2], 1: [3], 2: [3], 3: []}
    order = topological_sort(prereqs)
    pos = {node: i for i, node in enumerate(order)}
    for u in prereqs:
        for v in prereqs[u]:
            assert pos[u] < pos[v], f"{u} should come before {v}"

    # topological sort: linear chain
    chain = {0: [1], 1: [2], 2: [3], 3: []}
    chain_order = topological_sort(chain)
    assert chain_order == [0, 1, 2, 3]

    # connected components
    assert count_components(5, [[0,1],[1,2],[3,4]]) == 2
    assert count_components(5, []) == 5
    assert count_components(4, [[0,1],[1,2],[2,3]]) == 1
    assert count_components(1, []) == 1

    # grid flood fill / number of islands
    grid1 = [
        ['1','1','1','1','0'],
        ['1','1','0','1','0'],
        ['1','1','0','0','0'],
        ['0','0','0','0','0'],
    ]
    assert num_islands(grid1) == 1

    grid2 = [
        ['1','1','0','0','0'],
        ['1','1','0','0','0'],
        ['0','0','1','0','0'],
        ['0','0','0','1','1'],
    ]
    assert num_islands(grid2) == 3

    grid3 = [['0','0'],['0','0']]
    assert num_islands(grid3) == 0

    grid4 = [['1']]
    assert num_islands(grid4) == 1

    print("all tests pass")

if __name__ == '__main__':
    _run_tests()
```

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., and Stein, C. (2022). *Introduction to Algorithms*, 4th ed. MIT Press. Chapter 20: Depth-First Search. The authoritative treatment of DFS, the gray/black coloring, and the DFS forest theorem.
- Skiena, S. (2020). *The Algorithm Design Manual*, 3rd ed. Springer. Chapter 7: Graph Traversal. Practical framing of DFS vs BFS tradeoffs and backtracking applications.
- [CP-Algorithms: Depth First Search](https://cp-algorithms.com/graph/depth-first-search.html), competitive programming oriented reference with edge classification (tree, back, forward, cross edges).
- [LeetCode Graph Explore Card](https://leetcode.com/explore/learn/card/graph/), interactive exercises covering DFS-based connected components, cycle detection, and topological sort.

## Related topics

- [Breadth-First Search](./bfs/), the level-order counterpart: use BFS when shortest path or level distance matters
- [Dijkstra's algorithm](./dijkstra/), DFS/BFS generalization with weighted edges and a priority queue
- [LeetCode 150: Graphs](../leetcode-150/graphs/), the canonical graph problems including islands, course schedule, and surrounded regions
- [LeetCode 150: Backtracking](../leetcode-150/backtracking/), DFS with state restoration: word search, N-queens, permutations
- [Data Structures](../data-structures/), stacks (what the iterative version uses explicitly), sets (visited tracking), and adjacency lists (graph representation)
