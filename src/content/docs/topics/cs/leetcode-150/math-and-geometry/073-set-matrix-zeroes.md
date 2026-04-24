---
title: "73. Set Matrix Zeroes"
description: If an element in an m×n matrix is 0, set its entire row and column to 0 — in place.
parent: math-and-geometry
tags: [leetcode, neetcode-150, matrix, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an `m × n` integer matrix, if a cell is `0`, set its entire row and column to `0`. Do it **in place**; try for O(1) extra space as a follow-up.

**Example**
- `matrix = [[1,1,1],[1,0,1],[1,1,1]]` → `[[1,0,1],[0,0,0],[1,0,1]]`
- `matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]` → `[[0,0,0,0],[0,4,5,0],[0,3,1,0]]`

LeetCode 73 · [Link](https://leetcode.com/problems/set-matrix-zeroes/) · *Medium*

## Approach 1: Brute force — make a copy

Create a copy; read from the copy while writing zeroes to the original.

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

Doesn't meet the in-place requirement.

## Approach 2: Two boolean arrays (O(m + n) space)

Collect which rows and columns contain a 0; then zero them.

```python
def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])
    zero_rows = [False] * rows
    zero_cols = [False] * cols

    for r in range(rows):
        for c in range(cols):
            if matrix[r][c] == 0:
                zero_rows[r] = True
                zero_cols[c] = True

    for r in range(rows):
        for c in range(cols):
            if zero_rows[r] or zero_cols[c]:
                matrix[r][c] = 0
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m + n).

## Approach 3: First row and column as markers (O(1) space — canonical)

Use the first row and column themselves as flag arrays. Track separately whether the first row / first column themselves need zeroing.

```python
def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][c] == 0 for c in range(cols))
    first_col_zero = any(matrix[r][0] == 0 for r in range(rows))

    # Use first row/col as markers
    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0

    # Zero based on markers
    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0

    if first_row_zero:
        for c in range(cols):
            matrix[0][c] = 0
    if first_col_zero:
        for r in range(rows):
            matrix[r][0] = 0
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(1) extra.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Copy + overwrite | O(m · n) | O(m · n) |
| Boolean flag arrays | O(m · n) | O(m + n) |
| **First row/col as markers** | **O(m · n)** | **O(1)** |

"Reuse the input as auxiliary storage" is a recurring in-place trick.

## Related data structures

- [Arrays](../../../data-structures/arrays/) — in-place marking strategy
