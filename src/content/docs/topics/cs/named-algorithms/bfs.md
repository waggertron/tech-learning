---
title: "Breadth-First Search"
description: "Graph and grid traversal level by level using a queue: why FIFO order gives the shortest path in unweighted graphs, multi-source BFS, and the problems that need BFS instead of DFS."
parent: named-algorithms
tags: [algorithms, graphs, bfs, shortest-path, traversal, interviews]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it does

Breadth-First Search explores a graph or grid by visiting every node at distance 1 before any node at distance 2, every node at distance 2 before any node at distance 3, and so on. It radiates outward from the starting node in concentric shells, like ripples on water.

Because of this layer-by-layer property, BFS is the canonical algorithm for shortest paths in unweighted graphs. When you first reach a node, you have taken the shortest possible route to it. There is no need for a priority queue, no relaxation step, no Dijkstra machinery. The FIFO queue does all the work.

BFS shows up everywhere: finding the nearest exit in a maze, determining if two nodes are connected, computing the minimum number of word-transformation steps, detecting whether a graph is bipartite, and the "rotting oranges" multi-source spread problems on LeetCode.

## The core idea, in one sentence

> Process nodes in the order you discovered them, using a queue, so that nodes closer to the source are always handled before nodes farther away.

That FIFO constraint is the whole algorithm. Everything else is bookkeeping.

## The code

### Graph BFS (adjacency list)

```python
from collections import deque

def bfs(graph, start):
    """
    graph: dict[node, list[node]]  (adjacency list, directed or undirected)
    start: starting node
    Returns: dict mapping each reachable node to its shortest distance from start
    """
    dist = {start: 0}
    queue = deque([start])

    while queue:
        node = queue.popleft()          # FIFO: always process the oldest node first
        for neighbor in graph[node]:
            if neighbor not in dist:    # not yet visited
                dist[neighbor] = dist[node] + 1
                queue.append(neighbor)

    return dist
```

Key invariant: every node enters the queue at most once (the `if neighbor not in dist` guard), so the algorithm terminates in O(V + E).

### Grid BFS (implicit neighbors)

Grids don't need an explicit adjacency list. Encode each cell as `(row, col)` and generate the four directional neighbors on the fly.

```python
from collections import deque

def bfs_grid(grid, start_r, start_c):
    """
    grid: 2-D list of cells ('.' passable, '#' blocked, or any sentinel)
    Returns: 2-D dist array where dist[r][c] = shortest steps from start, -1 if unreachable
    """
    rows, cols = len(grid), len(grid[0])
    dist = [[-1] * cols for _ in range(rows)]
    dist[start_r][start_c] = 0
    queue = deque([(start_r, start_c)])

    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]  # right, left, down, up

    while queue:
        r, c = queue.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != '#' and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))

    return dist
```

The bounds check (`0 <= nr < rows and 0 <= nc < cols`) replaces the adjacency list lookup. Everything else is identical to graph BFS.

## Why FIFO gives shortest paths (proof sketch)

Call the distance of a node from the source its **level**. BFS processes nodes level by level:

```
Level 0:  [source]
Level 1:  [all nodes one edge from source]
Level 2:  [all nodes two edges from source, not already seen]
...
```

**Claim:** when a node `v` is first dequeued, `dist[v]` equals the true shortest-path distance from source to `v`.

**Proof by induction on levels:**

- Base: the source is at level 0. Distance 0 is trivially correct.
- Inductive step: assume every node at levels 0..k has been assigned the correct distance. Now consider a node `u` at level k+1. It was discovered through some node `p` at level k (because `p` had an edge to `u` and was processed before `u`). So `dist[u] = dist[p] + 1 = k + 1`. Could there be a shorter path? Any shorter path would have to pass through a node at level k or earlier, but all those nodes have already been processed, meaning `u` would already have been discovered with a smaller distance. Contradiction. So k+1 is correct.

The FIFO property enforces the ordering: no level-k+1 node can ever be processed before all level-k nodes, because level-k nodes were enqueued first and always dequeue first.

