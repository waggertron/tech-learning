---
title: "Kahn's algorithm"
description: "Topological sort via BFS: repeatedly pick nodes with no incoming edges, output them, and remove their edges until the graph is empty or a cycle is detected."
parent: named-algorithms
tags: [algorithms, graphs, topological-sort, bfs, dag, interviews]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it does

Given a **directed acyclic graph (DAG)**, produce a linear ordering of all vertices such that for every directed edge `u -> v`, vertex `u` appears before vertex `v` in the output. This is called a **topological sort**.

The canonical framing: you have courses, each with a list of prerequisites. You need to find an order to take all courses so that you never take a course before completing its prerequisites. That is a topological sort problem.

Named after Arthur B. Kahn, who described the algorithm in 1962. It is the standard BFS-based answer to LeetCode 207 (Course Schedule) and 210 (Course Schedule II), and it appears in every build system, package manager, and task scheduler worth naming.

Topological sort is only possible on a DAG: a directed graph with no cycles. If a cycle exists, there is no valid ordering (course A requires B, B requires C, C requires A). Kahn's algorithm detects this condition automatically.

## The core idea, in one sentence

> Process nodes in dependency order by repeatedly picking any node with in-degree zero (no remaining prerequisites), outputting it, and decrementing the in-degree of all its neighbors until the graph is empty or no zero-in-degree node remains.

A node with in-degree zero has no unprocessed predecessors. It is always safe to output next. Removing it may expose new zero-in-degree nodes, which then become candidates. This is BFS over the "layers" of the DAG.

## The code

```python
from collections import deque

def topological_sort(num_nodes, edges):
    """
    Returns a topological ordering, or [] if the graph has a cycle.

    num_nodes: int, vertices labeled 0..num_nodes-1
    edges: list of (u, v) meaning u must come before v
    """
    # Build adjacency list and in-degree array
    adj = [[] for _ in range(num_nodes)]
    in_degree = [0] * num_nodes

    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1

    # Seed the queue with every node that has no prerequisites
    queue = deque()
    for node in range(num_nodes):
        if in_degree[node] == 0:
            queue.append(node)

    order = []
    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in adj[node]:
            in_degree[neighbor] -= 1          # remove the edge
            if in_degree[neighbor] == 0:      # neighbor is now free
                queue.append(neighbor)

    # If we didn't output all nodes, there's a cycle
    if len(order) < num_nodes:
        return []   # cycle detected

    return order
```

Key variables:
- `adj[u]` = list of nodes that depend on `u` (outgoing edges)
- `in_degree[v]` = number of unprocessed predecessors of `v`
- `queue` = all nodes currently safe to process (in-degree zero)
- `order` = the growing topological order output

## Why it is correct

The invariant: **a node enters the queue exactly when its in-degree drops to zero**, meaning every prerequisite of that node has already been added to `order`.

Proof sketch:

1. Initially, every node in the queue genuinely has no prerequisites (in-degree was zero from the start).
2. When we process node `u` and decrement `in_degree[v]`, we are "crossing off" one prerequisite of `v`. The decrement only happens after `u` is already in `order`.
3. When `in_degree[v]` reaches zero, every predecessor of `v` is in `order` ahead of `v`. So placing `v` next never violates the ordering constraint.
4. No edge `u -> v` can cause `v` to appear before `u`: `v`'s in-degree starts at 1 or more (counting the `u -> v` edge), and it can only reach zero after `u` is processed and that edge is removed.

Output order is safe at every step. The algorithm never backtracks because it never needs to.

## Cycle detection

If the graph has a cycle, every node inside the cycle has at least one predecessor also inside the cycle. Their in-degrees never reach zero because the predecessor that would decrement them is also stuck waiting. They are never enqueued. They are never output.

The check is one line:

```python
if len(order) < num_nodes:
    return []  # cycle exists
```

If `order` has fewer than `num_nodes` entries after the BFS, the missing nodes are exactly those in (or blocked by) cycles.

This is one of Kahn's key advantages over DFS-based topological sort: cycle detection falls out of the algorithm for free, with no extra bookkeeping.

