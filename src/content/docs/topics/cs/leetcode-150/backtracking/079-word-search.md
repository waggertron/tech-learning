---
title: "79. Word Search"
description: Determine whether a word can be constructed from sequentially adjacent cells in a 2D board.
parent: backtracking
tags: [leetcode, neetcode-150, backtracking, dfs, grid, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a 2D board of characters and a string `word`, return `true` if `word` can be constructed from letters of sequentially adjacent cells (horizontally or vertically). Each cell may be used at most once per search.

**Example**
- `board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]`, `word = "ABCCED"` → `true`
- Same board, `word = "SEE"` → `true`
- Same board, `word = "ABCB"` → `false` (reuses `B`)

LeetCode 79 · [Link](https://leetcode.com/problems/word-search/) · *Medium*

## Approach 1: Brute force — DFS from every cell with a visited set

From each cell matching `word[0]`, DFS to the four neighbors, tracking visited positions in a set.

```python
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def dfs(r, c, i, visited):
        if i == len(word):
            return True
        if not (0 <= r < rows and 0 <= c < cols):
            return False
        if (r, c) in visited or board[r][c] != word[i]:
            return False
        visited.add((r, c))
        found = (dfs(r + 1, c, i + 1, visited) or
                 dfs(r - 1, c, i + 1, visited) or
                 dfs(r, c + 1, i + 1, visited) or
                 dfs(r, c - 1, i + 1, visited))
        visited.remove((r, c))
        return found

    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0, set()):
                return True
    return False
```

**Complexity**
- **Time:** O(m · n · 4^L) where L = word length.
- **Space:** O(L) visited + recursion.

## Approach 2: DFS with in-place mutation (canonical)

Instead of a visited set, temporarily mutate the cell to a sentinel (`'#'`) while it's on the path; restore on backtrack. Saves the hash-set allocation.

```python
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def dfs(r, c, i):
        if i == len(word):
            return True
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]:
            return False
        saved = board[r][c]
        board[r][c] = '#'
        found = (dfs(r + 1, c, i + 1) or
                 dfs(r - 1, c, i + 1) or
                 dfs(r, c + 1, i + 1) or
                 dfs(r, c - 1, i + 1))
        board[r][c] = saved
        return found

    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False
```

**Complexity**
- **Time:** O(m · n · 4^L).
- **Space:** O(L) recursion. No auxiliary set.

Standard interview answer. The "restore on backtrack" is the essential pattern.

## Approach 3: Start-cell pruning with character counts

Before doing any DFS, count characters on the board. If the board lacks any character of `word` (or not enough of each), return `false` immediately. Additionally, if the last character of `word` is rarer on the board than the first, reverse `word` before searching — DFS from rare characters prunes faster.

```python
from collections import Counter

def exist(board, word):
    board_counts = Counter(c for row in board for c in row)
    for ch, needed in Counter(word).items():
        if board_counts[ch] < needed:
            return False

    if board_counts[word[-1]] < board_counts[word[0]]:
        word = word[::-1]

    # then do Approach 2's DFS
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word):
            return True
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]:
            return False
        saved = board[r][c]
        board[r][c] = '#'
        found = (dfs(r + 1, c, i + 1) or
                 dfs(r - 1, c, i + 1) or
                 dfs(r, c + 1, i + 1) or
                 dfs(r, c - 1, i + 1))
        board[r][c] = saved
        return found

    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False
```

**Complexity**
- **Time:** Same worst case; much faster in practice on edge-case inputs.
- **Space:** O(L) recursion.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS + visited set | O(m · n · 4^L) | O(L) |
| **DFS + in-place mutation** | O(m · n · 4^L) | O(L) |
| + Counter pruning / reverse | same Big-O | O(L) |

The in-place mutation approach is the canonical interview answer. Counter-based pruning is a common "how would you optimize?" follow-up.

Related problem: **Word Search II (212)** uses a trie over multiple target words to amortize DFS work.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — the grid; in-place mutation as visited marker
- [Hash Tables](../../../data-structures/hash-tables/) — optional Counter pruning
