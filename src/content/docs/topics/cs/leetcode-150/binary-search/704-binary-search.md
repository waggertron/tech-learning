---
title: "704. Binary Search"
description: Find a target in a sorted array, returning its index or -1.
parent: binary-search
tags: [leetcode, neetcode-150, binary-search, arrays, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array `nums` sorted in ascending order and a target, return the index of `target`. If not present, return -1. The algorithm must run in O(log n) time.

**Example**
- `nums = [-1,0,3,5,9,12]`, `target = 9` → `4`
- `nums = [-1,0,3,5,9,12]`, `target = 2` → `-1`

LeetCode 704 · [Link](https://leetcode.com/problems/binary-search/) · *Easy*

## Approach 1: Brute force — linear scan

Ignore sortedness and scan linearly.

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

Fails the problem's O(log n) requirement.

## Approach 2: Recursive binary search

Divide the range and recurse.

```python
def search(nums: list[int], target: int) -> int:
    def helper(lo: int, hi: int) -> int:
        if lo > hi:
            return -1
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            return helper(mid + 1, hi)
        return helper(lo, mid - 1)
    return helper(0, len(nums) - 1)
```

**Complexity**
- **Time:** O(log n).
- **Space:** O(log n) recursion depth.

## Approach 3: Iterative binary search (optimal)

Same halving, no recursion.

```python
def search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
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
- **Time:** O(log n).
- **Space:** O(1).

### Note on `mid = (lo + hi) // 2`
In languages where integer overflow is a concern (C, C++, Java `int`), prefer `mid = lo + (hi - lo) // 2` to avoid `lo + hi` overflowing. In Python, integers are arbitrary-precision, so `(lo + hi) // 2` is safe.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Linear scan | O(n) | O(1) |
| Recursive binary search | O(log n) | O(log n) |
| **Iterative binary search** | **O(log n)** | **O(1)** |

Memorize the iterative form — it's the template for every other binary-search problem in this category.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — sorted-array access is the precondition for binary search
