---
title: "66. Plus One"
description: Add 1 to a non-negative integer represented as a digit array.
parent: math-and-geometry
tags: [leetcode, neetcode-150, math, arrays, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You're given an integer represented as a non-empty array of digits (most-significant first). Add 1 to it and return the resulting array.

**Example**
- `digits = [1, 2, 3]` → `[1, 2, 4]`
- `digits = [9, 9, 9]` → `[1, 0, 0, 0]`

LeetCode 66 · [Link](https://leetcode.com/problems/plus-one/) · *Easy*

## Approach 1: Convert to int, add, reconvert

Works in Python because `int` is arbitrary-precision.

```python
def plus_one(digits):
    n = int("".join(map(str, digits))) + 1  # L1: O(n) join + convert
    return [int(d) for d in str(n)]         # L2: O(n) convert back
```

**Where the time goes, line by line**

*Variables: n = len(digits).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (join + int convert)** | **O(n)** | **1** | **O(n)** ← dominates |
| L2 (str convert + list) | O(n) | 1 | O(n) |

**Complexity**
- **Time:** O(n), driven by L1/L2 (string conversion passes over all digits).
- **Space:** O(n).

Fails in languages with fixed integer widths past ~10 digits.

## Approach 2: Walk right to left with carry (canonical)

Standard grade-school addition, handling the all-nines case.

```python
def plus_one(digits):
    for i in range(len(digits) - 1, -1, -1):    # L1: walk right to left
        if digits[i] < 9:                        # L2: O(1)
            digits[i] += 1                       # L3: O(1), no carry needed
            return digits
        digits[i] = 0                            # L4: O(1), carry continues
    return [1] + digits                          # L5: O(n), all nines case
```

**Where the time goes, line by line**

*Variables: n = len(digits).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (walk loop)** | **O(1)** | **up to n** | **O(n)** ← dominates |
| L2-L4 (carry logic) | O(1) | up to n | O(n) |
| L5 (prepend 1, all-nines) | O(n) | at most 1 | O(n) |

Best case: one step (last digit < 9). Worst case: all nines, walk all n digits then prepend.

**Complexity**
- **Time:** O(n), driven by L1/L2/L3/L4 (right-to-left carry walk).
- **Space:** O(1) extra (worst case one extra digit).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Convert to int | O(n) | O(n) |
| **Digit-by-digit carry** | **O(n)** | **O(1)** |

The digit-carry approach is language-agnostic and generalizes to problems like Add Binary (67) and Plus One Linked List (369).

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_066.py and run.
# Uses the canonical implementation (Approach 2: right-to-left carry).

def plus_one(digits):
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    return [1] + digits

def _run_tests():
    assert plus_one([1, 2, 3]) == [1, 2, 4]
    assert plus_one([9, 9, 9]) == [1, 0, 0, 0]
    assert plus_one([0]) == [1]                   # single zero
    assert plus_one([9]) == [1, 0]                # single nine
    assert plus_one([1, 0, 9]) == [1, 1, 0]       # carry in middle
    assert plus_one([4, 3, 2, 1]) == [4, 3, 2, 2] # no carry
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), digit array; carry propagation
