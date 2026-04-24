---
title: "5. Longest Palindromic Substring"
description: Find the longest palindromic substring in a string.
parent: 1d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s`, return the longest palindromic substring in `s`.

**Example**
- `s = "babad"` → `"bab"` (or `"aba"`)
- `s = "cbbd"` → `"bb"`

LeetCode 5 · [Link](https://leetcode.com/problems/longest-palindromic-substring/) · *Medium*

## Approach 1: Brute force — check every substring

For each substring, verify it's a palindrome.

```python
def longest_palindrome(s):
    def is_pal(t):
        return t == t[::-1]
    best = ""
    for i in range(len(s)):
        for j in range(i, len(s)):
            if is_pal(s[i:j + 1]) and j - i + 1 > len(best):
                best = s[i:j + 1]
    return best
```

**Complexity**
- **Time:** O(n³).
- **Space:** O(n).

## Approach 2: Expand around center (canonical)

Every palindrome has a center — a single character (odd length) or a pair (even length). For each of `2n - 1` centers, expand outward.

```python
def longest_palindrome(s):
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1
            r += 1
        return s[l + 1:r]

    best = ""
    for i in range(len(s)):
        for cand in (expand(i, i), expand(i, i + 1)):
            if len(cand) > len(best):
                best = cand
    return best
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

Most interview-friendly. Short code, easy to reason about.

## Approach 3: DP table of palindrome flags

`dp[i][j] = True` iff `s[i:j+1]` is a palindrome. Fill by length: `dp[i][j] = (s[i] == s[j])` and (length ≤ 2 or `dp[i+1][j-1]`).

```python
def longest_palindrome(s):
    n = len(s)
    if n <= 1:
        return s
    dp = [[False] * n for _ in range(n)]
    best = s[0]

    for i in range(n):
        dp[i][i] = True

    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and (length == 2 or dp[i + 1][j - 1]):
                dp[i][j] = True
                if length > len(best):
                    best = s[i:j + 1]
    return best
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(n²).

Worse on space than Approach 2; useful when you also need answers for *every* `(i, j)` (e.g., problem 131 Palindrome Partitioning).

### Optional: Manacher's O(n)
Manacher's algorithm solves the problem in O(n); it's rarely expected in interviews but worth knowing.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| All substrings | O(n³) | O(n) |
| **Expand around center** | **O(n²)** | **O(1)** |
| DP table | O(n²) | O(n²) |
| Manacher's | O(n) | O(n) |

Expand-around-center is the canonical interview answer. Same template solves problem 647 (Palindromic Substrings).

## Related data structures

- [Strings](../../../data-structures/strings/) — palindrome-around-center traversal
