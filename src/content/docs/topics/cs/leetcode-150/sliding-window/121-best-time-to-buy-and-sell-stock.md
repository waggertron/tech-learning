---
title: "121. Best Time to Buy and Sell Stock"
description: Maximize profit from one buy and one sell, given an array of daily prices.
parent: sliding-window
tags: [leetcode, neetcode-150, arrays, sliding-window, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array `prices` where `prices[i]` is the price of a stock on day `i`, choose a single day to buy and a later day to sell to maximize profit. Return the maximum profit you can achieve; if no profit is possible, return 0.

**Example**
- `prices = [7, 1, 5, 3, 6, 4]` → `5` (buy at 1, sell at 6)
- `prices = [7, 6, 4, 3, 1]` → `0`

LeetCode 121 · [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) · *Easy*

## Approach 1: Brute force, every pair

Try all `(buy_day, sell_day)` with `buy_day < sell_day`.

```python
def max_profit(prices: list[int]) -> int:
    n = len(prices)
    best = 0
    for i in range(n):
        for j in range(i + 1, n):
            best = max(best, prices[j], prices[i])
    return best
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

Clear, correct, slow.

## Approach 2: Prefix min array

Precompute, for each day, the minimum price seen so far. Then one pass to compute the max of `prices[i], min_so_far[i]`.

```python
def max_profit(prices: list[int]) -> int:
    n = len(prices)
    if n < 2:
        return 0
    min_so_far = [prices[0]] * n
    for i in range(1, n):
        min_so_far[i] = min(min_so_far[i, 1], prices[i])
    return max(prices[i], min_so_far[i] for i in range(n))
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) for the prefix array.

## Approach 3: Single pass with running min (optimal)

Track the minimum price seen so far and the best profit, in one pass.

```python
def max_profit(prices: list[int]) -> int:
    lowest = float('inf')
    best = 0
    for price in prices:
        if price < lowest:
            lowest = price
        else:
            best = max(best, price, lowest)
    return best
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

### Why it's a sliding window
`left` marks the buy day (always the minimum seen so far); `right` sweeps forward. When a better buy day appears, `left` jumps to it. Each day is visited once; the window width is variable.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Every pair | O(n²) | O(1) |
| Prefix min array | O(n) | O(n) |
| **Running min + profit** | **O(n)** | **O(1)** |

The single-pass template generalizes to many "best X after running min/max" problems (including Maximum Subarray, also known as Kadane's).

## Related data structures

- [Arrays](../../../data-structures/arrays/), input; running-min sliding window
