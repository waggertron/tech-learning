---
title: "322. Coin Change"
description: Minimum number of coins summing to a given amount — unbounded knapsack.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, knapsack, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given coins of various denominations and a target `amount`, return the fewest number of coins summing to `amount` (or `-1` if impossible). Coins may be used unlimited times.

**Example**
- `coins = [1, 2, 5]`, `amount = 11` → `3` (5 + 5 + 1)
- `coins = [2]`, `amount = 3` → `-1`
- `coins = [1]`, `amount = 0` → `0`

LeetCode 322 · [Link](https://leetcode.com/problems/coin-change/) · *Medium*

## Approach 1: Recursive

`f(n) = 1 + min(f(n - c) for c in coins if c ≤ n)`.

```python
def coin_change(coins, amount):
    def f(n):
        if n == 0:
            return 0
        if n < 0:
            return float('inf')
        best = float('inf')
        for c in coins:
            best = min(best, 1 + f(n - c))
        return best
    result = f(amount)
    return -1 if result == float('inf') else result
```

**Complexity**
- **Time:** O(|coins|^amount). Exponential — unusable.
- **Space:** O(amount).

## Approach 2: Top-down memoized

```python
from functools import lru_cache

def coin_change(coins, amount):
    @lru_cache(maxsize=None)
    def f(n):
        if n == 0:
            return 0
        if n < 0:
            return float('inf')
        best = float('inf')
        for c in coins:
            best = min(best, 1 + f(n - c))
        return best
    result = f(amount)
    return -1 if result == float('inf') else result
```

**Complexity**
- **Time:** O(amount · |coins|).
- **Space:** O(amount).

## Approach 3: Bottom-up DP (canonical)

`dp[i]` = min coins to make `i`. `dp[0] = 0`; `dp[i] = min(dp[i - c] + 1)` over valid coins.

```python
def coin_change(coins, amount):
    INF = amount + 1
    dp = [INF] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for c in coins:
            if c <= i:
                dp[i] = min(dp[i], dp[i - c] + 1)
    return dp[amount] if dp[amount] != INF else -1
```

**Complexity**
- **Time:** O(amount · |coins|).
- **Space:** O(amount).

### Unbounded vs. 0/1 knapsack
Coin Change is **unbounded** — each coin can be used infinitely. The outer loop over amounts lets the DP "re-use" a coin naturally. Compare with 0/1 knapsack (problem 416 Partition Equal Subset Sum), where each item is used at most once and loop order matters.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(|coins|^amount) | O(amount) |
| Top-down memo | O(amount · |coins|) | O(amount) |
| **Bottom-up DP** | **O(amount · |coins|)** | **O(amount)** |

Template for "min operations to reach target" under free reuse: Coin Change, Perfect Squares, Minimum Cost For Tickets.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — DP table indexed by amount
