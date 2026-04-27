---
title: "371. Sum of Two Integers"
description: Compute a + b without using + or - using only bitwise operations.
parent: bit-manipulation
tags: [leetcode, neetcode-150, bit-manipulation, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Calculate the sum of two integers `a` and `b` without using the `+` or `-` operators.

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
    for i in range(32):                         # L1: always 32 iterations
        bit_a = (a >> i) & 1                    # L2: O(1)
        bit_b = (b >> i) & 1                    # L3: O(1)
        result |= ((bit_a ^ bit_b ^ carry) & 1) << i  # L4: O(1), sum bit
        carry = (bit_a & bit_b) | (bit_a & carry) | (bit_b & carry)  # L5: O(1)
    # Two's complement fix for negatives
    return result if result < (1 << 31) else result - (1 << 32)
```

**Where the time goes, line by line**

*Variables: B = 32 (fixed bit width).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1-L5 (bit loop)** | **O(1)** | **32** | **O(1)** ← dominates (constant) |
| L2-L3 (extract bits) | O(1) | 32 | O(1) |
| L4-L5 (sum + carry) | O(1) | 32 | O(1) |

All 32 iterations are O(1); the whole function is effectively O(1).

**Complexity**
- **Time:** O(32) = O(1), driven by L1/L2-L5 (32 fixed iterations of full-adder logic).
- **Space:** O(1).

## Approach 2: XOR + carry loop (canonical)

`a ^ b` is "sum without carry." `(a & b) << 1` is "the carry." Iterate until carry is 0.

In Python, integers are arbitrary-width, so we mask to 32 bits to simulate C-like overflow.

```python
def get_sum(a, b):
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF
    while b != 0:                               # L1: loop at most 32 times
        a, b = (a ^ b) & MASK, ((a & b) << 1) & MASK  # L2: O(1) per iter
    return a if a <= MAX_INT else ~(a ^ MASK)   # L3: O(1) sign correction
```

**Where the time goes, line by line**

*Variables: B = 32 (fixed bit width); loop terminates in at most B iterations.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1, L2 (carry loop)** | **O(1)** | **at most 32** | **O(1)** ← dominates (constant) |
| L3 (sign correction) | O(1) | 1 | O(1) |

Each iteration shifts the carry left by one bit; after at most 32 iterations the carry falls off the 32-bit window.

**Complexity**
- **Time:** O(32) = O(1), driven by L1/L2 (at most 32 carry-propagation iterations).
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

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_371.py and run.
# Uses the canonical implementation (Approach 2: XOR + carry loop).

def get_sum(a, b):
    MASK = 0xFFFFFFFF
    MAX_INT = 0x7FFFFFFF
    while b != 0:
        a, b = (a ^ b) & MASK, ((a & b) << 1) & MASK
    return a if a <= MAX_INT else ~(a ^ MASK)

def _run_tests():
    assert get_sum(1, 2) == 3
    assert get_sum(2, 3) == 5
    assert get_sum(0, 0) == 0              # edge: both zero
    assert get_sum(-1, 1) == 0             # edge: cancel to zero
    assert get_sum(-5, 3) == -2            # negative result
    assert get_sum(2**30, 2**30) == 2**31  # large positive (fits in 64-bit Python int)
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- None.
