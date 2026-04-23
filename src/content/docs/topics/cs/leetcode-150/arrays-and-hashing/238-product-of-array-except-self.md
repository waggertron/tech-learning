---
title: "238. Product of Array Except Self"
description: Return an array where each element is the product of all other elements — without using division.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, arrays, prefix-suffix, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums`, return an array `answer` such that `answer[i]` equals the product of all elements of `nums` except `nums[i]`.

The algorithm must run in O(n) time **and must not use the division operation**. Follow-up: can you solve in O(1) extra space (the output array doesn't count)?

**Example**
- `nums = [1, 2, 3, 4]` → `[24, 12, 8, 6]`
- `nums = [-1, 1, 0, -3, 3]` → `[0, 0, 9, 0, 0]`

LeetCode 238 · [Link](https://leetcode.com/problems/product-of-array-except-self/) · *Medium*

## Approach 1: Brute force — nested product

For each `i`, multiply all other elements.

```python
def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    answer = [0] * n
    for i in range(n):
        prod = 1
        for j in range(n):
            if j != i:
                prod *= nums[j]
        answer[i] = prod
    return answer
```

**Complexity**
- **Time:** O(n²). Nested loop.
- **Space:** O(1) excluding the output.

Too slow for the problem's stated constraint but useful as a sanity check.

## Approach 2: Prefix and suffix products (two auxiliary arrays)

`answer[i]` = (product of everything left of `i`) × (product of everything right of `i`).

Compute both in O(n) and combine.

```python
def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    prefix = [1] * n
    suffix = [1] * n

    for i in range(1, n):
        prefix[i] = prefix[i - 1] * nums[i - 1]
    for i in range(n - 2, -1, -1):
        suffix[i] = suffix[i + 1] * nums[i + 1]

    return [prefix[i] * suffix[i] for i in range(n)]
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) for the two auxiliary arrays.

## Approach 3: Space-optimized (O(1) extra space)

Reuse the output array for the prefix pass; track the suffix product as a single running scalar on a second pass.

```python
def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    answer = [1] * n

    # First pass: answer[i] = product of all elements left of i
    for i in range(1, n):
        answer[i] = answer[i - 1] * nums[i - 1]

    # Second pass: multiply by product of all elements right of i
    suffix = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]

    return answer
```

**Complexity**
- **Time:** O(n). Two linear passes.
- **Space:** O(1) extra (the output array is not counted per the problem).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Nested product | O(n²) | O(1) |
| Prefix + suffix arrays | O(n) | O(n) |
| **Space-optimized** | **O(n)** | **O(1)** extra |

Division would give an O(n) single-pass solution — forbidden here because of how it handles zeros (and to force the prefix/suffix idea, which generalizes to many problems).

## Related data structures

- [Arrays](../../../data-structures/arrays/) — input and output; classic prefix/suffix-product pattern
