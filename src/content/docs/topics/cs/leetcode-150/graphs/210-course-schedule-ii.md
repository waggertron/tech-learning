---
title: "210. Course Schedule II (Medium)"
description: Return a valid order to finish all courses, or [] if impossible, topological sort of a DAG.
parent: graphs
tags: [leetcode, neetcode-150, graphs, topological-sort, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

There are `numCourses` courses labeled `0` to `numCourses - 1`. Given prerequisites `[a, b]` meaning course `b` must be taken before `a`, return any ordering of courses you should take to finish all courses. If impossible, return `[]`.

**Example**
- `numCourses = 2`, `prerequisites = [[1, 0]]` → `[0, 1]`
- `numCourses = 4`, `prerequisites = [[1,0],[2,0],[3,1],[3,2]]` → `[0, 1, 2, 3]` or `[0, 2, 1, 3]`
- Cyclic prerequisites → `[]`

LeetCode 210 · [Link](https://leetcode.com/problems/course-schedule-ii/) · *Medium*

## Approach 1: Brute force, check feasibility first, then try to order

Use problem 207 to check for cycles. If none, use a second pass to build the order. Two passes, wasted work.

```python
# Essentially: two passes of the graph, once to detect cycles, once to order.
# Skipping full implementation since it's strictly worse than the one-pass versions.
```

**Complexity**
- **Time:** O(V + E) × 2 = O(V + E).
- **Space:** O(V + E).

## Approach 2: DFS post-order (reversed)

Topological order = reversed post-order of a DFS traversal (on a DAG).

```python
from collections import defaultdict

def find_order(num_courses, prerequisites):
    graph = defaultdict(list)                  # L1: O(E) to build
    for a, b in prerequisites:                 # L2: iterate edges
        graph[b].append(a)                     # L3: O(1) per edge

    WHITE, GRAY, BLACK = 0, 1, 2               # L4: constants
    color = [WHITE] * num_courses              # L5: O(V) array
    order = []                                 # L6: result list
    has_cycle = False                          # L7: flag

    def dfs(n):                                # L8: inner DFS
        nonlocal has_cycle
        if has_cycle:                          # L9: early exit
            return
        color[n] = GRAY                        # L10: mark in-progress
        for nb in graph[n]:                    # L11: visit neighbors, O(deg) total per node
            if color[nb] == WHITE:
                dfs(nb)                        # L12: recurse on unvisited
            elif color[nb] == GRAY:
                has_cycle = True               # L13: back edge = cycle
                return
        color[n] = BLACK                       # L14: mark done
        order.append(n)                        # L15: O(1) amortized

    for c in range(num_courses):               # L16: visit every node
        if color[c] == WHITE:
            dfs(c)                             # L17: O(V + E) total across all calls

    if has_cycle:
        return []
    return order[::-1]                         # L18: O(V) reverse
```

**Where the time goes, line by line**

*Variables: V = numCourses, E = len(prerequisites).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (build graph) | O(1) per edge | E | O(E) |
| L5 (color array) | O(V) | 1 | O(V) |
| L16-L17 (outer loop + DFS) | O(1) per node/edge | V + E total | O(V + E) |
| **L11-L12 (neighbor traversal inside DFS)** | **O(1) per edge** | **E total** | **O(V + E)** ← dominates |
| L18 (reverse) | O(V) | 1 | O(V) |

Each node is colored WHITE → GRAY → BLACK exactly once, and each edge is examined exactly once during the neighbor loops. The total DFS cost across all calls in L16-L17 is O(V + E), not O(V × E).

**Complexity**
- **Time:** O(V + E), driven by L11-L12 (each node and edge visited once).
- **Space:** O(V + E) for the graph and recursion stack.

## Approach 3: Kahn's algorithm (BFS on in-degree), optimal and natural

Incrementally process zero-in-degree nodes; the output order is the topological sort.

```python
from collections import defaultdict, deque

def find_order(num_courses, prerequisites):
    graph = defaultdict(list)                  # L1: adjacency list
    in_deg = [0] * num_courses                 # L2: O(V) in-degree array
    for a, b in prerequisites:                 # L3: O(E) to populate
        graph[b].append(a)                     # L4: O(1) per edge
        in_deg[a] += 1                         # L5: O(1) per edge

    q = deque([i for i in range(num_courses)   # L6: O(V) seed queue
               if in_deg[i] == 0])
    order = []                                 # L7: result
    while q:                                   # L8: outer BFS loop
        n = q.popleft()                        # L9: O(1)
        order.append(n)                        # L10: O(1) amortized
        for nb in graph[n]:                    # L11: visit neighbors
            in_deg[nb] -= 1                    # L12: O(1)
            if in_deg[nb] == 0:
                q.append(nb)                   # L13: O(1) amortized

    return order if len(order) == num_courses else []  # L14: O(1)
```

**Where the time goes, line by line**

*Variables: V = numCourses, E = len(prerequisites).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L5 (build graph + in-degree) | O(1) per edge | E | O(E) |
| L6 (seed queue) | O(V) | 1 | O(V) |
| L8-L10 (dequeue each node) | O(1) | V | O(V) |
| **L11-L13 (neighbor loop)** | **O(1) per edge** | **E total** | **O(V + E)** ← dominates |
| L14 (length check) | O(1) | 1 | O(1) |

Each node enters the queue at most once (when its in-degree hits zero), and each edge is decremented exactly once in L12. The BFS processes the entire graph in a single O(V + E) pass, with no recursion overhead.

**Complexity**
- **Time:** O(V + E), driven by L11-L13 (every edge decremented once).
- **Space:** O(V + E) for the graph, in-degree array, and queue.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Two-pass (cycle + order) | O(V + E) | O(V + E) | Redundant |
| **DFS post-order reversed** | **O(V + E)** | **O(V + E)** | Elegant |
| **Kahn's (BFS in-degree)** | **O(V + E)** | **O(V + E)** | Most natural for this problem |

Kahn's is usually the cleanest answer here, you get feasibility and ordering in one pass. DFS post-order is worth knowing because it generalizes to problems where you need a specific topological ordering (e.g., tie-breaking alphabetically).

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_210.py and run.
# Uses Kahn's algorithm (Approach 3) as the canonical implementation.

from collections import defaultdict, deque

def find_order(num_courses, prerequisites):
    graph = defaultdict(list)
    in_deg = [0] * num_courses
    for a, b in prerequisites:
        graph[b].append(a)
        in_deg[a] += 1
    q = deque([i for i in range(num_courses) if in_deg[i] == 0])
    order = []
    while q:
        n = q.popleft()
        order.append(n)
        for nb in graph[n]:
            in_deg[nb] -= 1
            if in_deg[nb] == 0:
                q.append(nb)
    return order if len(order) == num_courses else []

def _run_tests():
    # Example 1: simple two-course chain
    assert find_order(2, [[1, 0]]) == [0, 1]

    # Example 2: four courses, multiple valid orderings
    result = find_order(4, [[1,0],[2,0],[3,1],[3,2]])
    assert result.index(0) < result.index(1)
    assert result.index(0) < result.index(2)
    assert result.index(1) < result.index(3)
    assert result.index(2) < result.index(3)

    # Cycle: impossible
    assert find_order(2, [[1, 0],[0, 1]]) == []

    # Single course, no prerequisites
    assert find_order(1, []) == [0]

    # No prerequisites at all
    result = find_order(3, [])
    assert set(result) == {0, 1, 2}

    # Longer cycle
    assert find_order(3, [[0,1],[1,2],[2,0]]) == []

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Graphs](../../../data-structures/graphs/), topological sort (Kahn's vs. DFS post-order)
