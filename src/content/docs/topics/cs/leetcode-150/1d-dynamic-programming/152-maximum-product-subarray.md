---
title: "152. Maximum Product Subarray (Medium)"
description: Find the contiguous subarray with the largest product.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums`, find the contiguous subarray (at least one element) with the largest product, and return that product. The answer fits in a 32-bit integer.

**Example**
- `nums = [2, 3, -2, 4]` → `6` (`[2, 3]`)
- `nums = [-2, 0, -1]` → `0`
- `nums = [-2, 3, -4]` → `24` (all three)

LeetCode 152 · [Link](https://leetcode.com/problems/maximum-product-subarray/) · *Medium*

## Approach 1: Brute force, every subarray

For each `(i, j)`, compute the product.

```python
def max_product(nums):
    best = nums[0]                          # L1: O(1) init
    for i in range(len(nums)):             # L2: outer loop, n iterations
        prod = 1                            # L3: O(1) reset
        for j in range(i, len(nums)):      # L4: inner loop, n-i iterations
            prod *= nums[j]                # L5: O(1) multiply
            best = max(best, prod)         # L6: O(1) update
    return best                            # L7: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1, L3, L7 (inits) | O(1) | O(n) total | O(n) |
| L2 (outer loop) | O(1) | n | O(n) |
| L4 (inner loop) | O(1) | n + (n-1) + ... + 1 | O(n²) iters total |
| **L5, L6 (multiply + max)** | **O(1)** | **O(n²)** | **O(n²)** ← dominates |

Every pair `(i, j)` is visited exactly once. No early exit is possible because the product can always recover later (a zero resets it, a pair of negatives flips it positive), so the brute force must evaluate every subarray.

**Complexity**
- **Time:** O(n²), driven by L5/L6 across all O(n²) subarray pairs.
- **Space:** O(1).

## Approach 2: Kadane-like DP tracking max only (WRONG)

First instinct: `dp[i] = max(nums[i], dp[i - 1] * nums[i])`. This fails when a large negative product meets a negative number, the product becomes large positive.

Not a valid approach. Included to motivate Approach 3.

## Approach 3: DP tracking both max AND min at each position (canonical)

Because multiplying a negative makes a big-negative-min into a big-positive-max, we must track both `max_here` and `min_here`.

```python
def max_product(nums):
    max_here = min_here = best = nums[0]   # L1: O(1) init from first element
    for x in nums[1:]:                     # L2: single pass, n-1 iterations
        if x < 0:
            max_here, min_here = min_here, max_here  # L3: O(1) swap on sign flip
        max_here = max(x, max_here * x)    # L4: O(1) extend or restart max
        min_here = min(x, min_here * x)    # L5: O(1) extend or restart min
        best = max(best, max_here)         # L6: O(1) track global best
    return best                            # L7: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| L2 (loop) | O(1) | n - 1 | O(n) |
| L3 (swap) | O(1) | at most n - 1 | O(n) |
| **L4, L5 (max/min update)** | **O(1)** | **n - 1 each** | **O(n)** ← dominates |
| L6, L7 (best + return) | O(1) | n - 1 and 1 | O(n) |

Every line is O(1) per iteration and there is only one loop of length n - 1, so the entire algorithm is O(n). The L3 swap is the key insight: when `x < 0`, the roles of max and min flip before the multiplication, so L4 and L5 always see the right candidates without any branching on the product.

**Complexity**
- **Time:** O(n), driven by L4/L5 across the single pass.
- **Space:** O(1).

### Why swap on negative
When `x < 0`, multiplying by `x` flips order: the previous max becomes the smallest candidate, and the previous min becomes the largest. Swapping max/min before the update captures this cleanly.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Every subarray | O(n²) | O(1) |
| Track max only | O(n) | **wrong** |
| **Track max AND min** | **O(n)** | **O(1)** |

The "track both extremes" pattern also solves problem 978 (Longest Turbulent Subarray) and is a cornerstone of monotonic-signal DP.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_max_product.py and run.
# Uses the canonical implementation (Approach 3: track max and min).

def max_product(nums):
    max_here = min_here = best = nums[0]
    for x in nums[1:]:
        if x < 0:
            max_here, min_here = min_here, max_here
        max_here = max(x, max_here * x)
        min_here = min(x, min_here * x)
        best = max(best, max_here)
    return best

def _run_tests():
    # LeetCode examples
    assert max_product([2, 3, -2, 4]) == 6
    assert max_product([-2, 0, -1]) == 0
    assert max_product([-2, 3, -4]) == 24
    # Edge cases
    assert max_product([0]) == 0
    assert max_product([-3]) == -3
    # Two negatives make a positive
    assert max_product([-2, -3]) == 6
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), running-max/min scalars
