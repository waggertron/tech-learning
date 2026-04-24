---
title: "518. Coin Change II"
description: Count the number of ways to make an amount using unlimited coins of each denomination.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, knapsack, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an `amount` and an array of coin denominations, return the number of distinct ways to make `amount` using unlimited coins of each denomination.

**Example**
- `amount = 5`, `coins = [1, 2, 5]` → `4` (5; 2+2+1; 2+1+1+1; 1+1+1+1+1)
- `amount = 3`, `coins = [2]` → `0`

LeetCode 518 · [Link](https://leetcode.com/problems/coin-change-ii/) · *Medium*

## Approach 1: Recursive with coin index

At each step, for coin `c`, choose "include another `c`" or "move to next coin."

```python
def change(amount, coins):
    def f(i, remaining):
        if remaining == 0:
            return 1
        if remaining < 0 or i == len(coins):
            return 0
        return f(i, remaining - coins[i]) + f(i + 1, remaining)
    return f(0, amount)
```

**Complexity**
- **Time:** O(2^(n+a)) worst case.
- **Space:** O(n + a).

## Approach 2: Top-down memoized

Cache by `(i, remaining)`.

```python
from functools import lru_cache

def change(amount, coins):
    @lru_cache(maxsize=None)
    def f(i, remaining):
        if remaining == 0:
            return 1
        if remaining < 0 or i == len(coins):
            return 0
        return f(i, remaining - coins[i]) + f(i + 1, remaining)
    return f(0, amount)
```

**Complexity**
- **Time:** O(n · amount).
- **Space:** O(n · amount).

## Approach 3: Bottom-up 1-D DP with outer loop over coins (canonical)

Think of it as an unbounded knapsack *counting* problem. The loop order matters: **coins outside, amounts inside**. Swapping the loops would count permutations instead of combinations.

```python
def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for c in coins:
        for s in range(c, amount + 1):
            dp[s] += dp[s - c]
    return dp[amount]
```

**Complexity**
- **Time:** O(n · amount).
- **Space:** O(amount).

### Why coin-outside, amount-inside
With coin-outside, each coin is "introduced" once; by the time the inner loop finishes, you've added every multiset that includes that coin an integer number of times. Amount-outside would multi-count, treating `[1, 2]` and `[2, 1]` as different compositions.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2^(n+a)) | O(n + a) |
| Top-down memo | O(n · amount) | O(n · amount) |
| **1-D DP, coin-outside** | **O(n · amount)** | **O(amount)** |

Template for every "count combinations using unlimited items" problem (Number of Ways to Write N as Sum of Powers, etc.).

## Related data structures

- [Arrays](../../../data-structures/arrays/) — DP indexed by subtotal
