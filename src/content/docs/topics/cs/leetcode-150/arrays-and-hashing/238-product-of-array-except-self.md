---
title: "238. Product of Array Except Self (Medium)"
description: Return an array where each element is the product of all other elements, without using division.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, arrays, prefix-suffix, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums`, return an array `answer` such that `answer[i]` equals the product of all elements of `nums` except `nums[i]`.

The algorithm must run in O(n) time **and must not use the division operation**. Follow-up: can you solve in O(1) extra space (the output array doesn't count)?

**Example**
- `nums = [1, 2, 3, 4]` → `[24, 12, 8, 6]`
- `nums = [-1, 1, 0, -3, 3]` → `[0, 0, 9, 0, 0]`

LeetCode 238 · [Link](https://leetcode.com/problems/product-of-array-except-self/) · *Medium*

## Approach 1: Brute force, nested product

For each `i`, multiply all other elements.

```python
def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)                              # L1: O(1)
    answer = [0] * n                           # L2: O(n)
    for i in range(n):                         # L3: outer loop, n iterations
        prod = 1                               # L4: O(1) reset
        for j in range(n):                     # L5: inner loop, n iterations
            if j != i:                         # L6: O(1) guard
                prod *= nums[j]                # L7: O(1) multiply
        answer[i] = prod                       # L8: O(1) assign
    return answer
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (init output) | O(n) | 1 | O(n) |
| L3 (outer loop) | O(1) | n | O(n) |
| **L5, L7 (inner loop + multiply)** | **O(1)** | **n² total** | **O(n²)** ← dominates |
| L8 (assign) | O(1) | n | O(n) |

The nested multiply gives exactly n*(n-1) multiplications.

**Complexity**
- **Time:** O(n²), driven by L5/L7 (nested loop multiplications).
- **Space:** O(1) excluding the output.

Too slow for the problem's stated constraint but useful as a sanity check.

## Approach 2: Prefix and suffix products (two auxiliary arrays)

`answer[i]` = (product of everything left of `i`) × (product of everything right of `i`).

Compute both in O(n) and combine.

```python
def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)                              # L1: O(1)
    prefix = [1] * n                           # L2: O(n)
    suffix = [1] * n                           # L3: O(n)

    for i in range(1, n):                      # L4: forward pass, n-1 steps
        prefix[i] = prefix[i - 1] * nums[i - 1]  # L5: O(1)

    for i in range(n - 2, -1, -1):            # L6: backward pass, n-1 steps
        suffix[i] = suffix[i + 1] * nums[i + 1]  # L7: O(1)

    return [prefix[i] * suffix[i] for i in range(n)]  # L8: O(n)
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2, L3 (init arrays) | O(n) | 1 each | O(n) |
| **L4, L5 (prefix pass)** | **O(1)** | **n-1** | **O(n)** |
| **L6, L7 (suffix pass)** | **O(1)** | **n-1** | **O(n)** |
| L8 (combine) | O(1) per element | n | O(n) |

Three linear passes, each O(n). All three contribute equally; none dominates asymptotically.

**Complexity**
- **Time:** O(n), driven by the three linear passes (L4/L5, L6/L7, L8).
- **Space:** O(n) for the two auxiliary arrays.

## Approach 3: Space-optimized (O(1) extra space)

Reuse the output array for the prefix pass; track the suffix product as a single running scalar on a second pass.

```python
def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)                              # L1: O(1)
    answer = [1] * n                           # L2: O(n) output array

    # First pass: answer[i] = product of all elements left of i
    for i in range(1, n):                      # L3: n-1 steps
        answer[i] = answer[i - 1] * nums[i - 1]  # L4: O(1)

    # Second pass: multiply by product of all elements right of i
    suffix = 1                                 # L5: O(1) running scalar
    for i in range(n - 1, -1, -1):            # L6: n steps, right to left
        answer[i] *= suffix                    # L7: O(1) multiply-in-place
        suffix *= nums[i]                      # L8: O(1) extend suffix product

    return answer
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (init output) | O(n) | 1 | O(n) |
| **L3, L4 (prefix pass)** | **O(1)** | **n-1** | **O(n)** |
| L5 (init suffix) | O(1) | 1 | O(1) |
| **L6, L7, L8 (suffix pass)** | **O(1)** | **n-1** | **O(n)** |

Two linear passes, no auxiliary arrays. The suffix accumulator eliminates the need for a separate `suffix[]` array.

**Complexity**
- **Time:** O(n), driven by L3/L4 and L6/L7/L8 (two linear passes).
- **Space:** O(1) extra (the output array is not counted per the problem).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Nested product | O(n²) | O(1) |
| Prefix + suffix arrays | O(n) | O(n) |
| **Space-optimized** | **O(n)** | **O(1)** extra |

Division would give an O(n) single-pass solution, forbidden here because of how it handles zeros (and to force the prefix/suffix idea, which generalizes to many problems).

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_product_except_self.py and run.
# Uses the canonical implementation (Approach 3: space-optimized).

def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    answer = [1] * n
    for i in range(1, n):
        answer[i] = answer[i - 1] * nums[i - 1]
    suffix = 1
    for i in range(n - 1, -1, -1):
        answer[i] *= suffix
        suffix *= nums[i]
    return answer

def _run_tests():
    assert product_except_self([1, 2, 3, 4]) == [24, 12, 8, 6]
    assert product_except_self([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0]
    assert product_except_self([1, 1]) == [1, 1]
    assert product_except_self([2, 3]) == [3, 2]
    assert product_except_self([1, 0]) == [0, 1]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), input and output; classic prefix/suffix-product pattern
