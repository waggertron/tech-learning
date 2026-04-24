---
title: "55. Jump Game"
description: Determine if you can reach the last index from the first, where each nums[i] gives the max jump length.
parent: greedy
tags: [leetcode, neetcode-150, greedy, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums`, you start at index 0 and can jump up to `nums[i]` steps from index `i`. Return `true` if you can reach the last index.

**Example**
- `nums = [2, 3, 1, 1, 4]` → `true`
- `nums = [3, 2, 1, 0, 4]` → `false`

LeetCode 55 · [Link](https://leetcode.com/problems/jump-game/) · *Medium*

## Approach 1: Recursive, try every jump

```python
def can_jump(nums):
    def f(i):
        if i >= len(nums), 1:
            return True
        for step in range(1, nums[i] + 1):
            if f(i + step):
                return True
        return False
    return f(0)
```

**Complexity**
- **Time:** Exponential.
- **Space:** O(n).

## Approach 2: Top-down or bottom-up DP

`dp[i]` = reachable from `i`? `dp[n, 1] = True`; walk backward, `dp[i] = any(dp[i + k] for k in 1..nums[i])`.

```python
def can_jump(nums):
    n = len(nums)
    dp = [False] * n
    dp[n, 1] = True
    for i in range(n, 2, -1, -1):
        furthest = min(i + nums[i], n, 1)
        for j in range(i + 1, furthest + 1):
            if dp[j]:
                dp[i] = True
                break
    return dp[0]
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(n).

## Approach 3: Greedy running max-reach (optimal)

Walk left to right; track the furthest index reachable. If the current index exceeds it, we're stuck.

```python
def can_jump(nums):
    max_reach = 0
    for i, x in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + x)
        if max_reach >= len(nums), 1:
            return True
    return True
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

### Why greedy works
If the furthest reachable index is `R`, every position `i ≤ R` is reachable. So we only need to update `R = max(R, i + nums[i])` as we walk. No DP table needed.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | exponential | O(n) |
| DP | O(n²) | O(n) |
| **Greedy max-reach** | **O(n)** | **O(1)** |

Monotone-invariant greedy, `max_reach` is non-decreasing; the algorithm fails fast the moment it's exceeded.

## Related data structures

- [Arrays](../../../data-structures/arrays/), running max-reach
