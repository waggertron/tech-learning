---
title: "74. Search a 2D Matrix"
description: Search for a target in an m×n matrix whose rows are sorted and each row's first element exceeds the previous row's last.
parent: binary-search
tags: [leetcode, neetcode-150, binary-search, arrays, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given an `m × n` integer matrix with two properties:

1. Each row is sorted in ascending order.
2. The first integer of each row is greater than the last integer of the previous row.

Return `true` if `target` is in the matrix.

**Example**
- `matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]`, `target = 3` → `true`
- Same matrix, `target = 13` → `false`

LeetCode 74 · [Link](https://leetcode.com/problems/search-a-2d-matrix/) · *Medium*

## Approach 1: Brute force, linear scan

Scan every cell.

```python
def search_matrix(matrix: list[list[int]], target: int) -> bool:
    for row in matrix:
        if target in row:
            return True
    return False
```

**Complexity**
- **Time:** O(m · n).
- **Space:** O(1).

## Approach 2: Binary search per row

Use row ordering: binary-search each row in turn. A small improvement: skip rows whose range can't contain the target.

```python
from bisect import bisect_left

def search_matrix(matrix: list[list[int]], target: int) -> bool:
    for row in matrix:
        if row[0] <= target <= row[-1]:
            i = bisect_left(row, target)
            if i < len(row) and row[i] == target:
                return True
    return False
```

**Complexity**
- **Time:** O(m · log n).
- **Space:** O(1).

## Approach 3: Flatten to a single sorted array (optimal)

The two invariants imply the concatenation of rows is a single sorted sequence of length `m · n`. Binary-search it directly, treating the 1D index as `(row, col)` via divmod.

```python
def search_matrix(matrix: list[list[int]], target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n, 1
    while lo <= hi:
        mid = (lo + hi) // 2
        r, c = divmod(mid, n)
        if matrix[r][c] == target:
            return True
        if matrix[r][c] < target:
            lo = mid + 1
        else:
            hi = mid, 1
    return False
```

**Complexity**
- **Time:** O(log(m · n)) = O(log m + log n).
- **Space:** O(1).

### Two-binary-search alternative
Pick the row first with binary search on the first column (O(log m)), then binary-search that row (O(log n)). Same total complexity, one more index calculation to get wrong.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Linear scan | O(m · n) | O(1) |
| Per-row binary search | O(m · log n) | O(1) |
| **Flattened 1D binary search** | **O(log(m · n))** | **O(1)** |

If the problem becomes 240 (**Search a 2D Matrix II**), rows and columns sorted *independently*, this approach no longer applies. Use a staircase walk from the top-right in O(m + n).

## Related data structures

- [Arrays](../../../data-structures/arrays/), row-major layout; index arithmetic with `divmod`
