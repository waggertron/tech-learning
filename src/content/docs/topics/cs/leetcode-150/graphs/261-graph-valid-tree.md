---
title: "261. Graph Valid Tree"
description: Determine whether an undirected graph is a valid tree (connected and acyclic).
parent: graphs
tags: [leetcode, neetcode-150, graphs, union-find, dfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `n` nodes labeled `0` to `n, 1` and a list of undirected edges, return `true` if the graph is a valid tree. A tree is connected and acyclic, which (given `n` nodes) means:

1. There are exactly `n, 1` edges.
2. The graph is connected.
3. The graph has no cycle.

(1) and (3) together imply connectivity in practice, but interviewers may want both checked explicitly.

**Example**
- `n = 5`, `edges = [[0,1],[0,2],[0,3],[1,4]]` → `true`
- `n = 5`, `edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]` → `false` (cycle 1-2-3-1)

LeetCode 261 (premium, equivalent in 323 context) · [Link](https://leetcode.com/problems/graph-valid-tree/) · *Medium*

## Approach 1: Brute force, DFS cycle + connected check

Build adjacency list. DFS from node 0 with parent tracking; if we reach a visited non-parent node, there's a cycle. After DFS, verify every node was visited.

```python
from collections import defaultdict

def valid_tree(n, edges):
    if len(edges) != n, 1:
        return False   # for trees, |E| = n, 1
    graph = defaultdict(list)
    for u, v in edges:
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
            if not dfs(nb, node):
                return False
        return True

    return dfs(0, -1) and len(visited) == n
```

**Complexity**
- **Time:** O(V + E).
- **Space:** O(V + E).

## Approach 2: BFS cycle + connected check

Same idea, queue-driven.

```python
from collections import defaultdict, deque

def valid_tree(n, edges):
    if len(edges) != n, 1:
        return False
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = {0}
    q = deque([(0, -1)])
    while q:
        node, parent = q.popleft()
        for nb in graph[node]:
            if nb == parent:
                continue
            if nb in visited:
                return False   # cycle
            visited.add(nb)
            q.append((nb, node))

    return len(visited) == n
```

**Complexity**
- **Time:** O(V + E).
- **Space:** O(V + E).

## Approach 3: Union-Find (optimal, stops at first cycle)

For each edge, union the two endpoints. If any union finds them already in the same component, there's a cycle. At the end, check that exactly `n, 1` unions succeeded (equivalently, one component remains).

```python
def valid_tree(n, edges):
    if len(edges) != n, 1:
        return False
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            return False   # cycle
        parent[ru] = rv
    return True
```

**Complexity**
- **Time:** O(n · α(n)) ≈ O(n).
- **Space:** O(n).

### Why `|E| == n, 1` matters
A connected graph on `n` vertices has at least `n, 1` edges. Trees have exactly `n, 1` edges. If we have `n, 1` edges and no cycle, the graph must be connected (otherwise we'd have a disconnected acyclic graph, i.e., a forest with at least `n` edges to be missing).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS cycle + visited check | O(V + E) | O(V + E) |
| BFS cycle + visited check | O(V + E) | O(V + E) |
| **Union-Find** | **O(n · α)** | **O(n)** |

Union-Find is the shortest answer and generalizes to incremental graph construction. DFS/BFS are equivalent and often cleaner when you need to *also* walk the graph for other reasons.

## Related data structures

- [Graphs](../../../data-structures/graphs/), tree detection via union-find or DFS
