---
title: "746. Min Cost Climbing Stairs (Easy)"
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

## Approach 1: Recursive, min cost from step i

`min_from(i) = cost[i] + min(min_from(i+1), min_from(i+2))`. Return `min(min_from(0), min_from(1))`.

```python
def min_cost_climbing_stairs(cost):
    n = len(cost)
    def min_from(i):
        if i >= n:        # L1: base case, past top
            return 0
        return cost[i] + min(min_from(i + 1), min_from(i + 2))  # L2: two recursive branches
    return min(min_from(0), min_from(1))  # L3: best of starting at 0 or 1
```

**Where the time goes, line by line**

*Variables: n = len(cost).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (base case) | O(1) | O(2ⁿ) leaves | O(2ⁿ) |
| **L2 (two recursive calls)** | **O(1) + subtree** | **O(2ⁿ) nodes** | **O(2ⁿ)** ← dominates |
| L3 (initial call) | O(1) | 1 | O(1) |

Each call spawns two more; the tree doubles in width at every level, giving an exponential node count.

**Complexity**
- **Time:** O(2ⁿ), driven by L2 (exponential branching, no caching).
- **Space:** O(n) recursion stack.

## Approach 2: Memoized recursion

```python
from functools import lru_cache

def min_cost_climbing_stairs(cost):
    n = len(cost)
    @lru_cache(maxsize=None)
    def f(i):
        if i >= n:             # L1: base case
            return 0
        return cost[i] + min(f(i + 1), f(i + 2))  # L2: two sub-calls, cached after first hit
    return min(f(0), f(1))    # L3: best start
```

**Where the time goes, line by line**

*Variables: n = len(cost).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (base case) | O(1) | 2 | O(1) |
| **L2 (cached sub-calls)** | **O(1) each** | **n unique states** | **O(n)** ← dominates |
| L3 (initial call) | O(1) | 1 | O(1) |

Each of the n steps is computed exactly once; subsequent calls hit the cache in O(1).

**Complexity**
- **Time:** O(n), driven by L2 (n unique states, each computed once).
- **Space:** O(n) cache + stack.

## Approach 3: Bottom-up with two variables (optimal)

`dp[i]` = min cost to stand on step `i`. Then `dp[i] = cost[i] + min(dp[i-1], dp[i-2])`. Answer = `min(dp[n-1], dp[n-2])`.

```python
def min_cost_climbing_stairs(cost):
    n = len(cost)                       # L1: get length
    a, b = cost[0], cost[1]             # L2: seed dp[0], dp[1]
    for i in range(2, n):               # L3: loop n-2 times
        a, b = b, cost[i] + min(a, b)  # L4: O(1) update per step
    return min(a, b)                    # L5: best of last two steps
```

**Where the time goes, line by line**

*Variables: n = len(cost).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (length) | O(1) | 1 | O(1) |
| L2 (init) | O(1) | 1 | O(1) |
| **L3 (loop)** | **O(1)** | **n - 2** | **O(n)** ← dominates |
| L4 (update) | O(1) | n - 2 | O(n) |
| L5 (final min) | O(1) | 1 | O(1) |

The loop runs exactly n - 2 times, each iteration is a constant-cost update. No allocation beyond two scalars.

**Complexity**
- **Time:** O(n), driven by L3/L4.
- **Space:** O(1), just two scalars.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2ⁿ) | O(n) |
| Memoized | O(n) | O(n) |
| **Bottom-up, two vars** | **O(n)** | **O(1)** |

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_746.py and run.
# Uses the canonical implementation (Approach 3: bottom-up two variables).

def min_cost_climbing_stairs(cost):
    n = len(cost)
    a, b = cost[0], cost[1]
    for i in range(2, n):
        a, b = b, cost[i] + min(a, b)
    return min(a, b)

def _run_tests():
    assert min_cost_climbing_stairs([10, 15, 20]) == 15       # LeetCode example 1
    assert min_cost_climbing_stairs([1,100,1,1,1,100,1,1,100,1]) == 6  # LeetCode example 2
    assert min_cost_climbing_stairs([0, 0]) == 0              # all zeros
    assert min_cost_climbing_stairs([1, 2]) == 1              # two steps, pick cheaper
    assert min_cost_climbing_stairs([5, 3, 1, 2]) == 4        # skip alternating
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), input; implicit DP array
