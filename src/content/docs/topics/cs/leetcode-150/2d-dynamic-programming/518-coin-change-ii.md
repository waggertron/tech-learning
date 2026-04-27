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
        if remaining == 0:                              # L1: O(1) base: made the amount
            return 1
        if remaining < 0 or i == len(coins):           # L2: O(1) base: overshoot or no coins left
            return 0
        return f(i, remaining - coins[i]) + f(i + 1, remaining)  # L3: use coin or skip
    return f(0, amount)
```

**Where the time goes, line by line**

*Variables: n = len(coins), A = amount.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L2 (base cases) | O(1) | once per leaf | O(1) each |
| **L3 (two recursive calls)** | **O(1) work + 2 calls** | **every non-leaf** | **O(2^(n+A))** ← dominates |

Without memoization, the same `(i, remaining)` is recomputed many times across branches of the call tree.

**Complexity**
- **Time:** O(2^(n+A)) worst case, driven by L3 double-branching.
- **Space:** O(n + A) recursion depth.

## Approach 2: Top-down memoized

Cache by `(i, remaining)`.

```python
from functools import lru_cache

def change(amount, coins):
    @lru_cache(maxsize=None)                            # L1: cache decorator
    def f(i, remaining):
        if remaining == 0:                              # L2: O(1) base case
            return 1
        if remaining < 0 or i == len(coins):           # L3: O(1) base case
            return 0
        return f(i, remaining - coins[i]) + f(i + 1, remaining)  # L4: O(1) with cache
    return f(0, amount)
```

**Where the time goes, line by line**

*Variables: n = len(coins), A = amount.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (lru_cache) | O(1) | 1 | O(1) |
| L2-L3 (base cases) | O(1) | once per unique (i, remaining) | O(n · A) total |
| **L4 (cached calls)** | **O(1) per call** | **at most n · (A+1) unique states** | **O(n · A)** ← dominates |

Each unique `(i, remaining)` pair is computed once. There are `n * (A+1)` such pairs.

**Complexity**
- **Time:** O(n · amount), driven by L4 across all unique (i, remaining) states.
- **Space:** O(n · amount) for the memo table.

## Approach 3: Bottom-up 1-D DP with outer loop over coins (canonical)

Think of it as an unbounded knapsack *counting* problem. The loop order matters: **coins outside, amounts inside**. Swapping the loops would count permutations instead of combinations.

```python
def change(amount, coins):
    dp = [0] * (amount + 1)    # L1: O(A) table init
    dp[0] = 1                  # L2: O(1) base: one way to make amount 0 (use no coins)
    for c in coins:            # L3: O(n) outer loop over coins
        for s in range(c, amount + 1):   # L4: O(A) inner loop, left-to-right
            dp[s] += dp[s - c]           # L5: O(1) accumulate ways using coin c
    return dp[amount]          # L6: O(1) answer
```

**Where the time goes, line by line**

*Variables: n = len(coins), A = amount.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L2 (init) | O(A) | 1 | O(A) |
| **L3+L4 (double loop)** | **O(1) body** | **n · A** | **O(n · A)** ← dominates |
| L5 (DP update) | O(1) | n · A | included above |

The left-to-right inner loop (L4) is what makes this unbounded knapsack (vs. 0/1): when we update `dp[s]` at step `s`, `dp[s - c]` already reflects the current coin `c` being used, so it can be used multiple times. Contrast with 494 Target Sum (0/1 knapsack) where the inner loop runs right-to-left.

**Complexity**
- **Time:** O(n · amount), driven by L3/L4 (the double loop).
- **Space:** O(amount) for the 1-D DP array.

### Why coin-outside, amount-inside
With coin-outside, each coin is "introduced" once; by the time the inner loop finishes, you've added every multiset that includes that coin an integer number of times. Amount-outside would multi-count, treating `[1, 2]` and `[2, 1]` as different compositions.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2^(n+A)) | O(n + A) |
| Top-down memo | O(n · amount) | O(n · amount) |
| **1-D DP, coin-outside** | **O(n · amount)** | **O(amount)** |

Template for every "count combinations using unlimited items" problem (Number of Ways to Write N as Sum of Powers, etc.).

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_518.py and run.
# Uses the canonical implementation (Approach 3: 1-D DP, coin-outside).

def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for c in coins:
        for s in range(c, amount + 1):
            dp[s] += dp[s - c]
    return dp[amount]

def _run_tests():
    # problem statement examples
    assert change(5, [1, 2, 5]) == 4
    assert change(3, [2]) == 0
    # edge: amount = 0 (one way: use nothing)
    assert change(0, [1, 2, 5]) == 1
    # single coin exactly divides amount (only one combination: 5+5)
    assert change(10, [5]) == 1
    # larger case
    assert change(10, [1, 5, 10]) == 4
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), DP indexed by subtotal
