---
title: "215. Kth Largest Element in an Array"
description: Return the kth largest element in an unsorted array.
parent: heap-priority-queue
tags: [leetcode, neetcode-150, heaps, quickselect, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums` and an integer `k`, return the `k`-th largest element in the array. Note: it's the k-th largest in sorted order, not distinct.

Can you do this without sorting?

**Example**
- `nums = [3,2,1,5,6,4]`, `k = 2` → `5`
- `nums = [3,2,3,1,2,4,5,5,6]`, `k = 4` → `4`

LeetCode 215 · [Link](https://leetcode.com/problems/kth-largest-element-in-an-array/) · *Medium*

## Approach 1: Brute force — sort, index

```python
def find_kth_largest(nums, k):
    nums.sort()
    return nums[-k]
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(1) or O(log n) depending on sort.

Fastest to write; doesn't meet the "without sorting" challenge.

## Approach 2: Size-K min-heap

Maintain a min-heap of size k; the top is the kth largest.

```python
import heapq

def find_kth_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]

# Equivalent one-liner:
# return heapq.nlargest(k, nums)[-1]
```

**Complexity**
- **Time:** O(n log k).
- **Space:** O(k).

## Approach 3: Quickselect (optimal average)

Partition-based selection; average linear time.

```python
import random

def find_kth_largest(nums, k):
    # k-th largest = (n - k)-th smallest (0-indexed)
    target = len(nums) - k

    def partition(lo, hi):
        pivot = nums[random.randint(lo, hi)]
        left, right = lo, hi
        i = lo
        while i <= right:
            if nums[i] < pivot:
                nums[left], nums[i] = nums[i], nums[left]
                left += 1
                i += 1
            elif nums[i] > pivot:
                nums[right], nums[i] = nums[i], nums[right]
                right -= 1
            else:
                i += 1
        return left, right   # pivot's final range [left, right]

    def quickselect(lo, hi):
        while True:
            if lo == hi:
                return nums[lo]
            l, r = partition(lo, hi)
            if l <= target <= r:
                return nums[target]
            elif target < l:
                hi = l - 1
            else:
                lo = r + 1

    return quickselect(0, len(nums) - 1)
```

**Complexity**
- **Time:** **O(n) average**, O(n²) worst (mitigated by random pivot).
- **Space:** O(1) extra (iterative loop avoids recursion).

The three-way partition handles duplicate values efficiently — important when the array contains many repeats.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Sort | O(n log n) | O(1) |
| Size-K min-heap | O(n log k) | O(k) |
| **Quickselect** | **O(n)** avg / O(n²) worst | O(1) |

The heap is the interview-safe answer. Quickselect is the "show you understand selection algorithms" answer. In practice, std-lib `nlargest` is often the fastest due to constant factors.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/) — size-K min-heap
- [Arrays](../../../data-structures/arrays/) — in-place partitioning for quickselect
