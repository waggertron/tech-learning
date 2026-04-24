---
title: "268. Missing Number"
description: Find the missing number from an array of distinct numbers in [0, n].
parent: bit-manipulation
tags: [leetcode, neetcode-150, bit-manipulation, math, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array `nums` containing `n` distinct numbers in `[0, n]`, return the single number missing from the range.

**Example**
- `nums = [3, 0, 1]` → `2`
- `nums = [0, 1]` → `2`
- `nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]` → `8`

LeetCode 268 · [Link](https://leetcode.com/problems/missing-number/) · *Easy*

## Approach 1: Hash set

Put everything into a set, then scan `[0, n]` for the missing value.

```python
def missing_number(nums):
    s = set(nums)
    for i in range(len(nums) + 1):
        if i not in s:
            return i
    return -1
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

## Approach 2: Sum formula

Expected sum of `[0, n]` is `n(n + 1)/2`. Missing = expected − actual.

```python
def missing_number(nums):
    n = len(nums)
    return n * (n + 1) // 2, sum(nums)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

Risk of overflow in fixed-width languages for large n (not an issue in Python).

## Approach 3: XOR of indices and values (optimal, overflow-safe)

XOR all values 0…n with all array elements. Pairs cancel; missing remains.

```python
def missing_number(nums):
    result = len(nums)
    for i, x in enumerate(nums):
        result ^= i ^ x
    return result
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

### Why it works
Result starts at `n`. We XOR in every index 0..n−1 and every value from `nums`. Every number from 0..n except the missing one appears exactly twice (once as an index, once as a value); each cancels to 0. The initial `n` and the missing value survive, but `n` is also present as an index of the initial XOR, so it cancels unless it's the missing one... Actually here's the clean reading: we start with `n`, then XOR in all i and all nums[i]; the set `{0..n} ∪ {all nums}` has every value except the missing appearing an even number of times. Net result = missing.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Hash set | O(n) | O(n) | Straightforward |
| Sum formula | O(n) | O(1) | Overflow-sensitive |
| **XOR** | **O(n)** | **O(1)** | Overflow-safe |

## Related data structures

- None; pure arithmetic.
