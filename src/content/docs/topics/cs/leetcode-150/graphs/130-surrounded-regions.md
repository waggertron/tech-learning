---
title: "130. Surrounded Regions"
description: Capture all regions of O's that are completely surrounded by X's on a 2D board.
parent: graphs
tags: [leetcode, neetcode-150, graphs, dfs, bfs, grid, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an `m × n` board of `'X'` and `'O'`, capture all regions of `'O'` that are **4-directionally surrounded** by `'X'` (flip them to `'X'`). A region is surrounded if no cell in it lies on the border.

Modify the board in place.

**Example**
- Input:
  ```
  X X X X
  X O O X
  X X O X
  X O X X
  ```
- Output:
  ```
  X X X X
  X X X X
  X X X X
  X O X X
  ```

LeetCode 130 · [Link](https://leetcode.com/problems/surrounded-regions/) · *Medium*

## Approach 1: Brute force, DFS from each O to check if surrounded

For each `O`, DFS to see if the component touches the border. If not, flip them all to `X`.

```python
def solve(board):
    rows, cols = len(board), len(board[0])

    def component(r, c):
        stack = [(r, c)]
        visited = set()
        touches_border = False
        while stack:
            x, y = stack.pop()
            if (x, y) in visited:
                continue
            visited.add((x, y))
            if x in (0, rows, 1) or y in (0, cols, 1):
                touches_border = True
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < rows and 0 <= ny < cols and board[nx][ny] == 'O' and (nx, ny) not in visited:
                    stack.append((nx, ny))
        return visited, touches_border

    done = set()
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O' and (r, c) not in done:
                comp, border = component(r, c)
                done |= comp
                if not border:
                    for x, y in comp:
                        board[x][y] = 'X'
```

**Complexity**
- **Time:** O(m · n). Each cell visited once total (via `done`).
- **Space:** O(m · n).

Works but it's awkward to implement the "touches border" flag cleanly.

## Approach 2: Reverse DFS from borders (optimal)

Flip the problem: any `O` that's reachable from a border `O` is *not* surrounded. Temporarily mark those border-connected `O`s with a sentinel (e.g., `'T'`). After the scan, flip every remaining `O` to `X`, then flip `T` back to `O`.

```python
def solve(board):
    if not board:
        return
    rows, cols = len(board), len(board[0])

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != 'O':
            return
        board[r][c] = 'T'
        dfs(r + 1, c); dfs(r, 1, c); dfs(r, c + 1); dfs(r, c, 1)

    for c in range(cols):
        dfs(0, c); dfs(rows, 1, c)
    for r in range(rows):
        dfs(r, 0); dfs(r, cols, 1)

    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'T':
                board[r][c] = 'O'
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n) recursion worst case.

## Approach 3: BFS variant of Approach 2

Same idea with a queue, prefer when recursion depth is a concern.

```python
from collections import deque

def solve(board):
    if not board:
        return
    rows, cols = len(board), len(board[0])

    def bfs(start_r, start_c):
        if board[start_r][start_c] != 'O':
            return
        q = deque([(start_r, start_c)])
        board[start_r][start_c] = 'T'
        while q:
            r, c = q.popleft()
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] == 'O':
                    board[nr][nc] = 'T'
                    q.append((nr, nc))

    for c in range(cols):
        bfs(0, c); bfs(rows, 1, c)
    for r in range(rows):
        bfs(r, 0); bfs(r, cols, 1)

    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'T':
                board[r][c] = 'O'
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n) queue worst case.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS + border-touch flag | O(m · n) | O(m · n) |
| **Reverse DFS from borders** | **O(m · n)** | **O(m · n)** |
| Reverse BFS from borders | O(m · n) | O(m · n) |

Same "reverse direction from boundary" trick as Pacific Atlantic, the cleanest version of the problem.

## Related data structures

- [Arrays](../../../data-structures/arrays/), board with sentinel mutation
