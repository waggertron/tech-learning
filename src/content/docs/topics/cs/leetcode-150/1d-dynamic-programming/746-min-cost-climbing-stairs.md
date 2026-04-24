---
title: "746. Min Cost Climbing Stairs"
description: Minimum cost to reach the top, where each step has a cost and you can start from step 0 or 1.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array `cost` where `cost[i]` is the cost of step `i`, you can start at step `0` or step `1`. Each move climbs 1 or 2 steps. Return the minimum total cost to reach just past the last step.

**Example**
- `cost = [10, 15, 20]` → `15` (start at 1, pay 15, step over the top)
- `cost = [1,100,1,1,1,100,1,1,100,1]` → `6`

LeetCode 746 · [Link](https://leetcode.com/problems/min-cost-climbing-stairs/) · *Easy*

## Approach 1: Recursive — min cost from step i

`min_from(i) = cost[i] + min(min_from(i+1), min_from(i+2))`. Return `min(min_from(0), min_from(1))`.

```python
def min_cost_climbing_stairs(cost):
    n = len(cost)
    def min_from(i):
        if i >= n:
            return 0
        return cost[i] + min(min_from(i + 1), min_from(i + 2))
    return min(min_from(0), min_from(1))
```

**Complexity**
- **Time:** O(2ⁿ).
- **Space:** O(n).

## Approach 2: Memoized recursion

```python
from functools import lru_cache

def min_cost_climbing_stairs(cost):
    n = len(cost)
    @lru_cache(maxsize=None)
    def f(i):
        if i >= n:
            return 0
        return cost[i] + min(f(i + 1), f(i + 2))
    return min(f(0), f(1))
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

## Approach 3: Bottom-up with two variables (optimal)

`dp[i]` = min cost to stand on step `i`. Then `dp[i] = cost[i] + min(dp[i-1], dp[i-2])`. Answer = `min(dp[n-1], dp[n-2])`.

```python
def min_cost_climbing_stairs(cost):
    n = len(cost)
    a, b = cost[0], cost[1]
    for i in range(2, n):
        a, b = b, cost[i] + min(a, b)
    return min(a, b)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2ⁿ) | O(n) |
| Memoized | O(n) | O(n) |
| **Bottom-up, two vars** | **O(n)** | **O(1)** |

## Related data structures

- [Arrays](../../../data-structures/arrays/) — input; implicit DP array
