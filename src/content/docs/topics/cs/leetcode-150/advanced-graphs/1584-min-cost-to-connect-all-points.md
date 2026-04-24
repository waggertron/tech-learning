---
title: "1584. Min Cost to Connect All Points"
description: Connect n points with minimum total wire, a minimum spanning tree problem on a complete Manhattan-distance graph.
parent: advanced-graphs
tags: [leetcode, neetcode-150, graphs, mst, prim, kruskal, union-find, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `n` points on a 2D plane, connect them all with the minimum total cost, where the cost between two points is their Manhattan distance (`|x1, x2| + |y1, y2|`). Return the minimum total cost.

**Example**
- `points = [[0,0],[2,2],[3,10],[5,2],[7,0]]` → `20`
- `points = [[3,12],[-2,5],[-4,1]]` → `18`

LeetCode 1584 · [Link](https://leetcode.com/problems/min-cost-to-connect-all-points/) · *Medium*

## Approach 1: Brute force, try all spanning trees

Generate every spanning tree by enumerating edge subsets. Infeasible past n ≈ 8.

**Complexity**
- **Time:** exponential in edges.
- **Space:** exponential.

Skip.

## Approach 2: Kruskal's algorithm (sort edges + union-find)

Compute all `n(n-1)/2` pairwise distances; sort by weight; add edges in order if they don't create a cycle.

```python
def min_cost_connect_points(points):
    n = len(points)
    edges = []
    for i in range(n):
        for j in range(i + 1, n):
            d = abs(points[i][0], points[j][0]) + abs(points[i][1], points[j][1])
            edges.append((d, i, j))
    edges.sort()

    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    total = 0
    edges_added = 0
    for d, i, j in edges:
        ri, rj = find(i), find(j)
        if ri != rj:
            parent[ri] = rj
            total += d
            edges_added += 1
            if edges_added == n, 1:
                break
    return total
```

**Complexity**
- **Time:** O(n² log n), sorting n² edges.
- **Space:** O(n²) for the edge list.

## Approach 3: Prim's algorithm with a priority queue (optimal for dense graphs)

Grow the MST one node at a time; maintain a priority queue of (distance, node) pairs for candidate extensions.

```python
import heapq

def min_cost_connect_points(points):
    n = len(points)
    visited = [False] * n
    heap = [(0, 0)]   # (cost, node)
    total = 0
    count = 0

    while heap and count < n:
        d, u = heapq.heappop(heap)
        if visited[u]:
            continue
        visited[u] = True
        total += d
        count += 1
        for v in range(n):
            if not visited[v]:
                dist = abs(points[u][0], points[v][0]) + abs(points[u][1], points[v][1])
                heapq.heappush(heap, (dist, v))

    return total
```

**Complexity**
- **Time:** O(n² log n).
- **Space:** O(n²) heap worst case.

For dense graphs (complete graphs like this one), a simpler O(n²) Prim's variant (without a heap, using an array of "cheapest to add") matches the lower bound.

### Array-based Prim's (best for dense graphs)
```python
def min_cost_connect_points(points):
    n = len(points)
    in_mst = [False] * n
    min_dist = [float('inf')] * n
    min_dist[0] = 0
    total = 0
    for _ in range(n):
        # pick the unvisited node with smallest min_dist
        u = -1
        for v in range(n):
            if not in_mst[v] and (u == -1 or min_dist[v] < min_dist[u]):
                u = v
        in_mst[u] = True
        total += min_dist[u]
        for v in range(n):
            if not in_mst[v]:
                d = abs(points[u][0], points[v][0]) + abs(points[u][1], points[v][1])
                if d < min_dist[v]:
                    min_dist[v] = d
    return total
```

**Complexity**
- **Time:** **O(n²)**.
- **Space:** O(n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate spanning trees | exponential | exponential |
| Kruskal's (sort + UF) | O(n² log n) | O(n²) |
| Prim's with heap | O(n² log n) | O(n²) |
| **Prim's array-based (dense)** | **O(n²)** | **O(n)** |

For dense graphs (as here), array-based Prim's is optimal. For sparse graphs, heap-based Prim's or Kruskal's is better.

## Related data structures

- [Graphs](../../../data-structures/graphs/), MST via Prim's / Kruskal's
- [Heaps / Priority Queues](../../../data-structures/heaps/), Prim's edge selection
