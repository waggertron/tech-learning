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
import bisect

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.nums = sorted(nums)       # L1: O(n log n) initial sort

    def add(self, val):
        bisect.insort(self.nums, val)  # L2: O(log n) find + O(n) shift
        return self.nums[-self.k]      # L3: O(1) index
```

**Where the time goes, line by line**

*Variables: n = number of elements seen so far, k = the rank parameter.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (initial sort) | O(n log n) | 1 (init) | O(n log n) |
| **L2 (insort)** | **O(n)** | **1 per add** | **O(n)** ← dominates each add |
| L3 (index) | O(1) | 1 per add | O(1) |

`bisect.insort` finds the insertion point in O(log n) but must shift all subsequent elements in O(n).

**Complexity**
- `add`: O(n) per call (L2 shift dominates).
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
            self.add(x)              # L1: O(log k) per initial element

    def add(self, val: int) -> int:
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)      # L2: O(log k) push
        elif val > self.heap[0]:
            heapq.heapreplace(self.heap, val)   # L3: O(log k) pop+push atomic
        return self.heap[0]                     # L4: O(1) peek top
```

**Where the time goes, line by line**

*Variables: n = number of initial elements in nums, k = the rank parameter.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init loop) | O(log k) | n | O(n log k) |
| **L2 or L3 (push/replace)** | **O(log k)** | **1 per add** | **O(log k)** ← dominates each add |
| L4 (peek) | O(1) | 1 per add | O(1) |

The heap never grows beyond k entries. `heapreplace` is one sift-down operation, cheaper than a separate `heappop` + `heappush` because it avoids an extra sift-up.

**Complexity**
- `add`: O(log k) per call (L2 or L3).
- Space: O(k).

### Why min-heap?
A min-heap of size K holds the K largest seen, the smallest of those K sits at the top and is, by definition, the Kth largest overall. When a new value arrives, it only matters if it's larger than the current min (otherwise it can't be in the top K).

`heapreplace` pops and pushes in one operation, cheaper than push + pop as separate calls.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_703.py and run.
# Uses the size-K min-heap approach (Approach 3).
import heapq

class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = []
        for x in nums:
            self.add(x)

    def add(self, val):
        if len(self.heap) < self.k:
            heapq.heappush(self.heap, val)
        elif val > self.heap[0]:
            heapq.heapreplace(self.heap, val)
        return self.heap[0]

def _run_tests():
    # Example from problem statement: k=3, nums=[4,5,8,2]
    kl = KthLargest(3, [4, 5, 8, 2])
    assert kl.add(3) == 4
    assert kl.add(5) == 5
    assert kl.add(10) == 5
    assert kl.add(9) == 8
    assert kl.add(4) == 8

    # k=1: always return max
    kl2 = KthLargest(1, [])
    assert kl2.add(3) == 3
    assert kl2.add(5) == 5
    assert kl2.add(1) == 5

    # k equals initial size
    kl3 = KthLargest(2, [1, 2])
    assert kl3.add(0) == 1   # 3rd largest among [1,2,0] would be 0; kth=2nd=1
    assert kl3.add(3) == 2   # [0,1,2,3] kth=2nd=2

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Summary

| Approach | `add` | Space |
| --- | --- | --- |
| Sorted list (insort) | O(n) | O(n) |
| **Size-K min-heap** | **O(log k)** | **O(k)** |

This is the canonical "top-K streaming" pattern, the same template solves Top K Frequent (347) online and streaming percentile problems.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/), size-K min-heap for online top-K