## Concrete walkthrough

Six courses with prerequisites:

```
  0 --> 2 --> 4
  |         ^
  v         |
  1 --> 3 --+
        |
        v
        5
```

Edges: `(0,1), (0,2), (1,3), (2,4), (3,4), (3,5)`

**Initial in-degree array:**

| Node | 0 | 1 | 2 | 3 | 4 | 5 |
| ---- | - | - | - | - | - | - |
| in-degree | 0 | 1 | 1 | 1 | 2 | 1 |

Node 0 is the only node with in-degree 0. Seed the queue: `[0]`.

---

**Step 1: process node 0**

Output: `[0]`

Node 0 has neighbors 1 and 2. Decrement their in-degrees:
- `in_degree[1]` = 1 - 1 = 0 -> enqueue 1
- `in_degree[2]` = 1 - 1 = 0 -> enqueue 2

Queue: `[1, 2]`

| Node | 0 | 1 | 2 | 3 | 4 | 5 |
| ---- | - | - | - | - | - | - |
| in-degree | (done) | 0 | 0 | 1 | 2 | 1 |

---

**Step 2: process node 1**

Output: `[0, 1]`

Node 1 has neighbor 3. Decrement:
- `in_degree[3]` = 1 - 1 = 0 -> enqueue 3

Queue: `[2, 3]`

| Node | 0 | 1 | 2 | 3 | 4 | 5 |
| ---- | - | - | - | - | - | - |
| in-degree | - | - | 0 | 0 | 2 | 1 |

---

**Step 3: process node 2**

Output: `[0, 1, 2]`

Node 2 has neighbor 4. Decrement:
- `in_degree[4]` = 2 - 1 = 1 -> not yet zero, do not enqueue

Queue: `[3]`

| Node | 0 | 1 | 2 | 3 | 4 | 5 |
| ---- | - | - | - | - | - | - |
| in-degree | - | - | - | 0 | 1 | 1 |

---

**Step 4: process node 3**

Output: `[0, 1, 2, 3]`

Node 3 has neighbors 4 and 5. Decrement:
- `in_degree[4]` = 1 - 1 = 0 -> enqueue 4
- `in_degree[5]` = 1 - 1 = 0 -> enqueue 5

Queue: `[4, 5]`

| Node | 0 | 1 | 2 | 3 | 4 | 5 |
| ---- | - | - | - | - | - | - |
| in-degree | - | - | - | - | 0 | 0 |

---

**Step 5: process node 4**

Output: `[0, 1, 2, 3, 4]`

Node 4 has no outgoing edges. Queue: `[5]`

---

**Step 6: process node 5**

Output: `[0, 1, 2, 3, 4, 5]`

Node 5 has no outgoing edges. Queue: `[]`. Done.

`len(order) == 6 == num_nodes`. No cycle. Valid topological order: `0, 1, 2, 3, 4, 5`.

You can verify: every edge `u -> v` has `u` appearing before `v` in the output.

## Complexity

| Metric | Cost | Why |
| --- | --- | --- |
| Time | O(V + E) | Each node enters the queue once (O(V)), each edge is examined once during the decrement step (O(E)) |
| Space | O(V + E) | Adjacency list stores all edges (O(E)), in-degree array and queue are O(V) |

V = number of vertices, E = number of edges. This is optimal: you must look at every node and every edge at least once to produce a correct ordering.

## DFS-based topological sort: the alternative

There are two standard ways to topological-sort a DAG. Kahn's is BFS. The other is DFS with post-order reversal.

```python
def topological_sort_dfs(num_nodes, edges):
    adj = [[] for _ in range(num_nodes)]
    for u, v in edges:
        adj[u].append(v)

    UNVISITED, VISITING, VISITED = 0, 1, 2
    state = [UNVISITED] * num_nodes
    order = []
    has_cycle = [False]

    def dfs(node):
        if has_cycle[0]:
            return
        state[node] = VISITING
        for neighbor in adj[node]:
            if state[neighbor] == VISITING:
                has_cycle[0] = True
                return
            if state[neighbor] == UNVISITED:
                dfs(neighbor)
        state[node] = VISITED
        order.append(node)   # post-order: append after all descendants

    for node in range(num_nodes):
        if state[node] == UNVISITED:
            dfs(node)

    if has_cycle[0]:
        return []
    return order[::-1]   # reverse post-order = topological order
```

