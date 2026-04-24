---
title: "994. Rotting Oranges"
description: Minimum time for all fresh oranges to rot via adjacent contact, a multi-source BFS.
parent: graphs
tags: [leetcode, neetcode-150, graphs, bfs, multi-source, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given an `m × n` grid where each cell is:

- `0`, empty
- `1`, fresh orange
- `2`, rotten orange

Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes until no fresh orange remains, or `-1` if impossible.

**Example**
- `grid = [[2,1,1],[1,1,0],[0,1,1]]` → `4`
- `grid = [[2,1,1],[0,1,1],[1,0,1]]` → `-1` (the bottom-left fresh orange is unreachable)
- `grid = [[0,2]]` → `0`

LeetCode 994 · [Link](https://leetcode.com/problems/rotting-oranges/) · *Medium*

## Approach 1: Brute force, simulate minute-by-minute

On each tick, scan the grid and mark any fresh orange adjacent to a rotten one. Keep ticking until no more changes.

```python
def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    time = 0
    while True:
        to_rot = []
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 2:
                            to_rot.append((r, c))
                            break
        if not to_rot:
            break
        for r, c in to_rot:
            grid[r][c] = 2
        time += 1

    return -1 if any(1 in row for row in grid) else time
```

**Complexity**
- **Time:** O((m · n)²) worst case.
- **Space:** O(m · n).

Correct but slow.

## Approach 2: Multi-source BFS (optimal)

Seed a BFS queue with every rotten orange at time 0; process levels. When the queue empties, time = last recorded minute. Return -1 if any fresh orange remains.

```python
from collections import deque

def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                q.append((r, c, 0))
            elif grid[r][c] == 1:
                fresh += 1

    time = 0
    while q:
        r, c, t = q.popleft()
        time = t
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2
                fresh -= 1
                q.append((nr, nc, t + 1))

    return time if fresh == 0 else -1
```

**Complexity**
- **Time:** O(m · n). Each cell enqueued at most once.
- **Space:** O(m · n) queue worst case.

### Why multi-source BFS works
Think of all rotten oranges as simultaneous "starting points" of a BFS. The depth of any fresh orange in this BFS is its minute-to-rot. The overall answer is the max depth, which is the time the last orange rots.

## Approach 3: BFS without per-cell time tuple (level batching)

Same idea, drop per-entry time tag; use level-by-level batching.

```python
from collections import deque

def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    q = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                q.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1

    time = 0
    while q and fresh > 0:
        time += 1
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))

    return -1 if fresh > 0 else time
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

Same asymptotic; slightly tighter memory (no `t` tuple element).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Simulate minute-by-minute | O((m · n)²) | O(m · n) |
| **Multi-source BFS** | **O(m · n)** | **O(m · n)** |
| Multi-source BFS + level batching | O(m · n) | O(m · n) |

Multi-source BFS is the canonical template for "fire/water/infection spreads from multiple starts" problems. Same pattern: Walls and Gates (286), 01 Matrix (542), As Far From Land As Possible (1162).

## Related data structures

- [Arrays](../../../data-structures/arrays/), grid
- [Queues](../../../data-structures/queues/), BFS engine with multi-source seeding
