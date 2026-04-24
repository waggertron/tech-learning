---
title: "787. Cheapest Flights Within K Stops"
description: Find the cheapest price from src to dst with at most K stops, Bellman-Ford with a hop limit.
parent: advanced-graphs
tags: [leetcode, neetcode-150, graphs, bellman-ford, bfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `n` cities and flights `flights[i] = [fromᵢ, toᵢ, priceᵢ]`, return the cheapest price from `src` to `dst` using at most `k` **stops** (intermediate cities), or `-1` if impossible.

**Example**
- `n = 4`, `flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]`, `src = 0`, `dst = 3`, `k = 1` → `700`
- Same setup, `k = 0` → `-1`

LeetCode 787 · [Link](https://leetcode.com/problems/cheapest-flights-within-k-stops/) · *Medium*

## Approach 1: Brute force, DFS with memo

DFS all paths from src, prune with cost; memoize by `(city, remaining_stops)`.

```python
from collections import defaultdict
from functools import lru_cache

def find_cheapest_price(n, flights, src, dst, k):
    graph = defaultdict(list)
    for u, v, w in flights:
        graph[u].append((v, w))

    @lru_cache(maxsize=None)
    def dfs(city, stops_left):
        if city == dst:
            return 0
        if stops_left < 0:
            return float('inf')
        best = float('inf')
        for nb, cost in graph[city]:
            best = min(best, cost + dfs(nb, stops_left, 1))
        return best

    result = dfs(src, k + 1)
    return -1 if result == float('inf') else result
```

**Complexity**
- **Time:** O(n · k · avg_degree).
- **Space:** O(n · k).

## Approach 2: Modified Dijkstra with (cost, node, stops_remaining)

Dijkstra-ish with a third dimension for hops left; prune entries that exhaust hops before reaching dst.

```python
import heapq
from collections import defaultdict

def find_cheapest_price(n, flights, src, dst, k):
    graph = defaultdict(list)
    for u, v, w in flights:
        graph[u].append((v, w))
    # (cost, city, stops_left)
    heap = [(0, src, k + 1)]
    while heap:
        cost, city, stops = heapq.heappop(heap)
        if city == dst:
            return cost
        if stops > 0:
            for nb, w in graph[city]:
                heapq.heappush(heap, (cost + w, nb, stops, 1))
    return -1
```

**Complexity**
- **Time:** O(E · k · log(V · k)).
- **Space:** O(V · k).

Works but may re-expand nodes with fewer stops and higher cost.

## Approach 3: Bellman-Ford with hop limit (canonical)

Run Bellman-Ford exactly `k + 1` iterations (each iteration = one more hop allowed). Snapshot distances each round to avoid using this-round relaxations.

```python
def find_cheapest_price(n, flights, src, dst, k):
    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0
    for _ in range(k + 1):
        new_dist = dist.copy()
        for u, v, w in flights:
            if dist[u] != INF and dist[u] + w < new_dist[v]:
                new_dist[v] = dist[u] + w
        dist = new_dist
    return -1 if dist[dst] == INF else dist[dst]
```

**Complexity**
- **Time:** O(k · E).
- **Space:** O(V).

### Why the snapshot matters
Without copying, a flight `u → v` relaxed in iteration `i` could be immediately used by `v → x` in the same iteration, that's two hops in one "hop budget" slot, corrupting the answer.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS + memo | O(V · k · avg_deg) | O(V · k) |
| Modified Dijkstra | O(E · k · log(V · k)) | O(V · k) |
| **Bellman-Ford + hop cap** | **O(k · E)** | **O(V)** |

Bellman-Ford with a hop cap is the cleanest solution for this shape of problem, the hop count is exactly `k + 1` iterations. Same pattern applies to any "at-most-k-edges" shortest-path variant.

## Related data structures

- [Graphs](../../../data-structures/graphs/), Bellman-Ford; hop-limited shortest path
