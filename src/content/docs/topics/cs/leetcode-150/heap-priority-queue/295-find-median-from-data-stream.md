---
title: "295. Find Median from Data Stream"
description: Continuously compute the median of a stream of numbers.
parent: heap-priority-queue
tags: [leetcode, neetcode-150, heaps, design, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Design a data structure that supports:

- `addNum(num)` — add an integer to the data stream.
- `findMedian()` — return the median of all elements so far.

**Example**
```
addNum(1); addNum(2); findMedian()  // 1.5
addNum(3); findMedian()              // 2.0
```

LeetCode 295 · [Link](https://leetcode.com/problems/find-median-from-data-stream/) · *Hard*

## Approach 1: Brute force — store and sort on each findMedian

Keep all values; sort on query.

```python
class MedianFinder:
    def __init__(self):
        self.nums = []
    def addNum(self, num):
        self.nums.append(num)
    def findMedian(self):
        s = sorted(self.nums)
        n = len(s)
        if n % 2:
            return s[n // 2]
        return (s[n // 2 - 1] + s[n // 2]) / 2
```

**Complexity**
- `addNum`: O(1).
- `findMedian`: O(n log n).
- Space: O(n).

## Approach 2: Insertion sort via `bisect.insort`

Keep the array sorted on insertion.

```python
import bisect

class MedianFinder:
    def __init__(self):
        self.nums = []
    def addNum(self, num):
        bisect.insort(self.nums, num)
    def findMedian(self):
        n = len(self.nums)
        if n % 2:
            return self.nums[n // 2]
        return (self.nums[n // 2 - 1] + self.nums[n // 2]) / 2
```

**Complexity**
- `addNum`: O(n) (shift on insert).
- `findMedian`: O(1).
- Space: O(n).

## Approach 3: Two heaps (canonical, optimal)

Maintain a **max-heap** `lo` for the smaller half and a **min-heap** `hi` for the larger half. Balance them so `len(lo) == len(hi)` or `len(lo) == len(hi) + 1`. The median is at the top(s).

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []   # max-heap (negated)
        self.hi = []   # min-heap

    def addNum(self, num):
        heapq.heappush(self.lo, -num)
        # Push the largest of `lo` into `hi`
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        # Rebalance: lo should be at least as large as hi
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2
```

**Complexity**
- `addNum`: **O(log n)**.
- `findMedian`: **O(1)**.
- Space: O(n).

### Invariant
After each `addNum`:
- Every element in `lo` ≤ every element in `hi`.
- `len(lo) ∈ {len(hi), len(hi) + 1}`.

If the total count is odd, the median is `lo`'s top; if even, it's the average of both tops.

## Summary

| Approach | addNum | findMedian | Space |
| --- | --- | --- | --- |
| Append + sort on query | O(1) | O(n log n) | O(n) |
| Insertion sort | O(n) | O(1) | O(n) |
| **Two heaps** | **O(log n)** | **O(1)** | **O(n)** |

The two-heap technique is one of the most important design patterns in interviews. It also powers the sliding-window median (480) and percentile-tracking streaming systems.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/) — balanced dual-heap for running median
