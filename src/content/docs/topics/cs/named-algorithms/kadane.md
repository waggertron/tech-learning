---
title: "Kadane's algorithm"
description: "Maximum contiguous subarray sum in O(n) with a single greedy choice at every index. Plus the product-subarray and stock-price variants."
parent: named-algorithms
tags: [algorithms, dp, greedy, arrays, interviews]
status: draft
created: 2026-05-01
updated: 2026-05-01
---

## What it does

Given an integer array `nums`, find the contiguous subarray (at least one element) with the **largest sum**, in a single pass.

Named after Jay Kadane, who described it in 1977. It's the canonical answer to LeetCode 53 (Maximum Subarray) and the prototype for an entire family of "best contiguous something" problems.

## The core idea, in one sentence

> At every index, ask: is the running sum I've been carrying actually helping me, or is it dragging me down? If it's negative, throw it away and start fresh.

That single greedy decision (extend or restart) at each position is the whole algorithm.

## The code

```python
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)   # extend (cur + x) or restart (x)
        best = max(best, cur)   # remember the best ending so far
    return best
```

Two variables:
- `cur` = best subarray sum that **ends exactly at the current position**
- `best` = best subarray sum **seen anywhere so far**

You need both because the optimal subarray might have ended several steps ago, `cur` will have moved on, but `best` remembers it.

## Why greedy works (the proof sketch)

Greedy = at each step, make the locally optimal choice and never revisit. That's usually dangerous, but here it's provably safe:

> If the running sum ending at position `i-1` is negative, no future subarray that *includes* position `i-1` can be optimal. You'd always do better by starting fresh at `i`.

Negative prefix is dead weight. Cut it loose. That's the proof.

## Walking through `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`

| x  | cur = max(x, cur + x)        | best |
| -- | ---------------------------- | ---- |
| -2 | -2 (init)                    | -2   |
| 1  | max(1, -2+1=-1) = **1**      | 1    |
| -3 | max(-3, 1-3=-2) = **-2**     | 1    |
| 4  | max(4, -2+4=2) = **4**       | 4    |
| -1 | max(-1, 4-1=3) = **3**       | 4    |
| 2  | max(2, 3+2=5) = **5**        | 5    |
| 1  | max(1, 5+1=6) = **6**        | **6** |
| -5 | max(-5, 6-5=1) = **1**       | 6    |
| 4  | max(4, 1+4=5) = **5**        | 6    |

Answer: `6`, from the subarray `[4, -1, 2, 1]`.

The restart at `x=4` is the key moment: when `cur` was `-2`, we threw it away. We never look backward, never reconsider. That's what makes the whole thing O(n).

## Edge cases the formula handles for free

- **All negatives** like `[-3, -1, -4]` -> answer `-1` (least bad single element). The `max(x, cur+x)` keeps picking `x` alone.
- **Single element** -> loop doesn't execute, `best = nums[0]`.
- **All positives** -> `cur` keeps extending; you get the full sum.

## Complexity

| Metric | Cost |
| --- | --- |
| Time | O(n), single pass |
| Space | O(1), two scalars |

## The pattern

Kadane is the template for **"best contiguous something"** problems. The mental shape:

> Track the best answer **ending here**, and separately the best answer **anywhere**. At each step, either extend the local thing or restart it.

Once you internalize that, you start seeing it everywhere.

## Variant 1: Maximum Product Subarray (LeetCode 152)

**The twist:** sums and products behave differently. With sums, a negative running total is always worse than zero. With products, a *big negative* is one multiplication away from being a *big positive*.

Counter-example to naive Kadane on products: `[-2, 3, -4]`.

If you only track the running max:
```
cur = -2,  best = -2
x=3:  max(3, -2*3=-6) = 3       best = 3
x=-4: max(-4, 3*-4=-12) = -4    best = 3   ← WRONG, should be 24
```

You threw away the running value `-6` (which was the most useful thing you had, because `-6 * -4 = 24`). The fix: **track the running min too**, because today's min times tomorrow's negative is tomorrow's max.

```python
def max_product(nums):
    max_here = min_here = best = nums[0]
    for x in nums[1:]:
        if x < 0:
            max_here, min_here = min_here, max_here   # swap on sign flip
        max_here = max(x, max_here * x)
        min_here = min(x, min_here * x)
        best = max(best, max_here)
    return best
```

The swap on `x < 0` is the whole trick. When you multiply by a negative, the order flips: yesterday's max becomes today's smallest candidate, and yesterday's min becomes today's largest. Swap the labels first, then the same `extend or restart` logic works.

Walk through `[-2, 3, -4]`:

| x  | swap? | max_here = max(x, max_here·x) | min_here = min(x, min_here·x) | best |
| -- | ----- | ----------------------------- | ----------------------------- | ---- |
| -2 | init  | -2                            | -2                            | -2   |
| 3  | no    | max(3, -2·3=-6) = **3**       | min(3, -2·3=-6) = **-6**      | 3    |
| -4 | yes (swap to max=-6, min=3) | max(-4, -6·-4=24) = **24** | min(-4, 3·-4=-12) = **-12** | **24** |

The min `-6` was the bridge: holding it across the sign flip captured the `-2 · 3 · -4 = 24` product.

**Same shape as Kadane.** Same O(n) single pass. Same `extend or restart` choice. Just two running scalars instead of one because multiplication's symmetry forces it.

