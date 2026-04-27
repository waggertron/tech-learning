---
title: "136. Single Number"
description: Find the element that appears once in an array where every other element appears twice.
parent: bit-manipulation
tags: [leetcode, neetcode-150, bit-manipulation, xor, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a non-empty array of integers `nums` where every element appears twice except for one, find that single one. Solve in O(n) time and **O(1) extra space**.

**Example**
- `nums = [2, 2, 1]` → `1`
- `nums = [4, 1, 2, 1, 2]` → `4`
- `nums = [1]` → `1`

LeetCode 136 · [Link](https://leetcode.com/problems/single-number/) · *Easy*

## Approach 1: Hash set

Track elements; add on first sight, remove on second. The remainder is the answer.

```python
def single_number(nums):
    seen = set()                            # L1: O(1)
    for x in nums:                          # L2: single pass, n iterations
        if x in seen:
            seen.remove(x)                  # L3: O(1) amortized
        else:
            seen.add(x)                     # L4: O(1) amortized
    return seen.pop()                       # L5: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L2-L4 (scan)** | **O(1)** | **n** | **O(n)** ← dominates |
| L5 (pop) | O(1) | 1 | O(1) |

**Complexity**
- **Time:** O(n), driven by L2/L3/L4 (single pass over all elements).
- **Space:** O(n) for the set.

Violates the O(1) space constraint.

## Approach 2: Sort + scan pairs

Sort; any non-pair is the answer.

```python
def single_number(nums):
    nums.sort()                             # L1: O(n log n)
    for i in range(0, len(nums) - 1, 2):   # L2: scan in steps of 2
        if nums[i] != nums[i + 1]:         # L3: O(1)
            return nums[i]
    return nums[-1]                         # L4: last element is single
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (sort)** | **O(n log n)** | **1** | **O(n log n)** ← dominates |
| L2-L3 (pair scan) | O(1) | n/2 | O(n) |

**Complexity**
- **Time:** O(n log n), driven by L1 (sorting).
- **Space:** O(1) with in-place sort.

## Approach 3: XOR everything (optimal)

`a ^ a = 0` and `a ^ 0 = a`. XOR all elements; duplicates cancel, leaving the unique.

```python
def single_number(nums):
    result = 0                              # L1: O(1)
    for x in nums:                          # L2: single pass, n iterations
        result ^= x                         # L3: O(1), XOR accumulate
    return result

# Or:
# from functools import reduce
# from operator import xor
# return reduce(xor, nums)
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| **L2, L3 (XOR loop)** | **O(1)** | **n** | **O(n)** ← dominates |

A single pass; each element is XORed in once.

**Complexity**
- **Time:** O(n), driven by L2/L3 (single XOR pass).
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Hash set | O(n) | O(n) |
| Sort + scan | O(n log n) | O(1) |
| **XOR** | **O(n)** | **O(1)** |

XOR is the canonical bit-manipulation move, memorize it. Variants (Single Number II with triples, III with two singletons) build on this.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_136.py and run.
# Uses the canonical implementation (Approach 3: XOR).

def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result

def _run_tests():
    assert single_number([2, 2, 1]) == 1
    assert single_number([4, 1, 2, 1, 2]) == 4
    assert single_number([1]) == 1                      # single element edge case
    assert single_number([0, 0, 99]) == 99              # zero appears twice
    assert single_number([-1, -1, 42]) == 42            # negative numbers
    assert single_number([2**31 - 1]) == 2**31 - 1      # max int, single element
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), input; XOR accumulator (no extra structures)
