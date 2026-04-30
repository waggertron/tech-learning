---
title: "269. Alien Dictionary (Hard)"
description: Given a sorted list of words from an alien alphabet, deduce the alphabet order.
parent: graphs
tags: [leetcode, neetcode-150, graphs, topological-sort, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given a list of strings `words` from an alien language, sorted lexicographically by its rules. Return a string of unique letters in order; if impossible, return `""`.

**Example**
- `words = ["wrt","wrf","er","ett","rftt"]` -> `"wertf"`
- `words = ["z","x"]` -> `"zx"`
- `words = ["z","x","z"]` -> `""` (contradiction)

LeetCode 269 (premium) · [Link](https://leetcode.com/problems/alien-dictionary/) · *Hard*

## Approach 1: Brute force, try all character orderings

For each permutation of the distinct letters, test whether the given words are lexicographically ordered under it. Return the first permutation that works.

```python
from itertools import permutations

def alien_order(words):
    chars = set(c for w in words for c in w)
    for perm in permutations(sorted(chars)):                    # L1: K! orderings
        rank = {ch: i for i, ch in enumerate(perm)}
        valid = True
        for w1, w2 in zip(words, words[1:]):                    # L2: W-1 adjacent pairs
            cmp_done = False
            for a, b in zip(w1, w2):
                if a != b:
                    if rank[a] > rank[b]:
                        valid = False
                    cmp_done = True
                    break
            if not cmp_done and len(w1) > len(w2):              # prefix contradiction
                valid = False
            if not valid:
                break
        if valid:
            return "".join(perm)
    return ""
```

Different valid orderings exist for the same input; this returns the first one found in lexicographic permutation order. Don't compare against a specific canonical answer; verify it satisfies the constraints instead.

**Where the time goes, line by line**

*Variables: W = number of words, L = max word length, K = unique characters across all words (<=26).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (generate permutations) | O(K!) | 1 | O(K!) |
| **L2 (test each permutation against words)** | **O(W · L)** | **K!** | **O(K! · W · L)** <- dominates |

Every permutation must be tested against every adjacent pair of words up to length L; this blows up fast because K! grows catastrophically (12! > 479 million).

**Complexity**
- **Time:** O(K! · W · L), driven by L2. Infeasible past K around 8.
- **Space:** O(K).

Educational only; don't actually write this.

## Approach 2: Build graph from adjacent-word constraints + Kahn's BFS (canonical)

From adjacent word pairs, extract the **first differing character pair** -- that's a directed edge (earlier -> later). Then topologically sort.

Edge cases: if a word is a strict prefix of the previous word (e.g., `["abc", "ab"]`), it's a contradiction, return `""`.

```python
from collections import defaultdict, deque

def alien_order(words):
    # 1. Collect all distinct characters
    in_deg = {c: 0 for w in words for c in w}  # L1: O(W * L) to build
    graph = defaultdict(set)                     # L2: O(1)

    # 2. Build edges from adjacent pairs
    for w1, w2 in zip(words, words[1:]):         # L3: W-1 iterations
        # Prefix contradiction
        if len(w1) > len(w2) and w1.startswith(w2):  # L4: O(L) check
            return ""
        for a, b in zip(w1, w2):                 # L5: up to L char comparisons
            if a != b:
                if b not in graph[a]:
                    graph[a].add(b)
                    in_deg[b] += 1               # L6: O(1) edge insertion
                break

    # 3. Kahn's BFS
    q = deque([c for c, d in in_deg.items() if d == 0])  # L7: O(K)
    order = []
    while q:                                     # L8: K iterations total
        c = q.popleft()                          # L9: O(1)
        order.append(c)
        for nb in graph[c]:                      # L10: each edge visited once
            in_deg[nb] -= 1
            if in_deg[nb] == 0:
                q.append(nb)                     # L11: O(1)

    return "".join(order) if len(order) == len(in_deg) else ""  # L12: O(K)
```

**Where the time goes, line by line**

*Variables: W = number of words, L = max word length, K = unique characters across all words (<=26).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (build in_deg) | O(1) | W * L chars | O(W * L) |
| L3-L6 (edge extraction) | O(L) per pair | W - 1 pairs | O(W * L) |
| L7 (seed queue) | O(K) | 1 | O(K) |
| **L8-L11 (Kahn's BFS)** | **O(1) per node/edge** | **K nodes + E edges** | **O(K + E)** <- dominates on large inputs |
| L12 (join) | O(K) | 1 | O(K) |

The edge extraction and Kahn's loop each run in O(W * L + K + E). Because K <= 26, the W * L term (reading all word characters to build in_deg) is often the real bottleneck in practice.

**Complexity**
- **Time:** O(W * L + K + E), driven by L3-L6 (edge extraction) and L8-L11 (Kahn's BFS). Since K <= 26, this simplifies to O(W * L) in practice.
- **Space:** O(K + E) for the graph and in-degree map.

## Approach 3: Build graph + DFS post-order reversed

Same edge extraction, but topologically sort via DFS post-order.

```python
from collections import defaultdict

def alien_order(words):
    in_deg = {c: 0 for w in words for c in w}  # L1: O(W * L)
    graph = defaultdict(set)                     # L2: O(1)

    for w1, w2 in zip(words, words[1:]):         # L3: W-1 pairs
        if len(w1) > len(w2) and w1.startswith(w2):  # L4: O(L) check
            return ""
        for a, b in zip(w1, w2):                 # L5: up to L comparisons
            if a != b:
                graph[a].add(b)                  # L6: O(1) edge add
                break

    WHITE, GRAY, BLACK = 0, 1, 2
    color = {c: WHITE for c in in_deg}           # L7: O(K)
    order = []
    has_cycle = False

    def dfs(n):                                  # L8: called once per node
        nonlocal has_cycle
        if has_cycle:
            return
        color[n] = GRAY                          # L9: O(1)
        for nb in graph[n]:                      # L10: each edge visited once
            if color[nb] == WHITE:
                dfs(nb)
            elif color[nb] == GRAY:
                has_cycle = True                 # L11: cycle detected
                return
        color[n] = BLACK
        order.append(n)                          # L12: O(1) post-order append

    for c in list(in_deg):                       # L13: K nodes total
        if color[c] == WHITE:
            dfs(c)

    if has_cycle:
        return ""
    return "".join(order[::-1])                  # L14: O(K) reverse + join
```

**Where the time goes, line by line**

*Variables: W = number of words, L = max word length, K = unique characters across all words (<=26).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1, L3-L6 (graph build) | O(L) per pair | W - 1 pairs | O(W * L) |
| L7 (init color map) | O(K) | 1 | O(K) |
| **L8-L12 (DFS body)** | **O(1) per node/edge** | **K nodes + E edges** | **O(K + E)** <- dominates on large inputs |
| L14 (reverse + join) | O(K) | 1 | O(K) |

Same asymptotic profile as Kahn's. DFS adds call-stack overhead proportional to the longest path in the DAG, which is at most K deep. With K <= 26, stack overflow is not a real concern here.

**Complexity**
- **Time:** O(W * L + K + E), driven by L3-L6 and L8-L12.
- **Space:** O(K + E) for the graph plus O(K) recursion depth.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Try every permutation | O(K! · W · L) | O(K) |
| **Kahn's BFS** | **O(W * L + K + E)** | **O(K + E)** |
| DFS post-order reversed | O(W * L + K + E) | O(K + E) |

Kahn's is the canonical answer -- you extract edges in one pass and topologically sort in another. The prefix-contradiction check is the easy-to-miss gotcha.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_alien_dictionary.py and run.
# Uses the canonical implementation (Approach 2: Kahn's BFS).

from collections import defaultdict, deque

def alien_order(words):
    in_deg = {c: 0 for w in words for c in w}
    graph = defaultdict(set)

    for w1, w2 in zip(words, words[1:]):
        if len(w1) > len(w2) and w1.startswith(w2):
            return ""
        for a, b in zip(w1, w2):
            if a != b:
                if b not in graph[a]:
                    graph[a].add(b)
                    in_deg[b] += 1
                break

    q = deque([c for c, d in in_deg.items() if d == 0])
    order = []
    while q:
        c = q.popleft()
        order.append(c)
        for nb in graph[c]:
            in_deg[nb] -= 1
            if in_deg[nb] == 0:
                q.append(nb)

    return "".join(order) if len(order) == len(in_deg) else ""

def _run_tests():
    # Canonical example: "wertf" is one valid order
    result = alien_order(["wrt", "wrf", "er", "ett", "rftt"])
    assert result == "wertf", f"got {result!r}"

    # Simple two-word case
    result = alien_order(["z", "x"])
    assert result == "zx", f"got {result!r}"

    # Contradiction: z comes both before and after itself
    assert alien_order(["z", "x", "z"]) == ""

    # Prefix contradiction: "abc" cannot come before "ab" lexicographically
    assert alien_order(["abc", "ab"]) == ""

    # Single word: any order of its unique chars is valid
    result = alien_order(["abc"])
    assert set(result) == set("abc"), f"got {result!r}"

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Graphs](../../../data-structures/graphs/), topological sort of a DAG built from ordering constraints
- [Hash Tables](../../../data-structures/hash-tables/), adjacency map (set per node to dedup edges)
