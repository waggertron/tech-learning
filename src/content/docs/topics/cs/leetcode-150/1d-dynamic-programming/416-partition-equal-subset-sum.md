---
title: "416. Partition Equal Subset Sum"
description: Determine if an integer array can be partitioned into two subsets with equal sums — 0/1 knapsack.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, knapsack, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a non-empty array `nums` of positive integers, determine if the array can be partitioned into two subsets such that the sum of elements in both subsets is equal.

**Example**
- `nums = [1, 5, 11, 5]` → `true` (`[1, 5, 5]` and `[11]`)
- `nums = [1, 2, 3, 5]` → `false`

LeetCode 416 · [Link](https://leetcode.com/problems/partition-equal-subset-sum/) · *Medium*

## Approach 1: Brute force — enumerate subsets

Try every subset; test whether it sums to `total / 2`.

```python
def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    def f(i, cur):
        if cur == target:
            return True
        if i == len(nums) or cur > target:
            return False
        return f(i + 1, cur + nums[i]) or f(i + 1, cur)
    return f(0, 0)
```

**Complexity**
- **Time:** O(2ⁿ).
- **Space:** O(n).

## Approach 2: Top-down memoized

Cache by `(i, cur)`.

```python
from functools import lru_cache

def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2

    @lru_cache(maxsize=None)
    def f(i, cur):
        if cur == target:
            return True
        if i == len(nums) or cur > target:
            return False
        return f(i + 1, cur + nums[i]) or f(i + 1, cur)

    return f(0, 0)
```

**Complexity**
- **Time:** O(n · target).
- **Space:** O(n · target).

## Approach 3: Bottom-up 1-D DP (canonical, optimal space)

`dp[s] = True` iff some subset of processed items sums to `s`. Process items one at a time; **iterate `s` from high to low** to avoid reusing an item (0/1 knapsack rule).

```python
def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for x in nums:
        for s in range(target, x - 1, -1):
            dp[s] = dp[s] or dp[s - x]
    return dp[target]
```

**Complexity**
- **Time:** O(n · target).
- **Space:** O(target).

### Why iterate from high to low
In 0/1 knapsack, iterating `s` low-to-high would let an item be included more than once in the same outer iteration. Going high-to-low uses only values that haven't yet been updated this round — preserving the 0/1 semantics.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2ⁿ) | O(n) |
| Top-down memo | O(n · target) | O(n · target) |
| **Bottom-up 1-D DP** | **O(n · target)** | **O(target)** |

Template for every 0/1 knapsack problem — Target Sum (494), Last Stone Weight II (1049), etc.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — DP array indexed by subset sum
