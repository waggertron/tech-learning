---
title: "48. Rotate Image"
description: Rotate an n×n matrix 90° clockwise in place.
parent: math-and-geometry
tags: [leetcode, neetcode-150, matrix, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Rotate an `n × n` 2D matrix representing an image 90° clockwise. Do it **in place** — don't allocate another matrix.

**Example**
- `matrix = [[1,2,3],[4,5,6],[7,8,9]]` → `[[7,4,1],[8,5,2],[9,6,3]]`

LeetCode 48 · [Link](https://leetcode.com/problems/rotate-image/) · *Medium*

## Approach 1: Allocate a new matrix

`new[j][n - 1 - i] = old[i][j]`. Not in-place, but clarifies the coordinate transform.

```python
def rotate(matrix):
    n = len(matrix)
    new = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            new[j][n - 1 - i] = matrix[i][j]
    for i in range(n):
        matrix[i] = new[i]
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(n²).

Violates the in-place constraint.

## Approach 2: Rotate four cells at a time (in-place)

Rotate the outermost ring, then the next inner ring, etc. Each rotation is a four-cell swap.

```python
def rotate(matrix):
    n = len(matrix)
    for r in range(n // 2):
        for c in range(r, n - r - 1):
            tmp = matrix[r][c]
            matrix[r][c] = matrix[n - 1 - c][r]
            matrix[n - 1 - c][r] = matrix[n - 1 - r][n - 1 - c]
            matrix[n - 1 - r][n - 1 - c] = matrix[c][n - 1 - r]
            matrix[c][n - 1 - r] = tmp
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

## Approach 3: Transpose + reverse each row (canonical)

90° clockwise rotation = transpose + reverse each row.

```python
def rotate(matrix):
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse each row
    for row in matrix:
        row.reverse()
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1).

Shortest and easiest to remember. Counter-clockwise = transpose + reverse each column (or reverse rows first, then transpose).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| New matrix | O(n²) | O(n²) |
| Four-cell in-place rotation | O(n²) | O(1) |
| **Transpose + row reverse** | **O(n²)** | **O(1)** |

## Related data structures

- [Arrays](../../../data-structures/arrays/) — 2D matrix in-place transforms