This argument breaks the moment edges have different weights (a level-1 node reached via a weight-100 edge is not closer than a level-2 node reached via two weight-1 edges). That's why weighted graphs need Dijkstra instead.

## Walk through: BFS on a small graph

Graph (undirected):

```
    A
   / \
  B   C
 / \   \
D   E   F
```

Adjacency list:

```
A: [B, C]
B: [A, D, E]
C: [A, F]
D: [B]
E: [B]
F: [C]
```

Start at `A`. Initial state: `queue = [A]`, `dist = {A: 0}`.

| Step | Dequeue | Neighbors     | New in queue | dist                              |
| ---- | ------- | ------------- | ------------ | --------------------------------- |
| 1    | A       | B, C          | B, C         | {A:0, B:1, C:1}                   |
| 2    | B       | A, D, E       | D, E         | {A:0, B:1, C:1, D:2, E:2}        |
| 3    | C       | A, F          | F            | {A:0, B:1, C:1, D:2, E:2, F:2}   |
| 4    | D       | B             | (none new)   | unchanged                         |
| 5    | E       | B             | (none new)   | unchanged                         |
| 6    | F       | C             | (none new)   | unchanged                         |

Final distances: `A=0, B=1, C=1, D=2, E=2, F=2`.

Notice that B and C (level 1) were both fully processed before D, E, F (level 2) were dequeued. That's the queue doing its job. When we first touched D at step 2, we recorded `dist[D] = 2`, the correct shortest path. No later step could have found a shorter route.

## Complexity

| Metric | Cost     | Reason                                                  |
| ------ | -------- | ------------------------------------------------------- |
| Time   | O(V + E) | Each vertex enqueued once; each edge examined at most twice (undirected) |
| Space  | O(V)     | The queue and dist map each hold at most V entries      |

For grids, V = rows * cols and E = 4 * V (four neighbors per cell), so both reduce to O(rows * cols).

## Variant: Multi-source BFS

Sometimes the problem has multiple starting points and you want the shortest distance from any source to every other node. The naive approach runs BFS from each source separately, costing O(S * (V + E)).

The insight: push all sources into the queue at distance 0 simultaneously. The single BFS pass then computes shortest distance from the nearest source to every node in one O(V + E) sweep.

```python
from collections import deque

def multi_source_bfs(graph, sources):
    """
    sources: iterable of starting nodes, all treated as distance 0
    Returns: dist dict from nearest source to every reachable node
    """
    dist = {}
    queue = deque()
    for s in sources:
        dist[s] = 0
        queue.append(s)

    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in dist:
                dist[neighbor] = dist[node] + 1
                queue.append(neighbor)

    return dist
```

**Pattern:** [Rotting Oranges](../coding-problems/graphs/994-rotting-oranges/) ([LeetCode 994](../coding-problems/graphs/994-rotting-oranges/)). Every rotten orange is a source. Push them all at minute 0. The BFS then spreads rot simultaneously from all of them, so `dist[cell]` tells you the first minute the orange at that cell goes rotten. If any fresh orange remains unreachable, return -1.

```python
from collections import deque

def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))   # (row, col, minute)
            elif grid[r][c] == 1:
                fresh += 1

    if fresh == 0:
        return 0

    minutes = 0
    directions = [(0,1),(0,-1),(1,0),(-1,0)]
    while queue:
        r, c, t = queue.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                minutes = t + 1
                queue.append((nr, nc, t + 1))

    return minutes if fresh == 0 else -1
```

## Variant: BFS on a grid

The grid variant is just graph BFS with implicit edges. The four-directional neighbors of cell `(r, c)` are `(r+1, c)`, `(r-1, c)`, `(r, c+1)`, `(r, c-1)`. A visited set (or in-place marking) replaces the `dist` check.

