---
title: "50. Pow(x, n)"
description: Compute x raised to the power n — fast exponentiation.
parent: math-and-geometry
tags: [leetcode, neetcode-150, math, recursion, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Implement `pow(x, n)` — raise `x` to the integer power `n`. `n` can be negative. Use only basic arithmetic (don't call a library `pow`).

**Example**
- `x = 2.0, n = 10` → `1024.0`
- `x = 2.0, n = -2` → `0.25`

LeetCode 50 · [Link](https://leetcode.com/problems/powx-n/) · *Medium*

## Approach 1: Brute force — multiply n times

```python
def my_pow(x, n):
    if n < 0:
        x = 1 / x
        n = -n
    result = 1.0
    for _ in range(n):
        result *= x
    return result
```

**Complexity**
- **Time:** O(|n|).
- **Space:** O(1).

Times out for large `|n|`.

## Approach 2: Recursive exponentiation by squaring (canonical)

`x^n = (x^(n/2))² · (x if n odd else 1)`.

```python
def my_pow(x, n):
    if n < 0:
        x = 1 / x
        n = -n

    def helper(base, exp):
        if exp == 0:
            return 1
        half = helper(base, exp // 2)
        if exp % 2 == 0:
            return half * half
        return half * half * base

    return helper(x, n)
```

**Complexity**
- **Time:** O(log |n|).
- **Space:** O(log |n|) recursion.

## Approach 3: Iterative exponentiation by squaring (optimal)

```python
def my_pow(x, n):
    if n < 0:
        x = 1 / x
        n = -n
    result = 1.0
    while n:
        if n & 1:
            result *= x
        x *= x
        n >>= 1
    return result
```

**Complexity**
- **Time:** O(log |n|).
- **Space:** O(1).

### Why it works
Every integer `n` has a binary expansion. `x^n = prod(x^(2^k))` over the bit positions `k` where `n` has a 1. Iterate the bits, squaring `x` each time; multiply into the result when the current bit is set.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Multiply n times | O(n) | O(1) |
| Recursive squaring | O(log n) | O(log n) |
| **Iterative squaring** | **O(log n)** | **O(1)** |

Fast exponentiation is the template for modular exponentiation (common in number-theory problems), matrix exponentiation (linear recurrences), and Fast Fibonacci.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — bit-based iteration (no auxiliary structure)
