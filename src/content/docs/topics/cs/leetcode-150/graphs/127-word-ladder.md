---
title: "127. Word Ladder (Hard)"
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
    if endWord not in wordList:              # L1: O(N) set lookup
        return 0
    words = set(wordList)                   # L2: O(N) build set
    q = deque([(beginWord, 1)])             # L3: O(1) init queue
    visited = {beginWord}                   # L4: O(1) init visited

    def one_away(a, b):                     # L5: O(L) per call
        return sum(1 for x, y in zip(a, b) if x != y) == 1

    while q:                                # L6: outer BFS loop, up to N levels
        word, dist = q.popleft()            # L7: O(1)
        if word == endWord:
            return dist
        for cand in list(words):            # L8: O(N) scan per word
            if cand not in visited and one_away(word, cand):  # L9: O(L) per candidate
                visited.add(cand)
                q.append((cand, dist + 1))
    return 0
```

**Where the time goes, line by line**

*Variables: N = len(wordList), L = length of each word (all words same length).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (endWord check) | O(N) | 1 | O(N) |
| L2 (set build) | O(N) | 1 | O(N) |
| L6 (BFS loop) | O(1) | up to N iters | O(N) |
| L8 (scan all words) | O(N) | once per dequeued word | O(N) per dequeue |
| **L9 (one_away check)** | **O(L)** | **N times per dequeued word** | **O(N² · L)** ← dominates |

Each dequeued word scans the entire word list (L8, O(N)) and calls `one_away` for each candidate (L9, O(L)). In the worst case every word is dequeued, giving O(N) dequeues × O(N · L) work = **O(N² · L)**. This is why the pattern-bucket approach replaces L8+L9 with an O(L)-per-word neighbor lookup.

**Complexity**
- **Time:** O(N² · L), driven by L8/L9 (scanning all words and doing O(L) comparison per candidate per dequeued word).
- **Space:** O(N · L).

## Approach 2: Pattern buckets + BFS (optimal single-direction)

Preprocess: for each word, generate patterns like `"h*t"`, `"*ot"`, `"ho*"` (one wildcard). Two words are one-away iff they share a pattern. A dict `pattern → [words]` gives O(L) neighbor lookup.

```python
from collections import defaultdict, deque

def ladder_length(beginWord, endWord, wordList):
    if endWord not in wordList:                      # L1: O(N)
        return 0

    L = len(beginWord)                               # L2: O(1)
    patterns = defaultdict(list)                     # L3: O(1) init
    for w in wordList:                               # L4: O(N) outer
        for i in range(L):                           # L5: O(L) inner
            patterns[w[:i] + "*" + w[i+1:]].append(w)  # L6: O(L) slice + store

    q = deque([(beginWord, 1)])                      # L7: O(1)
    visited = {beginWord}                            # L8: O(1)
    while q:                                         # L9: BFS loop
        word, dist = q.popleft()                     # L10: O(1)
        if word == endWord:
            return dist
        for i in range(L):                           # L11: O(L) per word
            key = word[:i] + "*" + word[i+1:]        # L12: O(L) slice
            for nb in patterns[key]:                 # L13: O(neighbors)
                if nb not in visited:
                    visited.add(nb)
                    q.append((nb, dist + 1))
            patterns[key] = []                       # L14: prune bucket
    return 0
```

**Where the time goes, line by line**

*Variables: N = len(wordList), L = length of each word.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L4-L6 (build pattern dict) | O(L) per word per position | N × L | O(N · L²) |
| L9 (BFS loop) | O(1) | up to N iters | O(N) |
| L11-L12 (generate key) | O(L) | L times per dequeued word | O(L) per word |
| **L13 (neighbor lookup)** | **O(neighbors per pattern)** | **L per word, amortized O(N) total** | **O(N · L²)** ← dominates |
| L14 (prune bucket) | O(1) | L per dequeued word | O(N · L) |

The bottleneck is the preprocessing (L4-L6) plus the BFS neighbor lookups (L13). Each word generates L pattern keys, each of length L, so building the pattern dict costs O(N · L²). BFS visits each edge at most once (via L14 pruning), and there are at most O(N · L) edges (each word shares O(L) patterns with each neighbor), giving total BFS work O(N · L²).

**Complexity**
- **Time:** O(N · L²), driven by L4-L6/L13 (pattern construction and BFS neighbor traversal, each O(N · L²) total).
- **Space:** O(N · L²).

## Approach 3: Bidirectional BFS

Start BFS simultaneously from both `beginWord` and `endWord`; alternately expand the smaller frontier. When they meet, sum the two depths. Much faster on deep graphs because the branching factor is squared without bidirectional search.

```python
from collections import defaultdict