```
Grid (S = start, E = end, # = wall):

  0 1 2 3
0 S . . #
1 . # . .
2 . . . E

BFS from (0,0):

Level 0: (0,0)
Level 1: (0,1), (1,0)
Level 2: (0,2), (2,0)      ← (1,1) is blocked
Level 3: (1,2), (2,1)
Level 4: (1,3), (2,2)
Level 5: (2,3) = E

Shortest path length: 5 steps
```

For problems that ask "does a path exist?" rather than "how many steps?", you can use a visited set and break early on reaching the target:

```python
from collections import deque

def shortest_path_grid(grid, sr, sc, er, ec):
    """Returns shortest step count from (sr,sc) to (er,ec), or -1 if unreachable."""
    if grid[er][ec] == '#':
        return -1
    rows, cols = len(grid), len(grid[0])
    visited = {(sr, sc)}
    queue = deque([(sr, sc, 0)])
    directions = [(0,1),(0,-1),(1,0),(-1,0)]

    while queue:
        r, c, steps = queue.popleft()
        if r == er and c == ec:
            return steps
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != '#' and (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc, steps + 1))

    return -1
```

Mark cells visited when you **enqueue** them, not when you **dequeue** them. Marking on dequeue lets the same cell get enqueued multiple times from different neighbors, which bloats the queue and can produce wrong distances.

## When BFS beats DFS

Use BFS when the problem structure rewards level-by-level processing:

**Shortest path in an unweighted graph or grid.** DFS finds *a* path, not necessarily the shortest one. BFS guarantees the first time you reach the target, you've taken the fewest steps. This is the single biggest reason to reach for BFS.

**Minimum number of operations.** "Minimum word transformations" ([Word Ladder](../coding-problems/graphs/127-word-ladder/), [LeetCode 127](../coding-problems/graphs/127-word-ladder/)), "minimum number of mutations," "minimum moves to solve a puzzle": any time the question asks for a minimum count of discrete steps, model the state space as a graph and run BFS.

**Level-by-level output.** Binary tree level order traversal ([LeetCode 102](../coding-problems/trees/102-binary-tree-level-order-traversal/)) needs BFS because you process an entire level, emit it, then move to the next. DFS would require tracking depth explicitly.

**Detecting if a graph is bipartite.** BFS naturally assigns layers; if any edge connects two nodes in the same layer, the graph has an odd cycle and is not bipartite. DFS works too, but BFS makes the coloring intuitive.

**Multi-source spreading problems.** When every source must spread simultaneously (rotting oranges, walls and gates), multi-source BFS is the only clean solution.

## When DFS beats BFS

BFS is not always the right call. Know when to reach for DFS instead:

**Memory: sparse or deep graphs.** BFS must hold an entire frontier in the queue at once. In a wide graph (high branching factor), the queue can grow to O(V) nodes. DFS only holds the current path from root to the active node: O(depth). On a graph of depth 10 and branching factor 1000, BFS queues up to 10^10 nodes; DFS uses at most 10 stack frames.

**Cycle detection.** DFS with a recursion stack (or an explicit "in-progress" set) detects back edges naturally. BFS can detect cycles too, but the DFS approach maps more cleanly to the standard interview implementations (coloring: white / gray / black).

**Topological sort.** Kahn's algorithm uses BFS (process nodes with in-degree 0), but the classic recursive DFS post-order approach is the more common interview answer and integrates naturally with cycle detection.

**Finding any path (not shortest).** If you just need to know whether a path exists and don't care about length, DFS uses less memory and often exits sooner via backtracking.

**Connected components and flood fill on grids.** DFS (or BFS) both work, but recursive DFS is terser. The choice is stylistic unless the grid is huge enough to overflow the call stack.

**All paths enumeration.** DFS with backtracking explores all paths naturally. BFS needs exponential memory to hold all partial paths simultaneously.

Quick decision rule: if the problem says "shortest," reach for BFS. If it says "all paths," "cycle," "topological," or "connected component," DFS is usually cleaner.

## LeetCode exercises

