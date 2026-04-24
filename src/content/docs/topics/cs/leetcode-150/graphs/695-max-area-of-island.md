---
title: "695. Max Area of Island"
description: Find the largest island by cell count in a 2D grid.
parent: graphs
tags: [leetcode, neetcode-150, graphs, dfs, bfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a binary 2D grid where `1` is land and `0` is water, return the maximum area of an island. An island is a connected set of `1`s (4-directional).

**Example**
- A 51-island grid like the one in the problem → `6`
- `grid = [[0, 0, 0, 0, 0, 0, 0, 0]]` → `0`

LeetCode 695 · [Link](https://leetcode.com/problems/max-area-of-island/) · *Medium*

## Approach 1: DFS returning island area

Same template as Number of Islands, but the DFS returns the size of the connected component instead of just marking it.

```python
def max_area_of_island(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != 1:
            return 0
        grid[r][c] = 0
        return 1 + dfs(r + 1, c) + dfs(r, 1, c) + dfs(r, c + 1) + dfs(r, c, 1)

    best = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                best = max(best, dfs(r, c))
    return best
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n) recursion worst case.

## Approach 2: BFS with area counting

Equivalent structure; avoids deep recursion.

```python
from collections import deque

def max_area_of_island(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    best = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] != 1:
                continue
            area = 0
            q = deque([(r, c)])
            grid[r][c] = 0
            while q:
                x, y = q.popleft()
                area += 1
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 1:
                        grid[nx][ny] = 0
                        q.append((nx, ny))
            best = max(best, area)
    return best
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(min(m, n)) queue frontier.

## Approach 3: Union-Find with component sizes

Union land neighbors; track size per root; take the max.

```python
def max_area_of_island(grid):
    rows, cols = len(grid), len(grid[0])
    parent = {}
    size = {}

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return
        if size[ra] < size[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        size[ra] += size[rb]

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                i = r * cols + c
                parent[i] = i
                size[i] = 1

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                i = r * cols + c
                if r + 1 < rows and grid[r + 1][c] == 1:
                    union(i, (r + 1) * cols + c)
                if c + 1 < cols and grid[r][c + 1] == 1:
                    union(i, r * cols + c + 1)

    return max(size[find(k)] for k in parent) if parent else 0
```

**Complexity**
- **Time:** O(m · n · α(m · n)) ≈ O(m · n).
- **Space:** O(m · n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| **DFS with area return** | O(m · n) | O(m · n) recursion |
| BFS with area counter | O(m · n) | O(min(m, n)) |
| Union-Find with sizes | O(m · n · α) | O(m · n) |

The DFS-return-area pattern is the cleanest here, it generalizes to "for each component, compute some aggregate" (sum, min, max, perimeter).

## Related data structures

- [Arrays](../../../data-structures/arrays/), the grid
- [Queues](../../../data-structures/queues/), BFS
