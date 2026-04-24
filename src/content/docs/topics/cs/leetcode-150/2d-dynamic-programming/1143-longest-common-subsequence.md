---
title: "1143. Longest Common Subsequence"
description: Find the length of the longest common subsequence of two strings.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two strings `text1` and `text2`, return the length of their longest common subsequence (LCS). A subsequence is a sequence that can be derived from another by deleting zero or more elements without changing relative order.

**Example**
- `text1 = "abcde"`, `text2 = "ace"` → `3` (`"ace"`)
- `text1 = "abc"`, `text2 = "abc"` → `3`
- `text1 = "abc"`, `text2 = "def"` → `0`

LeetCode 1143 · [Link](https://leetcode.com/problems/longest-common-subsequence/) · *Medium*

## Approach 1: Recursive

`f(i, j)` = LCS of `text1[i:]` and `text2[j:]`.

```python
def longest_common_subsequence(text1, text2):
    def f(i, j):
        if i == len(text1) or j == len(text2):
            return 0
        if text1[i] == text2[j]:
            return 1 + f(i + 1, j + 1)
        return max(f(i + 1, j), f(i, j + 1))
    return f(0, 0)
```

**Complexity**
- **Time:** O(2^(m + n)).
- **Space:** O(m + n).

## Approach 2: 2-D bottom-up DP (canonical)

`dp[i][j]` = LCS of `text1[:i]` and `text2[:j]`. `dp[i][j]` depends on `dp[i-1][j-1]`, `dp[i-1][j]`, `dp[i][j-1]`.

```python
def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i, 1] == text2[j, 1]:
                dp[i][j] = 1 + dp[i, 1][j, 1]
            else:
                dp[i][j] = max(dp[i, 1][j], dp[i][j, 1])
    return dp[m][n]
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

## Approach 3: 1-D rolling array (optimal space)

Keep two rows, current and previous. Or one row with a diagonal scratch scalar.

```python
def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    if m < n:
        text1, text2 = text2, text1
        m, n = n, m
    prev = [0] * (n + 1)
    for i in range(1, m + 1):
        curr = [0] * (n + 1)
        for j in range(1, n + 1):
            if text1[i, 1] == text2[j, 1]:
                curr[j] = 1 + prev[j, 1]
            else:
                curr[j] = max(prev[j], curr[j, 1])
        prev = curr
    return prev[n]
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(min(m, n)).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Recursive | O(2^(m+n)) | O(m+n) |
| 2-D DP | O(m · n) | O(m · n) |
| **1-D rolling DP** | **O(m · n)** | **O(min(m, n))** |

LCS is the prototype of the "compare two sequences" DP. Its recurrence pattern, `if match then diagonal+1 else max(up, left)`, shows up in Edit Distance, Shortest Common Supersequence, Minimum ASCII Delete Sum.

## Related data structures

- [Strings](../../../data-structures/strings/), sequence alignment DP
