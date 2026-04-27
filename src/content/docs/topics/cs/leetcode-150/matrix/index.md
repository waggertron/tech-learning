---
title: Matrix
description: "4 problems covering in-place matrix manipulation, spiral traversal, and grid-based DFS: the core patterns that appear on nearly every matrix interview question."
parent: leetcode-150
tags: [leetcode, neetcode-150, matrix, medium]
status: draft
created: 2026-04-27
updated: 2026-04-27
---

## Overview

Matrix problems ask you to operate on 2D grids, either transforming them in place, traversing them in a specific order, or searching them for paths. Three core patterns cover most questions:

- **In-place transform**: Use the matrix's own cells as auxiliary storage (Set Matrix Zeroes), or exploit transpose + reverse symmetry (Rotate Image).
- **Boundary-shrinking traversal**: Maintain four pointers (top, bottom, left, right) and peel layers inward (Spiral Matrix).
- **Grid DFS/backtracking**: Recurse into neighbors, mark cells visited in-place, and unmark on backtrack (Word Search).

## Problems

1. [73. Set Matrix Zeroes (Medium)](../math-and-geometry/073-set-matrix-zeroes/)
2. [54. Spiral Matrix (Medium)](../math-and-geometry/054-spiral-matrix/)
3. [48. Rotate Image (Medium)](../math-and-geometry/048-rotate-image/)
4. [79. Word Search (Medium)](../backtracking/079-word-search/)

## Key patterns

- **First row/col as markers**: Set Matrix Zeroes avoids O(m + n) space by reusing the matrix's own first row and column as flag arrays.
- **Transpose + row reverse**: Rotating 90° clockwise = transpose the matrix, then reverse each row. Counter-clockwise = reverse each row first, then transpose.
- **Shrinking boundary**: Walk the top row, right column, bottom row, left column in order; shrink each boundary after walking it. Guards handle the last single row or column.
- **DFS with in-place marking**: Mark a cell visited by mutating it (e.g., `matrix[r][c] = '#'`), recurse, then restore. Avoids a separate `visited` set.

## Related topics

- [Backtracking](../backtracking/), Word Search is categorized there as well
- [Math & Geometry](../math-and-geometry/), Set Matrix Zeroes, Spiral Matrix, and Rotate Image live there
- [Graphs](../graphs/), for grid problems that become shortest-path or flood-fill questions
