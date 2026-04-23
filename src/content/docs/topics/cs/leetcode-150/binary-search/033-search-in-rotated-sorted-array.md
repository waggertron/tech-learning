---
title: "33. Search in Rotated Sorted Array"
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

## Approach 1: Brute force — linear scan

```python
def search(nums: list[int], target: int) -> int:
    for i, x in enumerate(nums):
        if x == target:
            return i
    return -1
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

Violates the O(log n) requirement.

## Approach 2: Find pivot, then binary search in the right half

First, find the rotation index (minimum) with a binary search (Approach 3 from [153](../153-find-minimum-in-rotated-sorted-array/)). Then binary-search the relevant half.

```python
def search(nums: list[int], target: int) -> int:
    # Step 1: find rotation pivot (index of min)
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    pivot = lo
    # Step 2: pick which half to binary-search
    if pivot == 0 or target < nums[0]:
        lo, hi = pivot, len(nums) - 1
    else:
        lo, hi = 0, pivot - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

**Complexity**
- **Time:** O(log n). Two binary searches.
- **Space:** O(1).

## Approach 3: One-pass modified binary search (optimal)

At each step, one of the halves is guaranteed to be sorted. Check which, then decide based on the target's position relative to that sorted half.

```python
def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:          # left half is sorted
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:                               # right half is sorted
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1
```

**Complexity**
- **Time:** O(log n). Single pass.
- **Space:** O(1).

### Why it works
A rotation means the array is two sorted runs. Whatever `mid` you pick, one of `[lo, mid]` or `[mid, hi]` is entirely within a single run — hence sorted. The `nums[lo] <= nums[mid]` comparison detects which side is sorted.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Linear scan | O(n) | O(1) |
| Find pivot + binary search | O(log n) | O(1) |
| **One-pass modified binary search** | **O(log n)** | **O(1)** |

The one-pass variant is the cleanest — and extends with small adjustments to problem 81 (rotated with duplicates), where the worst case degrades to O(n) because duplicates can break the "one half is sorted" guarantee.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — rotated-sorted invariant; modified binary search
