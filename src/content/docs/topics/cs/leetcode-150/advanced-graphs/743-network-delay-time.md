---
title: "743. Network Delay Time (Medium)"
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

Relax every edge `n - 1` times.

```python
def network_delay_time(times, n, k):
    INF = float('inf')
    dist = [INF] * (n + 1)          # L1: O(V) init
    dist[k] = 0                     # L2: O(1)
    for _ in range(n - 1):          # L3: outer loop, V-1 rounds
        for u, v, w in times:       # L4: iterate all edges, O(E) per round
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w   # L5: O(1) relaxation
    m = max(dist[1:])               # L6: O(V)
    return -1 if m == INF else m    # L7: O(1)
```

**Where the time goes, line by line**

*Variables: V = n (number of nodes), E = len(times).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init dist) | O(1) | V+1 | O(V) |
| L2 (set source) | O(1) | 1 | O(1) |
| L3 (outer loop) | O(1) | V-1 | O(V) |
| **L4 (edge scan)** | **O(1)** | **E × (V-1)** | **O(V · E)** ← dominates |
| L5 (relaxation) | O(1) | up to E per round | O(V · E) |
| L6 (max) | O(V) | 1 | O(V) |

L4 drives the cost: we walk all E edges once per round, for V-1 rounds. No priority ordering, no early-exit. Works for negative edges (given none here), but wastes work when only a fraction of edges improve each round.

**Complexity**
- **Time:** O(V · E), driven by L4 (the full edge scan repeated V-1 times).
- **Space:** O(V).

Works; overkill for non-negative weights.

## Approach 2: Floyd-Warshall

Compute all-pairs shortest paths, then take `max(dist[k][v])`.

```python
def network_delay_time(times, n, k):
    INF = float('inf')
    dist = [[INF] * (n + 1) for _ in range(n + 1)]     # L1: O(V²) init
    for i in range(n + 1):                              # L2: O(V) diagonal
        dist[i][i] = 0
    for u, v, w in times:                               # L3: O(E) seed edges
        dist[u][v] = w
    for mid in range(1, n + 1):                         # L4: outer pivot loop, V iters
        for i in range(1, n + 1):                       # L5: row loop, V iters
            for j in range(1, n + 1):                   # L6: col loop, V iters
                if dist[i][mid] + dist[mid][j] < dist[i][j]:
                    dist[i][j] = dist[i][mid] + dist[mid][j]   # L7: O(1) relax
    m = max(dist[k][1:])                                # L8: O(V)
    return -1 if m == INF else m                        # L9: O(1)
```

**Where the time goes, line by line**

*Variables: V = n (number of nodes), E = len(times).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init matrix) | O(1) | V² | O(V²) |
| L2 (diagonal) | O(1) | V | O(V) |
| L3 (seed edges) | O(1) | E | O(E) |
| L4 (pivot loop) | O(1) | V | O(V) |
| L5 (row loop) | O(1) | V² | O(V²) |
| **L6, L7 (col + relax)** | **O(1)** | **V³** | **O(V³)** ← dominates |
| L8 (max) | O(V) | 1 | O(V) |

The triple nested loop (L4/L5/L6) is the signature of Floyd-Warshall. Every (i, j, mid) triple is visited exactly once. This gives us all-pairs shortest paths, but for single-source we only need the `k`-th row -- all the other rows are wasted work.

**Complexity**
- **Time:** O(V³), driven by L6/L7 (the triple nested relaxation loop).
- **Space:** O(V²).

Single-source only needs `V²`; Floyd-Warshall is wasteful here.

## Approach 3: Dijkstra with a binary heap (optimal)

Min-heap of `(dist, node)`. Always expand the closest unvisited node.

```python
import heapq
from collections import defaultdict

def network_delay_time(times, n, k):
    graph = defaultdict(list)                       # L1: O(1) init
    for u, v, w in times:                          # L2: O(E) build adjacency
        graph[u].append((v, w))

    dist = {k: 0}                                  # L3: O(1) seed source
    heap = [(0, k)]                                # L4: O(1) seed heap
    while heap:                                    # L5: loop until heap empty
        d, u = heapq.heappop(heap)                 # L6: O(log V) pop min
        if d > dist.get(u, float('inf')):          # L7: O(1) stale check
            continue
        for v, w in graph[u]:                      # L8: O(deg(u)) neighbor scan
            nd = d + w
            if nd < dist.get(v, float('inf')):
                dist[v] = nd                       # L9: O(1) update dist
                heapq.heappush(heap, (nd, v))      # L10: O(log V) push

    if len(dist) != n:                             # L11: O(1) reachability check
        return -1
    return max(dist.values())                      # L12: O(V)
```

**Where the time goes, line by line**

*Variables: V = n (number of nodes), E = len(times).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L2 (build graph) | O(1) | E | O(E) |
| L3-L4 (seed) | O(1) | 1 | O(1) |
| L5 (loop test) | O(1) | up to E+1 | O(E) |
| **L6 (heappop)** | **O(log V)** | **up to E** | **O(E log V)** ← dominates |
| L7 (stale check) | O(1) | up to E | O(E) |
| L8 (neighbor scan) | O(1) | E total | O(E) |
| **L10 (heappush)** | **O(log V)** | **up to E** | **O(E log V)** ← dominates |
| L12 (max) | O(V) | 1 | O(V) |

Each edge can produce at most one push (L10), so the heap holds at most E entries. Each pop and push costs O(log(heap size)) = O(log E) = O(log V) since E ≤ V². The loop runs at most E times total (once per edge in the worst case). Combining: O(E log V) for the heap work, plus O(E) for the edge scanning, gives O((V + E) log V) overall.

**Complexity**
- **Time:** O((V + E) log V), driven by L6/L10 (heap pop/push inside the main loop).
- **Space:** O(V + E).

## Summary

| Approach | Time | Space | When to use |
| --- | --- | --- | --- |
| Bellman-Ford | O(V · E) | O(V) | When negative edges are possible |
| Floyd-Warshall | O(V³) | O(V²) | All-pairs shortest paths |
| **Dijkstra** | **O((V + E) log V)** | **O(V + E)** | **Non-negative edges, single source** |

Dijkstra is the canonical SSSP for non-negative weights. Memorize the heap-based template.

## Test cases

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

def _run_tests():
    # Example 1: chain 2->1, 2->3, 3->4; source=2; answer=2
    assert network_delay_time([[2,1,1],[2,3,1],[3,4,1]], 4, 2) == 2
    # Example 2: single edge 1->2; source=1; answer=1
    assert network_delay_time([[1,2,1]], 2, 1) == 1
    # Example 3: single edge 1->2 but source=2; unreachable; answer=-1
    assert network_delay_time([[1,2,1]], 2, 2) == -1
    # Single node, no edges; trivially reached
    assert network_delay_time([], 1, 1) == 0
    # Two parallel paths, pick shortest
    assert network_delay_time([[1,2,1],[1,2,5]], 2, 1) == 1
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Graphs](../../../data-structures/graphs/), shortest paths
- [Heaps / Priority Queues](../../../data-structures/heaps/), Dijkstra frontier
