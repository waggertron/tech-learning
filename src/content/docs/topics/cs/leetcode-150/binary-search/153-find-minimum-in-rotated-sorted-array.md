---
title: "153. Find Minimum in Rotated Sorted Array"
description: Find the minimum element in a sorted array that has been rotated by some unknown pivot.
parent: binary-search
tags: [leetcode, neetcode-150, binary-search, arrays, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Suppose an array of length `n` sorted in ascending order is rotated between 1 and `n` times. Given the rotated array (with unique elements), return the minimum element. The algorithm must run in O(log n).

**Example**
- `nums = [3,4,5,1,2]` → `1`
- `nums = [4,5,6,7,0,1,2]` → `0`
- `nums = [11,13,15,17]` → `11` (not rotated, or rotated by n)

LeetCode 153 · [Link](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) · *Medium*

## Approach 1: Brute force — `min(nums)`

```python
def find_min(nums: list[int]) -> int:
    return min(nums)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

Correct but violates the O(log n) constraint.

## Approach 2: Walk until the first decrease

If the array is rotated, the minimum is at the first drop. Scan linearly.

```python
def find_min(nums: list[int]) -> int:
    for i in range(1, len(nums)):
        if nums[i] < nums[i - 1]:
            return nums[i]
    return nums[0]   # not rotated
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

Same Big-O as Approach 1 but makes the structural observation that drives the binary search.

## Approach 3: Binary search on the rotation pivot (optimal)

Compare `nums[mid]` to `nums[hi]`:

- If `nums[mid] > nums[hi]` → the min is in the *right* half; move `lo = mid + 1`.
- Otherwise → the min is in the *left* half including `mid`; move `hi = mid`.

When `lo == hi`, you're at the minimum.

```python
def find_min(nums: list[int]) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]
```

**Complexity**
- **Time:** O(log n).
- **Space:** O(1).

### Why compare to `hi`, not `lo`?
Comparing `nums[mid]` to `nums[lo]` is subtler because a not-rotated segment `[lo, mid]` can look identical to a rotated one starting past `mid`. Comparing to `nums[hi]` uniquely identifies which half contains the minimum.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| `min(nums)` | O(n) | O(1) |
| Linear until decrease | O(n) | O(1) |
| **Binary search** | **O(log n)** | **O(1)** |

The "compare to `nums[hi]`" trick is the key insight; it transfers directly to problem 33 (Search in Rotated Sorted Array).

## Related data structures

- [Arrays](../../../data-structures/arrays/) — rotated-sorted invariant; binary search on the pivot
