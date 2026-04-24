---
title: "54. Spiral Matrix"
description: Return all elements of an m×n matrix in spiral order.
parent: math-and-geometry
tags: [leetcode, neetcode-150, matrix, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Return all elements of an `m × n` matrix in spiral order (clockwise, starting from the top-left).

**Example**
- `matrix = [[1,2,3],[4,5,6],[7,8,9]]` → `[1,2,3,6,9,8,7,4,5]`
- `matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]` → `[1,2,3,4,8,12,11,10,9,5,6,7]`

LeetCode 54 · [Link](https://leetcode.com/problems/spiral-matrix/) · *Medium*

## Approach 1: Visited-set DFS / walking with direction

Walk, turning when you hit a visited cell or the boundary.

```python
def spiral_order(matrix):
    if not matrix:
        return []
    rows, cols = len(matrix), len(matrix[0])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    result = []
    visited = [[False] * cols for _ in range(rows)]
    r = c = d = 0
    for _ in range(rows * cols):
        result.append(matrix[r][c])
        visited[r][c] = True
        dr, dc = directions[d]
        nr, nc = r + dr, c + dc
        if not (0 <= nr < rows and 0 <= nc < cols and not visited[nr][nc]):
            d = (d + 1) % 4
            dr, dc = directions[d]
            nr, nc = r + dr, c + dc
        r, c = nr, nc
    return result
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(m · n) visited array.

## Approach 2: Shrinking boundaries (canonical, optimal space)

Maintain `top`, `bottom`, `left`, `right`. Walk each layer: right along `top`, down along `right`, left along `bottom`, up along `left`. After each side, shrink the boundary.

```python
def spiral_order(matrix):
    if not matrix:
        return []
    result = []
    top, bottom = 0, len(matrix), 1
    left, right = 0, len(matrix[0]), 1

    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            result.append(matrix[top][c])
        top += 1
        for r in range(top, bottom + 1):
            result.append(matrix[r][right])
        right -= 1
        if top <= bottom:
            for c in range(right, left, 1, -1):
                result.append(matrix[bottom][c])
            bottom -= 1
        if left <= right:
            for r in range(bottom, top, 1, -1):
                result.append(matrix[r][left])
            left += 1
    return result
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(1) extra.

The `if top <= bottom` / `if left <= right` guards handle the last single row or column in non-square matrices.

## Approach 3: Recursive peel + rotate

Append the top row, then recurse on the transpose-reversed inner matrix. Elegant but mutates the input.

**Complexity**
- **Time:** O(m · n).
- **Space:** O(min(m, n)) recursion.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Visited + direction | O(m · n) | O(m · n) |
| **Shrinking boundaries** | **O(m · n)** | **O(1)** |
| Recursive peel | O(m · n) | O(min(m, n)) |

The boundary-shrink template works for Spiral Matrix II (fill), III (starting offset), and IV (multiple passes).

## Related data structures

- [Arrays](../../../data-structures/arrays/), 2D matrix traversal
