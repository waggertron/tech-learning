---
title: "212. Word Search II"
description: Find every word from a dictionary that can be formed from sequentially adjacent cells in a 2D board.
parent: tries
tags: [leetcode, neetcode-150, tries, backtracking, dfs, grid, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a 2D board of characters and a list of words, return all words that can be constructed from sequentially adjacent cells. Each cell may be used at most once per word.

**Example**
- `board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]`
- `words = ["oath","pea","eat","rain"]`
- → `["oath", "eat"]`

LeetCode 212 · [Link](https://leetcode.com/problems/word-search-ii/) · *Hard*

## Approach 1: Brute force, solve Word Search for each word

Run problem 79's algorithm once per word.

```python
def find_words(board, words):
    rows, cols = len(board), len(board[0])

    def exist(word):
        def dfs(r, c, i):
            if i == len(word):
                return True
            if not (0 <= r < rows and 0 <= c < cols) or board[r][c] != word[i]:
                return False
            saved = board[r][c]
            board[r][c] = "#"
            found = (dfs(r + 1, c, i + 1) or dfs(r, 1, c, i + 1)
                     or dfs(r, c + 1, i + 1) or dfs(r, c, 1, i + 1))
            board[r][c] = saved
            return found

        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, 0):
                    return True
        return False

    return [w for w in words if exist(w)]
```

**Complexity**
- **Time:** O(W · m · n · 4^L) where W = words, L = max word length.
- **Space:** O(L) recursion.

Typically times out: overlapping prefixes across words cause massive duplicate work.

## Approach 2: Insert all words into a trie, DFS the board with trie pruning

Walk the board with DFS; at each step, move down the trie along the current letter. If the letter isn't a child of the current trie node, prune immediately. When you reach an end-of-word node, record the word.

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None    # full word stored at terminal nodes (dedup helper)

def find_words(board, words):
    # Build the trie
    root = TrieNode()
    for w in words:
        node = root
        for ch in w:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.word = w

    rows, cols = len(board), len(board[0])
    found = []

    def dfs(r, c, node):
        if not (0 <= r < rows and 0 <= c < cols):
            return
        ch = board[r][c]
        if ch == "#" or ch not in node.children:
            return
        next_node = node.children[ch]
        if next_node.word:
            found.append(next_node.word)
            next_node.word = None    # dedup
        board[r][c] = "#"
        dfs(r + 1, c, next_node)
        dfs(r, 1, c, next_node)
        dfs(r, c + 1, next_node)
        dfs(r, c, 1, next_node)
        board[r][c] = ch

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, root)
    return found
```

**Complexity**
- **Time:** O(m · n · 4^L). Trie lookup is O(1) per step.
- **Space:** O(total characters in words).

## Approach 3: Approach 2 + dead-branch pruning

After finding a word, prune the leaf from the trie. Over time the trie shrinks, cutting the DFS search space. Combined with the `word = None` dedup above, this gives noticeable speedups on large word lists.

```python
# Add to the DFS in Approach 2: prune empty subtrees on the way back up.
# After the recursive calls:
#     if not next_node.children:
#         node.children.pop(ch)
```

Complexity is unchanged asymptotically but wall-clock is often 2–10× faster.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Per-word Word Search | O(W · m · n · 4^L) | O(L) | Usually times out |
| **Trie + board DFS** | **O(m · n · 4^L)** | **O(total chars)** | Canonical |
| + dead-branch pruning | same Big-O | same | Practical speedup |

This problem is the canonical "why tries matter" interview question. The trie turns "run N similar searches" into "run one search against a structure that encodes all N."

## Related data structures

- [Tries](../../../data-structures/tries/), dictionary representation with DFS pruning
- [Arrays](../../../data-structures/arrays/), board with in-place visited marker
