---
title: "50. Pow(x, n) (Medium)"
description: Compute x raised to the power n, fast exponentiation.
parent: math-and-geometry
tags: [leetcode, neetcode-150, math, recursion, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Implement `pow(x, n)`, raise `x` to the integer power `n`. `n` can be negative. Use only basic arithmetic (don't call a library `pow`).

**Example**
- `x = 2.0, n = 10` → `1024.0`
- `x = 2.0, n = -2` → `0.25`

LeetCode 50 · [Link](https://leetcode.com/problems/powx-n/) · *Medium*

## Approach 1: Brute force, multiply n times

```python
def my_pow(x, n):
    if n < 0:               # L1: O(1)
        x = 1 / x           # L2: O(1)
        n = -n              # L3: O(1)
    result = 1.0
    for _ in range(n):      # L4: loop |n| times
        result *= x         # L5: O(1)
    return result
```

**Where the time goes, line by line**

*Variables: n = the exponent (absolute value used for iteration).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L3 (sign handling) | O(1) | 1 | O(1) |
| **L4, L5 (multiply loop)** | **O(1)** | **\|n\|** | **O(\|n\|)** ← dominates |

Every multiplication is O(1); the loop runs |n| times.

**Complexity**
- **Time:** O(|n|), driven by L4/L5 (one multiply per exponent bit position).
- **Space:** O(1).

Times out for large `|n|`.

## Approach 2: Recursive exponentiation by squaring (canonical)

`x^n = (x^(n/2))² · (x if n odd else 1)`.

```python
def my_pow(x, n):
    if n < 0:                           # L1: O(1)
        x = 1 / x                       # L2: O(1)
        n = -n                          # L3: O(1)

    def helper(base, exp):
        if exp == 0:
            return 1                    # L4: base case O(1)
        half = helper(base, exp // 2)   # L5: recurse on half exponent
        if exp % 2 == 0:
            return half * half          # L6: O(1)
        return half * half * base       # L7: O(1) for odd exp

    return helper(x, n)
```

**Where the time goes, line by line**

*Variables: n = the exponent (absolute value).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L4 (base case) | O(1) | 1 | O(1) |
| **L5 (recursive halving)** | **O(1) per level** | **log n levels** | **O(log n)** ← dominates |
| L6, L7 (squaring) | O(1) | log n | O(log n) |

Each recursive call halves the exponent; there are log n levels, each doing O(1) work.

**Complexity**
- **Time:** O(log |n|), driven by L5 (halving the exponent at each level).
- **Space:** O(log |n|) recursion stack depth.

## Approach 3: Iterative exponentiation by squaring (optimal)

```python
def my_pow(x, n):
    if n < 0:               # L1: O(1)
        x = 1 / x           # L2: O(1)
        n = -n              # L3: O(1)
    result = 1.0            # L4: O(1)
    while n:                # L5: loop log n times
        if n & 1:
            result *= x     # L6: O(1), multiply in if odd bit
        x *= x              # L7: O(1), square x each iteration
        n >>= 1             # L8: O(1), shift to next bit
    return result
```

**Where the time goes, line by line**

*Variables: n = the exponent (absolute value).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L4 (setup) | O(1) | 1 | O(1) |
| **L5-L8 (bit loop)** | **O(1)** | **log n** | **O(log n)** ← dominates |
| L6 (conditional multiply) | O(1) | at most log n | O(log n) |
| L7 (square) | O(1) | log n | O(log n) |

The while loop iterates once per bit in `n`; there are log n bits.

**Complexity**
- **Time:** O(log |n|), driven by L5/L6/L7/L8 (one iteration per bit of the exponent).
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

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_050.py and run.
# Uses the canonical implementation (Approach 3: iterative squaring).

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

def _run_tests():
    assert abs(my_pow(2.0, 10) - 1024.0) < 1e-9
    assert abs(my_pow(2.0, -2) - 0.25) < 1e-9
    assert abs(my_pow(2.0, 0) - 1.0) < 1e-9      # anything^0 = 1
    assert abs(my_pow(1.0, 1000000) - 1.0) < 1e-9  # large exponent on 1
    assert abs(my_pow(0.0, 5) - 0.0) < 1e-9      # 0^n = 0 for n > 0
    assert abs(my_pow(2.0, 1) - 2.0) < 1e-9
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), bit-based iteration (no auxiliary structure)
