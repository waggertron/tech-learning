---
title: "73. Set Matrix Zeroes (Medium)"
description: If an element in an m×n matrix is 0, set its entire row and column to 0, in place.
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

## Approach 1: Brute force, make a copy

Create a copy; read from the copy while writing zeroes to the original.

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n).

Doesn't meet the in-place requirement.

## Approach 2: Two boolean arrays (O(m + n) space)

Collect which rows and columns contain a 0; then zero them.

```python
def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])    # L1: O(1)
    zero_rows = [False] * rows                  # L2: O(m)
    zero_cols = [False] * cols                  # L3: O(n)

    for r in range(rows):                       # L4: first pass, m·n iterations
        for c in range(cols):
            if matrix[r][c] == 0:
                zero_rows[r] = True             # L5: O(1)
                zero_cols[c] = True             # L6: O(1)

    for r in range(rows):                       # L7: second pass, m·n iterations
        for c in range(cols):
            if zero_rows[r] or zero_cols[c]:
                matrix[r][c] = 0               # L8: O(1)
```

**Where the time goes, line by line**

*Variables: m = number of rows, n = number of columns.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2-L3 (init flag arrays) | O(1) | m + n | O(m + n) |
| **L4-L6 (first scan)** | **O(1)** | **m·n** | **O(m·n)** ← dominates |
| L7-L8 (second scan) | O(1) | m·n | O(m·n) |

Two full passes over the matrix, each O(m·n).

**Complexity**
- **Time:** O(m · n), driven by L4/L5/L6 and L7/L8 (two full matrix scans).
- **Space:** O(m + n) for the flag arrays.

## Approach 3: First row and column as markers (O(1) space, canonical)

Use the first row and column themselves as flag arrays. Track separately whether the first row / first column themselves need zeroing.

```python
def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][c] == 0 for c in range(cols))    # L1: O(n)
    first_col_zero = any(matrix[r][0] == 0 for r in range(rows))    # L2: O(m)

    # Use first row/col as markers
    for r in range(1, rows):                    # L3: mark pass (m-1)·(n-1)
        for c in range(1, cols):
            if matrix[r][c] == 0:
                matrix[r][0] = 0               # L4: O(1)
                matrix[0][c] = 0               # L5: O(1)

    # Zero based on markers
    for r in range(1, rows):                    # L6: apply pass (m-1)·(n-1)
        for c in range(1, cols):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0               # L7: O(1)

    if first_row_zero:
        for c in range(cols):
            matrix[0][c] = 0                   # L8: O(n)
    if first_col_zero:
        for r in range(rows):
            matrix[r][0] = 0                   # L9: O(m)
```

**Where the time goes, line by line**

*Variables: m = number of rows, n = number of columns.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L2 (first row/col check) | O(1) | m + n | O(m + n) |
| **L3-L5 (mark pass)** | **O(1)** | **(m-1)·(n-1)** | **O(m·n)** ← dominates |
| L6-L7 (apply pass) | O(1) | (m-1)·(n-1) | O(m·n) |
| L8-L9 (fix first row/col) | O(1) | m + n | O(m + n) |

Three linear passes total; two of them are O(m·n), two are O(m + n).

**Complexity**
- **Time:** O(m · n), driven by L3/L4/L5 and L6/L7 (two full inner-matrix scans).
- **Space:** O(1) extra.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Copy + overwrite | O(m · n) | O(m · n) |
| Boolean flag arrays | O(m · n) | O(m + n) |
| **First row/col as markers** | **O(m · n)** | **O(1)** |

"Reuse the input as auxiliary storage" is a recurring in-place trick.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_073.py and run.
# Uses the canonical implementation (Approach 3: first row/col as markers).
# set_zeroes() modifies the matrix in place.

def set_zeroes(matrix):
    rows, cols = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][c] == 0 for c in range(cols))
    first_col_zero = any(matrix[r][0] == 0 for r in range(rows))

    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0

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

def _run_tests():
    m = [[1,1,1],[1,0,1],[1,1,1]]
    set_zeroes(m)
    assert m == [[1,0,1],[0,0,0],[1,0,1]]

    m2 = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
    set_zeroes(m2)
    assert m2 == [[0,0,0,0],[0,4,5,0],[0,3,1,0]]

    m3 = [[1]]  # no zeroes
    set_zeroes(m3)
    assert m3 == [[1]]

    m4 = [[0]]  # single zero
    set_zeroes(m4)
    assert m4 == [[0]]

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), in-place marking strategy
