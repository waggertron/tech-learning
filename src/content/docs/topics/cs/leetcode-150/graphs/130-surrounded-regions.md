---
title: "130. Surrounded Regions (Medium)"
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
    rows, cols = len(board), len(board[0])    # L1: O(1) setup

    def component(r, c):
        stack = [(r, c)]                       # L2: O(1) init
        visited = set()                        # L3: O(1)
        touches_border = False
        while stack:                           # L4: loop over component cells
            x, y = stack.pop()                 # L5: O(1)
            if (x, y) in visited:
                continue
            visited.add((x, y))               # L6: O(1)
            if x in (0, rows - 1) or y in (0, cols - 1):
                touches_border = True
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < rows and 0 <= ny < cols and board[nx][ny] == 'O' and (nx, ny) not in visited:
                    stack.append((nx, ny))    # L7: O(1) per neighbor
        return visited, touches_border

    done = set()
    for r in range(rows):
        for c in range(cols):                  # L8: O(m*n) outer scan
            if board[r][c] == 'O' and (r, c) not in done:
                comp, border = component(r, c) # L9: O(component size)
                done |= comp
                if not border:
                    for x, y in comp:
                        board[x][y] = 'X'      # L10: O(component size)
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (setup) | O(1) | 1 | O(1) |
| L8 (outer scan) | O(1) | m*n | O(m*n) |
| **L9 (component DFS)** | **O(component)** | **once per unvisited O** | **O(m*n) total** ← dominates |
| L10 (flip) | O(component) | once per non-border component | O(m*n) total |

Each cell is visited at most once in any component call (the `done` guard). So the total work across all component calls is O(m*n). The scan at L8 is also O(m*n). Overall the constant is roughly 2x but the asymptotic is O(m*n).

**Complexity**
- **Time:** O(m*n), driven by L9 (total component work across all cells).
- **Space:** O(m*n) for the visited set and the `done` set.

Works but it's awkward to implement the "touches border" flag cleanly.

## Approach 2: Reverse DFS from borders (optimal)

Flip the problem: any `O` that's reachable from a border `O` is *not* surrounded. Temporarily mark those border-connected `O`s with a sentinel (e.g., `'T'`). After the scan, flip every remaining `O` to `X`, then flip `T` back to `O`.

```python
def solve(board):
    if not board:                              # L1: O(1) guard
        return
    rows, cols = len(board), len(board[0])    # L2: O(1)

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != 'O':
            return                             # L3: O(1) base case
        board[r][c] = 'T'                     # L4: O(1) mark sentinel
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)  # L5: recurse 4 neighbors

    for c in range(cols):
        dfs(0, c); dfs(rows - 1, c)           # L6: seed top and bottom rows
    for r in range(rows):
        dfs(r, 0); dfs(r, cols - 1)           # L7: seed left and right cols

    for r in range(rows):
        for c in range(cols):                  # L8: O(m*n) final sweep
            if board[r][c] == 'O':
                board[r][c] = 'X'             # L9: O(1) flip interior O
            elif board[r][c] == 'T':
                board[r][c] = 'O'             # L10: O(1) restore border O
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L6 (seed top/bottom) | O(1) | 2*n | O(n) |
| L7 (seed left/right) | O(1) | 2*m | O(m) |
| **L5 (DFS recursion)** | **O(1) per cell** | **at most m*n total** | **O(m*n)** ← dominates |
| L8-L10 (final sweep) | O(1) | m*n | O(m*n) |

The DFS from all border cells collectively visits each cell at most once (once marked `'T'`, it won't be entered again). The final sweep is a single pass. Both halves are O(m*n).

**Complexity**
- **Time:** O(m*n), driven by L5/L8 (DFS traversal + final sweep).
- **Space:** O(m*n) recursion stack in the worst case (a board full of O's causes a chain of depth m*n).

## Approach 3: BFS variant of Approach 2

Same idea with a queue, prefer when recursion depth is a concern.

```python
from collections import deque

