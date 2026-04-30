---
title: "213. House Robber II (Medium)"
description: House Robber but the houses are arranged in a circle, the first and last are adjacent.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Same as House Robber (198), but houses are in a **circle**, the first and last houses are adjacent, so you can't rob both.

**Example**
- `nums = [2, 3, 2]` → `3`
- `nums = [1, 2, 3, 1]` → `4`
- `nums = [1, 2, 3]` → `3`

LeetCode 213 · [Link](https://leetcode.com/problems/house-robber-ii/) · *Medium*

## Approach 1: Brute force, enumerate all non-adjacent subsets

Generate every subset with no two adjacent (including circular adjacency, where house 0 and house n-1 cannot both be picked). Impractical past n ≈ 25.

```python
def rob(nums):
    n = len(nums)
    if n == 1:
        return nums[0]
    best = 0
    for mask in range(1 << n):                              # L1: 2^n subsets
        chosen = [i for i in range(n) if mask & (1 << i)]
        valid = True
        for i in range(len(chosen) - 1):
            if chosen[i + 1] - chosen[i] == 1:              # linear adjacency
                valid = False; break
        if valid and 0 in chosen and (n - 1) in chosen:     # circular adjacency
            valid = False
        if valid:
            best = max(best, sum(nums[i] for i in chosen))
    return best
```

The bitmask enumeration touches 2^n subsets; for each, validating non-adjacency and summing is O(n). Total O(2^n · n).

**Complexity**
- **Time:** O(2ⁿ).
- **Space:** O(n).

## Approach 2: Run House Robber twice, exclude endpoints alternately (canonical)

Either you rob the first house (then you can't rob the last), or you don't (and the last is fine). Run the linear House Robber on `nums[0:-1]` and `nums[1:]`; take the max.

Special-case `n == 1`.

```python
def rob(nums):
    def rob_linear(arr):                         # L1: define helper
        prev2, prev1 = 0, 0                      # L2: O(1) init
        for x in arr:                            # L3: loop over slice length (n-1)
            prev2, prev1 = prev1, max(prev1, prev2 + x)  # L4: O(1) per step
        return prev1                             # L5: O(1) return

    if len(nums) == 1:                           # L6: O(1) edge case
        return nums[0]
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))  # L7: two O(n) calls
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (init) | O(1) | 2 (one per call) | O(1) |
| L3 (loop header) | O(1) | 2(n-1) iterations total | O(n) |
| **L4 (update vars)** | **O(1)** | **2(n-1)** | **O(n)** ← dominates |
| L6 (edge case) | O(1) | 1 | O(1) |
| L7 (two calls + slices) | O(n) slicing + O(n) each call | 1 | O(n) |

Two passes of length n-1 over the input, plus O(n) memory for the two slices. Total work is 2(n-1) iterations = O(n).

**Complexity**
- **Time:** O(n), driven by L4 across two calls (L7).
- **Space:** O(n) for slicing (or O(1) if you pass indices).

## Approach 3: Two-pointer range DP, avoid slicing (optimal space)

Same idea, but iterate with explicit start/end indices instead of creating sliced copies. Drop first house by calling `rob_range(1, n)`, drop last by calling `rob_range(0, n-1)`.

```python
def rob(nums):
    def rob_range(lo, hi):                           # L1: define helper, args are indices
        prev2, prev1 = 0, 0                          # L2: O(1) init
        for i in range(lo, hi):                      # L3: loop hi-lo iterations
            prev2, prev1 = prev1, max(prev1, prev2 + nums[i])  # L4: O(1) per step
        return prev1                                 # L5: O(1) return

    if len(nums) == 1:                               # L6: O(1) edge case
        return nums[0]
    return max(rob_range(0, len(nums) - 1), rob_range(1, len(nums)))  # L7: two O(n) calls
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (init) | O(1) | 2 (one per call) | O(1) |
| L3 (loop header) | O(1) | 2(n-1) iterations total | O(n) |
| **L4 (update vars)** | **O(1)** | **2(n-1)** | **O(n)** ← dominates |
| L6 (edge case) | O(1) | 1 | O(1) |
| L7 (two calls, no slices) | O(n) each call | 1 | O(n) |

Identical time to Approach 2, but the two index arguments replace the two O(n) slice allocations. The only memory used is the two scalar variables inside each `rob_range` call.

**Complexity**
- **Time:** O(n), driven by L4 across two calls (L7).
- **Space:** O(1), no slice copies; only scalar vars.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate subsets | O(2ⁿ) | O(n) |
| Two HouseRobber runs + slice | O(n) | O(n) |
| **Two HouseRobber runs by index** | **O(n)** | **O(1)** |

The "split the circle by fixing one house in/out" trick is common in circular-array DP.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_213_house_robber_ii.py and run.
# Uses the canonical implementation (Approach 3: range-based, O(1) space).

def rob(nums):
    def rob_range(lo, hi):
        prev2, prev1 = 0, 0
        for i in range(lo, hi):
            prev2, prev1 = prev1, max(prev1, prev2 + nums[i])
        return prev1

    if len(nums) == 1:
        return nums[0]
    return max(rob_range(0, len(nums) - 1), rob_range(1, len(nums)))

def _run_tests():
    assert rob([2, 3, 2]) == 3           # LeetCode example 1: can't rob both end houses
    assert rob([1, 2, 3, 1]) == 4        # LeetCode example 2: rob houses 0 and 2
    assert rob([1, 2, 3]) == 3           # LeetCode example 3: rob last house
    assert rob([5]) == 5                  # single house
    assert rob([1, 3]) == 3              # two houses, take larger
    assert rob([2, 7, 9, 3, 1]) == 11   # skip adjacency: 2+9=11 vs 7+3=10 vs 7+1=8
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), input; circular constraint handled by running linear DP on two ranges
