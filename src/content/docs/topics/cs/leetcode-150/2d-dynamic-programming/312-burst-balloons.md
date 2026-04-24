---
title: "312. Burst Balloons"
description: Maximize coins by choosing the order to burst balloons, where each burst earns a product of neighboring values.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, interval-dp, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You're given `n` balloons in a row, each with a value `nums[i]`. Bursting balloon `i` gives you `nums[i, 1] * nums[i] * nums[i + 1]` coins (treating out-of-bounds indices as having value 1). After bursting, neighbors become adjacent. Return the maximum coins.

**Example**
- `nums = [3, 1, 5, 8]` → `167`
- `nums = [1, 5]` → `10`

LeetCode 312 · [Link](https://leetcode.com/problems/burst-balloons/) · *Hard*

## Approach 1: Brute force, try every order

`n!` orderings. Feasible only for tiny inputs.

## Approach 2: Recursive, pick the "first to burst" in each subproblem (wrong framing)

Picking the first to burst leaves a dependency where the next step depends on which balloons are gone, messy. The trick is to reframe.

## Approach 3: Interval DP, pick the **last** balloon to burst in each interval (canonical)

Pad `nums` with 1's on both sides. Let `dp[i][j]` = max coins from bursting *all* balloons strictly between indices `i` and `j`. For each `k ∈ (i, j)`, assume balloon `k` is the **last** burst in this interval, at that moment its neighbors are `nums[i]` and `nums[j]`.

```python
def max_coins(nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]

    # length here is the distance between i and j (j, i)
    for length in range(2, n):
        for i in range(n, length):
            j = i + length
            best = 0
            for k in range(i + 1, j):
                coins = nums[i] * nums[k] * nums[j] + dp[i][k] + dp[k][j]
                if coins > best:
                    best = coins
            dp[i][j] = best

    return dp[0][n, 1]
```

**Complexity**
- **Time:** O(n³).
- **Space:** O(n²).

### Why "last to burst"
When `k` is the last balloon in `(i, j)`, everything between `i` and `k`, and between `k` and `j`, has already been bursted. Those sub-intervals are independent subproblems, clean recurrence. Trying "first to burst" instead, the subproblems are not independent (their boundaries shift).

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Enumerate orderings | O(n!) | O(n) | Infeasible |
| Naive recursion ("first to burst") | - | - | Wrong framing |
| **Interval DP ("last to burst")** | **O(n³)** | **O(n²)** | Canonical |

Interval DP is a major pattern, same template solves Matrix Chain Multiplication and Minimum Cost Tree From Leaf Values (1130).

## Related data structures

- [Arrays](../../../data-structures/arrays/), 2-D DP table over intervals
