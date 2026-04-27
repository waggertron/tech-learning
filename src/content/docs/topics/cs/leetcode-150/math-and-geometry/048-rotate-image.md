---
title: "48. Rotate Image (Medium)"
description: Rotate an n×n matrix 90° clockwise in place.
parent: math-and-geometry
tags: [leetcode, neetcode-150, matrix, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Rotate an `n × n` 2D matrix representing an image 90° clockwise. Do it **in place**, don't allocate another matrix.

**Example**
- `matrix = [[1,2,3],[4,5,6],[7,8,9]]` → `[[7,4,1],[8,5,2],[9,6,3]]`

LeetCode 48 · [Link](https://leetcode.com/problems/rotate-image/) · *Medium*

## Approach 1: Allocate a new matrix

`new[j][n - 1 - i] = old[i][j]`. Not in-place, but clarifies the coordinate transform.

```python
def rotate(matrix):
    n = len(matrix)                             # L1: O(1)
    new = [[0] * n for _ in range(n)]           # L2: O(n²)
    for i in range(n):                          # L3: outer loop, n iterations
        for j in range(n):                      # L4: inner loop, n iterations
            new[j][n - 1 - i] = matrix[i][j]   # L5: O(1) coordinate remap
    for i in range(n):
        matrix[i] = new[i]                      # L6: O(n) per row copy
```

**Where the time goes, line by line**

*Variables: n = matrix side length (n×n).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (alloc new matrix) | O(1) | n² | O(n²) |
| **L3, L4, L5 (remap loop)** | **O(1)** | **n²** | **O(n²)** ← dominates |
| L6 (copy rows back) | O(n) | n | O(n²) |

Every cell is visited once for the remap and once for the copy-back.

**Complexity**
- **Time:** O(n²), driven by L3/L4/L5 (the cell-by-cell remap).
- **Space:** O(n²) for the auxiliary matrix.

Violates the in-place constraint.

## Approach 2: Rotate four cells at a time (in-place)

Rotate the outermost ring, then the next inner ring, etc. Each rotation is a four-cell swap.

```python
def rotate(matrix):
    n = len(matrix)                                 # L1: O(1)
    for r in range(n // 2):                         # L2: n/2 rings
        for c in range(r, n - r):                   # L3: n-2r cells per ring
            tmp = matrix[r][c]                      # L4: save top-left
            matrix[r][c] = matrix[n - 1 - c][r]    # L5: left -> top
            matrix[n - 1 - c][r] = matrix[n - 1 - r][n - 1 - c]  # L6: bottom -> left
            matrix[n - 1 - r][n - 1 - c] = matrix[c][n - 1 - r]  # L7: right -> bottom
            matrix[c][n - 1 - r] = tmp              # L8: top -> right
```

**Where the time goes, line by line**

*Variables: n = matrix side length (n×n).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (ring loop) | O(1) | n/2 | O(n) |
| **L3-L8 (four-cell swap)** | **O(1)** | **n²/4 total cells** | **O(n²)** ← dominates |

Each of the n²/4 non-center cells is visited once in the four-cell swap; the four assignments per cell are all O(1).

**Complexity**
- **Time:** O(n²), driven by L3/L4-L8 (visiting every cell in every ring).
- **Space:** O(1).

## Approach 3: Transpose + reverse each row (canonical)

90° clockwise rotation = transpose + reverse each row.

```python
def rotate(matrix):
    n = len(matrix)
    # Transpose
    for i in range(n):                              # L1: outer loop, n iterations
        for j in range(i + 1, n):                   # L2: upper-triangle only
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]  # L3: O(1) swap
    # Reverse each row
    for row in matrix:                              # L4: n rows
        row.reverse()                               # L5: O(n) per row
```

**Where the time goes, line by line**

*Variables: n = matrix side length (n×n).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1, L2, L3 (transpose)** | **O(1)** | **n(n-1)/2** | **O(n²)** ← dominates |
| L4, L5 (row reversal) | O(n) | n | O(n²) |

Both the transpose and the row-reversal pass touch every cell once.

**Complexity**
- **Time:** O(n²), driven by L1/L2/L3 (transpose) and L4/L5 (row reversal), both O(n²).
- **Space:** O(1).

Shortest and easiest to remember. Counter-clockwise = transpose + reverse each column (or reverse rows first, then transpose).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| New matrix | O(n²) | O(n²) |
| Four-cell in-place rotation | O(n²) | O(1) |
| **Transpose + row reverse** | **O(n²)** | **O(1)** |

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_048.py and run.
# Uses the canonical implementation (Approach 3: transpose + row reverse).
# rotate() modifies the matrix in place.

def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()

def _run_tests():
    m = [[1,2,3],[4,5,6],[7,8,9]]
    rotate(m)
    assert m == [[7,4,1],[8,5,2],[9,6,3]]

    m2 = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
    rotate(m2)
    assert m2 == [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]

    m3 = [[1]]  # 1x1 edge case
    rotate(m3)
    assert m3 == [[1]]

    m4 = [[1,2],[3,4]]
    rotate(m4)
    assert m4 == [[3,1],[4,2]]

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), 2D matrix in-place transforms