The DFS approach appends each node only after it has finished processing all its descendants. Reversing that post-order gives the topological sort.

**Comparison:**

| Aspect | Kahn's (BFS) | DFS post-order |
| --- | --- | --- |
| Traversal | BFS with queue | DFS with recursion |
| Cycle detection | Naturally: `len(order) < V` | Requires tracking VISITING state |
| Iterative? | Yes, trivially | Requires explicit stack to avoid recursion limit |
| Mental model | "Peel off roots repeatedly" | "Finish all descendants before committing" |
| Output order | Breadth-first layers | Reverse post-order |
| Same complexity | O(V + E) | O(V + E) |

Both are correct and efficient. Kahn's is generally preferred in interviews because:
- Cycle detection requires no extra state beyond `len(order) < V`.
- It is naturally iterative (no recursion limit concerns on large graphs).
- The in-degree array makes the "no remaining dependencies" condition explicit and easy to explain.

## Application: build systems and task scheduling

A build system like Make or Bazel models source files and build targets as a DAG: target A depends on B, B depends on C. Kahn's algorithm determines which targets to build and in what order. Targets with no unbuilt dependencies are queued and built in parallel; finishing each one decrements the in-degree of its dependents, exposing new targets to build.

Task schedulers use the same pattern. Given a list of tasks with "task X must complete before task Y" constraints, Kahn's finds a valid execution sequence (or reports an impossible constraint graph).

## Application: circular dependency detection in module graphs

A large codebase's import graph is a directed graph: module A imports B, B imports C. Circular imports (`A -> B -> C -> A`) cause problems in many languages and build systems.

Run Kahn's on the import graph. If `len(order) < num_modules`, the modules not in `order` are part of a cycle. You can report which modules are stuck (their in-degrees never reached zero) as the circular dependency candidates.

```python
def find_circular_dependencies(modules, imports):
    """
    modules: list of module names
    imports: list of (importer, importee) tuples

    Returns: list of modules involved in cycles
    """
    idx = {m: i for i, m in enumerate(modules)}
    n = len(modules)
    adj = [[] for _ in range(n)]
    in_degree = [0] * n

    for importer, importee in imports:
        u, v = idx[importer], idx[importee]
        adj[u].append(v)
        in_degree[v] += 1

    queue = deque(i for i in range(n) if in_degree[i] == 0)
    visited_count = 0

    while queue:
        node = queue.popleft()
        visited_count += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # Modules with in_degree > 0 were never freed: they're in cycles
    return [modules[i] for i in range(n) if in_degree[i] > 0]
```

## Variant: lexicographically smallest topological sort

Standard Kahn's uses a `deque`. When multiple nodes have in-degree zero simultaneously, the output order among them is arbitrary.

If the problem asks for the **lexicographically smallest** topological ordering, swap the `deque` for a **min-heap**:

```python
import heapq

def topological_sort_lex(num_nodes, edges):
    adj = [[] for _ in range(num_nodes)]
    in_degree = [0] * num_nodes

    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1

    heap = [node for node in range(num_nodes) if in_degree[node] == 0]
    heapq.heapify(heap)

    order = []
    while heap:
        node = heapq.heappop(heap)   # always pick the smallest available
        order.append(node)
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                heapq.heappush(heap, neighbor)

    return order if len(order) == num_nodes else []
```

The only change: `deque.popleft()` becomes `heapq.heappop()`, and `queue.append()` becomes `heapq.heappush()`. Complexity changes from O(V + E) to O((V + E) log V) because each heap operation costs O(log V).

This variant appears in LeetCode 269 (Alien Dictionary), where you reconstruct a lexicographic character ordering from sorted word pairs.

## When Kahn's is the answer

Reach for Kahn's when you see:

