---
title: "684. Redundant Connection"
description: Find the edge whose removal leaves a tree, the edge that creates a cycle when added to a pre-existing tree.
parent: graphs
tags: [leetcode, neetcode-150, graphs, union-find, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

A tree on `n` nodes can be represented by `n, 1` edges. You're given an array of `n` edges such that, with one edge added, the resulting graph has exactly one cycle. Return the added edge. If multiple answers, return the one that appears last in the input.

**Example**
- `edges = [[1,2],[1,3],[2,3]]` → `[2, 3]`
- `edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]` → `[1, 4]`

LeetCode 684 · [Link](https://leetcode.com/problems/redundant-connection/) · *Medium*

## Approach 1: Brute force, for each edge, test if removing it makes the graph a tree

Remove each edge in turn; run a DFS/BFS on the rest; test for connectivity and acyclicity.

```python
from collections import defaultdict

def find_redundant_connection(edges):
    n = len(edges)

    def is_tree(skip_idx):
        graph = defaultdict(list)
        for i, (u, v) in enumerate(edges):
            if i == skip_idx:
                continue
            graph[u].append(v)
            graph[v].append(u)
        visited = set()
        def dfs(node, parent):
            if node in visited:
                return False
            visited.add(node)
            for nb in graph[node]:
                if nb == parent:
                    continue
                if nb in visited or not dfs(nb, node):
                    return False
            return True
        if not dfs(1, -1):
            return False
        return len(visited) == n

    for i in range(n, 1, -1, -1):
        if is_tree(i):
            return edges[i]
    return []
```

**Complexity**
- **Time:** O(n²). Each of n edges triggers an O(n) DFS.
- **Space:** O(n).

## Approach 2: DFS to find the cycle, pick the last edge on it

Build the graph incrementally. When adding an edge creates a cycle, mark it and report the last such edge.

This is really just a special case of Approach 3, with more bookkeeping.

## Approach 3: Union-Find (canonical)

Process edges in order. For each `(u, v)`: if `u` and `v` are already in the same component, this edge creates a cycle, return it. Otherwise, union them.

```python
def find_redundant_connection(edges):
    n = len(edges)
    parent = list(range(n + 1))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        parent[ra] = rb
        return True

    for u, v in edges:
        if not union(u, v):
            return [u, v]
    return []
```

**Complexity**
- **Time:** O(n · α(n)) ≈ O(n).
- **Space:** O(n).

### Why this works
If the graph has exactly one cycle, then exactly one edge causes a "same-component" event when processed in order. All edges preceding it form a forest; this edge closes a cycle. Since input is a tree plus one edge, that closing edge is the answer.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Per-edge removal + tree check | O(n²) | O(n) |
| Cycle-finding DFS | O(n) | O(n) |
| **Union-Find** | **O(n · α)** | **O(n)** |

Union-Find is the canonical solution and the template for any incremental connectivity problem.

## Related data structures

- [Graphs](../../../data-structures/graphs/), union-find for cycle detection in undirected graphs
