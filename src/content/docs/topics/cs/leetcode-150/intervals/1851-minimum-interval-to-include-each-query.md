---
title: "1851. Minimum Interval to Include Each Query"
description: For each query, find the smallest interval that contains the query point; or -1 if none.
parent: intervals
tags: [leetcode, neetcode-150, intervals, heap, offline-query, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You're given `intervals` and `queries`. For each query `q`, find the length of the smallest interval that contains `q` (i.e., `start ≤ q ≤ end`), or `-1` if no such interval exists.

**Example**
- `intervals = [[1,4],[2,4],[3,6],[4,4]]`, `queries = [2, 3, 4, 5]` → `[3, 3, 1, 4]`
- `intervals = [[2,3],[2,5],[1,8],[20,25]]`, `queries = [2, 19, 5, 22]` → `[2, -1, 4, 4]`

LeetCode 1851 · [Link](https://leetcode.com/problems/minimum-interval-to-include-each-query/) · *Hard*

## Approach 1: Brute force — per query, scan all intervals

For each query, iterate intervals and track the smallest containing length.

**Complexity**
- **Time:** O(n · q).
- **Space:** O(q).

Acceptable only when both n and q are small.

## Approach 2: Offline queries + min-heap (canonical)

Sort queries and intervals by start. Walk queries in order; for each query, push all intervals whose start ≤ query into a min-heap keyed by length. Then pop heap entries whose end < query (they don't contain it). The heap top is the smallest containing interval.

```python
import heapq

def min_interval(intervals, queries):
    intervals.sort(key=lambda x: x[0])
    sorted_queries = sorted(enumerate(queries), key=lambda p: p[1])

    result = [0] * len(queries)
    heap = []   # (length, end)
    i = 0
    for orig_idx, q in sorted_queries:
        while i < len(intervals) and intervals[i][0] <= q:
            s, e = intervals[i]
            heapq.heappush(heap, (e - s + 1, e))
            i += 1
        while heap and heap[0][1] < q:
            heapq.heappop(heap)
        result[orig_idx] = heap[0][0] if heap else -1
    return result
```

**Complexity**
- **Time:** O((n + q) log (n + q)).
- **Space:** O(n + q).

### Why offline sorting helps
Processing queries out of order turns a "for each query, find the best interval" problem into a stream. Sorting queries by value + sorting intervals by start makes the two monotonic, so a single sweep can answer every query.

## Approach 3: Segment tree / merge sort tree

More powerful and more code. Used in competitive programming for online variants. Skip unless the interviewer asks for O(log n) per query online.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Per-query scan | O(n · q) | O(q) |
| **Offline + heap sweep** | **O((n + q) log (n + q))** | **O(n + q)** |
| Segment tree | O((n + q) log n) | O(n) |

Offline query processing is a broadly useful pattern whenever you have a batch of queries that can be answered by a single sorted sweep.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/) — running min-length heap with lazy deletion
- [Arrays](../../../data-structures/arrays/) — sorted intervals and queries
