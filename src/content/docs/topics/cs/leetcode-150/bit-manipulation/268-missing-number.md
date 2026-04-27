---
title: "268. Missing Number (Easy)"
description: Find the missing number from an array of distinct numbers in [0, n].
parent: bit-manipulation
tags: [leetcode, neetcode-150, bit-manipulation, math, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an array `nums` containing `n` distinct numbers in `[0, n]`, return the single number missing from the range.

**Example**
- `nums = [3, 0, 1]` → `2`
- `nums = [0, 1]` → `2`
- `nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]` → `8`

LeetCode 268 · [Link](https://leetcode.com/problems/missing-number/) · *Easy*

## Approach 1: Hash set

Put everything into a set, then scan `[0, n]` for the missing value.

```python
def missing_number(nums):
    s = set(nums)                           # L1: O(n)
    for i in range(len(nums) + 1):          # L2: scan 0..n
        if i not in s:                      # L3: O(1) amortized
            return i
    return -1
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (build set)** | **O(1)** | **n** | **O(n)** ← dominates |
| L2-L3 (scan) | O(1) | n+1 | O(n) |

**Complexity**
- **Time:** O(n), driven by L1/L2/L3 (one pass to build set, one to scan).
- **Space:** O(n) for the set.

## Approach 2: Sum formula

Expected sum of `[0, n]` is `n(n + 1)/2`. Missing = expected - actual.

```python
def missing_number(nums):
    n = len(nums)                           # L1: O(1)
    return n * (n + 1) // 2 - sum(nums)    # L2: O(n)
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (get length) | O(1) | 1 | O(1) |
| **L2 (sum)** | **O(n)** | **1** | **O(n)** ← dominates |

**Complexity**
- **Time:** O(n), driven by L2 (summing all elements).
- **Space:** O(1).

Risk of overflow in fixed-width languages for large n (not an issue in Python).

## Approach 3: XOR of indices and values (optimal, overflow-safe)

XOR all values 0…n with all array elements. Pairs cancel; missing remains.

```python
def missing_number(nums):
    result = len(nums)                      # L1: O(1), start with n
    for i, x in enumerate(nums):            # L2: single pass, n iterations
        result ^= i ^ x                     # L3: O(1), cancel paired values
    return result
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init with n) | O(1) | 1 | O(1) |
| **L2, L3 (XOR loop)** | **O(1)** | **n** | **O(n)** ← dominates |

A single pass; each element and index are XORed in once.

**Complexity**
- **Time:** O(n), driven by L2/L3 (single XOR pass).
- **Space:** O(1).

### Why it works
Result starts at `n`. We XOR in every index 0..n-1 and every value from `nums`. Every number from 0..n except the missing one appears exactly twice (once as an index, once as a value); each cancels to 0. The initial `n` and the missing value survive, but `n` is also present as an index of the initial XOR, so it cancels unless it's the missing one... Actually here's the clean reading: we start with `n`, then XOR in all i and all nums[i]; the set `{0..n} ∪ {all nums}` has every value except the missing appearing an even number of times. Net result = missing.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Hash set | O(n) | O(n) | Straightforward |
| Sum formula | O(n) | O(1) | Overflow-sensitive |
| **XOR** | **O(n)** | **O(1)** | Overflow-safe |

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_268.py and run.
# Uses the canonical implementation (Approach 3: XOR).

def missing_number(nums):
    result = len(nums)
    for i, x in enumerate(nums):
        result ^= i ^ x
    return result

def _run_tests():
    assert missing_number([3, 0, 1]) == 2
    assert missing_number([0, 1]) == 2
    assert missing_number([9, 6, 4, 2, 3, 5, 7, 0, 1]) == 8
    assert missing_number([0]) == 1         # missing 1
    assert missing_number([1]) == 0         # missing 0, edge case
    assert missing_number([0, 1, 2, 4, 5]) == 3  # missing middle
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- None; pure arithmetic.
