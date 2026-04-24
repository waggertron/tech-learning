---
title: "152. Maximum Product Subarray"
description: Find the contiguous subarray with the largest product.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums`, find the contiguous subarray (at least one element) with the largest product, and return that product. The answer fits in a 32-bit integer.

**Example**
- `nums = [2, 3, -2, 4]` → `6` (`[2, 3]`)
- `nums = [-2, 0, -1]` → `0`
- `nums = [-2, 3, -4]` → `24` (all three)

LeetCode 152 · [Link](https://leetcode.com/problems/maximum-product-subarray/) · *Medium*

## Approach 1: Brute force, every subarray

For each `(i, j)`, compute the product.

```python
def max_product(nums):
    best = nums[0]
    for i in range(len(nums)):
        prod = 1
        for j in range(i, len(nums)):
            prod *= nums[j]
            best = max(best, prod)
    return best
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

## Approach 2: Kadane-like DP tracking max only (WRONG)

First instinct: `dp[i] = max(nums[i], dp[i, 1] * nums[i])`. This fails when a large negative product meets a negative number, the product becomes large positive.

Not a valid approach. Included to motivate Approach 3.

## Approach 3: DP tracking both max AND min at each position (canonical)

Because multiplying a negative makes a big-negative-min into a big-positive-max, we must track both `max_here` and `min_here`.

```python
def max_product(nums):
    max_here = min_here = best = nums[0]
    for x in nums[1:]:
        if x < 0:
            max_here, min_here = min_here, max_here
        max_here = max(x, max_here * x)
        min_here = min(x, min_here * x)
        best = max(best, max_here)
    return best
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

### Why swap on negative
When `x < 0`, multiplying by `x` flips order: the previous max becomes the smallest candidate, and the previous min becomes the largest. Swapping max/min before the update captures this cleanly.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Every subarray | O(n²) | O(1) |
| Track max only | O(n) | **wrong** |
| **Track max AND min** | **O(n)** | **O(1)** |

The "track both extremes" pattern also solves problem 978 (Longest Turbulent Subarray) and is a cornerstone of monotonic-signal DP.

## Related data structures

- [Arrays](../../../data-structures/arrays/), running-max/min scalars
