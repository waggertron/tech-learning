---
title: "62. Unique Paths"
description: Count paths from the top-left to the bottom-right of an m×n grid, moving only right or down.
parent: 2d-dynamic-programming
tags: [leetcode, neetcode-150, dp, grid, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

A robot is on an `m × n` grid, at the top-left. It can only move right or down. Return the number of unique paths to the bottom-right.

**Example**
- `m = 3, n = 7` → `28`
- `m = 3, n = 2` → `3`

LeetCode 62 · [Link](https://leetcode.com/problems/unique-paths/) · *Medium*

## Approach 1: Recursive

`f(r, c) = f(r - 1, c) + f(r, c - 1)` with `f(0, c) = f(r, 0) = 1`.

```python
def unique_paths(m, n):
    def f(r, c):
        if r == 0 or c == 0:
            return 1
        return f(r - 1, c) + f(r, c - 1)
    return f(m - 1, n - 1)
```

**Complexity**
- **Time:** O(2^(m + n)).
- **Space:** O(m + n) recursion.

## Approach 2: 2-D bottom-up DP

`dp[r][c]` = paths to `(r, c)`.

```python
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[m - 1][n - 1]
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

## Approach 3: 1-D rolling array (optimal space)

`dp[c]` holds the current row; update in place.

```python
def unique_paths(m, n):
    dp = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            dp[c] += dp[c - 1]
    return dp[n - 1]
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(n).

### Closed-form (math variant)
The answer is `C(m + n - 2, m - 1)` — choose which `m - 1` of the `m + n - 2` total moves are "down." O(min(m, n)) using iterative factorial.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Recursive | O(2^(m+n)) | O(m + n) |
| 2-D DP | O(m · n) | O(m · n) |
| **1-D rolling DP** | **O(m · n)** | **O(n)** |
| Closed-form | O(min(m, n)) | O(1) |

The 1-D rolling array is the standard interview answer. The closed-form is a neat math flex when permitted.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — DP grid; rolling array
