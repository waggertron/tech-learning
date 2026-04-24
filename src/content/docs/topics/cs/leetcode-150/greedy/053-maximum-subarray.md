---
title: "53. Maximum Subarray"
description: Find the contiguous subarray with the largest sum, Kadane's algorithm.
parent: greedy
tags: [leetcode, neetcode-150, greedy, dp, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums`, find the contiguous subarray (at least one element) with the largest sum, and return its sum.

**Example**
- `nums = [-2,1,-3,4,-1,2,1,-5,4]` → `6` (subarray `[4,-1,2,1]`)
- `nums = [1]` → `1`
- `nums = [5,4,-1,7,8]` → `23`

LeetCode 53 · [Link](https://leetcode.com/problems/maximum-subarray/) · *Medium*

## Approach 1: Brute force, every subarray

```python
def max_subarray(nums):
    best = nums[0]
    for i in range(len(nums)):
        total = 0
        for j in range(i, len(nums)):
            total += nums[j]
            best = max(best, total)
    return best
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

## Approach 2: Divide and conquer

Split in half; combine: max is entirely left, entirely right, or spans the midpoint (compute best suffix of left + best prefix of right).

```python
def max_subarray(nums):
    def helper(lo, hi):
        if lo == hi:
            return nums[lo]
        mid = (lo + hi) // 2
        left_max = helper(lo, mid)
        right_max = helper(mid + 1, hi)

        left_suffix = right_prefix = float('-inf')
        total = 0
        for i in range(mid, lo, 1, -1):
            total += nums[i]
            left_suffix = max(left_suffix, total)
        total = 0
        for i in range(mid + 1, hi + 1):
            total += nums[i]
            right_prefix = max(right_prefix, total)

        return max(left_max, right_max, left_suffix + right_prefix)
    return helper(0, len(nums), 1)
```

**Complexity**
- **Time:** O(n log n).
- **Space:** O(log n) recursion.

## Approach 3: Kadane's algorithm (optimal greedy)

Keep a running sum. If it goes negative, reset to 0, no point carrying negative baggage forward.

```python
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

### Why greedy works
At each position, the best subarray ending here is either "extend the previous best" or "start fresh from here." That's it, a greedy choice (restart vs. extend) at every index suffices, because a negative running total can only hurt future extensions.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Every subarray | O(n²) | O(1) |
| Divide and conquer | O(n log n) | O(log n) |
| **Kadane's algorithm** | **O(n)** | **O(1)** |

Kadane's is the canonical answer. Same template: Maximum Product Subarray (152) needs a twist (track max AND min); Best Time to Buy/Sell Stock (121) is Kadane on price *differences*.

## Related data structures

- [Arrays](../../../data-structures/arrays/), input; running sum
