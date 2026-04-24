---
title: "190. Reverse Bits"
description: Reverse the bits of a 32-bit unsigned integer.
parent: bit-manipulation
tags: [leetcode, neetcode-150, bit-manipulation, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Reverse the bits of a given 32-bit unsigned integer.

**Example**
- Input: `00000010100101000001111010011100` → Output: `00111001011110000010100101000000`
- Input: `11111111111111111111111111111101` → Output: `10111111111111111111111111111111`

LeetCode 190 · [Link](https://leetcode.com/problems/reverse-bits/) · *Easy*

## Approach 1: Bit-by-bit shift

```python
def reverse_bits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result
```

**Complexity**
- **Time:** O(32) = O(1).
- **Space:** O(1).

## Approach 2: String conversion (cheating)

```python
def reverse_bits(n):
    return int(f"{n:032b}"[::-1], 2)
```

**Complexity**
- **Time:** O(32).
- **Space:** O(32).

Clear and short, but doesn't demonstrate bit mechanics.

## Approach 3: Byte-wise swap with masks (mask-and-swap)

For a fixed-size reversal, use two-way swap on halves: swap 16-bit halves, then 8-bit, then 4-bit, then 2-bit, then 1-bit. Each step uses a constant mask.

```python
def reverse_bits(n):
    n = ((n >> 16) | (n << 16)) & 0xFFFFFFFF
    n = ((n & 0xFF00FF00) >> 8) | ((n & 0x00FF00FF) << 8)
    n = ((n & 0xF0F0F0F0) >> 4) | ((n & 0x0F0F0F0F) << 4)
    n = ((n & 0xCCCCCCCC) >> 2) | ((n & 0x33333333) << 2)
    n = ((n & 0xAAAAAAAA) >> 1) | ((n & 0x55555555) << 1)
    return n & 0xFFFFFFFF
```

**Complexity**
- **Time:** O(1). Constant number of bitwise operations.
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Bit-by-bit | O(32) | O(1) |
| String reversal | O(32) | O(32) |
| **Mask-and-swap** | **O(1)** | **O(1)** |

Mask-and-swap is the classic "known-width bit reversal" trick, also used in FFT bit-reversal permutations.

## Related data structures

- None.
