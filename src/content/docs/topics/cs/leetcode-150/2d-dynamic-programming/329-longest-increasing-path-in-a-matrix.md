---
title: "329. Longest Increasing Path in a Matrix"
description: Find the length of the longest strictly increasing path in a 2D grid.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, dfs, memoization, grid, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an `m × n` matrix of integers, return the length of the longest strictly increasing path. You can move 4-directionally; diagonal moves and revisits are not allowed.

**Example**
- `matrix = [[9,9,4],[6,6,8],[2,1,1]]` → `4` (`[1, 2, 6, 9]`)
- `matrix = [[3,4,5],[3,2,6],[2,2,1]]` → `4` (`[3, 4, 5, 6]`)

LeetCode 329 · [Link](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) · *Hard*

## Approach 1: DFS from every cell

For each cell, DFS to longer neighbors; track global max.

```python
def longest_increasing_path(matrix):
    if not matrix:
        return 0
    rows, cols = len(matrix), len(matrix[0])

    def dfs(r, c):
        best = 1
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))
        return best

    return max(dfs(r, c) for r in range(rows) for c in range(cols))
```

**Complexity**
- **Time:** O(2^(m · n)) worst case. Exponential due to revisits.
- **Space:** O(m · n) recursion.

## Approach 2: Memoized DFS (canonical)

Each cell's "longest path starting here" is a property of the cell alone — no backtracking mutation needed because the strictly-increasing constraint prevents cycles. Cache it.

```python
from functools import lru_cache

def longest_increasing_path(matrix):
    if not matrix:
        return 0
    rows, cols = len(matrix), len(matrix[0])

    @lru_cache(maxsize=None)
    def dfs(r, c):
        best = 1
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))
        return best

    return max(dfs(r, c) for r in range(rows) for c in range(cols))
```

**Complexity**
- **Time:** O(m · n). Each cell's `dfs` computed once; each computation is O(1) (≤ 4 neighbors).
- **Space:** O(m · n) memo + recursion.

### Why no "visited" set is needed
Strict inequality implies no cycles — the sequence of values on any path is strictly increasing, so revisit is impossible. This is what allows the memoization to be sound.

## Approach 3: Topological sort + BFS (iterative, avoids recursion)

Treat cells as nodes; edges from lower to higher values. Compute in-degree and BFS from zero-in-degree cells (local minima). The number of BFS levels is the answer.

```python
from collections import deque

def longest_increasing_path(matrix):
    if not matrix:
        return 0
    rows, cols = len(matrix), len(matrix[0])
    in_deg = [[0] * cols for _ in range(rows)]

    for r in range(rows):
        for c in range(cols):
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] < matrix[r][c]:
                    in_deg[r][c] += 1

    q = deque()
    for r in range(rows):
        for c in range(cols):
            if in_deg[r][c] == 0:
                q.append((r, c))

    levels = 0
    while q:
        levels += 1
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                    in_deg[nr][nc] -= 1
                    if in_deg[nr][nc] == 0:
                        q.append((nr, nc))
    return levels
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

Useful when recursion depth is a concern (very tall/wide matrices).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS from every cell | O(2^(m · n)) | O(m · n) |
| **Memoized DFS** | **O(m · n)** | **O(m · n)** |
| Topological BFS | O(m · n) | O(m · n) |

Memoized DFS is the canonical answer. Topological sort is the "avoid recursion" alternative.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — input grid
- [Hash Tables](../../../data-structures/hash-tables/) — memo cache (`lru_cache`)
- [Queues](../../../data-structures/queues/) — topological BFS variant
