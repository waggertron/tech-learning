---
title: "79. Word Search (Medium)"
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

## Approach 1: Brute force, DFS from every cell with a visited set

From each cell matching `word[0]`, DFS to the four neighbors, tracking visited positions in a set.

```python
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def dfs(r, c, i, visited):
        if i == len(word):
            return True                               # L1: found full word
        if not (0 <= r < rows and 0 <= c < cols):
            return False                              # L2: out of bounds
        if (r, c) in visited or board[r][c] != word[i]:
            return False                              # L3: O(1) hash check
        visited.add((r, c))                           # L4: O(1) mark
        found = (dfs(r + 1, c, i + 1, visited) or
                 dfs(r - 1, c, i + 1, visited) or
                 dfs(r, c + 1, i + 1, visited) or
                 dfs(r, c - 1, i + 1, visited))       # L5: 4 recursive calls
        visited.remove((r, c))                        # L6: O(1) unmark
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
            return True                               # L1: full match
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]:
            return False                              # L2: boundary / mismatch
        saved = board[r][c]
        board[r][c] = '#'                             # L3: O(1) mark in-place
        found = (dfs(r + 1, c, i + 1) or
                 dfs(r - 1, c, i + 1) or
                 dfs(r, c + 1, i + 1) or
                 dfs(r, c - 1, i + 1))               # L4: 4 recursive calls
        board[r][c] = saved                           # L5: O(1) restore
        return found

    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False
```

**Where the time goes, line by line**

*Variables: n = rows * cols (board cells), L = len(word).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (boundary/mismatch) | O(1) | one per DFS call | O(n · 4^L) |
| L3/L5 (mark/restore) | O(1) | one per DFS call | O(n · 4^L) |
| **L4 (four recursive calls)** | **O(1) dispatch** | **n · 4^L** | **O(n · 4^L)** ← dominates |

Starting from each of n cells, the DFS explores at most 4^L paths of length L.

**Complexity**
- **Time:** O(m · n · 4^L), driven by L4 branching four ways per step.
- **Space:** O(L) recursion. No auxiliary set.

Standard interview answer. The "restore on backtrack" is the essential pattern.

## Approach 3: Start-cell pruning with character counts

Before doing any DFS, count characters on the board. If the board lacks any character of `word` (or not enough of each), return `false` immediately. Additionally, if the last character of `word` is rarer on the board than the first, reverse `word` before searching, DFS from rare characters prunes faster.

```python
from collections import Counter

def exist(board, word):
    board_counts = Counter(c for row in board for c in row)  # L1: O(n) count
    for ch, needed in Counter(word).items():
        if board_counts[ch] < needed:
            return False                                      # L2: O(L) fast reject

    if board_counts[word[-1]] < board_counts[word[0]]:
        word = word[::-1]                                     # L3: O(L) reverse

    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]: return False
        saved = board[r][c]; board[r][c] = '#'
        found = (dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or
                 dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1))  # L4: DFS as before
        board[r][c] = saved
        return found

    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False
```

**Where the time goes, line by line**

*Variables: n = rows * cols (board cells), L = len(word).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1/L2 (count + reject) | O(n + L) | 1 | O(n + L) |
| L3 (reverse) | O(L) | at most 1 | O(L) |
| **L4 (DFS)** | **O(n · 4^L)** | **1** | **O(n · 4^L)** ← dominates |

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

## Test cases

```python
def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]: return False
        saved = board[r][c]; board[r][c] = '#'
        found = (dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1))
        board[r][c] = saved
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0): return True
    return False

def _run_tests():
    board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]
    import copy
    assert exist(copy.deepcopy(board), "ABCCED") == True
    assert exist(copy.deepcopy(board), "SEE") == True
    assert exist(copy.deepcopy(board), "ABCB") == False
    # single cell
    assert exist([["A"]], "A") == True
    assert exist([["A"]], "B") == False
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), the grid; in-place mutation as visited marker
- [Hash Tables](../../../data-structures/hash-tables/), optional Counter pruning
