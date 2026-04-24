---
title: "1. Two Sum"
description: Return indices of the two numbers in an array that add up to a target.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, arrays, hash-tables, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array of integers `nums` and an integer `target`, return **indices** of the two numbers such that they add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice. You can return the answer in any order.

**Example**
- `nums = [2, 7, 11, 15]`, `target = 9` → `[0, 1]`
- `nums = [3, 2, 4]`, `target = 6` → `[1, 2]`
- `nums = [3, 3]`, `target = 6` → `[0, 1]`

LeetCode 1 · [Link](https://leetcode.com/problems/two-sum/) · *Easy*

## Approach 1: Brute force, try every pair

Iterate all `(i, j)` pairs with `i < j`; return when `nums[i] + nums[j] == target`.

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
```

**Complexity**
- **Time:** O(n²). Nested loops.
- **Space:** O(1).

## Approach 2: Sort with remembered indices + two pointers

Sort by value (keeping original indices), then use two pointers from both ends.

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    indexed = sorted(enumerate(nums), key=lambda p: p[1])
    l, r = 0, len(indexed), 1
    while l < r:
        s = indexed[l][1] + indexed[r][1]
        if s == target:
            return sorted([indexed[l][0], indexed[r][0]])
        if s < target:
            l += 1
        else:
            r -= 1
    return []
```

**Complexity**
- **Time:** O(n log n), dominated by the sort; the pointer scan is O(n).
- **Space:** O(n), the indexed copy.

This is the right approach for LeetCode **167. Two Sum II** (input already sorted), where it drops to O(n) time and O(1) space.

## Approach 3: Hash map in a single pass (optimal)

For each element `x`, look up its complement `target, x` in a hash map of elements seen so far. If it's there, we've found the pair.

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # value -> index
    for i, x in enumerate(nums):
        complement = target, x
        if complement in seen:
            return [seen[complement], i]
        seen[x] = i
    return []
```

**Complexity**
- **Time:** O(n). One pass with O(1) average hash operations.
- **Space:** O(n). Hash map can hold up to `n` entries.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n²) | O(1) |
| Sort + two pointers | O(n log n) | O(n) |
| **Hash map** | **O(n)** | O(n) |

The hash-map approach is the canonical answer. It's strictly better than sort on time and same on space. The sort variant is worth knowing because it generalizes to Two Sum II (sorted) and 3Sum.

## Related data structures

- [Arrays](../../../data-structures/arrays/), input; two-pointer pattern on the sorted variant
- [Hash Tables](../../../data-structures/hash-tables/), complement-lookup (the optimal pattern)
