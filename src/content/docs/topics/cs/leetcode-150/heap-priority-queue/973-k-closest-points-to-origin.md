---
title: "973. K Closest Points to Origin"
description: Return the k points closest to the origin by Euclidean distance.
parent: heap-priority-queue
tags: [leetcode, neetcode-150, heaps, quickselect, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array `points` where `points[i] = [xᵢ, yᵢ]`, return the `k` points closest to the origin `(0, 0)`. The distance metric is Euclidean; squared distance is sufficient for ranking (no need for `sqrt`).

**Example**
- `points = [[1,3],[-2,2]]`, `k = 1` → `[[-2, 2]]`
- `points = [[3,3],[5,-1],[-2,4]]`, `k = 2` → `[[3, 3], [-2, 4]]`

LeetCode 973 · [Link](https://leetcode.com/problems/k-closest-points-to-origin/) · *Medium*

## Approach 1: Brute force — sort by squared distance

Sort all points; take the first k.

```python
def k_closest(points, k):
    return sorted(points, key=lambda p: p[0] ** 2 + p[1] ** 2)[:k]
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(n).

Simple and often accepted.

## Approach 2: Size-K max-heap

Keep a max-heap of size K. Each new point is pushed; if the heap exceeds K, pop the farthest.

```python
import heapq

def k_closest(points, k):
    # Max-heap via negated distance
    heap = []
    for x, y in points:
        d = -(x * x + y * y)
        if len(heap) < k:
            heapq.heappush(heap, (d, x, y))
        elif d > heap[0][0]:
            heapq.heapreplace(heap, (d, x, y))
    return [[x, y] for _, x, y in heap]
```

**Complexity**
- **Time:** O(n log k).
- **Space:** O(k).

Strictly better than Approach 1 when k ≪ n.

## Approach 3: Quickselect (optimal average)

Partition the array in place so the first k elements are the k closest (unordered). Average O(n).

```python
def k_closest(points, k):
    def dist(p):
        return p[0] ** 2 + p[1] ** 2

    def partition(lo, hi):
        pivot = dist(points[hi])
        store = lo
        for i in range(lo, hi):
            if dist(points[i]) <= pivot:
                points[store], points[i] = points[i], points[store]
                store += 1
        points[store], points[hi] = points[hi], points[store]
        return store

    def quickselect(lo, hi, k):
        if lo >= hi:
            return
        p = partition(lo, hi)
        if p == k:
            return
        if p < k:
            quickselect(p + 1, hi, k)
        else:
            quickselect(lo, p - 1, k)

    quickselect(0, len(points) - 1, k)
    return points[:k]
```

**Complexity**
- **Time:** **O(n) average**, O(n²) worst case (pathological pivots; mitigate with randomization).
- **Space:** O(log n) recursion.

Pick quickselect when you're allowed to mutate the input and want the tightest average complexity.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Sort | O(n log n) | O(n) |
| **Size-K max-heap** | **O(n log k)** | **O(k)** |
| Quickselect | O(n) avg / O(n²) worst | O(log n) |

The heap version is the canonical interview answer. Quickselect is the "optimal-average" answer — know it for when the interviewer pushes on tighter bounds.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/) — size-K top/bottom heap template
- [Arrays](../../../data-structures/arrays/) — in-place partitioning for quickselect
