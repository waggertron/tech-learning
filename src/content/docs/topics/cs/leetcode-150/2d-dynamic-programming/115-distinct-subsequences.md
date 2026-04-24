---
title: "115. Distinct Subsequences"
description: Count the number of distinct subsequences of s that equal t.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two strings `s` and `t`, return the number of distinct subsequences of `s` that equal `t`. The answer fits in a 32-bit signed integer.

**Example**
- `s = "rabbbit"`, `t = "rabbit"` → `3`
- `s = "babgbag"`, `t = "bag"` → `5`

LeetCode 115 · [Link](https://leetcode.com/problems/distinct-subsequences/) · *Hard*

## Approach 1: Recursive

`f(i, j)` = number of ways `t[j:]` appears as a subsequence of `s[i:]`.

- If `j == len(t)`: matched everything → 1.
- If `i == len(s)`: out of characters → 0.
- If `s[i] == t[j]`: `f(i + 1, j + 1) + f(i + 1, j)` (use or skip).
- Else: `f(i + 1, j)` (must skip).

```python
def num_distinct(s, t):
    def f(i, j):
        if j == len(t):
            return 1
        if i == len(s):
            return 0
        if s[i] == t[j]:
            return f(i + 1, j + 1) + f(i + 1, j)
        return f(i + 1, j)
    return f(0, 0)
```

**Complexity**
- **Time:** O(2^n).
- **Space:** O(n).

## Approach 2: Top-down memoized

```python
from functools import lru_cache

def num_distinct(s, t):
    @lru_cache(maxsize=None)
    def f(i, j):
        if j == len(t):
            return 1
        if i == len(s):
            return 0
        if s[i] == t[j]:
            return f(i + 1, j + 1) + f(i + 1, j)
        return f(i + 1, j)
    return f(0, 0)
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

## Approach 3: Bottom-up 2-D DP + rolling to 1-D (optimal space)

`dp[j]` = number of ways `t[:j]` appears as a subsequence of the current prefix of `s`. Iterate j from high to low to avoid reusing updates within a single row.

```python
def num_distinct(s, t):
    m, n = len(s), len(t)
    dp = [0] * (n + 1)
    dp[0] = 1
    for i in range(m):
        for j in range(n, 0, -1):
            if s[i] == t[j, 1]:
                dp[j] += dp[j, 1]
    return dp[n]
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2^n) | O(n) |
| Top-down memo | O(m · n) | O(m · n) |
| **1-D bottom-up DP** | **O(m · n)** | **O(n)** |

## Related data structures

- [Strings](../../../data-structures/strings/), subsequence counting DP