def solve(board):
    if not board:                              # L1: O(1) guard
        return
    rows, cols = len(board), len(board[0])    # L2: O(1)

    def bfs(start_r, start_c):
        if board[start_r][start_c] != 'O':
            return                             # L3: O(1) early exit
        q = deque([(start_r, start_c)])        # L4: O(1) init queue
        board[start_r][start_c] = 'T'         # L5: O(1) mark start
        while q:                               # L6: loop until queue empty
            r, c = q.popleft()                 # L7: O(1) dequeue
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] == 'O':
                    board[nr][nc] = 'T'
                    q.append((nr, nc))         # L8: O(1) enqueue neighbor

    for c in range(cols):
        bfs(0, c); bfs(rows - 1, c)           # L9: seed top and bottom rows
    for r in range(rows):
        bfs(r, 0); bfs(r, cols - 1)           # L10: seed left and right cols

    for r in range(rows):
        for c in range(cols):                  # L11: O(m*n) final sweep
            if board[r][c] == 'O':
                board[r][c] = 'X'             # L12: O(1)
            elif board[r][c] == 'T':
                board[r][c] = 'O'             # L13: O(1)
```

**Where the time goes, line by line**

*Variables: m = grid rows, n = grid cols.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L9 (seed top/bottom) | O(1) | 2*n | O(n) |
| L10 (seed left/right) | O(1) | 2*m | O(m) |
| **L7, L8 (BFS body)** | **O(1) per cell** | **at most m*n total** | **O(m*n)** ← dominates |
| L11-L13 (final sweep) | O(1) | m*n | O(m*n) |

Identical complexity to the DFS variant. The queue holds at most O(m*n) cells; in practice it's bounded by the perimeter of the largest border-connected region. The explicit queue avoids Python's recursion limit, which is the only practical reason to choose BFS here.

**Complexity**
- **Time:** O(m*n), driven by L7/L8/L11 (BFS traversal + final sweep).
- **Space:** O(m*n) for the queue in the worst case.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS + border-touch flag | O(m*n) | O(m*n) |
| **Reverse DFS from borders** | **O(m*n)** | **O(m*n)** |
| Reverse BFS from borders | O(m*n) | O(m*n) |

Same "reverse direction from boundary" trick as Pacific Atlantic, the cleanest version of the problem.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_130.py and run.
# Uses the canonical implementation (Approach 2: reverse DFS from borders).

def solve(board):
    if not board:
        return
    rows, cols = len(board), len(board[0])

    def dfs(r, c):
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != 'O':
            return
        board[r][c] = 'T'
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)

    for c in range(cols):
        dfs(0, c); dfs(rows - 1, c)
    for r in range(rows):
        dfs(r, 0); dfs(r, cols - 1)

    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'T':
                board[r][c] = 'O'


def _run_tests():
    # Example from the problem statement
    b = [['X','X','X','X'],
         ['X','O','O','X'],
         ['X','X','O','X'],
         ['X','O','X','X']]
    solve(b)
    assert b == [['X','X','X','X'],
                 ['X','X','X','X'],
                 ['X','X','X','X'],
                 ['X','O','X','X']]

    # All X's: nothing changes
    b2 = [['X','X'],['X','X']]
    solve(b2)
    assert b2 == [['X','X'],['X','X']]

    # Single cell O on border: stays O
    b3 = [['O']]
    solve(b3)
    assert b3 == [['O']]

    # O's entirely on the border: all stay
    b4 = [['O','O','O'],
          ['O','X','O'],
          ['O','O','O']]
    solve(b4)
    assert b4 == [['O','O','O'],
                  ['O','X','O'],
                  ['O','O','O']]

    # Interior O fully surrounded: gets captured
    b5 = [['X','X','X'],
          ['X','O','X'],
          ['X','X','X']]
    solve(b5)
    assert b5 == [['X','X','X'],
                  ['X','X','X'],
                  ['X','X','X']]

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), board with sentinel mutation