| Problem | Pattern | Link |
| ------- | ------- | ---- |
| 200. [Number of Islands](../coding-problems/graphs/200-number-of-islands/) | BFS flood fill, connected components | [200 Number of Islands](../coding-problems/graphs/200-number-of-islands/) |
| 994. Rotting Oranges | Multi-source BFS, simultaneous spread | [994 Rotting Oranges](../coding-problems/graphs/994-rotting-oranges/) |
| 127. Word Ladder | BFS on implicit state graph, shortest transformation | [127 Word Ladder](../coding-problems/graphs/127-word-ladder/) |
| 207. [Course Schedule](../coding-problems/graphs/207-course-schedule/) | Kahn's algorithm (BFS topological sort) | [207 Course Schedule](../coding-problems/graphs/207-course-schedule/) |

## Multiple uses

**Bipartite graph check (BFS 2-coloring).** Assign alternating colors as you traverse. If you ever need to assign both colors to a node, the graph is not bipartite. O(V+E).

```python
from collections import deque

def is_bipartite(graph):
    color = {}
    for start in graph:
        if start in color:
            continue
        queue = deque([start])
        color[start] = 0
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if neighbor not in color:
                    color[neighbor] = 1 - color[node]
                    queue.append(neighbor)
                elif color[neighbor] == color[node]:
                    return False
    return True
```

**Shortest path with obstacles on a grid (0/1 BFS).** When edge weights are only 0 or 1, use a deque instead of a heap. Weight-0 edges go to the front (`deque.appendleft`), weight-1 edges go to the back. O(V+E) instead of O((V+E) log V).

```python
from collections import deque

def zero_one_bfs(graph, start):
    """graph: dict[node, list[(neighbor, weight)] where weight in {0, 1}]"""
    dist = {start: 0}
    dq = deque([start])
    while dq:
        node = dq.popleft()
        for neighbor, weight in graph[node]:
            new_dist = dist[node] + weight
            if neighbor not in dist or new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                if weight == 0:
                    dq.appendleft(neighbor)  # free edge: process immediately
                else:
                    dq.append(neighbor)      # cost-1 edge: process later
    return dist
```

**Word ladder (BFS on implicit graph).** Each word is a node; two words are adjacent if they differ by one character. BFS gives the minimum transformation steps. The graph is never explicitly built; neighbors are generated on the fly.

```python
from collections import deque

def word_ladder(begin_word, end_word, word_list):
    word_set = set(word_list)
    if end_word not in word_set:
        return 0
    queue = deque([(begin_word, 1)])
    visited = {begin_word}
    while queue:
        word, steps = queue.popleft()
        for i in range(len(word)):
            for ch in 'abcdefghijklmnopqrstuvwxyz':
                candidate = word[:i] + ch + word[i+1:]
                if candidate == end_word:
                    return steps + 1
                if candidate in word_set and candidate not in visited:
                    visited.add(candidate)
                    queue.append((candidate, steps + 1))
    return 0
```

**Minimum steps to spread (multi-source BFS).** Rotting oranges style: all initial sources pushed at time=0, BFS propagates outward. The answer is the time when the last reachable node is visited.

```python
from collections import deque

def min_steps_to_spread(grid):
    """grid cells: 0=empty, 1=fresh, 2=source. Returns time for all fresh to be reached, -1 if impossible."""
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))
            elif grid[r][c] == 1:
                fresh += 1
    if fresh == 0:
        return 0
    directions = [(0,1),(0,-1),(1,0),(-1,0)]
    time = 0
    while queue:
        r, c, t = queue.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                time = t + 1
                queue.append((nr, nc, t + 1))
    return time if fresh == 0 else -1
```

## Test cases

