---
title: "198. House Robber"
description: Maximum money you can rob without alerting any two adjacent houses.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `nums[i]` = money at house `i`, return the maximum amount you can rob without robbing two adjacent houses.

**Example**
- `nums = [1, 2, 3, 1]` → `4` (rob houses 0 and 2)
- `nums = [2, 7, 9, 3, 1]` → `12` (rob 0, 2, 4)

LeetCode 198 · [Link](https://leetcode.com/problems/house-robber/) · *Medium*

## Approach 1: Recursive with take/skip

`f(i) = max(nums[i] + f(i+2), f(i+1))`.

```python
def rob(nums):
    def f(i):
        if i >= len(nums):
            return 0
        return max(nums[i] + f(i + 2), f(i + 1))
    return f(0)
```

**Complexity**
- **Time:** O(2ⁿ).
- **Space:** O(n).

## Approach 2: Memoized

```python
from functools import lru_cache

def rob(nums):
    n = len(nums)
    @lru_cache(maxsize=None)
    def f(i):
        if i >= n:
            return 0
        return max(nums[i] + f(i + 2), f(i + 1))
    return f(0)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

## Approach 3: Bottom-up with two variables (optimal)

`prev2 = dp[i-2]`, `prev1 = dp[i-1]`. `dp[i] = max(prev1, prev2 + nums[i])`.

```python
def rob(nums):
    prev2, prev1 = 0, 0
    for x in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + x)
    return prev1
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive take/skip | O(2ⁿ) | O(n) |
| Memoized | O(n) | O(n) |
| **Bottom-up, two vars** | **O(n)** | **O(1)** |

This is the canonical "take or skip" DP pattern. Reappears in Paint House, Delete and Earn, and Best Time to Buy/Sell with Cooldown.

## Related data structures

- [Arrays](../../../data-structures/arrays/), input; collapsed DP