def ladder_length(beginWord, endWord, wordList):
    words = set(wordList)                       # L1: O(N) build set
    if endWord not in words:                    # L2: O(1)
        return 0

    L = len(beginWord)                          # L3: O(1)
    front, back = {beginWord}, {endWord}        # L4: O(1) init frontiers
    visited = {beginWord, endWord}              # L5: O(1)
    dist = 1                                    # L6: O(1)

    while front and back:                       # L7: outer loop, O(diameter) levels
        if len(front) > len(back):              # L8: swap to keep front smaller
            front, back = back, front

        next_front = set()
        for w in front:                         # L9: iterate smaller frontier
            for i in range(L):                  # L10: O(L) positions
                for ch in "abcdefghijklmnopqrstuvwxyz":  # L11: O(26) chars
                    cand = w[:i] + ch + w[i+1:]  # L12: O(L) slice
                    if cand in back:             # L13: O(1) set lookup
                        return dist + 1
                    if cand in words and cand not in visited:  # L14: O(1)
                        visited.add(cand)
                        next_front.add(cand)
        front = next_front
        dist += 1
    return 0
```

**Where the time goes, line by line**

*Variables: N = len(wordList), L = length of each word.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (build set) | O(N) | 1 | O(N) |
| L7 (BFS levels) | O(1) | O(diameter) levels | O(diameter) |
| L9-L12 (frontier expansion) | O(L²) per word in frontier | frontier size per level | O(frontier · L²) |
| **L13-L14 (candidate test)** | **O(1)** | **26 · L per frontier word** | **O(N · L²)** ← dominates worst case |

In the worst case both frontiers grow to O(sqrt(N)) (bidirectional BFS squares the branching rate), giving O(N · L²) total. In practice, the smaller frontier stays tiny and the search terminates far earlier than unidirectional BFS.

**Complexity**
- **Time:** O(N · L²) worst case, driven by L13/L14; typically much faster than unidirectional BFS.
- **Space:** O(N · L).

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| BFS with pairwise check | O(N² · L) | O(N · L) | Too slow for large inputs |
| **BFS with pattern buckets** | **O(N · L²)** | **O(N · L²)** | Canonical |
| **Bidirectional BFS** | O(N · L²) worst; much faster practically | O(N · L) | Best in practice |

Bidirectional BFS is a general technique for "minimum number of edits" problems where both source and target are known.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_127.py and run.
# Uses Approach 2 (pattern buckets + BFS) as the canonical implementation.

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
            patterns[key] = []
    return 0

def _run_tests():
    # Example from problem statement
    assert ladder_length("hit", "cog", ["hot","dot","dog","lot","log","cog"]) == 5
    # No path (endWord not in list)
    assert ladder_length("hit", "cot", ["hot","dot","dog","lot","log","cog"]) == 0
    # Single step
    assert ladder_length("hot", "dot", ["dot","lot"]) == 2
    # endWord not reachable
    assert ladder_length("hit", "cog", ["hot","dot","dog","lot","log"]) == 0
    # Two words, direct transform
    assert ladder_length("a", "c", ["a","b","c"]) == 2
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Graphs](../../../data-structures/graphs/), implicit graph via string edit distance
- [Hash Tables](../../../data-structures/hash-tables/), pattern-bucket adjacency
- [Queues](../../../data-structures/queues/), BFS engine