- **"Given dependencies, find a valid processing order"**: courses, packages, build targets, tasks with prerequisites.
- **"Detect circular dependencies"**: import graphs, configuration dependencies, lock-order validation.
- **"Is this ordering possible?"** (LeetCode 207): run Kahn's, check `len(order) == V`.
- **"Find a valid ordering"** (LeetCode 210): run Kahn's, return `order` or `[]`.
- **"Lexicographically smallest ordering"**: Kahn's with a min-heap.
- **"How many valid orderings exist?"**: Kahn's with a counter: when `len(queue) > 1`, multiply the count by the number of choices at that step. This gives the total count of valid topological orderings.

Counter-clues: if the graph has undirected edges, or if you need to find strongly connected components, Kahn's is not the right tool (reach for Tarjan's instead).

## LeetCode exercises

- [207, Course Schedule](../leetcode-150/graphs/207-course-schedule/): can you finish all courses? Run Kahn's, check `len(order) == numCourses`.
- [210, Course Schedule II](../leetcode-150/graphs/210-course-schedule-ii/): return a valid course order, or `[]` if impossible.
- [269, Alien Dictionary](../leetcode-150/graphs/269-alien-dictionary/): reconstruct a character ordering from a sorted alien word list. Lexicographic Kahn's with a min-heap.

## Test cases

```python
from collections import deque

def topological_sort(num_nodes, edges):
    adj = [[] for _ in range(num_nodes)]
    in_degree = [0] * num_nodes
    for u, v in edges:
        adj[u].append(v)
        in_degree[v] += 1
    queue = deque(n for n in range(num_nodes) if in_degree[n] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return order if len(order) == num_nodes else []

def is_valid_topo_order(order, num_nodes, edges):
    """Verify that the returned order is a valid topological sort."""
    if len(order) != num_nodes:
        return False
    position = {node: i for i, node in enumerate(order)}
    return all(position[u] < position[v] for u, v in edges)

def _run_tests():
    # Basic DAG
    result = topological_sort(4, [(0, 1), (0, 2), (1, 3), (2, 3)])
    assert is_valid_topo_order(result, 4, [(0, 1), (0, 2), (1, 3), (2, 3)])

    # Six-node DAG from the walkthrough above
    edges6 = [(0, 1), (0, 2), (1, 3), (2, 4), (3, 4), (3, 5)]
    result = topological_sort(6, edges6)
    assert is_valid_topo_order(result, 6, edges6)

    # Single node, no edges
    result = topological_sort(1, [])
    assert result == [0]

    # Two independent nodes
    result = topological_sort(2, [])
    assert set(result) == {0, 1}

    # Simple cycle: 0 -> 1 -> 0
    result = topological_sort(2, [(0, 1), (1, 0)])
    assert result == []

    # Longer cycle embedded in a larger graph: 1 -> 2 -> 3 -> 1, node 0 is separate
    result = topological_sort(4, [(0, 1), (1, 2), (2, 3), (3, 1)])
    assert result == []

    # Linear chain: 0 -> 1 -> 2 -> 3 -> 4
    result = topological_sort(5, [(0, 1), (1, 2), (2, 3), (3, 4)])
    assert result == [0, 1, 2, 3, 4]

    # Diamond: 0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3
    edges_diamond = [(0, 1), (0, 2), (1, 3), (2, 3)]
    result = topological_sort(4, edges_diamond)
    assert is_valid_topo_order(result, 4, edges_diamond)

    # Already-sorted nodes with no edges
    result = topological_sort(3, [])
    assert len(result) == 3 and set(result) == {0, 1, 2}

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## References

- Kahn, A. B. (1962). "Topological sorting of large networks." *Communications of the ACM*, 5(11), 558-562. The original paper.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.), Section 22.4: Topological sort. MIT Press. Covers both Kahn's and the DFS-based approach with formal correctness proofs.

## Related topics

- [DFS](./dfs/), the basis of the alternative post-order topological sort
- [BFS](./bfs/), the traversal strategy Kahn's is built on
- [Tarjan's algorithm](./tarjans/), for strongly connected components and cycle detection in directed graphs
- [LeetCode 150 Graphs](../leetcode-150/graphs/), where most interview applications of Kahn's appear
