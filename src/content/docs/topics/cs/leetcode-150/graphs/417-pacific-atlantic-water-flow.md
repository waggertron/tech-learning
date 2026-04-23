---
title: "417. Pacific Atlantic Water Flow"
description: Find cells from which water can flow to both the Pacific and Atlantic oceans.
parent: graphs
tags: [leetcode, neetcode-150, graphs, dfs, bfs, grid, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an `m × n` matrix of heights representing an island, water can flow from a cell to an adjacent cell with height ≤ the current cell. The Pacific Ocean touches the top and left edges; the Atlantic touches the bottom and right. Return all cells from which water can flow to **both** oceans.

**Example**
- `heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]`
- → `[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]`

LeetCode 417 · [Link](https://leetcode.com/problems/pacific-atlantic-water-flow/) · *Medium*

## Approach 1: Brute force — DFS from every cell, test reachability

For each cell, run two DFSes ("can I reach Pacific?", "can I reach Atlantic?"). Keep cells that answer yes to both.

```python
def pacific_atlantic(heights):
    rows, cols = len(heights), len(heights[0])

    def dfs(r, c, visited):
        if (r, c) in visited:
            return False
        visited.add((r, c))
        if r == 0 or c == 0:
            pac = True
        else:
            pac = False
        # ... (simplified; in practice you'd pass a callback for the ocean check)

    # Full version omitted; too slow to be worth writing out.
    return []
```

**Complexity**
- **Time:** O((m · n)²). For each of m·n cells, a full O(m·n) DFS.
- **Space:** O(m · n).

## Approach 2: DFS from the oceans inward (optimal)

Reverse the problem: for each ocean, walk **upward** (to higher or equal heights) from the border. Mark every reachable cell. The intersection of the two sets is the answer.

```python
def pacific_atlantic(heights):
    if not heights:
        return []
    rows, cols = len(heights), len(heights[0])
    pac = set()
    atl = set()

    def dfs(r, c, visited):
        if (r, c) in visited:
            return
        visited.add((r, c))
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and heights[nr][nc] >= heights[r][c]:
                dfs(nr, nc, visited)

    for c in range(cols):
        dfs(0, c, pac)            # top row — Pacific
        dfs(rows - 1, c, atl)      # bottom row — Atlantic
    for r in range(rows):
        dfs(r, 0, pac)            # left column — Pacific
        dfs(r, cols - 1, atl)      # right column — Atlantic

    return [[r, c] for (r, c) in pac & atl]
```

**Complexity**
- **Time:** O(m · n). Each cell visited at most twice (once per ocean).
- **Space:** O(m · n) for the visited sets.

## Approach 3: BFS from the oceans inward

Same reverse-walk idea with a queue.

```python
from collections import deque

def pacific_atlantic(heights):
    if not heights:
        return []
    rows, cols = len(heights), len(heights[0])

    def bfs(starts):
        visited = set(starts)
        q = deque(starts)
        while q:
            r, c = q.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if (0 <= nr < rows and 0 <= nc < cols and
                        (nr, nc) not in visited and
                        heights[nr][nc] >= heights[r][c]):
                    visited.add((nr, nc))
                    q.append((nr, nc))
        return visited

    pac = bfs([(0, c) for c in range(cols)] + [(r, 0) for r in range(rows)])
    atl = bfs([(rows - 1, c) for c in range(cols)] + [(r, cols - 1) for r in range(rows)])
    return [[r, c] for (r, c) in pac & atl]
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS from every cell to each ocean | O((m · n)²) | O(m · n) |
| **DFS from ocean borders inward** | **O(m · n)** | **O(m · n)** |
| BFS from ocean borders | O(m · n) | O(m · n) |

The "reverse the direction" trick is the key insight — it avoids redundant work by computing both reachability sets once. Same pattern solves problem 130 (Surrounded Regions).

## Related data structures

- [Arrays](../../../data-structures/arrays/) — height grid
- [Hash Tables](../../../data-structures/hash-tables/) — two reachability sets intersected at the end
