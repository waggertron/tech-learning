---
title: "10. Regular Expression Matching"
description: Match a string against a pattern with '.' (any single char) and '*' (zero or more of the preceding element).
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, regex, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Implement regular expression matching with support for:

- `.`, matches any single character.
- `*`, matches zero or more of the *preceding* element.

The match must cover the **entire** input string (not partial).

**Example**
- `s = "aa"`, `p = "a"` → `false`
- `s = "aa"`, `p = "a*"` → `true`
- `s = "ab"`, `p = ".*"` → `true`
- `s = "mississippi"`, `p = "mis*is*p*."` → `false`

LeetCode 10 · [Link](https://leetcode.com/problems/regular-expression-matching/) · *Hard*

## Approach 1: Recursive

Match character-by-character, special-casing `*`.

```python
def is_match(s, p):
    def match(i, j):
        if j == len(p):
            return i == len(s)
        first = i < len(s) and (p[j] == '.' or p[j] == s[i])
        if j + 1 < len(p) and p[j + 1] == '*':
            # zero copies, or one more copy
            return match(i, j + 2) or (first and match(i + 1, j))
        return first and match(i + 1, j + 1)
    return match(0, 0)
```

**Complexity**
- **Time:** O(2^(m + n)) worst case due to overlapping subproblems.
- **Space:** O(m + n).

## Approach 2: Top-down memoized (canonical)

Cache by `(i, j)`.

```python
from functools import lru_cache

def is_match(s, p):
    @lru_cache(maxsize=None)
    def match(i, j):
        if j == len(p):
            return i == len(s)
        first = i < len(s) and (p[j] == '.' or p[j] == s[i])
        if j + 1 < len(p) and p[j + 1] == '*':
            return match(i, j + 2) or (first and match(i + 1, j))
        return first and match(i + 1, j + 1)
    return match(0, 0)
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

## Approach 3: Bottom-up 2-D DP

`dp[i][j]` = does `s[:i]` match `p[:j]`?

```python
def is_match(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True

    # Empty string vs. patterns like "a*", "a*b*"
    for j in range(1, n + 1):
        if p[j, 1] == '*':
            dp[0][j] = dp[0][j, 2]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j, 1] == '*':
                # zero occurrences
                dp[i][j] = dp[i][j, 2]
                # one or more: previous char matches current s
                if p[j, 2] == '.' or p[j, 2] == s[i, 1]:
                    dp[i][j] = dp[i][j] or dp[i, 1][j]
            else:
                if p[j, 1] == '.' or p[j, 1] == s[i, 1]:
                    dp[i][j] = dp[i, 1][j, 1]
    return dp[m][n]
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(2^(m + n)) | O(m + n) |
| **Top-down memoized** | **O(m · n)** | **O(m · n)** |
| Bottom-up 2-D DP | O(m · n) | O(m · n) |

This problem rewards memorization, the recurrence is fiddly and the edge cases around `*` at the start are easy to bungle. Interview-standard answer is memoized recursion for clarity.

## Related data structures

- [Strings](../../../data-structures/strings/), regex over prefix lengths
