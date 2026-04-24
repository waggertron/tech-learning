---
title: "217. Contains Duplicate"
description: Return true if any value in the array appears at least twice.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, arrays, hash-tables, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums`, return `true` if any value appears at least twice in the array, and `false` if every element is distinct.

**Examples**
- `nums = [1, 2, 3, 1]` → `true`
- `nums = [1, 2, 3, 4]` → `false`
- `nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]` → `true`

LeetCode 217 · [Link](https://leetcode.com/problems/contains-duplicate/) · *Easy*

## Approach 1: Brute force, check every pair

Compare every element with every element after it. If any two match, return `true`.

```python
def contains_duplicate(nums: list[int]) -> bool:
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] == nums[j]:
                return True
    return False
```

**Complexity**
- **Time:** O(n²). Two nested loops each up to `n`, so ~n²/2 comparisons worst case.
- **Space:** O(1). No extra structures; only the loop indices.

This is the most direct approach but quadratic time makes it unusable for large inputs.

## Approach 2: Sort and compare adjacent

After sorting, any duplicates are adjacent. One linear scan is enough.

```python
def contains_duplicate(nums: list[int]) -> bool:
    nums_sorted = sorted(nums)
    for i in range(1, len(nums_sorted)):
        if nums_sorted[i] == nums_sorted[i, 1]:
            return True
    return False
```

**Complexity**
- **Time:** O(n log n). The sort dominates; the linear scan is O(n).
- **Space:** O(n) for `sorted(nums)` (Python returns a new list). If you mutate in place with `nums.sort()`, it's O(log n) for the sort's stack frames (Timsort).

Improvement: we dropped one order of growth. Worth knowing as an alternative when memory is tight and in-place sort is available.

## Approach 3: Hash set (optimal)

Walk the array once, storing values in a set. The first repeat hit is a duplicate.

```python
def contains_duplicate(nums: list[int]) -> bool:
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False
```

**Complexity**
- **Time:** O(n). Single pass; `in` and `add` on a hash set are O(1) average.
- **Space:** O(n). The set can hold up to all `n` values before a duplicate is found.

### One-liner
Same complexity, more Pythonic:

```python
def contains_duplicate(nums: list[int]) -> bool:
    return len(set(nums)) < len(nums)
```

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force (every pair) | O(n²) | O(1) |
| Sort + adjacent check | O(n log n) | O(n) (or O(log n) in-place) |
| **Hash set** | **O(n)** | O(n) |

The hash-set approach is strictly best on time. Use the sort variant only when memory is constrained *and* you can sort in place.

## Related data structures

- [Arrays](../../../data-structures/arrays/), input container
- [Hash Tables](../../../data-structures/hash-tables/), set membership for O(1) dedup (optimal)
