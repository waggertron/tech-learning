---
title: "703. Kth Largest Element in a Stream"
description: Maintain the kth largest element in a data stream under repeated `add` calls.
parent: heap-priority-queue
tags: [leetcode, neetcode-150, heaps, design, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Design a class that efficiently returns the `k`-th largest element in a stream of integers:

- `KthLargest(k, nums)`, initialize with a starting stream.
- `add(val)`, add `val` and return the current kth largest.

**Example**
```
k = 3, nums = [4, 5, 8, 2]
add(3)   // 4
add(5)   // 5
add(10)  // 5
add(9)   // 8
add(4)   // 8
```

LeetCode 703 · [Link](https://leetcode.com/problems/kth-largest-element-in-a-stream/) · *Easy*

## Approach 1: Brute force, sort on every add

Keep a sorted list; on each add, insert and return `list[-k]`.

```python
class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.nums = sorted(nums)

    def add(self, val):
        import bisect
        bisect.insort(self.nums, val)
        return self.nums[-self.k]
```

**Complexity**
- `add`: O(n). `bisect.insort` is O(log n) lookup + O(n) shift.
- Space: O(n).

## Approach 2: Keep a full heap

Maintain a min-heap of all values; the top is the smallest, not what we want. We'd need a max-heap or inverted indexing. Doesn't beat sorting asymptotically.

Skip, the meaningful optimization is Approach 3.

## Approach 3: Size-K min-heap (optimal)

Maintain a min-heap of size **K**. The top is always the current kth largest. On add, push and pop-if-oversized.

```python
import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = []
        for x in nums:
            self.add(x)

    def add(self, val: int) -> int:
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)
        elif val > self.heap[0]:
            heapq.heapreplace(self.heap, val)
        return self.heap[0]
```

**Complexity**
- `add`: **O(log k)**.
- Space: O(k).

### Why min-heap?
A min-heap of size K holds the K largest seen, the smallest of those K sits at the top and is, by definition, the Kth largest overall. When a new value arrives, it only matters if it's larger than the current min (otherwise it can't be in the top K).

`heapreplace` pops and pushes in one operation, cheaper than push + pop as separate calls.

## Summary

| Approach | `add` | Space |
| --- | --- | --- |
| Sorted list (insort) | O(n) | O(n) |
| **Size-K min-heap** | **O(log k)** | **O(k)** |

This is the canonical "top-K streaming" pattern, the same template solves Top K Frequent (347) online and streaming percentile problems.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/), size-K min-heap for online top-K
