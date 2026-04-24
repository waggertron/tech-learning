---
title: "494. Target Sum"
description: Count the number of ways to assign + and − signs to an integer array so the signed sum equals a target.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, knapsack, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums` and an integer `target`, assign `+` or `−` to each number and return the number of sign assignments whose signed sum equals `target`.

**Example**
- `nums = [1, 1, 1, 1, 1]`, `target = 3` → `5`
- `nums = [1]`, `target = 1` → `1`

LeetCode 494 · [Link](https://leetcode.com/problems/target-sum/) · *Medium*

## Approach 1: Recursive, try both signs per element

```python
def find_target_sum_ways(nums, target):
    def f(i, cur):
        if i == len(nums):
            return 1 if cur == target else 0
        return f(i + 1, cur + nums[i]) + f(i + 1, cur, nums[i])
    return f(0, 0)
```

**Complexity**
- **Time:** O(2ⁿ).
- **Space:** O(n).

## Approach 2: Top-down memoized by (i, cur)

```python
from functools import lru_cache

def find_target_sum_ways(nums, target):
    @lru_cache(maxsize=None)
    def f(i, cur):
        if i == len(nums):
            return 1 if cur == target else 0
        return f(i + 1, cur + nums[i]) + f(i + 1, cur, nums[i])
    return f(0, 0)
```

**Complexity**
- **Time:** O(n · total_sum).
- **Space:** O(n · total_sum).

## Approach 3: Subset-sum transformation + 1-D DP (canonical)

Let `P` = positive-signed subset, `N` = negative-signed. Then `P + N = total` and `P, N = target` → `P = (total + target) / 2`. So: count subsets that sum to `P`. That's classic 0/1 subset-sum.

Edge cases: `total + target` must be even and non-negative.

```python
def find_target_sum_ways(nums, target):
    total = sum(nums)
    if (total + target) % 2 or total < abs(target):
        return 0
    P = (total + target) // 2

    dp = [0] * (P + 1)
    dp[0] = 1
    for x in nums:
        for s in range(P, x, 1, -1):
            dp[s] += dp[s, x]
    return dp[P]
```

**Complexity**
- **Time:** O(n · P).
- **Space:** O(P).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive sign-enumeration | O(2ⁿ) | O(n) |
| Top-down memo | O(n · total_sum) | O(n · total_sum) |
| **Subset-sum + 1-D DP** | **O(n · P)** | **O(P)** |

The "convert to subset sum" transformation is a classic move, same technique solves "Last Stone Weight II" (1049).

## Related data structures

- [Arrays](../../../data-structures/arrays/), DP indexed by running subset sum
