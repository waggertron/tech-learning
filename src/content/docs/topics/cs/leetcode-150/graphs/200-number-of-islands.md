---
title: "200. Number of Islands"
description: Count the number of islands (connected components of land cells) in a 2D grid.
parent: graphs
tags: [leetcode, neetcode-150, graphs, dfs, bfs, union-find, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an `m × n` grid of `"1"` (land) and `"0"` (water), return the number of islands. An island is formed by connecting adjacent land cells horizontally or vertically.

**Example**
- `grid = [["1","1","1","1","0"], ["1","1","0","1","0"], ["1","1","0","0","0"], ["0","0","0","0","0"]]` → `1`
- `grid = [["1","1","0","0","0"], ["1","1","0","0","0"], ["0","0","1","0","0"], ["0","0","0","1","1"]]` → `3`

LeetCode 200 · [Link](https://leetcode.com/problems/number-of-islands/) · *Medium*

## Approach 1: DFS with in-place mutation

Scan the grid; for each land cell, DFS to mark every connected land cell as water (visited). Each DFS trigger = one island.

```python
def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        dfs(r + 1, c); dfs(r, 1, c); dfs(r, c + 1); dfs(r, c, 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)
    return count
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n) recursion worst case.

## Approach 2: BFS with a queue

Same idea, BFS instead of DFS, avoids deep recursion on large grids.

```python
from collections import deque

def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def bfs(r, c):
        q = deque([(r, c)])
        grid[r][c] = "0"
        while q:
            x, y = q.popleft()
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == "1":
                    grid[nx][ny] = "0"
                    q.append((nx, ny))

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                bfs(r, c)
    return count
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(min(m, n)) queue (max frontier width).

## Approach 3: Union-Find

Treat each land cell as a node; union neighboring land cells. Count unique components at the end.

```python
def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    parent = list(range(rows * cols))
    count = sum(grid[r][c] == "1" for r in range(rows) for c in range(cols))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        nonlocal count
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
            count -= 1

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                if r + 1 < rows and grid[r + 1][c] == "1":
                    union(r * cols + c, (r + 1) * cols + c)
                if c + 1 < cols and grid[r][c + 1] == "1":
                    union(r * cols + c, r * cols + c + 1)
    return count
```

**Complexity**
- **Time:** O(m · n · α(m · n)). Effectively O(m · n).
- **Space:** O(m · n) parent array.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| **DFS** | O(m · n) | O(m · n) recursion | Canonical |
| **BFS** | O(m · n) | O(min(m, n)) | Use when grids are deep (avoid recursion depth) |
| Union-Find | O(m · n · α) | O(m · n) | Overkill here, template for incremental updates |

DFS/BFS are equivalent in Big-O. Choose Union-Find when the graph is growing over time, adding edges online and asking "how many components now?"

## Related data structures

- [Arrays](../../../data-structures/arrays/), the grid; in-place mutation as visited marker
- [Queues](../../../data-structures/queues/), BFS
- [Stacks](../../../data-structures/stacks/), implicit via DFS recursion
