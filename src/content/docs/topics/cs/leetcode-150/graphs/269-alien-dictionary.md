---
title: "269. Alien Dictionary"
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
- `words = ["wrt","wrf","er","ett","rftt"]` → `"wertf"`
- `words = ["z","x"]` → `"zx"`
- `words = ["z","x","z"]` → `""` (contradiction)

LeetCode 269 (premium) · [Link](https://leetcode.com/problems/alien-dictionary/) · *Hard*

## Approach 1: Brute force — try all character orderings

For each permutation of the distinct letters, test whether the given words are lexicographically ordered under it. Return the first permutation that works.

**Complexity**
- **Time:** O(c! · W · L) where c = distinct chars. Infeasible past c ≈ 8.
- **Space:** O(c).

Educational only; don't actually write this.

## Approach 2: Build graph from adjacent-word constraints + Kahn's BFS (canonical)

From adjacent word pairs, extract the **first differing character pair** — that's a directed edge (earlier → later). Then topologically sort.

Edge cases: if a word is a strict prefix of the previous word (e.g., `["abc", "ab"]`), it's a contradiction — return `""`.

```python
from collections import defaultdict, deque

def alien_order(words):
    # 1. Collect all distinct characters
    in_deg = {c: 0 for w in words for c in w}
    graph = defaultdict(set)

    # 2. Build edges from adjacent pairs
    for w1, w2 in zip(words, words[1:]):
        # Prefix contradiction
        if len(w1) > len(w2) and w1.startswith(w2):
            return ""
        for a, b in zip(w1, w2):
            if a != b:
                if b not in graph[a]:
                    graph[a].add(b)
                    in_deg[b] += 1
                break

    # 3. Kahn's
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
```

**Complexity**
- **Time:** O(N + E) where N = total characters, E ≤ unique char pairs.
- **Space:** O(N + E).

## Approach 3: Build graph + DFS post-order reversed

Same edge extraction, but topologically sort via DFS post-order.

```python
from collections import defaultdict

def alien_order(words):
    in_deg = {c: 0 for w in words for c in w}
    graph = defaultdict(set)

    for w1, w2 in zip(words, words[1:]):
        if len(w1) > len(w2) and w1.startswith(w2):
            return ""
        for a, b in zip(w1, w2):
            if a != b:
                graph[a].add(b)
                break

    WHITE, GRAY, BLACK = 0, 1, 2
    color = {c: WHITE for c in in_deg}
    order = []
    has_cycle = False

    def dfs(n):
        nonlocal has_cycle
        if has_cycle:
            return
        color[n] = GRAY
        for nb in graph[n]:
            if color[nb] == WHITE:
                dfs(nb)
            elif color[nb] == GRAY:
                has_cycle = True
                return
        color[n] = BLACK
        order.append(n)

    for c in list(in_deg):
        if color[c] == WHITE:
            dfs(c)

    if has_cycle:
        return ""
    return "".join(order[::-1])
```

**Complexity**
- **Time:** O(N + E).
- **Space:** O(N + E).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Try every permutation | O(c! · W · L) | O(c) |
| **Kahn's BFS** | **O(N + E)** | **O(N + E)** |
| DFS post-order reversed | O(N + E) | O(N + E) |

Kahn's is the canonical answer — you extract edges in one pass and topologically sort in another. The prefix-contradiction check is the easy-to-miss gotcha.

## Related data structures

- [Graphs](../../../data-structures/graphs/) — topological sort of a DAG built from ordering constraints
- [Hash Tables](../../../data-structures/hash-tables/) — adjacency map (set per node to dedup edges)
