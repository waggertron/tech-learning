---
title: "207. Course Schedule (Medium)"
description: Determine whether you can finish all courses given a list of prerequisite edges, i.e., whether the graph is a DAG.
parent: graphs
tags: [leetcode, neetcode-150, graphs, topological-sort, cycle-detection, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given `numCourses` courses labeled `0` to `numCourses - 1` and an array `prerequisites` where `prerequisites[i] = [a, b]` means you must take course `b` before course `a`. Return `true` if you can finish all courses, i.e., the prerequisite graph has no cycles.

**Example**
- `numCourses = 2`, `prerequisites = [[1, 0]]` → `true`
- `numCourses = 2`, `prerequisites = [[1, 0], [0, 1]]` → `false`

LeetCode 207 · [Link](https://leetcode.com/problems/course-schedule/) · *Medium*

## Approach 1: Brute force, DFS with path tracking

For each course, DFS tracking the current recursion path; if we hit a course already on the path, it's a cycle.

```python
from collections import defaultdict

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    for a, b in prerequisites:                   # L1: O(E) build adjacency list
        graph[b].append(a)

    def has_cycle(start):
        on_path = set()                          # L2: O(1) init per call
        def dfs(n):
            if n in on_path:                     # L3: O(1) membership check
                return True
            on_path.add(n)                       # L4: O(1)
            for nb in graph[n]:                  # L5: iterate neighbors
                if dfs(nb):                      # L6: recurse
                    return True
            on_path.remove(n)                    # L7: O(1) backtrack
            return False
        return dfs(start)

    for c in range(num_courses):                 # L8: call has_cycle for every node
        if has_cycle(c):
            return False
    return True
```

**Where the time goes, line by line**

*Variables: V = numCourses, E = len(prerequisites).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (build graph) | O(1) per edge | E | O(E) |
| L8 (outer loop) | varies | V | V invocations of has_cycle |
| L3, L4, L7 (path ops) | O(1) | per node visited | - |
| L5, L6 (DFS traversal) | O(V + E) per start | V | O(V) calls × O(V + E) each |
| **L8 total** | **O(V + E)** | **V** | **O(V² + VE) ← dominates** |

Because `on_path` is reset on every call to `has_cycle`, there is no memoization. A node reachable from k different starting points is fully re-explored k times. In a dense graph (E near V²), this blows up to O(V³).

**Complexity**
- **Time:** O(V² + VE), driven by L8 (re-walking the graph from every node).
- **Space:** O(V + E).

Correct but wasteful.

## Approach 2: DFS with three-color cycle detection (optimal)

Each node is `white` (unvisited), `gray` (on the current DFS path), or `black` (finished). A gray-to-gray transition means a cycle.

```python
from collections import defaultdict

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    for a, b in prerequisites:                   # L1: O(E) build graph
        graph[b].append(a)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * num_courses                # L2: O(V) init color array

    def dfs(n):
        if color[n] == GRAY:                     # L3: O(1) back-edge check
            return False   # cycle
        if color[n] == BLACK:                    # L4: O(1) already done
            return True
        color[n] = GRAY                          # L5: O(1) mark in-progress
        for nb in graph[n]:                      # L6: iterate neighbors
            if not dfs(nb):                      # L7: recurse
                return False
        color[n] = BLACK                         # L8: O(1) mark complete
        return True

    for c in range(num_courses):                 # L9: outer loop over all nodes
        if not dfs(c):
            return False
    return True
```

**Where the time goes, line by line**

*Variables: V = numCourses, E = len(prerequisites).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (build graph) | O(1) per edge | E | O(E) |
| L2 (init colors) | O(V) | 1 | O(V) |
| L3, L4 (color checks) | O(1) | once per node entry | O(V) total |
| **L5, L8 (color transitions)** | **O(1)** | **each node goes WHITE→GRAY→BLACK once** | **O(V) total** |
| **L6, L7 (edge traversal)** | **O(1) per edge** | **each edge visited at most once** | **O(E) ← dominates** |

The BLACK check at L4 is the memoization that makes this O(V + E) instead of O(V² + VE). Once a node is colored BLACK, any future DFS that reaches it returns immediately without re-exploring its subtree.

**Complexity**
- **Time:** O(V + E), driven by L6/L7 (each edge visited at most once across the whole run).
- **Space:** O(V + E).

## Approach 3: Kahn's algorithm (topological sort via BFS on in-degree)

Build an in-degree array. Repeatedly remove nodes with in-degree 0; if we can process all of them, the graph is a DAG.

```python
from collections import defaultdict, deque

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    in_deg = [0] * num_courses                   # L1: O(V) init in-degree
    for a, b in prerequisites:                   # L2: O(E) build graph + in-degrees
        graph[b].append(a)
        in_deg[a] += 1

    q = deque([i for i in range(num_courses) if in_deg[i] == 0])  # L3: O(V) seed queue
    done = 0                                     # L4: O(1)
    while q:                                     # L5: process until queue empty
        n = q.popleft()                          # L6: O(1) dequeue
        done += 1                                # L7: O(1) count processed
        for nb in graph[n]:                      # L8: iterate neighbors
            in_deg[nb] -= 1                      # L9: O(1) decrement in-degree
            if in_deg[nb] == 0:
                q.append(nb)                     # L10: O(1) enqueue newly free node
    return done == num_courses                   # L11: O(1)
```

**Where the time goes, line by line**

*Variables: V = numCourses, E = len(prerequisites).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init in-degree) | O(V) | 1 | O(V) |
| L2 (build graph) | O(1) per edge | E | O(E) |
| L3 (seed queue) | O(V) | 1 | O(V) |
| L6 (dequeue) | O(1) | at most V | O(V) |
| **L8, L9, L10 (edge processing)** | **O(1) per edge** | **each edge visited at most once** | **O(E) ← dominates** |
| L11 (comparison) | O(1) | 1 | O(1) |

Each directed edge causes exactly one decrement at L9 and at most one enqueue at L10. No edge is processed twice. The total work is proportional to V + E, matching the DFS approach.

**Complexity**
- **Time:** O(V + E), driven by L8/L9/L10 (each edge processed once).
- **Space:** O(V + E).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS from every node | O(V² + VE) | O(V + E) |
| **DFS + three-color** | **O(V + E)** | **O(V + E)** |
| **Kahn's algorithm (BFS)** | **O(V + E)** | **O(V + E)** |

Both DFS+color and Kahn's are optimal. Kahn's generalizes directly to problem 210 where we need the actual ordering, not just feasibility.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_207.py and run.
# Uses the canonical implementation (Approach 2: DFS three-color).

from collections import defaultdict

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    for a, b in prerequisites:
        graph[b].append(a)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * num_courses

    def dfs(n):
        if color[n] == GRAY:
            return False
        if color[n] == BLACK:
            return True
        color[n] = GRAY
        for nb in graph[n]:
            if not dfs(nb):
                return False
        color[n] = BLACK
        return True

    for c in range(num_courses):
        if not dfs(c):
            return False
    return True


def _run_tests():
    # Example 1: simple chain, no cycle
    assert can_finish(2, [[1, 0]]) == True

    # Example 2: direct cycle
    assert can_finish(2, [[1, 0], [0, 1]]) == False

    # Edge: no prerequisites, trivially true
    assert can_finish(5, []) == True

    # Edge: single course, no prerequisites
    assert can_finish(1, []) == True

    # Larger cycle (3 nodes)
    assert can_finish(3, [[1, 0], [2, 1], [0, 2]]) == False

    # Larger DAG (no cycle)
    assert can_finish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]) == True

    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Graphs](../../../data-structures/graphs/), cycle detection; topological sort
- [Hash Tables](../../../data-structures/hash-tables/), adjacency list (defaultdict)
