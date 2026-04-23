---
title: "211. Design Add and Search Words Data Structure"
description: Support adding words and searching with a '.' wildcard that matches any single character.
parent: tries
tags: [leetcode, neetcode-150, tries, backtracking, design, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Design a data structure supporting:

- `addWord(word)` — add a word.
- `search(word)` — true iff any added word matches. `word` may contain `.` which matches any single letter.

**Example**
```
wd = WordDictionary();
wd.addWord("bad"); wd.addWord("dad"); wd.addWord("mad");
wd.search("pad");  // false
wd.search("bad");  // true
wd.search(".ad");  // true
wd.search("b..");  // true
```

LeetCode 211 · [Link](https://leetcode.com/problems/design-add-and-search-words-data-structure/) · *Medium*

## Approach 1: Brute force — list of words, regex match

Store words in a list; on search, compile `.` as regex.

```python
import re

class WordDictionary:
    def __init__(self):
        self.words = []

    def addWord(self, word):
        self.words.append(word)

    def search(self, word):
        pattern = re.compile("^" + word + "$")
        return any(pattern.match(w) for w in self.words)
```

**Complexity**
- `addWord`: O(1).
- `search`: O(W · L). Degrades as words accumulate.
- Space: O(total chars).

## Approach 2: Hash map bucketed by length + per-position scan

Group words by length; on search, compare character-by-character only against same-length words. Faster pruning but still linear in group size.

```python
from collections import defaultdict

class WordDictionary:
    def __init__(self):
        self.by_len = defaultdict(list)

    def addWord(self, word):
        self.by_len[len(word)].append(word)

    def search(self, word):
        for w in self.by_len.get(len(word), []):
            if all(p == '.' or p == c for p, c in zip(word, w)):
                return True
        return False
```

**Complexity**
- `addWord`: O(L).
- `search`: O(W_L · L) where W_L is count of stored words of that length.

Reasonable for small L, small W_L.

## Approach 3: Trie with DFS wildcard (canonical)

Store words in a trie. On search, follow the trie; for `.`, try every child.

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        def dfs(i, node):
            if i == len(word):
                return node.is_end
            ch = word[i]
            if ch == '.':
                return any(dfs(i + 1, child) for child in node.children.values())
            if ch in node.children:
                return dfs(i + 1, node.children[ch])
            return False
        return dfs(0, self.root)
```

**Complexity**
- `addWord`: O(L).
- `search`: O(L) average, O(26^L) worst (all wildcards in a dense trie).
- Space: O(total chars).

The wildcard branches are where performance can degrade — a prompt like `"......"` against a dense dictionary is the pathological case.

## Summary

| Approach | addWord | search | Notes |
| --- | --- | --- | --- |
| List + regex | O(1) | O(W · L) | Naive |
| Length-bucketed list | O(L) | O(W_L · L) | Better pruning |
| **Trie + DFS wildcard** | **O(L)** | **O(L)** avg | Canonical |

The trie approach generalizes to **212 Word Search II** (the next problem) where we DFS a grid against a trie of candidate words.

## Related data structures

- [Tries](../../../data-structures/tries/) — trie with wildcard DFS
