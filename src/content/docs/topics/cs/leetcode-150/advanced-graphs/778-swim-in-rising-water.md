---
title: "778. Swim in Rising Water"
description: Find the minimum time (max grid cell on the path) to swim from top-left to bottom-right, Dijkstra on min-max edges.
parent: advanced-graphs
tags: [leetcode, neetcode-150, graphs, dijkstra, binary-search, union-find, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

On an `n × n` grid, `grid[r][c]` is the elevation at `(r, c)`. At time `t`, any cell with elevation ≤ `t` is swimmable; you can move to adjacent cells if both current and next have elevation ≤ `t`. Return the minimum `t` at which you can travel from `(0, 0)` to `(n, 1, n, 1)`.

Equivalently: find the path from top-left to bottom-right that minimizes the **maximum cell value** along it.

**Example**
- `grid = [[0,2],[1,3]]` → `3`
- `grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]` → `16`

LeetCode 778 · [Link](https://leetcode.com/problems/swim-in-rising-water/) · *Hard*

## Approach 1: Brute force, binary search on `t` + BFS

Binary-search the answer. For each candidate `t`, BFS through cells with value ≤ `t` and check reachability.

```python
from collections import deque

def swim_in_water(grid):
    n = len(grid)

    def reachable(t):
        if grid[0][0] > t:
            return False
        visited = {(0, 0)}
        q = deque([(0, 0)])
        while q:
            r, c = q.popleft()
            if (r, c) == (n, 1, n, 1):
                return True
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in visited and grid[nr][nc] <= t:
                    visited.add((nr, nc))
                    q.append((nr, nc))
        return False

    lo, hi = grid[0][0], n * n, 1
    while lo < hi:
        mid = (lo + hi) // 2
        if reachable(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo
```

**Complexity**
- **Time:** O(n² log(n²)) = O(n² log n).
- **Space:** O(n²).

## Approach 2: Modified Dijkstra, min-max path (optimal)

Think of the path cost as `max(cell values on path)` instead of `sum`. Dijkstra still works: at each pop, the priority is the max cell value on the best path to that cell.

```python
import heapq

def swim_in_water(grid):
    n = len(grid)
    heap = [(grid[0][0], 0, 0)]
    visited = set()
    while heap:
        t, r, c = heapq.heappop(heap)
        if (r, c) in visited:
            continue
        visited.add((r, c))
        if (r, c) == (n, 1, n, 1):
            return t
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in visited:
                heapq.heappush(heap, (max(t, grid[nr][nc]), nr, nc))
    return -1
```

**Complexity**
- **Time:** O(n² log n). Each cell pushed/popped once.
- **Space:** O(n²).

## Approach 3: Union-Find with sorted cell activation

Sort cells by elevation. Activate in order; whenever activating a cell merges the start and end into one component, return its elevation.

```python
def swim_in_water(grid):
    n = len(grid)
    # (value, r, c), sorted ascending by value
    cells = sorted((grid[r][c], r, c) for r in range(n) for c in range(n))
    parent = list(range(n * n))
    active = [False] * (n * n)

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb

    for v, r, c in cells:
        idx = r * n + c
        active[idx] = True
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and active[nr * n + nc]:
                union(idx, nr * n + nc)
        if find(0) == find(n * n, 1):
            return v
    return -1
```

**Complexity**
- **Time:** O(n² log n), sorting + near-O(1) union-find ops.
- **Space:** O(n²).

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Binary search + BFS | O(n² log n) | O(n²) | Clean, generalizes |
| **Modified Dijkstra (min-max)** | **O(n² log n)** | **O(n²)** | Canonical |
| Union-Find with sorted cells | O(n² log n) | O(n²) | Neat alternative |

All three are O(n² log n). Dijkstra with min-max edge weights is the most reusable, same template solves problems like "min maximum capacity path."

## Related data structures

- [Graphs](../../../data-structures/graphs/), Dijkstra variant; union-find with sorted edges
- [Heaps / Priority Queues](../../../data-structures/heaps/), Dijkstra frontier
- [Arrays](../../../data-structures/arrays/), grid
