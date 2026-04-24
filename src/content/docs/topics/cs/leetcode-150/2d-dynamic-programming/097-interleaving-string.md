---
title: "97. Interleaving String"
description: Determine whether s3 can be formed by interleaving s1 and s2 while preserving relative order within each.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given strings `s1`, `s2`, and `s3`, return whether `s3` is formed by interleaving `s1` and `s2` — picking characters in order from either string. `|s3|` must equal `|s1| + |s2|`.

**Example**
- `s1 = "aabcc"`, `s2 = "dbbca"`, `s3 = "aadbbcbcac"` → `true`
- `s1 = "aabcc"`, `s2 = "dbbca"`, `s3 = "aadbbbaccc"` → `false`

LeetCode 97 · [Link](https://leetcode.com/problems/interleaving-string/) · *Medium*

## Approach 1: Recursive

`f(i, j)` = can `s3[:i + j]` be formed by `s1[:i]` and `s2[:j]`?

```python
def is_interleave(s1, s2, s3):
    if len(s1) + len(s2) != len(s3):
        return False
    def f(i, j):
        k = i + j
        if k == len(s3):
            return True
        if i < len(s1) and s1[i] == s3[k] and f(i + 1, j):
            return True
        if j < len(s2) and s2[j] == s3[k] and f(i, j + 1):
            return True
        return False
    return f(0, 0)
```

**Complexity**
- **Time:** O(2^(m + n)).
- **Space:** O(m + n).

## Approach 2: Top-down memoized

```python
from functools import lru_cache

def is_interleave(s1, s2, s3):
    if len(s1) + len(s2) != len(s3):
        return False
    @lru_cache(maxsize=None)
    def f(i, j):
        k = i + j
        if k == len(s3):
            return True
        if i < len(s1) and s1[i] == s3[k] and f(i + 1, j):
            return True
        if j < len(s2) and s2[j] == s3[k] and f(i, j + 1):
            return True
        return False
    return f(0, 0)
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

## Approach 3: Bottom-up 2-D DP

`dp[i][j]` = can `s3[:i + j]` be formed from `s1[:i]` and `s2[:j]`?

```python
def is_interleave(s1, s2, s3):
    m, n = len(s1), len(s2)
    if m + n != len(s3):
        return False
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for i in range(m + 1):
        for j in range(n + 1):
            if i == 0 and j == 0:
                continue
            k = i + j - 1
            if i > 0 and s1[i - 1] == s3[k] and dp[i - 1][j]:
                dp[i][j] = True
            if not dp[i][j] and j > 0 and s2[j - 1] == s3[k] and dp[i][j - 1]:
                dp[i][j] = True
    return dp[m][n]
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n). Can be reduced to O(min(m, n)) via rolling array.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2^(m + n)) | O(m + n) |
| Top-down memo | O(m · n) | O(m · n) |
| **Bottom-up 2-D DP** | **O(m · n)** | **O(m · n)** |

## Related data structures

- [Strings](../../../data-structures/strings/) — 2-D DP over paired indices
