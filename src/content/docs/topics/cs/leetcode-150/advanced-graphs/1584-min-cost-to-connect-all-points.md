---
title: "1584. Min Cost to Connect All Points (Medium)"
description: Connect n points with minimum total wire, a minimum spanning tree problem on a complete Manhattan-distance graph.
parent: advanced-graphs
tags: [leetcode, neetcode-150, graphs, mst, prim, kruskal, union-find, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `n` points on a 2D plane, connect them all with the minimum total cost, where the cost between two points is their Manhattan distance (`|x1 - x2| + |y1 - y2|`). Return the minimum total cost.

**Example**
- `points = [[0,0],[2,2],[3,10],[5,2],[7,0]]` → `20`
- `points = [[3,12],[-2,5],[-4,1]]` → `18`

LeetCode 1584 · [Link](https://leetcode.com/problems/min-cost-to-connect-all-points/) · *Medium*

## Approach 1: Brute force, try all spanning trees

Generate every (n-1)-subset of edges; check if each forms a spanning tree (acyclic and connects all nodes). Track the minimum total weight.

```python
from itertools import combinations

def min_cost_connect_points(points):
    n = len(points)
    if n <= 1:
        return 0
    edges = []
    for i in range(n):
        for j in range(i + 1, n):
            d = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
            edges.append((d, i, j))

    best = float('inf')
    for combo in combinations(edges, n - 1):              # L1: C(E, n-1) subsets
        parent = list(range(n))
        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x
        total = 0
        ok = True
        for d, i, j in combo:                              # L2: check acyclic via Union-Find
            ri, rj = find(i), find(j)
            if ri == rj:
                ok = False
                break
            parent[ri] = rj
            total += d
        if ok:                                             # connected if no cycle and exactly n-1 edges
            best = min(best, total)
    return best
```

By Cayley's formula, K_n has n^(n-2) spanning trees, so this explodes past n ≈ 8.

**Complexity**
- **Time:** exponential in edges.
- **Space:** exponential.

Skip.

## Approach 2: Kruskal's algorithm (sort edges + union-find)

Compute all `n(n-1)/2` pairwise distances; sort by weight; add edges in order if they don't create a cycle.

```python
def min_cost_connect_points(points):
    n = len(points)                                                   # L1: O(1)
    edges = []                                                        # L2: O(1)
    for i in range(n):                                                # L3: outer loop, n iterations
        for j in range(i + 1, n):                                     # L4: inner loop, n-i-1 iterations
            d = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])  # L5: O(1) per pair
            edges.append((d, i, j))                                   # L6: O(1) amortized
    edges.sort()                                                      # L7: O(E log E) where E = n(n-1)/2

    parent = list(range(n))                                           # L8: O(n)
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]                            # L9: path compression, amortized O(alpha(n))
            x = parent[x]
        return x

    total = 0
    edges_added = 0
    for d, i, j in edges:                                             # L10: iterate over sorted edges, up to E iterations
        ri, rj = find(i), find(j)                                     # L11: O(alpha(n)) per find
        if ri != rj:
            parent[ri] = rj                                           # L12: O(1) union
            total += d                                                # L13: O(1)
            edges_added += 1
            if edges_added == n - 1:                                  # L14: early exit once MST complete
                break
    return total
```

**Where the time goes, line by line**

*Variables: V = len(points), E = V² (complete graph of pairwise distances).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3/L4 (edge generation) | O(1) | E = V(V-1)/2 | O(V²) |
| L5/L6 (compute + append) | O(1) | E | O(V²) |
| **L7 (sort edges)** | **O(E log E)** | **1** | **O(V² log V)** ← dominates |
| L8 (init parent) | O(V) | 1 | O(V) |
| L10/L11 (UF loop) | O(alpha(V)) | up to E | O(V²) effectively |
| L12/L13 (union + sum) | O(1) | V-1 | O(V) |

Sorting E = O(V²) edges costs O(V² log V²) = O(V² log V). The union-find loop is fast (nearly linear via path compression and union by rank), but it runs over V² edges in the worst case; however, it exits as soon as V-1 edges are added, so it often terminates well before that.

**Complexity**
- **Time:** O(V² log V), driven by L7 (sorting all pairwise edges).
- **Space:** O(V²) for the edge list.

## Approach 3: Prim's algorithm with a priority queue (optimal for dense graphs)

Grow the MST one node at a time; maintain a priority queue of (distance, node) pairs for candidate extensions.

```python
import heapq

def min_cost_connect_points(points):
    n = len(points)                                                   # L1: O(1)
    visited = [False] * n                                             # L2: O(n)
    heap = [(0, 0)]                                                   # L3: O(1), seed with node 0 at cost 0
    total = 0
    count = 0

    while heap and count < n:                                         # L4: loop runs until all nodes added
        d, u = heapq.heappop(heap)                                    # L5: O(log(heap size)) per pop
        if visited[u]:                                                # L6: skip stale entries
            continue
        visited[u] = True                                             # L7: O(1)
        total += d                                                    # L8: O(1)
        count += 1
        for v in range(n):                                            # L9: scan all nodes for neighbors
            if not visited[v]:
                dist = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])  # L10: O(1)
                heapq.heappush(heap, (dist, v))                       # L11: O(log(heap size)) per push

    return total
```

**Where the time goes, line by line**

*Variables: V = len(points), E = V² (complete graph of pairwise distances).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (init visited) | O(V) | 1 | O(V) |
| L4 (loop) | O(1) | up to E | O(E) = O(V²) |
| **L5 (heappop)** | **O(log E)** | **up to E** | **O(E log E) = O(V² log V)** ← dominates |
| L9/L10 (neighbor scan) | O(1) | V per accepted node | O(V²) total |
| **L11 (heappush)** | **O(log E)** | **up to E** | **O(V² log V)** ← ties |

Each accepted node triggers V neighbor pushes, and each push/pop costs O(log E) = O(log V²) = O(2 log V) = O(log V). With V nodes accepted and V neighbors each, we get O(V² log V) total.

**Complexity**
- **Time:** O(V² log V), driven by L5/L11 (heap operations over E candidate edges).
- **Space:** O(V²) heap worst case (all edges can be in the heap simultaneously).

For dense graphs (complete graphs like this one), a simpler O(V²) Prim's variant (without a heap, using an array of "cheapest to add") matches the lower bound.

### Array-based Prim's (best for dense graphs)
```python
def min_cost_connect_points(points):
    n = len(points)                                                   # L1: O(1)
    in_mst = [False] * n                                              # L2: O(n)
    min_dist = [float('inf')] * n                                     # L3: O(n)
    min_dist[0] = 0
    total = 0
    for _ in range(n):                                                # L4: outer loop, n iterations
        # pick the unvisited node with smallest min_dist
        u = -1
        for v in range(n):                                            # L5: linear scan, O(n) per outer iteration
            if not in_mst[v] and (u == -1 or min_dist[v] < min_dist[u]):
                u = v
        in_mst[u] = True                                              # L6: O(1)
        total += min_dist[u]                                          # L7: O(1)
        for v in range(n):                                            # L8: update min_dist for all neighbors
            if not in_mst[v]:
                d = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])  # L9: O(1)
                if d < min_dist[v]:
                    min_dist[v] = d                                   # L10: O(1)
    return total
```

**Where the time goes, line by line**

*Variables: V = len(points), E = V² (complete graph of pairwise distances).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2/L3 (init arrays) | O(V) | 1 | O(V) |
| L4 (outer loop) | O(1) | V | O(V) |
| **L5 (linear min scan)** | **O(V)** | **V** | **O(V²)** ← dominates |
| L6/L7 (mark + sum) | O(1) | V | O(V) |
| **L8/L9/L10 (dist update)** | **O(V)** | **V** | **O(V²)** ← ties |

No heap needed. The inner scans at L5 and L8 each visit all V nodes once per outer iteration, giving exactly V² operations. This is optimal for dense graphs: you can't do better than O(V²) when there are V² edges to consider.

**Complexity**
- **Time:** O(V²), driven by L5/L8 (the two inner loops over all V nodes).
- **Space:** O(V) for `in_mst` and `min_dist`.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate spanning trees | exponential | exponential |
| Kruskal's (sort + UF) | O(V² log V) | O(V²) |
| Prim's with heap | O(V² log V) | O(V²) |
| **Prim's array-based (dense)** | **O(V²)** | **O(V)** |

For dense graphs (as here), array-based Prim's is optimal. For sparse graphs, heap-based Prim's or Kruskal's is better.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_1584.py and run.
# Uses the canonical implementation (array-based Prim's, optimal for dense graphs).

def min_cost_connect_points(points):
    n = len(points)
    in_mst = [False] * n
    min_dist = [float('inf')] * n
    min_dist[0] = 0
    total = 0
    for _ in range(n):
        u = -1
        for v in range(n):
            if not in_mst[v] and (u == -1 or min_dist[v] < min_dist[u]):
                u = v
        in_mst[u] = True
        total += min_dist[u]
        for v in range(n):
            if not in_mst[v]:
                d = abs(points[u][0] - points[v][0]) + abs(points[u][1] - points[v][1])
                if d < min_dist[v]:
                    min_dist[v] = d
    return total

def _run_tests():
    # Example 1 from problem statement
    assert min_cost_connect_points([[0,0],[2,2],[3,10],[5,2],[7,0]]) == 20
    # Example 2 from problem statement
    assert min_cost_connect_points([[3,12],[-2,5],[-4,1]]) == 18
    # Single point: no edges needed
    assert min_cost_connect_points([[0,0]]) == 0
    # Two points: single edge
    assert min_cost_connect_points([[0,0],[1,1]]) == 2
    # All points on same horizontal line
    assert min_cost_connect_points([[0,0],[1,0],[2,0],[3,0]]) == 3
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Graphs](../../../data-structures/graphs/), MST via Prim's / Kruskal's
- [Heaps / Priority Queues](../../../data-structures/heaps/), Prim's edge selection
