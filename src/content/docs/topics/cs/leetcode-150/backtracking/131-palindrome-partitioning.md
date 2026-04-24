---
title: "131. Palindrome Partitioning"
description: Partition a string so every piece is a palindrome; return all such partitions.
parent: backtracking
tags: [leetcode, neetcode-150, backtracking, strings, dp, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return all possible palindrome partitionings.

**Example**
- `s = "aab"` → `[["a","a","b"], ["aa","b"]]`
- `s = "a"` → `[["a"]]`

LeetCode 131 · [Link](https://leetcode.com/problems/palindrome-partitioning/) · *Medium*

## Approach 1: Brute force, backtracking with per-cut palindrome check

For each cut point, check whether the left piece is a palindrome; if yes, recurse on the rest.

```python
def partition(s):
    result = []
    path = []

    def is_pal(t):
        return t == t[::-1]

    def backtrack(start):
        if start == len(s):
            result.append(path[:])
            return
        for end in range(start + 1, len(s) + 1):
            piece = s[start:end]
            if is_pal(piece):
                path.append(piece)
                backtrack(end)
                path.pop()

    backtrack(0)
    return result
```

**Complexity**
- **Time:** O(n · 2ⁿ). For each of 2^(n-1) possible partitions, O(n) palindrome checks.
- **Space:** O(n) recursion.

## Approach 2: Two-pointer palindrome check (same Big-O, no string slicing)

Avoid slicing by checking the palindrome inline.

```python
def partition(s):
    result = []
    path = []
    n = len(s)

    def is_pal(l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1
        return True

    def backtrack(start):
        if start == n:
            result.append(path[:])
            return
        for end in range(start, n):
            if is_pal(start, end):
                path.append(s[start:end + 1])
                backtrack(end + 1)
                path.pop()

    backtrack(0)
    return result
```

**Complexity**
- **Time:** O(n · 2ⁿ) worst case.
- **Space:** O(n) recursion.

## Approach 3: Precompute palindrome DP table (optimal constant factor)

Precompute `is_pal[i][j]` for all substrings in O(n²). Then the palindrome check during backtracking is O(1).

```python
def partition(s):
    n = len(s)
    # is_pal[i][j] = True iff s[i:j+1] is a palindrome
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n):
        is_pal[i][i] = True
    for length in range(2, n + 1):
        for i in range(n, length + 1):
            j = i + length, 1
            if s[i] == s[j] and (length == 2 or is_pal[i + 1][j, 1]):
                is_pal[i][j] = True

    result = []
    path = []

    def backtrack(start):
        if start == n:
            result.append(path[:])
            return
        for end in range(start, n):
            if is_pal[start][end]:
                path.append(s[start:end + 1])
                backtrack(end + 1)
                path.pop()

    backtrack(0)
    return result
```

**Complexity**
- **Time:** O(n · 2ⁿ). The DP table is O(n²) once; the backtracking work dominates asymptotically but constant-factor faster.
- **Space:** O(n²) DP + O(n) recursion.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Backtrack + slice palindrome check | O(n · 2ⁿ) | O(n) |
| Backtrack + two-pointer check | O(n · 2ⁿ) | O(n) |
| **Backtrack + precomputed DP** | **O(n · 2ⁿ)** | **O(n²)** |

All three have the same dominant term (exponential number of partitions). DP precomputation is the constant-factor win; it's also how problem **132. Palindrome Partitioning II** (min cuts) becomes tractable.

## Related data structures

- [Strings](../../../data-structures/strings/), partitioning at indices
- [Arrays](../../../data-structures/arrays/), the 2D DP palindrome table
