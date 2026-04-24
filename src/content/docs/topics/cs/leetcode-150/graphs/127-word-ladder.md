---
title: "127. Word Ladder"
description: Transform one word into another using a word list, changing one letter at a time. Return the shortest ladder length.
parent: graphs
tags: [leetcode, neetcode-150, graphs, bfs, strings, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two words `beginWord` and `endWord`, and a word list `wordList`, return the length of the shortest transformation sequence from `beginWord` to `endWord`, where:

- Each step changes exactly one letter.
- Every intermediate word must be in `wordList`.
- Return 0 if there's no valid transformation.

`beginWord` is not required to be in `wordList`; `endWord` must be.

**Example**
- `beginWord = "hit"`, `endWord = "cog"`, `wordList = ["hot","dot","dog","lot","log","cog"]` → `5` (hit → hot → dot → dog → cog)
- Same setup, `endWord = "cot"` → `0`

LeetCode 127 · [Link](https://leetcode.com/problems/word-ladder/) · *Hard*

## Approach 1: Brute force, BFS comparing every pair

BFS from `beginWord`. At each frontier word, scan the whole word list for "1 letter off" candidates.

```python
from collections import deque

def ladder_length(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0
    words = set(wordList)
    q = deque([(beginWord, 1)])
    visited = {beginWord}

    def one_away(a, b):
        return sum(1 for x, y in zip(a, b) if x != y) == 1

    while q:
        word, dist = q.popleft()
        if word == endWord:
            return dist
        for cand in list(words):
            if cand not in visited and one_away(word, cand):
                visited.add(cand)
                q.append((cand, dist + 1))
    return 0
```

**Complexity**
- **Time:** O(N² · L) where N = `|wordList|`, L = word length.
- **Space:** O(N · L).

Quadratic in N, too slow for large lists.

## Approach 2: Pattern buckets + BFS (optimal single-direction)

Preprocess: for each word, generate patterns like `"h*t"`, `"*ot"`, `"ho*"` (one wildcard). Two words are one-away iff they share a pattern. A dict `pattern → [words]` gives O(L) neighbor lookup.

```python
from collections import defaultdict, deque

def ladder_length(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0

    L = len(beginWord)
    patterns = defaultdict(list)
    for w in wordList:
        for i in range(L):
            patterns[w[:i] + "*" + w[i+1:]].append(w)

    q = deque([(beginWord, 1)])
    visited = {beginWord}
    while q:
        word, dist = q.popleft()
        if word == endWord:
            return dist
        for i in range(L):
            key = word[:i] + "*" + word[i+1:]
            for nb in patterns[key]:
                if nb not in visited:
                    visited.add(nb)
                    q.append((nb, dist + 1))
            patterns[key] = []   # prune to avoid revisiting
    return 0
```

**Complexity**
- **Time:** O(N · L²). Each of N words has L patterns; each pattern string is length L.
- **Space:** O(N · L²).

The canonical single-BFS answer.

## Approach 3: Bidirectional BFS

Start BFS simultaneously from both `beginWord` and `endWord`; alternately expand the smaller frontier. When they meet, sum the two depths. Much faster on deep graphs because the branching factor is squared without bidirectional search.

```python
from collections import defaultdict

def ladder_length(beginWord, endWord, wordList):
    words = set(wordList)
    if endWord not in words:
        return 0

    L = len(beginWord)
    front, back = {beginWord}, {endWord}
    visited = {beginWord, endWord}
    dist = 1

    while front and back:
        if len(front) > len(back):
            front, back = back, front

        next_front = set()
        for w in front:
            for i in range(L):
                for ch in "abcdefghijklmnopqrstuvwxyz":
                    cand = w[:i] + ch + w[i+1:]
                    if cand in back:
                        return dist + 1
                    if cand in words and cand not in visited:
                        visited.add(cand)
                        next_front.add(cand)
        front = next_front
        dist += 1
    return 0
```

**Complexity**
- **Time:** O(N · L²) in the worst case; typically far faster in practice.
- **Space:** O(N · L).

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| BFS with pairwise check | O(N² · L) | O(N · L) | Too slow for large inputs |
| **BFS with pattern buckets** | **O(N · L²)** | **O(N · L²)** | Canonical |
| **Bidirectional BFS** | O(N · L²) worst; much faster practically | O(N · L) | Best in practice |

Bidirectional BFS is a general technique for "minimum number of edits" problems where both source and target are known.

## Related data structures

- [Graphs](../../../data-structures/graphs/), implicit graph via string edit distance
- [Hash Tables](../../../data-structures/hash-tables/), pattern-bucket adjacency
- [Queues](../../../data-structures/queues/), BFS engine
