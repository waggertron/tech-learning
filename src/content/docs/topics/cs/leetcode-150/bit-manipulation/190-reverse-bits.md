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
    for _ in range(32):                     # L1: always 32 iterations
        result = (result << 1) | (n & 1)    # L2: O(1), shift result and OR in LSB
        n >>= 1                             # L3: O(1), shift input right
    return result
```

**Where the time goes, line by line**

*Variables: B = 32 (fixed bit width).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1-L3 (bit loop)** | **O(1)** | **32** | **O(1)** ← dominates (constant) |
| L2 (shift + OR) | O(1) | 32 | O(1) |
| L3 (shift input) | O(1) | 32 | O(1) |

All 32 iterations are constant-time; the whole function is O(1).

**Complexity**
- **Time:** O(32) = O(1), driven by L1/L2/L3 (32 fixed iterations).
- **Space:** O(1).

## Approach 2: String conversion (cheating)

```python
def reverse_bits(n):
    return int(f"{n:032b}"[::-1], 2)        # L1: O(32) format + reverse + parse
```

**Where the time goes, line by line**

*Variables: B = 32 (fixed bit width).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (format + reverse + parse)** | **O(32)** | **1** | **O(1)** ← dominates (constant) |

**Complexity**
- **Time:** O(32) = O(1).
- **Space:** O(32) = O(1) for the string.

Clear and short, but doesn't demonstrate bit mechanics.

## Approach 3: Byte-wise swap with masks (mask-and-swap)

For a fixed-size reversal, use two-way swap on halves: swap 16-bit halves, then 8-bit, then 4-bit, then 2-bit, then 1-bit. Each step uses a constant mask.

```python
def reverse_bits(n):
    n = ((n >> 16) | (n << 16)) & 0xFFFFFFFF           # L1: swap 16-bit halves
    n = ((n & 0xFF00FF00) >> 8) | ((n & 0x00FF00FF) << 8)   # L2: swap bytes
    n = ((n & 0xF0F0F0F0) >> 4) | ((n & 0x0F0F0F0F) << 4)   # L3: swap nibbles
    n = ((n & 0xCCCCCCCC) >> 2) | ((n & 0x33333333) << 2)   # L4: swap pairs
    n = ((n & 0xAAAAAAAA) >> 1) | ((n & 0x55555555) << 1)   # L5: swap individual bits
    return n & 0xFFFFFFFF
```

**Where the time goes, line by line**

*Variables: B = 32 (fixed bit width), 5 mask-and-swap stages.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1-L5 (mask swaps)** | **O(1)** | **5** | **O(1)** ← dominates (constant) |

Five constant-time bitwise operations regardless of input value.

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

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_190.py and run.
# Uses the canonical implementation (Approach 1: bit-by-bit, clearest for verification).

def reverse_bits(n):
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result

def _run_tests():
    assert reverse_bits(0b00000010100101000001111010011100) == 0b00111001011110000010100101000000
    assert reverse_bits(0b11111111111111111111111111111101) == 0b10111111111111111111111111111111
    assert reverse_bits(0) == 0                  # all zeros stay zero
    assert reverse_bits(0xFFFFFFFF) == 0xFFFFFFFF  # all ones stay all ones
    assert reverse_bits(1) == 0x80000000         # single LSB becomes MSB
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- None.
