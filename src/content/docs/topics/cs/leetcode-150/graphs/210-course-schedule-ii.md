---
title: "210. Course Schedule II"
description: Return a valid order to finish all courses, or [] if impossible, topological sort of a DAG.
parent: graphs
tags: [leetcode, neetcode-150, graphs, topological-sort, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

There are `numCourses` courses labeled `0` to `numCourses, 1`. Given prerequisites `[a, b]` meaning course `b` must be taken before `a`, return any ordering of courses you should take to finish all courses. If impossible, return `[]`.

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
    graph = defaultdict(list)
    for a, b in prerequisites:
        graph[b].append(a)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * num_courses
    order = []
    has_cycle = False

    def dfs(n):
        nonlocal has_cycle
        if has_cycle:
            return
        color[n] = GRAY
        for nb in graph[n]:
            if color[nb] == WHITE:
                dfs(nb)
            elif color[nb] == GRAY:
                has_cycle = True
                return
        color[n] = BLACK
        order.append(n)

    for c in range(num_courses):
        if color[c] == WHITE:
            dfs(c)

    if has_cycle:
        return []
    return order[::-1]
```

**Complexity**
- **Time:** O(V + E).
- **Space:** O(V + E).

## Approach 3: Kahn's algorithm (BFS on in-degree), optimal and natural

Incrementally process zero-in-degree nodes; the output order is the topological sort.

```python
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
```

**Complexity**
- **Time:** O(V + E).
- **Space:** O(V + E).

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Two-pass (cycle + order) | O(V + E) | O(V + E) | Redundant |
| **DFS post-order reversed** | **O(V + E)** | **O(V + E)** | Elegant |
| **Kahn's (BFS in-degree)** | **O(V + E)** | **O(V + E)** | Most natural for this problem |

Kahn's is usually the cleanest answer here, you get feasibility and ordering in one pass. DFS post-order is worth knowing because it generalizes to problems where you need a specific topological ordering (e.g., tie-breaking alphabetically).

## Related data structures

- [Graphs](../../../data-structures/graphs/), topological sort (Kahn's vs. DFS post-order)
