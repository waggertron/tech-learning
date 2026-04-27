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
    if not matrix:                                          # L1: O(1) guard
        return 0
    rows, cols = len(matrix), len(matrix[0])               # L2: O(1)

    def dfs(r, c):
        best = 1                                            # L3: O(1) path of length 1 at minimum
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)): # L4: O(1) 4-directional neighbors
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))          # L5: recursive call to neighbor
        return best

    return max(dfs(r, c) for r in range(rows) for c in range(cols))  # L6: run from every cell
```

**Where the time goes, line by line**

*Variables: m = number of matrix rows, n = number of matrix columns.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (guard + init) | O(1) | once | O(1) |
| L4-L5 (4 neighbor DFS) | O(1) work + up to 4 calls | per cell | without cache: exponential |
| **L6 (launch from every cell, no cache)** | **O(2^(m·n)) per launch** | **m · n launches** | **O(2^(m·n))** ← dominates |

Without memoization, each DFS from a cell can revisit the same sub-paths that other cells already explored, leading to exponential recomputation.

**Complexity**
- **Time:** O(2^(m · n)) worst case, driven by repeated DFS sub-paths across all launches at L6.
- **Space:** O(m · n) recursion depth.

## Approach 2: Memoized DFS (canonical)

Each cell's "longest path starting here" is a property of the cell alone, no backtracking mutation needed because the strictly-increasing constraint prevents cycles. Cache it.

```python
from functools import lru_cache

def longest_increasing_path(matrix):
    if not matrix:                                          # L1: O(1) guard
        return 0
    rows, cols = len(matrix), len(matrix[0])               # L2: O(1)

    @lru_cache(maxsize=None)                               # L3: cache per (r,c)
    def dfs(r, c):
        best = 1                                            # L4: O(1) minimum path length
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)): # L5: O(1) 4 directions
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))          # L6: O(1) with cache
        return best

    return max(dfs(r, c) for r in range(rows) for c in range(cols))  # L7: O(m*n) launches
```

**Where the time goes, line by line**

*Variables: m = number of matrix rows, n = number of matrix columns.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (guard + cache setup) | O(1) | 1 | O(1) |
| L4-L5 (init + direction loop) | O(1) | once per unique cell | O(m · n) total |
| **L6 (cached neighbor calls)** | **O(1) per call** | **at most 4 per cell, m · n cells** | **O(m · n)** ← dominates |
| L7 (launch from every cell) | O(1) per cell (cached) | m · n | O(m · n) |

Each cell is computed exactly once (via `lru_cache`). Each computation checks at most 4 neighbors, each a cache lookup. The total work is O(4 · m · n) = O(m · n).

**Complexity**
- **Time:** O(m · n), driven by L6/L7: each cell computed once with O(1) neighbor checks.
- **Space:** O(m · n) for the memo cache and recursion stack.

### Why no "visited" set is needed
Strict inequality implies no cycles, the sequence of values on any path is strictly increasing, so revisit is impossible. This is what allows the memoization to be sound.

## Approach 3: Topological sort + BFS (iterative, avoids recursion)

Treat cells as nodes; edges from lower to higher values. Compute in-degree and BFS from zero-in-degree cells (local minima). The number of BFS levels is the answer.

```python
from collections import deque

def longest_increasing_path(matrix):
    if not matrix:                                         # L1: O(1) guard
        return 0
    rows, cols = len(matrix), len(matrix[0])              # L2: O(1)
    in_deg = [[0] * cols for _ in range(rows)]            # L3: O(m*n) in-degree table

    for r in range(rows):                                  # L4: O(m*n) build in-degree
        for c in range(cols):
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] < matrix[r][c]:
                    in_deg[r][c] += 1

    q = deque()                                           # L5: O(1) init queue
    for r in range(rows):                                 # L6: O(m*n) seed local minima
        for c in range(cols):
            if in_deg[r][c] == 0:
                q.append((r, c))

    levels = 0                                            # L7: O(1) answer counter
    while q:                                              # L8: BFS over topological levels
        levels += 1
        for _ in range(len(q)):                           # L9: process one level at a time
            r, c = q.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                    in_deg[nr][nc] -= 1                   # L10: O(1) reduce in-degree
                    if in_deg[nr][nc] == 0:
                        q.append((nr, nc))                # L11: O(1) enqueue
    return levels
```

**Where the time goes, line by line**

*Variables: m = number of matrix rows, n = number of matrix columns.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3-L4 (in-degree build) | O(1) per cell | m · n cells, 4 neighbors each | O(m · n) |
| L5-L6 (seed queue) | O(1) per cell | m · n | O(m · n) |
| **L8-L11 (BFS)** | **O(1) per cell** | **each cell dequeued once** | **O(m · n)** ← dominates |

Each cell is enqueued and dequeued at most once. Each dequeue checks 4 neighbors. Total work is O(m · n). The number of BFS levels equals the longest increasing path length.

**Complexity**
- **Time:** O(m · n), driven by L8-L11 (BFS processes each cell once).
- **Space:** O(m · n) for in-degree table and queue.

Useful when recursion depth is a concern (very tall/wide matrices).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS from every cell | O(2^(m · n)) | O(m · n) |
| **Memoized DFS** | **O(m · n)** | **O(m · n)** |
| Topological BFS | O(m · n) | O(m · n) |

Memoized DFS is the canonical answer. Topological sort is the "avoid recursion" alternative.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_329.py and run.
# Uses the canonical implementation (Approach 2: memoized DFS).

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

def _run_tests():
    # problem statement examples
    assert longest_increasing_path([[9,9,4],[6,6,8],[2,1,1]]) == 4
    assert longest_increasing_path([[3,4,5],[3,2,6],[2,2,1]]) == 4
    # edge: single cell
    assert longest_increasing_path([[1]]) == 1
    # all same value (no increasing neighbors)
    assert longest_increasing_path([[1,1],[1,1]]) == 1
    # strictly increasing row
    assert longest_increasing_path([[1,2,3,4]]) == 4
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), input grid
- [Hash Tables](../../../data-structures/hash-tables/), memo cache (`lru_cache`)
- [Queues](../../../data-structures/queues/), topological BFS variant
