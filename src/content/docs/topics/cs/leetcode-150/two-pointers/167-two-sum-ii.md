---
title: "167. Two Sum II — Input Array Is Sorted"
description: Given a 1-indexed sorted array, return indices of the two numbers that sum to the target.
parent: two-pointers
tags: [leetcode, neetcode-150, arrays, two-pointers, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a **1-indexed** array `numbers` that is already sorted in non-decreasing order, find two numbers such that they sum to `target`. Return `[index1, index2]` where `index1 < index2`. Exactly one solution exists, and you may not use the same element twice.

Constraint: **must use only constant extra space**.

**Example**
- `numbers = [2, 7, 11, 15]`, `target = 9` → `[1, 2]`
- `numbers = [2, 3, 4]`, `target = 6` → `[1, 3]`

LeetCode 167 · [Link](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) · *Medium*

## Approach 1: Brute force — try every pair

```python
def two_sum(numbers: list[int], target: int) -> list[int]:
    n = len(numbers)
    for i in range(n):
        for j in range(i + 1, n):
            if numbers[i] + numbers[j] == target:
                return [i + 1, j + 1]   # 1-indexed
    return []
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

Ignores that the array is sorted — so this is strictly worse than it needs to be.

## Approach 2: For each element, binary search for the complement

Since the array is sorted, you can binary-search for `target - numbers[i]` in the suffix.

```python
from bisect import bisect_left

def two_sum(numbers: list[int], target: int) -> list[int]:
    n = len(numbers)
    for i in range(n):
        need = target - numbers[i]
        j = bisect_left(numbers, need, i + 1, n)
        if j < n and numbers[j] == need:
            return [i + 1, j + 1]
    return []
```

**Complexity**
- **Time:** O(n log n). n iterations × O(log n) binary search.
- **Space:** O(1).

Uses the sort structure, but not optimally.

## Approach 3: Two pointers from both ends (optimal)

Start with pointers at both ends. If the sum is too small, move the left pointer right (increase sum). If too large, move the right pointer left (decrease sum). This works exactly because the array is sorted.

```python
def two_sum(numbers: list[int], target: int) -> list[int]:
    l, r = 0, len(numbers) - 1
    while l < r:
        s = numbers[l] + numbers[r]
        if s == target:
            return [l + 1, r + 1]
        if s < target:
            l += 1
        else:
            r -= 1
    return []
```

**Complexity**
- **Time:** O(n). Each pointer moves in one direction only, so total work is linear.
- **Space:** O(1).

### Why it's correct
At any point, `numbers[l] + numbers[r]` is the sum under consideration. If it's too small, `numbers[l]` can't be part of any valid pair with *any* remaining right value — moving `l` right is safe. Symmetric argument for moving `r` left. So the pair, if it exists, must be found during the walk.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n²) | O(1) |
| Per-element binary search | O(n log n) | O(1) |
| **Two pointers** | **O(n)** | **O(1)** |

The two-pointer approach is the standard answer. Generalizes directly to 3Sum and 4Sum.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — sorted-array access is the precondition for two pointers
