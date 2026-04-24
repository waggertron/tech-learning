---
title: "191. Number of 1 Bits"
description: Count the set bits in an unsigned 32-bit integer (popcount / Hamming weight).
parent: bit-manipulation
tags: [leetcode, neetcode-150, bit-manipulation, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Write a function that takes an unsigned integer and returns the number of `1` bits it has (popcount).

**Example**
- `n = 0b1011` → `3`
- `n = 0b10000000` → `1`

LeetCode 191 · [Link](https://leetcode.com/problems/number-of-1-bits/) · *Easy*

## Approach 1: Shift and test each bit

```python
def hamming_weight(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count
```

**Complexity**
- **Time:** O(B) where B = number of bits (32 for this problem).
- **Space:** O(1).

## Approach 2: Brian Kernighan's trick (canonical)

`n & (n - 1)` clears the lowest set bit. Loop until `n == 0`.

```python
def hamming_weight(n):
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count
```

**Complexity**
- **Time:** O(popcount). Iterations = number of set bits.
- **Space:** O(1).

Faster than Approach 1 when the integer has few set bits.

## Approach 3: Built-in / bit-parallel tricks

Modern hardware has popcount instructions. Python's `bin(n).count('1')` or `n.bit_count()` (Python 3.10+) compiles to that on supporting platforms.

```python
def hamming_weight(n):
    return n.bit_count()
```

**Complexity**
- **Time:** O(1) on most modern hardware, O(B) worst.
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Shift + test | O(B) | O(1) |
| **Kernighan (`n &= n - 1`)** | **O(popcount)** | **O(1)** |
| Built-in `bit_count` | O(1) on modern HW | O(1) |

Kernighan's is the interview-canonical trick. Know it for problem 338 and any "count bits" variant.

## Related data structures

- None — pure bit arithmetic.
