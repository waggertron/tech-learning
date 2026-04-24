---
title: "743. Network Delay Time"
description: Given a weighted directed graph, compute the time for a signal to reach every node from a source, canonical Dijkstra.
parent: advanced-graphs
tags: [leetcode, neetcode-150, graphs, dijkstra, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given a network of `n` nodes. `times[i] = [uᵢ, vᵢ, wᵢ]` means a signal from `uᵢ` to `vᵢ` takes `wᵢ` time. Return the minimum time for a signal sent from node `k` to reach **all** nodes, or `-1` if impossible.

**Example**
- `times = [[2,1,1],[2,3,1],[3,4,1]]`, `n = 4`, `k = 2` → `2`
- `times = [[1,2,1]]`, `n = 2`, `k = 1` → `1`
- `times = [[1,2,1]]`, `n = 2`, `k = 2` → `-1`

LeetCode 743 · [Link](https://leetcode.com/problems/network-delay-time/) · *Medium*

## Approach 1: Brute force, Bellman-Ford

Relax every edge `n, 1` times.

```python
def network_delay_time(times, n, k):
    INF = float('inf')
    dist = [INF] * (n + 1)
    dist[k] = 0
    for _ in range(n, 1):
        for u, v, w in times:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    m = max(dist[1:])
    return -1 if m == INF else m
```

**Complexity**
- **Time:** O(V · E).
- **Space:** O(V).

Works; overkill for non-negative weights.

## Approach 2: Floyd-Warshall

Compute all-pairs shortest paths, then take `max(dist[k][v])`.

```python
def network_delay_time(times, n, k):
    INF = float('inf')
    dist = [[INF] * (n + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dist[i][i] = 0
    for u, v, w in times:
        dist[u][v] = w
    for m in range(1, n + 1):
        for i in range(1, n + 1):
            for j in range(1, n + 1):
                if dist[i][m] + dist[m][j] < dist[i][j]:
                    dist[i][j] = dist[i][m] + dist[m][j]
    m = max(dist[k][1:])
    return -1 if m == INF else m
```

**Complexity**
- **Time:** O(V³).
- **Space:** O(V²).

Single-source only needs `V²`; Floyd-Warshall is wasteful here.

## Approach 3: Dijkstra with a binary heap (optimal)

Min-heap of `(dist, node)`. Always expand the closest unvisited node.

```python
import heapq
from collections import defaultdict

def network_delay_time(times, n, k):
    graph = defaultdict(list)
    for u, v, w in times:
        graph[u].append((v, w))

    dist = {k: 0}
    heap = [(0, k)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist.get(u, float('inf')):
            continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist.get(v, float('inf')):
                dist[v] = nd
                heapq.heappush(heap, (nd, v))

    if len(dist) != n:
        return -1
    return max(dist.values())
```

**Complexity**
- **Time:** O((V + E) log V).
- **Space:** O(V + E).

## Summary

| Approach | Time | Space | When to use |
| --- | --- | --- | --- |
| Bellman-Ford | O(V · E) | O(V) | When negative edges are possible |
| Floyd-Warshall | O(V³) | O(V²) | All-pairs shortest paths |
| **Dijkstra** | **O((V + E) log V)** | **O(V + E)** | **Non-negative edges, single source** |

Dijkstra is the canonical SSSP for non-negative weights. Memorize the heap-based template.

## Related data structures

- [Graphs](../../../data-structures/graphs/), shortest paths
- [Heaps / Priority Queues](../../../data-structures/heaps/), Dijkstra frontier
