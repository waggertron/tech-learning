---
title: "70. Climbing Stairs"
description: Count ways to climb n stairs taking 1 or 2 steps at a time.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, fibonacci, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are climbing a staircase of `n` steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?

**Example**
- `n = 2` → `2` (1+1, 2)
- `n = 3` → `3` (1+1+1, 1+2, 2+1)

LeetCode 70 · [Link](https://leetcode.com/problems/climbing-stairs/) · *Easy*

## Approach 1: Brute force, naive recursion

`f(n) = f(n-1) + f(n-2)`.

```python
def climb_stairs(n):
    if n <= 2:              # L1: base case
        return n
    return climb_stairs(n - 1) + climb_stairs(n - 2)  # L2: two recursive calls per step
```

**Where the time goes, line by line**

*Variables: n = the input integer (number of stairs).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (base case) | O(1) | O(2ⁿ) leaves | O(2ⁿ) |
| **L2 (two recursive calls)** | **O(1) + subtree cost** | **O(2ⁿ) nodes** | **O(2ⁿ)** ← dominates |

Each call at depth d spawns two more calls, doubling the tree width. The total node count is the Fibonacci-tree size, which grows as O(2ⁿ).

**Complexity**
- **Time:** O(2ⁿ), driven by L2. Exponential, same call tree as Fibonacci.
- **Space:** O(n) recursion stack depth.

## Approach 2: Top-down with memoization

Cache results by `n`.

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def climb_stairs(n):
    if n <= 2:              # L1: base case
        return n
    return climb_stairs(n - 1) + climb_stairs(n - 2)  # L2: two sub-calls, result cached
```

**Where the time goes, line by line**

*Variables: n = the input integer (number of stairs).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (base case) | O(1) | 2 | O(1) |
| **L2 (cached sub-calls)** | **O(1) each** | **n - 2 unique states** | **O(n)** ← dominates |

Each unique `n` is computed once and cached. After that, every subsequent call hits the cache in O(1). The total unique states is n, so all work is O(n).

**Complexity**
- **Time:** O(n), driven by L2 (n unique states, each computed once).
- **Space:** O(n) cache + recursion stack.

## Approach 3: Bottom-up with two variables (optimal)

Only the last two values are needed.

```python
def climb_stairs(n):
    if n <= 2:                    # L1: base case O(1)
        return n
    a, b = 1, 2                   # L2: init f(1), f(2)
    for _ in range(3, n + 1):     # L3: loop runs n-2 times
        a, b = b, a + b           # L4: O(1) update per iteration
    return b
```

**Where the time goes, line by line**

*Variables: n = the input integer (number of stairs).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (base check) | O(1) | 1 | O(1) |
| L2 (init) | O(1) | 1 | O(1) |
| **L3 (loop)** | **O(1)** | **n - 2** | **O(n)** ← dominates |
| L4 (update) | O(1) | n - 2 | O(n) |

The loop runs exactly n - 2 times; each iteration is a fixed-cost swap-and-add. Nothing allocates.

**Complexity**
- **Time:** O(n), driven by L3/L4 (n - 2 iterations).
- **Space:** O(1), just two scalars.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2ⁿ) | O(n) |
| Memoized recursion | O(n) | O(n) |
| **Bottom-up, two vars** | **O(n)** | **O(1)** |

Template for every Fibonacci-shape DP (House Robber, Min Cost Climbing Stairs, Tribonacci, etc.).

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_climbing_stairs.py and run.
# Uses the canonical implementation (Approach 3: bottom-up two variables).

def climb_stairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

def _run_tests():
    assert climb_stairs(1) == 1    # single step: one way
    assert climb_stairs(2) == 2    # (1+1) or (2): two ways
    assert climb_stairs(3) == 3    # (1+1+1),(1+2),(2+1): three ways
    assert climb_stairs(4) == 5
    assert climb_stairs(5) == 8
    assert climb_stairs(10) == 89
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), conceptual DP array (here collapsed to two scalars)
