---
title: "72. Edit Distance"
description: Minimum number of insert/delete/replace operations to transform one string into another.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, strings, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. Allowed operations: insert a character, delete a character, replace a character.

**Example**
- `word1 = "horse"`, `word2 = "ros"` → `3`
- `word1 = "intention"`, `word2 = "execution"` → `5`

LeetCode 72 · [Link](https://leetcode.com/problems/edit-distance/) · *Hard*

## Approach 1: Recursive

`f(i, j)` = edit distance between `word1[i:]` and `word2[j:]`.

- If `i == m`: need `n - j` inserts.
- If `j == n`: need `m - i` deletes.
- If chars match: `f(i + 1, j + 1)`.
- Else: `1 + min(f(i + 1, j), f(i, j + 1), f(i + 1, j + 1))` (delete, insert, replace).

```python
def min_distance(word1, word2):
    def f(i, j):
        if i == len(word1):
            return len(word2) - j
        if j == len(word2):
            return len(word1) - i
        if word1[i] == word2[j]:
            return f(i + 1, j + 1)
        return 1 + min(f(i + 1, j), f(i, j + 1), f(i + 1, j + 1))
    return f(0, 0)
```

**Complexity**
- **Time:** O(3^(m + n)).
- **Space:** O(m + n).

## Approach 2: Top-down memoized

```python
from functools import lru_cache

def min_distance(word1, word2):
    @lru_cache(maxsize=None)
    def f(i, j):
        if i == len(word1):
            return len(word2) - j
        if j == len(word2):
            return len(word1) - i
        if word1[i] == word2[j]:
            return f(i + 1, j + 1)
        return 1 + min(f(i + 1, j), f(i, j + 1), f(i + 1, j + 1))
    return f(0, 0)
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

## Approach 3: Bottom-up 2-D DP (canonical)

`dp[i][j]` = edit distance between `word1[:i]` and `word2[:j]`.

```python
def min_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n). Reducible to O(min(m, n)) with rolling rows.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(3^(m + n)) | O(m + n) |
| Top-down memo | O(m · n) | O(m · n) |
| **Bottom-up 2-D DP** | **O(m · n)** | **O(m · n)** |

Edit Distance (Levenshtein) is one of the most-cited DP problems — it underlies spell-check, DNA alignment, and diff algorithms.

## Related data structures

- [Strings](../../../data-structures/strings/) — 2-D DP over prefix lengths
