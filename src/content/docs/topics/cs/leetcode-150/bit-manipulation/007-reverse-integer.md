---
title: "7. Reverse Integer (Medium)"
description: Reverse the digits of a signed 32-bit integer, returning 0 on overflow.
parent: bit-manipulation
tags: [leetcode, neetcode-150, math, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing causes the value to go outside the signed 32-bit range `[-2³¹, 2³¹ − 1]`, return `0`.

You are **not** allowed to store 64-bit integers.

**Example**
- `x = 123` → `321`
- `x = -123` → `-321`
- `x = 120` → `21`

LeetCode 7 · [Link](https://leetcode.com/problems/reverse-integer/) · *Medium*

## Approach 1: String manipulation

Convert to string, reverse, handle sign; check range.

```python
def reverse(x):
    sign = -1 if x < 0 else 1              # L1: O(1)
    rev = int(str(abs(x))[::-1]) * sign    # L2: O(log|x|) string ops
    return 0 if rev < -2**31 or rev > 2**31 - 1 else rev  # L3: O(1)
```

**Where the time goes, line by line**

*Variables: d = number of digits in x, d = O(log|x|).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (sign check) | O(1) | 1 | O(1) |
| **L2 (string reverse)** | **O(d)** | **1** | **O(log\|x\|)** ← dominates |
| L3 (range check) | O(1) | 1 | O(1) |

**Complexity**
- **Time:** O(log|x|), driven by L2 (string conversion and reversal over all digits).
- **Space:** O(log|x|) for the reversed string.

Easy, but uses language features that dodge the "no 64-bit int" constraint.

## Approach 2: Digit extraction with overflow check (canonical)

Pop the last digit with `x % 10` and append to a reversed number, checking for overflow *before* the push.

```python
INT_MIN = -2**31
INT_MAX = 2**31 - 1

def reverse(x):
    sign = -1 if x < 0 else 1              # L1: O(1)
    x = abs(x)                             # L2: O(1)
    result = 0
    while x:                               # L3: loop d times (d = digits)
        digit = x % 10                     # L4: O(1)
        x //= 10                           # L5: O(1)
        # pre-check overflow under the target sign
        if sign == 1 and (result > INT_MAX // 10 or (result == INT_MAX // 10 and digit > 7)):
            return 0                        # L6: O(1) overflow guard
        if sign == -1 and (result > -INT_MIN // 10 or (result == -INT_MIN // 10 and digit > 8)):
            return 0                        # L7: O(1) overflow guard
        result = result * 10 + digit       # L8: O(1)
    return sign * result
```

**Where the time goes, line by line**

*Variables: d = number of digits in x, d = O(log|x|).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L2 (init) | O(1) | 1 | O(1) |
| **L3-L8 (digit loop)** | **O(1)** | **d** | **O(log\|x\|)** ← dominates |
| L4-L5 (pop digit) | O(1) | d | O(log\|x\|) |
| L6-L7 (overflow guard) | O(1) | d | O(log\|x\|) |
| L8 (build result) | O(1) | d | O(log\|x\|) |

One iteration per digit; each iteration does O(1) work.

**Complexity**
- **Time:** O(log|x|), driven by L3/L4-L8 (one loop iteration per digit).
- **Space:** O(1).

### Why the overflow check is tricky
`INT_MAX = 2147483647`. Before a push we need `result * 10 + digit ≤ INT_MAX`, i.e., `result < INT_MAX / 10` (then any digit is fine) or `result == INT_MAX / 10 = 214748364` and `digit ≤ 7`. Symmetric condition for negatives (where `-INT_MIN = 2147483648` has last digit 8).

## Approach 3: Simpler check by computing and comparing

If your language allows a 64-bit intermediate (Python always does), you can compute the reversed value and then compare with bounds. Python-only; defeats the purpose of the constraint, but often acceptable in interviews if you articulate the simulated bound.

```python
def reverse(x):
    sign = -1 if x < 0 else 1
    rev = sign * int(str(abs(x))[::-1])
    if rev < -2**31 or rev > 2**31 - 1:
        return 0
    return rev
```

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| String manipulation | O(log\|x\|) | O(log\|x\|) | Shortest |
| **Digit extraction + pre-check** | **O(log\|x\|)** | **O(1)** | Language-agnostic |
| Compute then compare | O(log\|x\|) | O(1) | Needs 64-bit intermediate |

The digit-extraction version with pre-push overflow check is the canonical interview answer, it proves you can reason about bounds under fixed-width arithmetic.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_007.py and run.
# Uses the canonical implementation (Approach 2: digit extraction + pre-check).

INT_MIN = -2**31
INT_MAX = 2**31 - 1

def reverse(x):
    sign = -1 if x < 0 else 1
    x = abs(x)
    result = 0
    while x:
        digit = x % 10
        x //= 10
        if sign == 1 and (result > INT_MAX // 10 or (result == INT_MAX // 10 and digit > 7)):
            return 0
        if sign == -1 and (result > -INT_MIN // 10 or (result == -INT_MIN // 10 and digit > 8)):
            return 0
        result = result * 10 + digit
    return sign * result

def _run_tests():
    assert reverse(123) == 321
    assert reverse(-123) == -321
    assert reverse(120) == 21
    assert reverse(0) == 0
    assert reverse(2**31 - 1) == 0     # MAX_INT reversed overflows
    assert reverse(1534236469) == 0    # overflows after reversal
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- None.
