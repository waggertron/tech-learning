---
title: "309. Best Time to Buy and Sell Stock with Cooldown"
description: Maximize profit from buying/selling a stock with unlimited transactions and a one-day cooldown after each sell.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, state-machine, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given prices for a stock on consecutive days, maximize profit. You may make unlimited transactions but:

- You must sell the stock before buying again.
- After a **sell**, you must wait one day before buying again (cooldown).

**Example**
- `prices = [1, 2, 3, 0, 2]` → `3` (buy day 0, sell day 1, cooldown day 2, buy day 3, sell day 4)
- `prices = [1]` → `0`

LeetCode 309 · [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) · *Medium*

## Approach 1: Recursive with state

At each day, you're in one of three states: **holding** a stock, **free** (can buy), **cooldown** (can't buy this day).

```python
def max_profit(prices):
    n = len(prices)
    def f(i, holding, cooldown):
        if i == n:
            return 0
        best = f(i + 1, holding, False)   # skip
        if holding:
            best = max(best, prices[i] + f(i + 1, False, True))   # sell
        elif not cooldown:
            best = max(best, -prices[i] + f(i + 1, True, False))  # buy
        return best
    return f(0, False, False)
```

**Complexity**
- **Time:** O(2ⁿ).
- **Space:** O(n).

## Approach 2: Top-down memoized

```python
from functools import lru_cache

def max_profit(prices):
    n = len(prices)
    @lru_cache(maxsize=None)
    def f(i, holding, cooldown):
        if i == n:
            return 0
        best = f(i + 1, holding, False)
        if holding:
            best = max(best, prices[i] + f(i + 1, False, True))
        elif not cooldown:
            best = max(best, -prices[i] + f(i + 1, True, False))
        return best
    return f(0, False, False)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

## Approach 3: Bottom-up three-state DP (optimal)

Track three scalar states: `hold` (holding a stock), `sold` (just sold, must cooldown next day), `rest` (free to buy).

```python
def max_profit(prices):
    if not prices:
        return 0
    hold = -prices[0]   # max profit if holding today
    sold = 0             # max profit if just sold today
    rest = 0             # max profit if resting (free) today

    for i in range(1, len(prices)):
        prev_hold, prev_sold, prev_rest = hold, sold, rest
        hold = max(prev_hold, prev_rest - prices[i])   # keep or buy from rest
        sold = prev_hold + prices[i]                    # must have been holding, now sell
        rest = max(prev_rest, prev_sold)                # stay rest or enter from cooldown

    return max(sold, rest)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

### State machine
The three states are nodes in a DAG:

- `rest → rest` (do nothing)
- `rest → hold` (buy)
- `hold → hold` (do nothing)
- `hold → sold` (sell)
- `sold → rest` (cooldown expires)

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2ⁿ) | O(n) |
| Memoized | O(n) | O(n) |
| **Three-state scalar DP** | **O(n)** | **O(1)** |

State-machine DP is the right abstraction whenever you have "at each position, the set of things you could be doing is finite." Best Time to Buy and Sell Stock IV (fixed K transactions) extends this pattern.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — input; state-machine transitions
