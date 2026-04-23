---
title: "207. Course Schedule"
description: Determine whether you can finish all courses given a list of prerequisite edges — i.e., whether the graph is a DAG.
parent: graphs
tags: [leetcode, neetcode-150, graphs, topological-sort, cycle-detection, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given `numCourses` courses labeled `0` to `numCourses - 1` and an array `prerequisites` where `prerequisites[i] = [a, b]` means you must take course `b` before course `a`. Return `true` if you can finish all courses — i.e., the prerequisite graph has no cycles.

**Example**
- `numCourses = 2`, `prerequisites = [[1, 0]]` → `true`
- `numCourses = 2`, `prerequisites = [[1, 0], [0, 1]]` → `false`

LeetCode 207 · [Link](https://leetcode.com/problems/course-schedule/) · *Medium*

## Approach 1: Brute force — DFS with path tracking

For each course, DFS tracking the current recursion path; if we hit a course already on the path, it's a cycle.

```python
from collections import defaultdict

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    for a, b in prerequisites:
        graph[b].append(a)

    def has_cycle(start):
        on_path = set()
        def dfs(n):
            if n in on_path:
                return True
            on_path.add(n)
            for nb in graph[n]:
                if dfs(nb):
                    return True
            on_path.remove(n)
            return False
        return dfs(start)

    for c in range(num_courses):
        if has_cycle(c):
            return False
    return True
```

**Complexity**
- **Time:** O(V² + VE). Re-walks the graph from every node.
- **Space:** O(V + E).

Correct but wasteful.

## Approach 2: DFS with three-color cycle detection (optimal)

Each node is `white` (unvisited), `gray` (on the current DFS path), or `black` (finished). A gray-to-gray transition means a cycle.

```python
from collections import defaultdict

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    for a, b in prerequisites:
        graph[b].append(a)

    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * num_courses

    def dfs(n):
        if color[n] == GRAY:
            return False   # cycle
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
```

**Complexity**
- **Time:** O(V + E). Each node is entered once per color transition.
- **Space:** O(V + E).

## Approach 3: Kahn's algorithm (topological sort via BFS on in-degree)

Build an in-degree array. Repeatedly remove nodes with in-degree 0; if we can process all of them, the graph is a DAG.

```python
from collections import defaultdict, deque

def can_finish(num_courses, prerequisites):
    graph = defaultdict(list)
    in_deg = [0] * num_courses
    for a, b in prerequisites:
        graph[b].append(a)
        in_deg[a] += 1

    q = deque([i for i in range(num_courses) if in_deg[i] == 0])
    done = 0
    while q:
        n = q.popleft()
        done += 1
        for nb in graph[n]:
            in_deg[nb] -= 1
            if in_deg[nb] == 0:
                q.append(nb)
    return done == num_courses
```

**Complexity**
- **Time:** O(V + E).
- **Space:** O(V + E).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS from every node | O(V² + VE) | O(V + E) |
| **DFS + three-color** | **O(V + E)** | **O(V + E)** |
| **Kahn's algorithm (BFS)** | **O(V + E)** | **O(V + E)** |

Both DFS+color and Kahn's are optimal. Kahn's generalizes directly to problem 210 where we need the actual ordering, not just feasibility.

## Related data structures

- [Graphs](../../../data-structures/graphs/) — cycle detection; topological sort
- [Hash Tables](../../../data-structures/hash-tables/) — adjacency list (defaultdict)
