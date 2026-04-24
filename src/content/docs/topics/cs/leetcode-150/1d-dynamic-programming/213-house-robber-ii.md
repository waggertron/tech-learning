---
title: "213. House Robber II"
description: House Robber but the houses are arranged in a circle — the first and last are adjacent.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Same as House Robber (198), but houses are in a **circle** — the first and last houses are adjacent, so you can't rob both.

**Example**
- `nums = [2, 3, 2]` → `3`
- `nums = [1, 2, 3, 1]` → `4`
- `nums = [1, 2, 3]` → `3`

LeetCode 213 · [Link](https://leetcode.com/problems/house-robber-ii/) · *Medium*

## Approach 1: Brute force — enumerate all non-adjacent subsets

Generate every subset with no two adjacent (including circular adjacency). Impractical past n ≈ 25.

**Complexity**
- **Time:** O(2ⁿ).
- **Space:** O(n).

## Approach 2: Run House Robber twice, exclude endpoints alternately (canonical)

Either you rob the first house (then you can't rob the last), or you don't (and the last is fine). Run the linear House Robber on `nums[0:-1]` and `nums[1:]`; take the max.

Special-case `n == 1`.

```python
def rob(nums):
    def rob_linear(arr):
        prev2, prev1 = 0, 0
        for x in arr:
            prev2, prev1 = prev1, max(prev1, prev2 + x)
        return prev1

    if len(nums) == 1:
        return nums[0]
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) for slicing (or O(1) if you pass indices).

## Approach 3: Two-pointer range DP — avoid slicing (optimal space)

Same idea, but iterate with explicit start/end indices instead of creating sliced copies.

```python
def rob(nums):
    def rob_range(lo, hi):
        prev2, prev1 = 0, 0
        for i in range(lo, hi + 1):
            prev2, prev1 = prev1, max(prev1, prev2 + nums[i])
        return prev1

    if len(nums) == 1:
        return nums[0]
    return max(rob_range(0, len(nums) - 2), rob_range(1, len(nums) - 1))
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate subsets | O(2ⁿ) | O(n) |
| Two HouseRobber runs + slice | O(n) | O(n) |
| **Two HouseRobber runs by index** | **O(n)** | **O(1)** |

The "split the circle by fixing one house in/out" trick is common in circular-array DP.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — input; circular constraint handled by running linear DP on two ranges
