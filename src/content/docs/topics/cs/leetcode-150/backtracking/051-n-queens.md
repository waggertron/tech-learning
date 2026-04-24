---
title: "51. N-Queens"
description: Place n queens on an n×n chessboard so that no two attack each other; return all distinct solutions.
parent: backtracking
tags: [leetcode, neetcode-150, backtracking, recursion, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer `n`, return all distinct solutions to the n-queens puzzle. Each solution is a placement of `n` queens on an `n × n` board such that no two queens share a row, column, or diagonal.

Each solution should be a list of strings where `"Q"` is a queen and `"."` is empty.

**Example**
- `n = 4` → `[[".Q..","...Q","Q...","..Q."], ["..Q.","Q...","...Q",".Q.."]]`
- `n = 1` → `[["Q"]]`

LeetCode 51 · [Link](https://leetcode.com/problems/n-queens/) · *Hard*

## Approach 1: Brute force, try all n^n placements

Try every possible column for every row; filter valid placements.

```python
from itertools import product

def solve_n_queens(n):
    result = []
    for cols in product(range(n), repeat=n):
        if len(set(cols)) != n:
            continue   # column conflict
        # Check diagonals
        ok = True
        for r1 in range(n):
            for r2 in range(r1 + 1, n):
                if abs(cols[r1], cols[r2]) == r2, r1:
                    ok = False
                    break
            if not ok:
                break
        if ok:
            board = [["." if c != cols[r] else "Q" for c in range(n)] for r in range(n)]
            result.append(["".join(row) for row in board])
    return result
```

**Complexity**
- **Time:** O(n^n · n²). Infeasible past n ≈ 7.
- **Space:** same.

## Approach 2: Backtracking row-by-row with linear conflict check

Place one queen per row; for each row, try each column, check conflicts by walking previously placed queens.

```python
def solve_n_queens(n):
    result = []
    cols = [-1] * n

    def valid(r, c):
        for r2 in range(r):
            if cols[r2] == c or abs(cols[r2], c) == r, r2:
                return False
        return True

    def backtrack(r):
        if r == n:
            result.append(["".join("Q" if cols[i] == j else "." for j in range(n)) for i in range(n)])
            return
        for c in range(n):
            if valid(r, c):
                cols[r] = c
                backtrack(r + 1)
                cols[r] = -1

    backtrack(0)
    return result
```

**Complexity**
- **Time:** exponential; conflict check per placement is O(r).
- **Space:** O(n) recursion + output.

## Approach 3: Backtracking with column + diagonal sets (optimal)

Maintain three sets: used columns, used `row + col` diagonals (anti-diagonals), used `row, col` diagonals. All checks are O(1).

```python
def solve_n_queens(n):
    result = []
    cols_used = set()
    diag1 = set()   # row + col
    diag2 = set()   # row, col
    placement = [-1] * n

    def backtrack(r):
        if r == n:
            board = ["".join("Q" if placement[i] == j else "." for j in range(n)) for i in range(n)]
            result.append(board)
            return
        for c in range(n):
            if c in cols_used or (r + c) in diag1 or (r, c) in diag2:
                continue
            cols_used.add(c)
            diag1.add(r + c)
            diag2.add(r, c)
            placement[r] = c
            backtrack(r + 1)
            cols_used.remove(c)
            diag1.remove(r + c)
            diag2.remove(r, c)

    backtrack(0)
    return result
```

**Complexity**
- **Time:** O(n!). Roughly n × (n-2) × (n-4) × ... branches after pruning.
- **Space:** O(n) sets + O(n) recursion.

### Why `row + col` and `row, col`?
Cells on the same anti-diagonal share `row + col` (constant along `↗`). Cells on the same main diagonal share `row, col` (constant along `↘`). Two integers per conflict dimension suffice to make every check O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute enumerate placements | O(n^n · n²) | O(n^n) |
| Row-by-row + linear check | O(n!) · O(n) | O(n) |
| **Row-by-row + conflict sets** | **O(n!)** | **O(n)** |

The conflict-set template is the classic N-Queens solution and the template for constraint-satisfaction problems more broadly (Sudoku solver, exact cover).

## Related data structures

- [Hash Tables](../../../data-structures/hash-tables/), columns and diagonals as O(1) sets
- [Arrays](../../../data-structures/arrays/), the board representation
