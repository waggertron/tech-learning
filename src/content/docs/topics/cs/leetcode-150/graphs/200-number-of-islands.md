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
    if not grid:                                                        # L1: guard empty input
        return 0
    rows, cols = len(grid), len(grid[0])                               # L2: O(1)
    count = 0                                                          # L3: O(1)

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != "1":  # L4: O(1) boundary check
            return
        grid[r][c] = "0"                                               # L5: O(1) mark visited
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)   # L6: recurse 4 neighbors

    for r in range(rows):                                              # L7: outer scan loop
        for c in range(cols):                                          # L8: inner scan loop
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)                                              # L9: DFS from new island root
    return count
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L7, L8 (scan) | O(1) | m · n | O(m · n) |
| L4 (boundary check) | O(1) | once per cell entered via DFS | O(m · n) total |
| L5 (mark visited) | O(1) | at most once per land cell | O(m · n) total |
| **L6 (recurse)** | **O(1) per call** | **each cell visited at most once** | **O(m · n) ← dominates** |

Every land cell is flipped from `"1"` to `"0"` exactly once, so L6 fires at most m · n times total across the entire outer loop, not per island. The recursion stack depth is at most m · n in a pathological all-land grid.

**Complexity**
- **Time:** O(m · n), driven by L6/L9 (each cell visited at most once in total).
- **Space:** O(m · n) recursion worst case.

## Approach 2: BFS with a queue

Same idea, BFS instead of DFS, avoids deep recursion on large grids.

```python
from collections import deque

def num_islands(grid):
    if not grid:                                                      # L1: guard empty input
        return 0
    rows, cols = len(grid), len(grid[0])                             # L2: O(1)
    count = 0                                                        # L3: O(1)

    def bfs(r, c):
        q = deque([(r, c)])                                          # L4: O(1) seed queue
        grid[r][c] = "0"                                             # L5: O(1) mark root visited
        while q:                                                     # L6: process until queue empty
            x, y = q.popleft()                                       # L7: O(1) dequeue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == "1":
                    grid[nx][ny] = "0"                               # L8: O(1) mark visited
                    q.append((nx, ny))                               # L9: O(1) enqueue neighbor

    for r in range(rows):                                            # L10: outer scan
        for c in range(cols):                                        # L11: inner scan
            if grid[r][c] == "1":
                count += 1
                bfs(r, c)                                            # L12: BFS from new island root
    return count
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L10, L11 (scan) | O(1) | m · n | O(m · n) |
| L7 (dequeue) | O(1) | at most once per land cell | O(m · n) total |
| L8 (mark visited) | O(1) | at most once per land cell | O(m · n) total |
| **L9 (enqueue)** | **O(1)** | **each land cell enqueued at most once** | **O(m · n) ← dominates** |

The queue holds at most min(m, n) cells at any instant (the BFS frontier cannot exceed the shorter grid dimension), but total enqueue operations across the whole run are bounded by m · n.

**Complexity**
- **Time:** O(m · n), driven by L9/L12 (each cell enqueued at most once in total).
- **Space:** O(min(m, n)) queue (max frontier width).

## Approach 3: Union-Find

Treat each land cell as a node; union neighboring land cells. Count unique components at the end.

```python
def num_islands(grid):
    if not grid:                                                          # L1: guard
        return 0
    rows, cols = len(grid), len(grid[0])                                 # L2: O(1)
    parent = list(range(rows * cols))                                    # L3: O(m · n) init
    count = sum(grid[r][c] == "1" for r in range(rows) for c in range(cols))  # L4: O(m · n) count land

    def find(x):                                                         # L5: path-compressed find
        while parent[x] != x:
            parent[x] = parent[parent[x]]                               # L6: path halving
            x = parent[x]
        return x

    def union(a, b):
        nonlocal count
        ra, rb = find(a), find(b)                                        # L7: O(α) each
        if ra != rb:
            parent[ra] = rb                                              # L8: O(1) link roots
            count -= 1                                                   # L9: O(1) merge components

    for r in range(rows):                                                # L10: outer scan
        for c in range(cols):                                            # L11: inner scan
            if grid[r][c] == "1":
                if r + 1 < rows and grid[r + 1][c] == "1":
                    union(r * cols + c, (r + 1) * cols + c)             # L12: union down-neighbor
                if c + 1 < cols and grid[r][c + 1] == "1":
                    union(r * cols + c, r * cols + c + 1)               # L13: union right-neighbor
    return count
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3, L4 (init) | O(m · n) | 1 each | O(m · n) |
| L10, L11 (scan) | O(1) | m · n | O(m · n) |
| L6 (path halving) | O(1) amortized | per find call | amortized O(1) |
| **L12, L13 (union calls)** | **O(α(m · n))** | **at most 2 · m · n** | **O(m · n · α) ← dominates** |

The `find` function uses path halving (not full path compression), which still achieves the same inverse-Ackermann amortized bound. α(m · n) is less than 5 for any realistic grid, so this is effectively O(m · n). The factor dominates over init and scan only in the constant, not asymptotically.

**Complexity**
- **Time:** O(m · n · α(m · n)), driven by L12/L13 (the union calls). Effectively O(m · n).
- **Space:** O(m · n) parent array.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| **DFS** | O(m · n) | O(m · n) recursion | Canonical |
| **BFS** | O(m · n) | O(min(m, n)) | Use when grids are deep (avoid recursion depth) |
| Union-Find | O(m · n · α) | O(m · n) | Overkill here, template for incremental updates |

DFS/BFS are equivalent in Big-O. Choose Union-Find when the graph is growing over time, adding edges online and asking "how many components now?"

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_200.py and run.
# Uses the canonical implementation (Approach 1: DFS).

def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                dfs(r, c)
    return count


def _run_tests():
    # Example 1: single island
    g1 = [["1","1","1","1","0"],
          ["1","1","0","1","0"],
          ["1","1","0","0","0"],
          ["0","0","0","0","0"]]
    assert num_islands(g1) == 1

    # Example 2: three islands
    g2 = [["1","1","0","0","0"],
          ["1","1","0","0","0"],
          ["0","0","1","0","0"],
          ["0","0","0","1","1"]]
    assert num_islands(g2) == 3

    # Edge: empty grid
    assert num_islands([]) == 0

    # Edge: single land cell
    assert num_islands([["1"]]) == 1

    # Edge: single water cell
    assert num_islands([["0"]]) == 0

    # All land, one island
    g3 = [["1","1"],["1","1"]]
    assert num_islands(g3) == 1

    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), the grid; in-place mutation as visited marker
- [Queues](../../../data-structures/queues/), BFS
- [Stacks](../../../data-structures/stacks/), implicit via DFS recursion