Detailed walkthrough: [LeetCode 152, Maximum Product Subarray](../leetcode-150/1d-dynamic-programming/152-maximum-product-subarray/).

## Variant 2: Best Time to Buy and Sell Stock (LeetCode 121)

**The twist:** at first glance this isn't a subarray-sum problem at all. You're given prices and asked for the max profit from one buy and one sell (sell after buy).

Trick: think about the **differences between consecutive days**. If `prices = [7, 1, 5, 3, 6, 4]`, the daily changes are `[-6, +4, -2, +3, -2]`. The total profit of buying on day `i` and selling on day `j` equals the **sum of consecutive differences from `i` to `j-1`**:

```
profit(buy day 1, sell day 4) = prices[4] - prices[1]
                              = (-6 + 4 - 2 + 3 - 2) -- (-6)
                              = 4 - 2 + 3 = 5
```

So the question "what's the max profit?" is exactly "what's the **max contiguous sum** of the differences array?" And that's Kadane, verbatim.

```python
def max_profit(prices):
    best = cur = 0
    for i in range(1, len(prices)):
        diff = prices[i] - prices[i-1]
        cur = max(diff, cur + diff)
        best = max(best, cur)
    return best
```

Or, equivalently, the more common form which tracks "min seen so far":

```python
def max_profit(prices):
    min_price = prices[0]
    best = 0
    for p in prices[1:]:
        best = max(best, p - min_price)
        min_price = min(min_price, p)
    return best
```

Both are O(n), O(1). The second is what most people write because it's the more direct phrasing, but it's the same algorithm: the running `cur` in the first version equals `prices[i] - min_price` in the second.

Walk through `[7, 1, 5, 3, 6, 4]` with the diff form:

| i | price | diff | cur = max(diff, cur+diff) | best |
| - | ----- | ---- | ------------------------- | ---- |
| 0 | 7     | -    | 0 (init)                  | 0    |
| 1 | 1     | -6   | max(-6, 0-6=-6) = **-6**  | 0    |
| 2 | 5     | +4   | max(4, -6+4=-2) = **4**   | 4    |
| 3 | 3     | -2   | max(-2, 4-2=2) = **2**    | 4    |
| 4 | 6     | +3   | max(3, 2+3=5) = **5**     | **5** |
| 5 | 4     | -2   | max(-2, 5-2=3) = **3**    | 5    |

Answer: `5` (buy at 1, sell at 6).

**Same shape as Kadane.** Single pass. `extend or restart` at every step. The only difference is the input is *implied*: instead of operating on the array directly, you operate on the consecutive-difference array, which you compute on the fly.

Detailed walkthrough: [LeetCode 121, Best Time to Buy and Sell Stock](../leetcode-150/sliding-window/121-best-time-to-buy-and-sell-stock/).

## Quick comparison of the three

| Problem | What's contiguous | Combine op | Need both extremes? | Answer |
| --- | --- | --- | --- | --- |
| Max Subarray (53) | Sum of `nums[i..j]` | `+` | No, sums are monotone in sign | `max(cur)` ever seen |
| Max Product Subarray (152) | Product of `nums[i..j]` | `*` | Yes, neg·neg flips sign | `max(max_here)` ever seen |
| Buy/Sell Stock (121) | Sum of `diffs[i..j-1]` | `+` (on diffs) | No | `max(cur)` ever seen |

The unifying mental model: **at each step, decide whether to extend the local optimum or to restart from here.** The bookkeeping changes (one var vs two, raw input vs differences) but the loop is always the same shape.

## Things that aren't Kadane (counter-clues)

- **Non-contiguous subset sum** -> not Kadane. Different problem entirely (often DP knapsack or subset enumeration).
- **K-element subarray with max sum** -> sliding window of fixed size, not Kadane.
- **Max sum with at most one element skipped** -> 2-state DP, generalization of Kadane.
- **Circular max subarray (LC 918)** -> two passes, one normal Kadane, one inverted to find the min and subtract.

If "contiguous" or "consecutive" doesn't appear in the problem, Kadane probably isn't the answer.

## Test cases

```python
def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best

def _run_tests():
    assert max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6
    assert max_subarray([1]) == 1
    assert max_subarray([5, 4, -1, 7, 8]) == 23
    assert max_subarray([-1]) == -1
    assert max_subarray([-2, -3, -1, -5]) == -1
    assert max_subarray([1, 2, 3, 4, 5]) == 15
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## References

- Bentley, J. (1984). *Programming Pearls: Algorithm Design Techniques.* CACM 27(9). The original popularization.
- Kadane, J. (1977). The history of Kadane's algorithm and Bentley's column.
- [LeetCode 53, Maximum Subarray](https://leetcode.com/problems/maximum-subarray/)

## Related topics

- [LeetCode 53, Maximum Subarray](../leetcode-150/greedy/053-maximum-subarray/), the canonical exercise
- [LeetCode 152, Maximum Product Subarray](../leetcode-150/1d-dynamic-programming/152-maximum-product-subarray/), the product variant with min/max swap
- [LeetCode 121, Best Time to Buy and Sell Stock](../leetcode-150/sliding-window/121-best-time-to-buy-and-sell-stock/), Kadane on consecutive differences
- [Arrays](../data-structures/arrays/), the data structure these problems operate on
- [1-D Dynamic Programming](../leetcode-150/1d-dynamic-programming/), the broader family Kadane sits inside
