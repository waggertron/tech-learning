---
title: "994. Rotting Oranges (Medium)"
description: Minimum time for all fresh oranges to rot via adjacent contact, a multi-source BFS.
parent: graphs
tags: [leetcode, neetcode-150, graphs, bfs, multi-source, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given an `m x n` grid where each cell is:

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
    rows, cols = len(grid), len(grid[0])             # L1: grid dimensions
    time = 0
    while True:                                       # L2: outer loop, one tick per iteration
        to_rot = []
        for r in range(rows):                         # L3: scan rows
            for c in range(cols):                     # L4: scan cols
                if grid[r][c] == 1:
                    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 2:
                            to_rot.append((r, c))     # L5: queue cell to rot
                            break
        if not to_rot:                                # L6: no change, done
            break
        for r, c in to_rot:
            grid[r][c] = 2                            # L7: apply rot
        time += 1                                     # L8: advance clock

    return -1 if any(1 in row for row in grid) else time  # L9: check unreachable
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3, L4 (full scan) | O(1) per cell | m * n per tick | O(m * n) per tick |
| **L2 (outer loop)** | **O(m * n) per tick** | **up to m * n ticks** | **O((m * n)^2) ← dominates** |
| L5 (append) | O(1) | up to m * n total | O(m * n) |
| L7 (apply rot) | O(1) | up to m * n total | O(m * n) |
| L9 (final scan) | O(m * n) | 1 | O(m * n) |

The bottleneck is L2 combined with L3/L4: in the worst case (a long snake of oranges), exactly one orange rots per tick, giving m * n ticks each scanning m * n cells.

**Complexity**
- **Time:** O((m * n)^2), driven by L2 (up to m * n ticks, each doing an O(m * n) scan).
- **Space:** O(m * n) for `to_rot` in the worst tick.

Correct but slow.

## Approach 2: Multi-source BFS (optimal)

Seed a BFS queue with every rotten orange at time 0; process levels. When the queue empties, time = last recorded minute. Return -1 if any fresh orange remains.

```python
from collections import deque

def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])             # L1: grid dimensions
    q = deque()
    fresh = 0
    for r in range(rows):                            # L2: seed queue + count fresh
        for c in range(cols):
            if grid[r][c] == 2:
                q.append((r, c, 0))                  # L3: enqueue rotten with t=0
            elif grid[r][c] == 1:
                fresh += 1                           # L4: count fresh

    time = 0
    while q:                                         # L5: BFS loop
        r, c, t = q.popleft()                        # L6: O(1) dequeue
        time = t                                     # L7: track latest minute
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2                     # L8: rot neighbor
                fresh -= 1                           # L9: decrement fresh count
                q.append((nr, nc, t + 1))            # L10: enqueue with incremented time

    return time if fresh == 0 else -1                # L11: check for unreachable
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (seed scan) | O(1) | m * n | O(m * n) |
| L3, L4 (enqueue/count) | O(1) | m * n | O(m * n) |
| **L6 (dequeue)** | **O(1)** | **once per cell** | **O(m * n) ← dominates** |
| L8, L9 (rot + decrement) | O(1) | once per fresh cell | O(m * n) |
| L10 (enqueue) | O(1) | once per fresh cell | O(m * n) |
| L11 (return check) | O(1) | 1 | O(1) |

Each cell enters the queue at most once (L8 marks it `2` before L10 enqueues it, preventing re-entry). The scan in L2 and the BFS in L5 together visit every cell a constant number of times.

**Complexity**
- **Time:** O(m * n), driven by L6/L10 (each cell enqueued and dequeued at most once).
- **Space:** O(m * n) queue worst case (all cells rotten from the start).

### Why multi-source BFS works

Think of all rotten oranges as simultaneous "starting points" of a BFS. The depth of any fresh orange in this BFS is its minute-to-rot. The overall answer is the max depth, which is the time the last orange rots.

## Approach 3: BFS without per-cell time tuple (level batching)

Same idea, drop per-entry time tag; use level-by-level batching.

```python
from collections import deque

def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])             # L1: grid dimensions
    q = deque()
    fresh = 0
    for r in range(rows):                            # L2: seed queue + count fresh
        for c in range(cols):
            if grid[r][c] == 2:
                q.append((r, c))                     # L3: enqueue rotten, no time tag
            elif grid[r][c] == 1:
                fresh += 1                           # L4: count fresh

    time = 0
    while q and fresh > 0:                           # L5: BFS loop, stop early if no fresh
        time += 1                                    # L6: advance clock once per level
        for _ in range(len(q)):                      # L7: process exactly one level
            r, c = q.popleft()                       # L8: O(1) dequeue
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2                 # L9: rot neighbor
                    fresh -= 1                       # L10: decrement fresh count
                    q.append((nr, nc))               # L11: enqueue for next level

    return -1 if fresh > 0 else time                 # L12: check for unreachable
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (seed scan) | O(1) | m * n | O(m * n) |
| L6 (time increment) | O(1) | once per BFS level | O(m * n) total |
| L7 (level snapshot) | O(1) | once per level | O(m * n) total |
| **L8 (dequeue)** | **O(1)** | **once per cell** | **O(m * n) ← dominates** |
| L9, L10 (rot + decrement) | O(1) | once per fresh cell | O(m * n) |
| L11 (enqueue) | O(1) | once per fresh cell | O(m * n) |

The `for _ in range(len(q))` snapshot in L7 captures exactly the current level's size before any new cells are appended. This avoids the per-entry time tuple while keeping level boundaries clean.

**Complexity**
- **Time:** O(m * n), driven by L8/L11 (each cell processed once).
- **Space:** O(m * n) queue; slightly less memory per entry than Approach 2 (no `t` field in each tuple).

Same asymptotic; slightly tighter memory (no `t` tuple element).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Simulate minute-by-minute | O((m * n)^2) | O(m * n) |
| **Multi-source BFS** | **O(m * n)** | **O(m * n)** |
| Multi-source BFS + level batching | O(m * n) | O(m * n) |

Multi-source BFS is the canonical template for "fire/water/infection spreads from multiple starts" problems. Same pattern: Walls and Gates (286), 01 Matrix (542), As Far From Land As Possible (1162).

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_994.py and run.
# Uses the canonical implementation (Approach 2: multi-source BFS).

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


def _run_tests():
    # Example 1 from problem statement
    assert oranges_rotting([[2,1,1],[1,1,0],[0,1,1]]) == 4

    # Example 2: unreachable fresh orange
    assert oranges_rotting([[2,1,1],[0,1,1],[1,0,1]]) == -1

    # Example 3: no fresh oranges
    assert oranges_rotting([[0,2]]) == 0

    # All fresh, no rotten: impossible
    assert oranges_rotting([[1,1],[1,1]]) == -1

    # All empty
    assert oranges_rotting([[0]]) == 0

    # Single rotten, single fresh adjacent
    assert oranges_rotting([[2,1]]) == 1

    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), grid
- [Queues](../../../data-structures/queues/), BFS engine with multi-source seeding
