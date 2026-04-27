---
title: "43. Multiply Strings (Medium)"
description: Multiply two non-negative integers represented as strings.
parent: math-and-geometry
tags: [leetcode, neetcode-150, math, strings, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two non-negative integers `num1` and `num2` represented as strings, return their product as a string. You must not convert to integers directly (simulate the arithmetic).

**Example**
- `num1 = "2", num2 = "3"` → `"6"`
- `num1 = "123", num2 = "456"` → `"56088"`

LeetCode 43 · [Link](https://leetcode.com/problems/multiply-strings/) · *Medium*

## Approach 1: Big-integer via int() (cheating)

Not permitted by the problem, but shown for contrast.

```python
def multiply(num1, num2):
    return str(int(num1) * int(num2))
```

**Complexity**
- **Time:** O(n · m) ish.
- **Space:** O(n + m).

## Approach 2: Schoolbook multiplication on digit arrays (canonical)

`result[i + j + 1]` accumulates `num1[i] * num2[j]` with carries propagated at the end.

```python
def multiply(num1, num2):
    if num1 == "0" or num2 == "0":              # L1: O(1) early exit
        return "0"
    n, m = len(num1), len(num2)                 # L2: O(1)
    result = [0] * (n + m)                      # L3: O(n + m)
    for i in range(n - 1, -1, -1):              # L4: outer loop, n iterations
        for j in range(m - 1, -1, -1):          # L5: inner loop, m iterations
            prod = int(num1[i]) * int(num2[j])  # L6: O(1)
            p1, p2 = i + j, i + j + 1          # L7: O(1)
            total = prod + result[p2]           # L8: O(1)
            result[p2] = total % 10             # L9: O(1)
            result[p1] += total // 10           # L10: O(1)

    # Strip leading zeros
    start = 0
    while start < len(result) and result[start] == 0:
        start += 1                              # L11: O(n + m)
    return "".join(map(str, result[start:]))    # L12: O(n + m)
```

**Where the time goes, line by line**

*Variables: n = len(num1), m = len(num2).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3 (init result) | O(1) | n + m | O(n + m) |
| **L4, L5 (nested loops)** | **O(1)** | **n * m** | **O(n · m)** ← dominates |
| L6-L10 (digit multiply + carry) | O(1) | n * m | O(n · m) |
| L11-L12 (strip + join) | O(1) | n + m | O(n + m) |

Every pair of digit positions (i, j) is visited exactly once; there are n * m such pairs.

**Complexity**
- **Time:** O(n · m), driven by L4/L5/L6-L10 (the nested digit-multiply loop).
- **Space:** O(n + m) for the result array.

### Why `p1, p2 = i + j, i + j + 1` works
In schoolbook multiplication, the product of two digits at positions `i` (from num1) and `j` (from num2) contributes to positions `i + j` (carry) and `i + j + 1` (units) of the result. Carries propagate leftward during accumulation.

## Approach 3: Karatsuba (divide and conquer)

O(n^log₂3) ≈ O(n^1.585). Rarely worth the code in an interview but known as "the first better-than-quadratic integer multiplication."

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Cast to int | O(n + m) | O(n + m) |
| **Schoolbook** | **O(n · m)** | **O(n + m)** |
| Karatsuba | O(n^1.585) | O(n) |

Schoolbook is the canonical interview answer. Know the `i + j + 1` positional index.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_043.py and run.
# Uses the canonical implementation (Approach 2: schoolbook multiplication).

def multiply(num1, num2):
    if num1 == "0" or num2 == "0":
        return "0"
    n, m = len(num1), len(num2)
    result = [0] * (n + m)
    for i in range(n - 1, -1, -1):
        for j in range(m - 1, -1, -1):
            prod = int(num1[i]) * int(num2[j])
            p1, p2 = i + j, i + j + 1
            total = prod + result[p2]
            result[p2] = total % 10
            result[p1] += total // 10
    start = 0
    while start < len(result) and result[start] == 0:
        start += 1
    return "".join(map(str, result[start:]))

def _run_tests():
    assert multiply("2", "3") == "6"
    assert multiply("123", "456") == "56088"
    assert multiply("0", "12345") == "0"
    assert multiply("99", "99") == "9801"
    assert multiply("1", "1") == "1"
    assert multiply("9999", "9999") == "99980001"
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Strings](../../../data-structures/strings/), digit strings
- [Arrays](../../../data-structures/arrays/), result accumulator
