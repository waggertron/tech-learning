---
title: "33. Search in Rotated Sorted Array (Medium)"
description: Find a target in a sorted array that has been rotated by some unknown pivot. O(log n).
parent: binary-search
tags: [leetcode, neetcode-150, binary-search, arrays, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

There is an integer array `nums` (originally sorted in ascending order with distinct values) that has been rotated by an unknown pivot. Given the rotated array and a target, return the index of the target, or -1 if not present. Must run in O(log n).

**Example**
- `nums = [4,5,6,7,0,1,2]`, `target = 0` → `4`
- `nums = [4,5,6,7,0,1,2]`, `target = 3` → `-1`
- `nums = [1]`, `target = 0` → `-1`

LeetCode 33 · [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) · *Medium*

## Approach 1: Brute force, linear scan

```python
def search(nums: list[int], target: int) -> int:
    for i, x in enumerate(nums):    # L1: scan all elements, up to n
        if x == target:             # L2: O(1) compare
            return i
    return -1
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1/L2 (linear scan)** | **O(1)** | **n** | **O(n)** ← dominates |

**Complexity**
- **Time:** O(n), driven by L1 (ignores the rotated-sorted structure entirely).
- **Space:** O(1).

Violates the O(log n) requirement.

## Approach 2: Find pivot, then binary search in the right half

First, find the rotation index (minimum) with a binary search (Approach 3 from [153](../153-find-minimum-in-rotated-sorted-array/)). Then binary-search the relevant half.

```python
def search(nums: list[int], target: int) -> int:
    # Step 1: find rotation pivot (index of min)
    lo, hi = 0, len(nums) - 1               # L1: O(1)
    while lo < hi:                           # L2: first binary search, O(log n)
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    pivot = lo                               # L3: O(1) pivot found
    # Step 2: pick which half to binary-search
    if pivot == 0 or target < nums[0]:
        lo, hi = pivot, len(nums) - 1       # L4: O(1) right segment
    else:
        lo, hi = 0, pivot - 1              # L5: O(1) left segment
    while lo <= hi:                          # L6: second binary search, O(log n)
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (find pivot) | O(1) per step | log n | O(log n) |
| L4 or L5 (pick segment) | O(1) | 1 | O(1) |
| **L6 (binary search segment)** | **O(1) per step** | **log n** | **O(log n)** ← dominates |

Two sequential O(log n) binary searches on disjoint parts of the array. The total is 2 × O(log n) = O(log n).

**Complexity**
- **Time:** O(log n), driven by L2 and L6 (two independent O(log n) binary searches).
- **Space:** O(1).

## Approach 3: One-pass modified binary search (optimal)

At each step, one of the halves is guaranteed to be sorted. Check which, then decide based on the target's position relative to that sorted half.

```python
def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1             # L1: O(1)
    while lo <= hi:                        # L2: loop, O(log n) iterations
        mid = (lo + hi) // 2              # L3: O(1) midpoint
        if nums[mid] == target:            # L4: O(1) compare
            return mid
        if nums[lo] <= nums[mid]:          # L5: O(1) left-half sorted check
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1              # L6: O(1) target in left half
            else:
                lo = mid + 1              # L7: O(1) target in right half
        else:                              # right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1              # L8: O(1) target in right half
            else:
                hi = mid - 1             # L9: O(1) target in left half
    return -1
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| **L2/L3/L4/L5 (loop body)** | **O(1)** | **log n** | **O(log n)** ← dominates |
| L6/L7/L8/L9 (narrow range) | O(1) | log n | O(log n) |

Each iteration either returns (found) or eliminates half the remaining range. The `nums[lo] <= nums[mid]` check at L5 identifies which half is a contiguous sorted run in O(1).

**Complexity**
- **Time:** O(log n), driven by L2/L3/L4/L5 (single pass that halves range each step).
- **Space:** O(1).

### Why it works
A rotation means the array is two sorted runs. Whatever `mid` you pick, one of `[lo, mid]` or `[mid, hi]` is entirely within a single run, hence sorted. The `nums[lo] <= nums[mid]` comparison detects which side is sorted.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Linear scan | O(n) | O(1) |
| Find pivot + binary search | O(log n) | O(1) |
| **One-pass modified binary search** | **O(log n)** | **O(1)** |

The one-pass variant is the cleanest, and extends with small adjustments to problem 81 (rotated with duplicates), where the worst case degrades to O(n) because duplicates can break the "one half is sorted" guarantee.

## Test cases

```python
# Quick smoke tests - paste into a REPL or save as test_033.py and run.
# Uses the optimal Approach 3 implementation.

def search(nums: list, target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1

def _run_tests():
    assert search([4, 5, 6, 7, 0, 1, 2], 0) == 4
    assert search([4, 5, 6, 7, 0, 1, 2], 3) == -1    # not present
    assert search([1], 0) == -1                        # single element miss
    assert search([1], 1) == 0                         # single element hit
    assert search([3, 1], 1) == 1                      # small rotated, target on right
    assert search([3, 1], 3) == 0                      # small rotated, target on left
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), rotated-sorted invariant; modified binary search
