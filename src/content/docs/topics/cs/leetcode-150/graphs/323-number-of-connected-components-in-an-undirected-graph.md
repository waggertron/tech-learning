---
title: "323. Number of Connected Components in an Undirected Graph"
description: Count connected components in an undirected graph.
parent: graphs
tags: [leetcode, neetcode-150, graphs, union-find, dfs, bfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `n` nodes labeled `0` to `n, 1` and a list of undirected edges, return the number of connected components.

**Example**
- `n = 5`, `edges = [[0,1],[1,2],[3,4]]` → `2`
- `n = 5`, `edges = [[0,1],[1,2],[2,3],[3,4]]` → `1`

LeetCode 323 (premium) · [Link](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) · *Medium*

## Approach 1: DFS

Walk each unvisited node; each DFS covers one component.

```python
from collections import defaultdict

def count_components(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set()

    def dfs(node):
        stack = [node]
        while stack:
            x = stack.pop()
            if x in visited:
                continue
            visited.add(x)
            for nb in graph[x]:
                if nb not in visited:
                    stack.append(nb)

    count = 0
    for i in range(n):
        if i not in visited:
            count += 1
            dfs(i)
    return count
```

**Complexity**
- **Time:** O(V + E).
- **Space:** O(V + E).

## Approach 2: BFS

Same structure, queue-driven.

```python
from collections import defaultdict, deque

def count_components(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set()
    count = 0
    for i in range(n):
        if i in visited:
            continue
        count += 1
        q = deque([i])
        visited.add(i)
        while q:
            x = q.popleft()
            for nb in graph[x]:
                if nb not in visited:
                    visited.add(nb)
                    q.append(nb)
    return count
```

**Complexity**
- **Time:** O(V + E).
- **Space:** O(V + E).

## Approach 3: Union-Find (optimal)

Start with `n` components. Each successful union reduces the count by 1.

```python
def count_components(n, edges):
    parent = list(range(n))
    count = n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru != rv:
            parent[ru] = rv
            count -= 1
    return count
```

**Complexity**
- **Time:** O(n + E · α(n)).
- **Space:** O(n).

Slightly tighter space than DFS/BFS; incremental construction friendly.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS | O(V + E) | O(V + E) |
| BFS | O(V + E) | O(V + E) |
| **Union-Find** | **O(V + E · α)** | **O(V)** |

All optimal. Pick union-find when edges arrive online or you also need "are u and v in the same component?" queries.

## Related data structures

- [Graphs](../../../data-structures/graphs/), connected components via any of the three
