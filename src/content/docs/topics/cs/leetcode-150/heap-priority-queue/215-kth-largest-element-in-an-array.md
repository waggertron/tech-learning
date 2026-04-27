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

## Approach 1: Brute force, sort, index

```python
def find_kth_largest(nums, k):
    nums.sort()       # L1: O(n log n)
    return nums[-k]   # L2: O(1) index
```

**Where the time goes, line by line**

*Variables: n = number of elements in nums, k = the rank parameter.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (sort)** | **O(n log n)** | **1** | **O(n log n)** ← dominates |
| L2 (index) | O(1) | 1 | O(1) |

**Complexity**
- **Time:** O(n log n), driven by L1.
- **Space:** O(1) or O(log n) depending on sort.

Fastest to write; doesn't meet the "without sorting" challenge.

## Approach 2: Size-K min-heap

Maintain a min-heap of size k; the top is the kth largest.

```python
import heapq

def find_kth_largest(nums, k):
    heap = []
    for x in nums:                 # L1: iterate n elements
        heapq.heappush(heap, x)    # L2: O(log k) push
        if len(heap) > k:
            heapq.heappop(heap)    # L3: O(log k) pop to keep size k
    return heap[0]

# Equivalent one-liner:
# return heapq.nlargest(k, nums)[-1]
```

**Where the time goes, line by line**

*Variables: n = number of elements in nums, k = the rank parameter.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (loop) | O(1) | n | O(n) |
| **L2 (heappush)** | **O(log k)** | **n** | **O(n log k)** ← dominates |
| L3 (heappop) | O(log k) | n - k | O(n log k) |

The heap never exceeds k entries. Every push and pop costs O(log k). Since we process n elements, total cost is O(n log k).

**Complexity**
- **Time:** O(n log k), driven by L2/L3.
- **Space:** O(k).

## Approach 3: Quickselect (optimal average)

Partition-based selection; average linear time.

```python
import random

def find_kth_largest(nums, k):
    # k-th largest = (n - k)-th smallest (0-indexed)
    target = len(nums) - k

    def partition(lo, hi):
        pivot = nums[random.randint(lo, hi)]  # L1: O(1) random pivot
        left, right = lo, hi
        i = lo
        while i <= right:                      # L2: three-way partition
            if nums[i] < pivot:
                nums[left], nums[i] = nums[i], nums[left]
                left += 1; i += 1
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
            l, r = partition(lo, hi)          # L3: O(hi - lo) per call
            if l <= target <= r:
                return nums[target]
            elif target < l:
                hi = l - 1
            else:
                lo = r + 1

    return quickselect(0, len(nums) - 1)
```

**Where the time goes, line by line**

*Variables: n = number of elements in nums, k = the rank parameter.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (random pivot) | O(1) | log n avg rounds | O(log n) |
| **L2 (three-way partition)** | **O(subarray size)** | **log n avg rounds** | **O(n) avg** ← dominates |
| L3 (partition call) | O(n) first round | log n avg | O(n) avg |

On average, each round halves the search space: n + n/2 + n/4 + ... = 2n = O(n). With random pivot, worst case O(n²) is extremely unlikely.

**Complexity**
- **Time:** O(n) average, O(n²) worst case (mitigated by random pivot at L1).
- **Space:** O(1) extra (iterative loop avoids recursion).

The three-way partition handles duplicate values efficiently, important when the array contains many repeats.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_215.py and run.
# Uses the size-K min-heap approach (Approach 2).
import heapq

def find_kth_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]

def _run_tests():
    # Examples from problem statement
    assert find_kth_largest([3,2,1,5,6,4], 2) == 5
    assert find_kth_largest([3,2,3,1,2,4,5,5,6], 4) == 4
    # k = 1: largest
    assert find_kth_largest([1], 1) == 1
    # All same
    assert find_kth_largest([2,2,2,2], 2) == 2
    # k = n: smallest
    assert find_kth_largest([5,3,1,4,2], 5) == 1
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Sort | O(n log n) | O(1) |
| Size-K min-heap | O(n log k) | O(k) |
| **Quickselect** | **O(n)** avg / O(n²) worst | O(1) |

The heap is the interview-safe answer. Quickselect is the "show you understand selection algorithms" answer. In practice, std-lib `nlargest` is often the fastest due to constant factors.

## Related data structures

- [Heaps / Priority Queues](../../../data-structures/heaps/), size-K min-heap
- [Arrays](../../../data-structures/arrays/), in-place partitioning for quickselect
