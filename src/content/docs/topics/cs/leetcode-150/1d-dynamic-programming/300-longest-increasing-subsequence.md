---
title: "300. Longest Increasing Subsequence"
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

**Complexity**
- **Time:** O(2ⁿ · n).
- **Space:** O(n).

Skip.

## Approach 2: DP, O(n²)

`dp[i]` = length of LIS ending at `i`. `dp[i] = 1 + max(dp[j] for j < i if nums[j] < nums[i])`.

```python
def length_of_lis(nums):
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(n).

Canonical "beginner" DP.

## Approach 3: Patience sort / binary search (optimal)

Maintain `tails[k]` = the smallest tail of any increasing subsequence of length `k + 1`. For each new number, replace the first `tails[k] >= num` (or append). `len(tails)` is the LIS length.

```python
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
```

**Complexity**
- **Time:** O(n log n).
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

## Related data structures

- [Arrays](../../../data-structures/arrays/), DP array / `tails` binary search