```python
from collections import deque


def bfs(graph, start):
    dist = {start: 0}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in dist:
                dist[neighbor] = dist[node] + 1
                queue.append(neighbor)
    return dist


def bfs_grid(grid, start_r, start_c):
    rows, cols = len(grid), len(grid[0])
    dist = [[-1] * cols for _ in range(rows)]
    dist[start_r][start_c] = 0
    queue = deque([(start_r, start_c)])
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    while queue:
        r, c = queue.popleft()
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != '#' and dist[nr][nc] == -1:
                dist[nr][nc] = dist[r][c] + 1
                queue.append((nr, nc))
    return dist


def multi_source_bfs(graph, sources):
    dist = {}
    queue = deque()
    for s in sources:
        dist[s] = 0
        queue.append(s)
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in dist:
                dist[neighbor] = dist[node] + 1
                queue.append(neighbor)
    return dist


def _run_tests():
    # --- graph BFS: the tree example from the walkthrough ---
    graph = {
        'A': ['B', 'C'],
        'B': ['A', 'D', 'E'],
        'C': ['A', 'F'],
        'D': ['B'],
        'E': ['B'],
        'F': ['C'],
    }
    dist = bfs(graph, 'A')
    assert dist['A'] == 0
    assert dist['B'] == 1
    assert dist['C'] == 1
    assert dist['D'] == 2
    assert dist['E'] == 2
    assert dist['F'] == 2

    # --- graph BFS: linear chain ---
    chain = {0: [1], 1: [0, 2], 2: [1, 3], 3: [2]}
    d = bfs(chain, 0)
    assert d == {0: 0, 1: 1, 2: 2, 3: 3}

    # --- graph BFS: disconnected node is not reached ---
    disc = {0: [1], 1: [0], 2: []}   # node 2 is isolated
    d = bfs(disc, 0)
    assert 2 not in d

    # --- graph BFS: single node ---
    single = {0: []}
    d = bfs(single, 0)
    assert d == {0: 0}

    # --- graph BFS: cycle ---
    cycle = {0: [1, 2], 1: [0, 2], 2: [0, 1]}
    d = bfs(cycle, 0)
    assert d[1] == 1 and d[2] == 1

    # --- multi-source BFS ---
    ms_graph = {
        0: [1, 2],
        1: [0, 3],
        2: [0, 3],
        3: [1, 2, 4],
        4: [3],
    }
    d = multi_source_bfs(ms_graph, [0, 4])
    assert d[0] == 0
    assert d[4] == 0
    assert d[3] == 1   # adjacent to source 4
    assert d[1] == 2   # 4->3->1
    assert d[2] == 2   # 4->3->2

    # --- grid BFS: open grid ---
    grid = [
        ['.', '.', '.'],
        ['.', '.', '.'],
        ['.', '.', '.'],
    ]
    d = bfs_grid(grid, 0, 0)
    assert d[0][0] == 0
    assert d[0][1] == 1
    assert d[1][0] == 1
    assert d[2][2] == 4

    # --- grid BFS: wall blocks direct path ---
    walled = [
        ['.', '#', '.'],
        ['.', '#', '.'],
        ['.', '.', '.'],
    ]
    d = bfs_grid(walled, 0, 0)
    assert d[0][2] == 4   # must go around the wall
    assert d[1][2] == 3

    # --- grid BFS: fully blocked, cell unreachable ---
    blocked = [
        ['.', '#'],
        ['#', '.'],
    ]
    d = bfs_grid(blocked, 0, 0)
    assert d[1][1] == -1   # unreachable

    print("all tests pass")


if __name__ == '__main__':
    _run_tests()
```

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., and Stein, C. (2022). *Introduction to Algorithms*, 4th ed. MIT Press. Chapter 22: Elementary Graph Algorithms.
- [CP-Algorithms: Breadth-First Search](https://cp-algorithms.com/graph/bfs.html), a concise reference with proof and applications.
- [LeetCode Explore: Graph](https://leetcode.com/explore/learn/card/graph/), interactive BFS and DFS exercises with editorial hints.

## Related topics

- [Depth-First Search](./dfs/), the stack-based alternative and when to use it over BFS
- [Dijkstra's Algorithm](./dijkstra/), BFS extended to weighted graphs with a priority queue
- [Graphs (LeetCode 150)](../coding-problems/graphs/), the problem set where BFS appears most often
- [Data Structures](../data-structures/), queues, sets, and adjacency representations that BFS depends on
