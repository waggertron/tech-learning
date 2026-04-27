---
title: "695. Max Area of Island (Medium)"
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
    if not grid:                                                         # L1: guard empty input
        return 0
    rows, cols = len(grid), len(grid[0])                                 # L2: grid dimensions

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != 1:   # L3: bounds + land check
            return 0
        grid[r][c] = 0                                                   # L4: mark visited
        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)  # L5: sum neighbors

    best = 0
    for r in range(rows):                                                # L6: outer scan
        for c in range(cols):                                            # L7: inner scan
            if grid[r][c] == 1:
                best = max(best, dfs(r, c))                              # L8: launch DFS, update best
    return best
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L6, L7 (scan) | O(1) | m * n | O(m * n) |
| L3 (bounds check) | O(1) | once per DFS call | O(m * n) total |
| L4 (mark visited) | O(1) | once per land cell | O(m * n) total |
| **L5 (recurse 4 neighbors)** | **O(1) per frame** | **each cell visited once** | **O(m * n) ← dominates** |
| L8 (max update) | O(1) | m * n | O(m * n) |

Each cell is visited at most once: L4 marks it `0` before recursing, so no cell is processed twice. The four recursive calls in L5 each hit L3's early-return path for already-visited or out-of-bounds cells. Total work across all DFS calls is proportional to the number of cells.

**Complexity**
- **Time:** O(m * n), driven by L5 (each cell entered at most once across all DFS calls).
- **Space:** O(m * n) recursion worst case (a fully-land grid produces a call stack m * n deep).

## Approach 2: BFS with area counting

Equivalent structure; avoids deep recursion.

```python
from collections import deque

def max_area_of_island(grid):
    if not grid:                                             # L1: guard empty input
        return 0
    rows, cols = len(grid), len(grid[0])                     # L2: grid dimensions
    best = 0

    for r in range(rows):                                    # L3: outer scan
        for c in range(cols):                                # L4: inner scan
            if grid[r][c] != 1:
                continue
            area = 0
            q = deque([(r, c)])                              # L5: seed queue
            grid[r][c] = 0                                   # L6: mark visited immediately
            while q:
                x, y = q.popleft()                           # L7: O(1) dequeue
                area += 1                                    # L8: count this cell
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 1:
                        grid[nx][ny] = 0                     # L9: mark before enqueue
                        q.append((nx, ny))                   # L10: O(1) enqueue
            best = max(best, area)                           # L11: update global best
    return best
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3, L4 (scan) | O(1) | m * n | O(m * n) |
| L6, L9 (mark visited) | O(1) | once per land cell | O(m * n) total |
| **L7 (dequeue)** | **O(1)** | **once per land cell** | **O(m * n) ← dominates** |
| L8 (area count) | O(1) | once per land cell | O(m * n) total |
| L10 (enqueue) | O(1) amortized | once per land cell | O(m * n) total |
| L11 (max update) | O(1) | once per island | O(islands) |

L9 marks cells before enqueuing, preventing duplicates in the queue. The queue frontier never holds a cell more than once, so total enqueue/dequeue operations equal the number of land cells.

**Complexity**
- **Time:** O(m * n), driven by L7/L10 (each land cell enqueued and dequeued exactly once).
- **Space:** O(min(m, n)) queue frontier (the BFS wavefront can be at most min(m, n) wide).

## Approach 3: Union-Find with component sizes

Union land neighbors; track size per root; take the max.

```python
def max_area_of_island(grid):
    rows, cols = len(grid), len(grid[0])                     # L1: grid dimensions
    parent = {}                                              # L2: Union-Find parent map
    size = {}                                                # L3: component size map

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]                   # L4: path halving
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)                            # L5: find both roots
        if ra == rb:
            return
        if size[ra] < size[rb]:
            ra, rb = rb, ra
        parent[rb] = ra                                      # L6: attach smaller to larger
        size[ra] += size[rb]                                 # L7: update root size

    for r in range(rows):                                    # L8: init land cells
        for c in range(cols):
            if grid[r][c] == 1:
                i = r * cols + c
                parent[i] = i
                size[i] = 1

    for r in range(rows):                                    # L9: union neighbors
        for c in range(cols):
            if grid[r][c] == 1:
                i = r * cols + c
                if r + 1 < rows and grid[r + 1][c] == 1:
                    union(i, (r + 1) * cols + c)             # L10: union down
                if c + 1 < cols and grid[r][c + 1] == 1:
                    union(i, r * cols + c + 1)               # L11: union right

    return max(size[find(k)] for k in parent) if parent else 0  # L12: max component size
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L8 (init) | O(1) | m * n | O(m * n) |
| L9 (scan) | O(1) | m * n | O(m * n) |
| L4 (path halving) | O(alpha(m * n)) amortized | per find call | near O(1) |
| **L10, L11 (union)** | **O(alpha(m * n))** | **up to 2 * m * n calls** | **O(m * n * alpha) ← dominates** |
| L12 (max scan) | O(alpha(m * n)) per key | m * n keys | O(m * n * alpha) |

alpha(m * n) is the inverse Ackermann function, which is at most 4 for any input that fits in memory. The Union-Find with path halving and union-by-size is essentially linear.

**Complexity**
- **Time:** O(m * n * alpha(m * n)) ≈ O(m * n), driven by L10/L11 (union calls).
- **Space:** O(m * n) for the parent and size maps.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| **DFS with area return** | O(m * n) | O(m * n) recursion |
| BFS with area counter | O(m * n) | O(min(m, n)) |
| Union-Find with sizes | O(m * n * alpha) | O(m * n) |

The DFS-return-area pattern is the cleanest here, it generalizes to "for each component, compute some aggregate" (sum, min, max, perimeter).

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_695.py and run.
# Uses the canonical implementation (Approach 1: DFS).

def max_area_of_island(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or grid[r][c] != 1:
            return 0
        grid[r][c] = 0
        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1)

    best = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                best = max(best, dfs(r, c))
    return best


def _run_tests():
    # Example from problem statement: largest island has area 6
    assert max_area_of_island([
        [0,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,1,1,0,1,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,1,0,0,1,0,1,0,0],
        [0,1,0,0,1,1,0,0,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,1,0,0,0,0],
    ]) == 6

    # All water
    assert max_area_of_island([[0, 0, 0, 0, 0, 0, 0, 0]]) == 0

    # Single land cell
    assert max_area_of_island([[1]]) == 1

    # Single water cell
    assert max_area_of_island([[0]]) == 0

    # Two disconnected islands of different sizes
    assert max_area_of_island([
        [1, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
    ]) == 3

    # Entire grid is one island
    assert max_area_of_island([
        [1, 1],
        [1, 1],
    ]) == 4

    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), the grid
- [Queues](../../../data-structures/queues/), BFS
