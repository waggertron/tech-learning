---
title: "74. Search a 2D Matrix (Medium)"
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
    for row in matrix:          # L1: iterate over m rows
        if target in row:       # L2: O(n) linear scan per row
            return True
    return False
```

**Where the time goes, line by line**

*Variables: m = number of rows, n = number of columns.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (row loop) | O(1) | m | O(m) |
| **L2 (scan row)** | **O(n)** | **m** | **O(m · n)** ← dominates |

**Complexity**
- **Time:** O(m · n), driven by L2 (scanning every cell in the worst case).
- **Space:** O(1).

## Approach 2: Binary search per row

Use row ordering: binary-search each row in turn. A small improvement: skip rows whose range can't contain the target.

```python
from bisect import bisect_left

def search_matrix(matrix: list[list[int]], target: int) -> bool:
    for row in matrix:                          # L1: iterate over m rows
        if row[0] <= target <= row[-1]:         # L2: O(1) range check
            i = bisect_left(row, target)        # L3: O(log n) binary search
            if i < len(row) and row[i] == target:
                return True
    return False
```

**Where the time goes, line by line**

*Variables: m = number of rows, n = number of columns.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (row loop) | O(1) | m | O(m) |
| L2 (range check) | O(1) | m | O(m) |
| **L3 (bisect)** | **O(log n)** | **m** | **O(m · log n)** ← dominates |

The range check at L2 prunes rows that can't contain the target, but in the worst case (all rows could contain it) we still do m binary searches.

**Complexity**
- **Time:** O(m · log n), driven by L3 (binary search per row).
- **Space:** O(1).

## Approach 3: Flatten to a single sorted array (optimal)

The two invariants imply the concatenation of rows is a single sorted sequence of length `m · n`. Binary-search it directly, treating the 1D index as `(row, col)` via divmod.

```python
def search_matrix(matrix: list[list[int]], target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1               # L1: O(1) treat matrix as 1D array of size m*n
    while lo <= hi:                       # L2: loop, O(log(m*n)) iterations
        mid = (lo + hi) // 2             # L3: O(1) midpoint
        r, c = divmod(mid, n)            # L4: O(1) decode 1D index to (row, col)
        if matrix[r][c] == target:        # L5: O(1) compare
            return True
        if matrix[r][c] < target:
            lo = mid + 1                  # L6: O(1) narrow right
        else:
            hi = mid - 1                  # L7: O(1) narrow left
    return False
```

**Where the time goes, line by line**

*Variables: m = number of rows, n = number of columns.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| **L2-L5 (loop body)** | **O(1)** | **log(m · n)** | **O(log(m · n))** ← dominates |
| L6 or L7 (narrow) | O(1) | log(m · n) | O(log(m · n)) |

The matrix's two structural properties (sorted rows, each row's first element exceeds the previous row's last) mean that reading the elements in row-major order gives a sorted sequence of length m · n. A single binary search over that conceptual 1D array uses log(m · n) = log m + log n steps.

**Complexity**
- **Time:** O(log(m · n)) = O(log m + log n), driven by L2 (single binary search over m · n elements).
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

## Test cases

```python
# Quick smoke tests - paste into a REPL or save as test_074.py and run.
# Uses the optimal Approach 3 implementation.

def search_matrix(matrix: list, target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        r, c = divmod(mid, n)
        if matrix[r][c] == target:
            return True
        if matrix[r][c] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False

def _run_tests():
    m = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
    assert search_matrix(m, 3) == True
    assert search_matrix(m, 13) == False
    assert search_matrix([[1]], 1) == True              # 1x1 hit
    assert search_matrix([[1]], 2) == False             # 1x1 miss
    assert search_matrix([[1, 3]], 3) == True           # single row, last element
    assert search_matrix([[1], [3]], 1) == True         # single col, first element
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Arrays](../../../data-structures/arrays/), row-major layout; index arithmetic with `divmod`
