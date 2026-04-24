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
    n = int("".join(map(str, digits))) + 1
    return [int(d) for d in str(n)]
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

Fails in languages with fixed integer widths past ~10 digits.

## Approach 2: Walk right to left with carry (canonical)

Standard grade-school addition, handling the all-nines case.

```python
def plus_one(digits):
    for i in range(len(digits) - 1, -1, -1):
        if digits[i] < 9:
            digits[i] += 1
            return digits
        digits[i] = 0
    return [1] + digits
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1) extra (worst case one extra digit).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Convert to int | O(n) | O(n) |
| **Digit-by-digit carry** | **O(n)** | **O(1)** |

The digit-carry approach is language-agnostic and generalizes to problems like Add Binary (67) and Plus One Linked List (369).

## Related data structures

- [Arrays](../../../data-structures/arrays/) — digit array; carry propagation
