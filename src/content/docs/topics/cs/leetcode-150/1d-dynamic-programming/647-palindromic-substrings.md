---
title: "647. Palindromic Substrings"
description: Count the number of palindromic substrings in a string.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s`, return the number of palindromic substrings (counting duplicates).

**Example**
- `s = "abc"` → `3` (a, b, c)
- `s = "aaa"` → `6` (a, a, a, aa, aa, aaa)

LeetCode 647 · [Link](https://leetcode.com/problems/palindromic-substrings/) · *Medium*

## Approach 1: Brute force — check every substring

```python
def count_substrings(s):
    def is_pal(t):
        return t == t[::-1]
    count = 0
    for i in range(len(s)):
        for j in range(i, len(s)):
            if is_pal(s[i:j + 1]):
                count += 1
    return count
```

**Complexity**
- **Time:** O(n³).
- **Space:** O(n) per slice.

## Approach 2: Expand around center (canonical)

For each of `2n - 1` centers, expand outward and count every step that forms a palindrome.

```python
def count_substrings(s):
    def expand(l, r):
        count = 0
        while l >= 0 and r < len(s) and s[l] == s[r]:
            count += 1
            l -= 1
            r += 1
        return count

    return sum(expand(i, i) + expand(i, i + 1) for i in range(len(s)))
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

## Approach 3: DP table

`dp[i][j] = True` iff `s[i:j+1]` is a palindrome. Fill by length; count the `True` entries.

```python
def count_substrings(s):
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    count = 0
    for i in range(n):
        dp[i][i] = True
        count += 1
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and (length == 2 or dp[i + 1][j - 1]):
                dp[i][j] = True
                count += 1
    return count
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(n²).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| All substrings | O(n³) | O(n) |
| **Expand around center** | **O(n²)** | **O(1)** |
| DP table | O(n²) | O(n²) |

Same pattern as problem 5. Manacher's gives O(n) if you need it.

## Related data structures

- [Strings](../../../data-structures/strings/) — center-expansion
