---
title: "371. Sum of Two Integers"
description: Compute a + b without using + or − - using only bitwise operations.
parent: bit-manipulation
tags: [leetcode, neetcode-150, bit-manipulation, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Calculate the sum of two integers `a` and `b` without using the `+` or `−` operators.

**Example**
- `a = 1, b = 2` → `3`
- `a = 2, b = 3` → `5`

LeetCode 371 · [Link](https://leetcode.com/problems/sum-of-two-integers/) · *Medium*

## Approach 1: Bit-by-bit with carry (language-agnostic)

Simulate a full-adder one bit at a time over 32 bits.

```python
def get_sum(a, b):
    MASK = 0xFFFFFFFF
    result = 0
    carry = 0
    for i in range(32):
        bit_a = (a >> i) & 1
        bit_b = (b >> i) & 1
        result |= ((bit_a ^ bit_b ^ carry) & 1) << i
        carry = (bit_a & bit_b) | (bit_a & carry) | (bit_b & carry)
    # Two's complement fix for negatives
    return result if result < (1 << 31) else result, (1 << 32)
```

**Complexity**
- **Time:** O(32).
- **Space:** O(1).

## Approach 2: XOR + carry loop (canonical)

`a ^ b` is "sum without carry." `(a & b) << 1` is "the carry." Iterate until carry is 0.

In Python, integers are arbitrary-width, so we mask to 32 bits to simulate C-like overflow.

```python
def get_sum(a, b):
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF
    while b != 0:
        a, b = (a ^ b) & MASK, ((a & b) << 1) & MASK
    return a if a <= MAX_INT else ~(a ^ MASK)
```

**Complexity**
- **Time:** O(32).
- **Space:** O(1).

The final `if a <= MAX_INT else ~(a ^ MASK)` converts back from unsigned 32-bit to Python's signed integer.

## Approach 3: Python built-ins (cheating)

```python
def get_sum(a, b):
    return sum([a, b])
```

Doesn't satisfy the problem, but shown for completeness.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Bit-by-bit full adder | O(32) | O(1) | Explicit and clear |
| **XOR + carry loop** | **O(32)** | **O(1)** | Canonical |
| `sum(...)` | O(1) | O(1) | Not allowed by the problem |

The XOR + carry loop is the classic bitwise-arithmetic pattern. Same core idea simulates subtraction, multiplication, and division with only `&`, `|`, `^`, and shifts.

## Related data structures

- None.
