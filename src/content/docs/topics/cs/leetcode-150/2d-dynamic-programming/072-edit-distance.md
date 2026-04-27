---
title: "72. Edit Distance (Hard)"
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
    def f(i, j):                                                   # L1: recursive helper
        if i == len(word1):                                        # L2: O(1) base: word1 exhausted
            return len(word2) - j
        if j == len(word2):                                        # L3: O(1) base: word2 exhausted
            return len(word1) - i
        if word1[i] == word2[j]:                                   # L4: O(1) char match
            return f(i + 1, j + 1)                                 # L5: one recursive call
        return 1 + min(f(i + 1, j), f(i, j + 1), f(i + 1, j + 1))  # L6: three recursive calls
    return f(0, 0)
```

**Where the time goes, line by line**

*Variables: m = len(word1), n = len(word2).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2-L4 (base + match checks) | O(1) | per call | O(1) each |
| L5 (one recursive call on match) | O(1) work + 1 call | per match | included below |
| **L6 (three recursive branches on mismatch)** | **O(1) work + 3 calls** | **worst case every call** | **O(3^(m+n))** ← dominates |

Every mismatch spawns three sub-calls. Without memoization the same `(i, j)` sub-problem is recomputed exponentially many times.

**Complexity**
- **Time:** O(3^(m + n)), driven by L6 triple-branching on mismatches.
- **Space:** O(m + n) recursion depth.

## Approach 2: Top-down memoized

```python
from functools import lru_cache

def min_distance(word1, word2):
    @lru_cache(maxsize=None)                                       # L1: cache decorator
    def f(i, j):
        if i == len(word1):                                        # L2: O(1) base case
            return len(word2) - j
        if j == len(word2):                                        # L3: O(1) base case
            return len(word1) - i
        if word1[i] == word2[j]:                                   # L4: O(1) char match
            return f(i + 1, j + 1)                                 # L5: O(1) with cache
        return 1 + min(f(i + 1, j), f(i, j + 1), f(i + 1, j + 1))  # L6: O(1) with cache
    return f(0, 0)
```

**Where the time goes, line by line**

*Variables: m = len(word1), n = len(word2).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (lru_cache) | O(1) | 1 | O(1) |
| L2-L4 (checks) | O(1) | once per unique (i,j) | O(m · n) total |
| **L5, L6 (recursive calls, cache hits after first)** | **O(1) per call** | **at most (m+1)(n+1) unique states** | **O(m · n)** ← dominates |

Each `(i, j)` pair is computed exactly once. There are `(m+1) * (n+1)` such pairs, each taking O(1).

**Complexity**
- **Time:** O(m · n), driven by L5/L6 across all unique (i,j) states.
- **Space:** O(m · n) for the memo table.

## Approach 3: Bottom-up 2-D DP (canonical)

`dp[i][j]` = edit distance between `word1[:i]` and `word2[:j]`.

```python
def min_distance(word1, word2):
    m, n = len(word1), len(word2)                               # L1: O(1)
    dp = [[0] * (n + 1) for _ in range(m + 1)]                 # L2: O(m*n) table init
    for i in range(m + 1):                                      # L3: O(m) base: word2 empty
        dp[i][0] = i
    for j in range(n + 1):                                      # L4: O(n) base: word1 empty
        dp[0][j] = j
    for i in range(1, m + 1):                                   # L5: outer loop O(m)
        for j in range(1, n + 1):                               # L6: inner loop O(n)
            if word1[i - 1] == word2[j - 1]:                   # L7: O(1) char match
                dp[i][j] = dp[i - 1][j - 1]                    # L8: O(1) diagonal copy
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])  # L9: O(1) min of 3
    return dp[m][n]                                             # L10: O(1) answer
```

**Where the time goes, line by line**

*Variables: m = len(word1), n = len(word2).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (table init) | O(1) per cell | (m+1)(n+1) | O(m · n) |
| L3 (base init col 0) | O(1) | m+1 | O(m) |
| L4 (base init row 0) | O(1) | n+1 | O(n) |
| **L5+L6 (double loop)** | **O(1) body** | **m · n** | **O(m · n)** ← dominates |
| L7-L9 (table fill) | O(1) | once per cell | included above |

Every cell of the DP table is filled in O(1) via three table lookups. The double loop at L5/L6 drives the total.

**Complexity**
- **Time:** O(m · n), driven by L5/L6 (the double loop over all DP cells).
- **Space:** O(m · n). Reducible to O(min(m, n)) with rolling rows.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Naive recursion | O(3^(m + n)) | O(m + n) |
| Top-down memo | O(m · n) | O(m · n) |
| **Bottom-up 2-D DP** | **O(m · n)** | **O(m · n)** |

Edit Distance (Levenshtein) is one of the most-cited DP problems, it underlies spell-check, DNA alignment, and diff algorithms.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_072.py and run.
# Uses the canonical implementation (Approach 3: bottom-up 2-D DP).

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

def _run_tests():
    # problem statement examples
    assert min_distance("horse", "ros") == 3
    assert min_distance("intention", "execution") == 5
    # edge: empty strings
    assert min_distance("", "") == 0
    assert min_distance("abc", "") == 3
    assert min_distance("", "abc") == 3
    # same strings
    assert min_distance("abc", "abc") == 0
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Strings](../../../data-structures/strings/), 2-D DP over prefix lengths
