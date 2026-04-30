---
title: "300. Longest Increasing Subsequence (Medium)"
description: Find the length of the longest strictly increasing subsequence.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, binary-search, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `nums`, return the length of the **longest strictly increasing subsequence**.

**Example**
- `nums = [10, 9, 2, 5, 3, 7, 101, 18]` → `4` (`[2, 3, 7, 101]`)
- `nums = [0, 1, 0, 3, 2, 3]` → `4`
- `nums = [7, 7, 7, 7]` → `1`

Follow-up: can you do it in O(n log n)?

LeetCode 300 · [Link](https://leetcode.com/problems/longest-increasing-subsequence/) · *Medium*

## Approach 1: Brute force, try every subsequence

Enumerate all 2ⁿ subsequences; keep the longest strictly increasing.

```python
def length_of_lis(nums):
    n = len(nums)
    best = 0
    for mask in range(1 << n):                                  # L1: 2^n bitmasks
        subseq = [nums[i] for i in range(n) if mask & (1 << i)]
        if all(subseq[i] < subseq[i + 1] for i in range(len(subseq) - 1)):
            best = max(best, len(subseq))
    return best
```

Bitmask enumerates all subsequences; for each, checking strict-increase is O(n). Total O(2^n · n). Don't run this past n ≈ 20.

**Complexity**
- **Time:** O(2ⁿ · n).
- **Space:** O(n).

Skip.

## Approach 2: DP, O(n²)

`dp[i]` = length of LIS ending at `i`. `dp[i] = 1 + max(dp[j] for j < i if nums[j] < nums[i])`.

```python
def length_of_lis(nums):
    n = len(nums)                          # L1: O(1)
    dp = [1] * n                           # L2: O(n) init, every element is a LIS of length 1
    for i in range(1, n):                  # L3: outer loop, n-1 iterations
        for j in range(i):                 # L4: inner loop, up to i iterations
            if nums[j] < nums[i]:          # L5: O(1) comparison
                dp[i] = max(dp[i], dp[j] + 1)  # L6: O(1) update
    return max(dp)                         # L7: O(n) scan
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (init dp) | O(1) | n | O(n) |
| L3 (outer loop) | O(1) | n-1 | O(n) |
| **L4, L6 (inner loop + update)** | **O(1)** | **0+1+2+...+(n-1) = n(n-1)/2** | **O(n²)** ← dominates |
| L7 (max scan) | O(1) | n | O(n) |

The triangular sum at L4 is the bottleneck. For each index `i`, we scan all `j < i`, giving 1 + 2 + ... + (n-1) = O(n²) iterations total.

**Complexity**
- **Time:** O(n²), driven by L4/L6 (the nested loop).
- **Space:** O(n) for the dp array.

Canonical "beginner" DP.

## Approach 3: Patience sort / binary search (optimal)

Maintain `tails[k]` = the smallest tail of any increasing subsequence of length `k + 1`. For each new number, replace the first `tails[k] >= num` (or append). `len(tails)` is the LIS length.

```python
from bisect import bisect_left

def length_of_lis(nums):
    tails = []                             # L1: O(1), empty tails array
    for x in nums:                         # L2: outer loop, n iterations
        i = bisect_left(tails, x)          # L3: O(log k) binary search, k = len(tails)
        if i == len(tails):                # L4: O(1) check
            tails.append(x)               # L5: O(1) amortized, extend LIS
        else:
            tails[i] = x                  # L6: O(1), update smallest tail
    return len(tails)                      # L7: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(nums).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| L2 (outer loop) | O(1) | n | O(n) |
| **L3 (binary search)** | **O(log n)** | **n** | **O(n log n)** ← dominates |
| L5, L6 (append/assign) | O(1) amortized | n total | O(n) |
| L7 (return) | O(1) | 1 | O(1) |

L3 does a binary search over `tails`, which grows to at most n elements. Each of the n elements is processed once with one binary search call, giving O(n log n) total. The append at L5 is O(1) amortized over the whole loop.

**Complexity**
- **Time:** O(n log n), driven by L3 (binary search inside the loop).
- **Space:** O(n) for the `tails` array.

### Note
`tails` is not itself a valid LIS, it's the *length-indexed* smallest tails. But `len(tails)` equals the LIS length, which is all we need.

For the actual sequence, track predecessor indices alongside (more bookkeeping).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate subsequences | O(2ⁿ · n) | O(n) |
| DP | O(n²) | O(n) |
| **Patience sort + binary search** | **O(n log n)** | **O(n)** |

Patience sort is the canonical O(n log n) answer. Same template: Longest Bitonic Subsequence, Russian Doll Envelopes (354), Minimum Number of Operations to Make Array Increasing (1827 variants).

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_300.py and run.
# Uses the canonical implementation (Approach 3: patience sort + binary search).

from bisect import bisect_left

def length_of_lis(nums):
    tails = []
    for x in nums:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)

def _run_tests():
    assert length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]) == 4  # LeetCode example: [2,3,7,101]
    assert length_of_lis([0, 1, 0, 3, 2, 3]) == 4
    assert length_of_lis([7, 7, 7, 7]) == 1                   # all duplicates
    assert length_of_lis([1]) == 1                             # single element
    assert length_of_lis([1, 2, 3, 4, 5]) == 5                # already sorted
    assert length_of_lis([5, 4, 3, 2, 1]) == 1                # strictly decreasing
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), DP array / `tails` binary search
