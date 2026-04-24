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

## Approach 1: Brute force — naive recursion

`f(n) = f(n-1) + f(n-2)`.

```python
def climb_stairs(n):
    if n <= 2:
        return n
    return climb_stairs(n - 1) + climb_stairs(n - 2)
```

**Complexity**
- **Time:** O(2ⁿ). Exponential — same call tree as Fibonacci.
- **Space:** O(n) recursion.

## Approach 2: Top-down with memoization

Cache results by `n`.

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def climb_stairs(n):
    if n <= 2:
        return n
    return climb_stairs(n - 1) + climb_stairs(n - 2)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) cache + recursion.

## Approach 3: Bottom-up with two variables (optimal)

Only the last two values are needed.

```python
def climb_stairs(n):
    if n <= 2:
        return n
    a, b = 1, 2   # f(1), f(2)
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2ⁿ) | O(n) |
| Memoized recursion | O(n) | O(n) |
| **Bottom-up, two vars** | **O(n)** | **O(1)** |

Template for every Fibonacci-shape DP (House Robber, Min Cost Climbing Stairs, Tribonacci, etc.).

## Related data structures

- [Arrays](../../../data-structures/arrays/) — conceptual DP array (here collapsed to two scalars)
