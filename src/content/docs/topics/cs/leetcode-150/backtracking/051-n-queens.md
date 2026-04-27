---
title: "51. N-Queens (Hard)"
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
    for cols in product(range(n), repeat=n):         # L1: O(n^n) outer enumeration
        if len(set(cols)) != n:
            continue                                  # L2: column conflict
        ok = True
        for r1 in range(n):
            for r2 in range(r1 + 1, n):
                if abs(cols[r1] - cols[r2]) == r2 - r1:
                    ok = False; break                 # L3: O(n²) diagonal check
            if not ok: break
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
            if cols[r2] == c or abs(cols[r2] - c) == r - r2:  # L1: O(r) check
                return False
        return True

    def backtrack(r):
        if r == n:
            result.append(["".join("Q" if cols[i] == j else "." for j in range(n)) for i in range(n)])
            return
        for c in range(n):
            if valid(r, c):              # L2: O(r) per column
                cols[r] = c
                backtrack(r + 1)         # L3: recurse
                cols[r] = -1

    backtrack(0)
    return result
```

**Complexity**
- **Time:** exponential; conflict check per placement is O(r).
- **Space:** O(n) recursion + output.

## Approach 3: Backtracking with column + diagonal sets (optimal)

Maintain three sets: used columns, used `row + col` diagonals (anti-diagonals), used `row - col` diagonals. All checks are O(1).

```python
def solve_n_queens(n):
    result = []
    cols_used = set()
    diag1 = set()   # row + col
    diag2 = set()   # row - col
    placement = [-1] * n

    def backtrack(r):
        if r == n:
            board = ["".join("Q" if placement[i] == j else "." for j in range(n)) for i in range(n)]
            result.append(board)                      # L1: O(n²) build board
            return
        for c in range(n):
            if c in cols_used or (r + c) in diag1 or (r - c) in diag2:
                continue                              # L2: O(1) conflict check
            cols_used.add(c)                          # L3: O(1) mark column
            diag1.add(r + c)                          # L4: O(1) mark anti-diag
            diag2.add(r - c)                          # L5: O(1) mark main diag
            placement[r] = c
            backtrack(r + 1)                          # L6: recurse to next row
            cols_used.remove(c)                       # L7: O(1) unmark
            diag1.remove(r + c)
            diag2.remove(r - c)

    backtrack(0)
    return result
```

**Where the time goes, line by line**

*Variables: n = the board size.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (build board) | O(n²) | solutions | O(solutions · n²) |
| L2 (conflict check) | O(1) | n per row per path | O(n · n!) |
| L3/L4/L5 (mark sets) | O(1) | valid placements | O(n!) |
| **L6 (recurse)** | **O(1) dispatch** | **O(n!) nodes** | **O(n!)** ← dominates |
| L7 (unmark) | O(1) | valid placements | O(n!) |

The recursion tree has at most n! leaves (after column pruning). Each level has at most n candidates, but the conflict sets reduce the effective branching to roughly n - row.

**Complexity**
- **Time:** O(n!). Roughly n × (n-2) × (n-4) × ... branches after pruning.
- **Space:** O(n) sets + O(n) recursion.

### Why `row + col` and `row - col`?
Cells on the same anti-diagonal share `row + col` (constant along the up-right direction). Cells on the same main diagonal share `row - col` (constant along the down-right direction). Two integers per conflict dimension suffice to make every check O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute enumerate placements | O(n^n · n²) | O(n^n) |
| Row-by-row + linear check | O(n!) · O(n) | O(n) |
| **Row-by-row + conflict sets** | **O(n!)** | **O(n)** |

The conflict-set template is the classic N-Queens solution and the template for constraint-satisfaction problems more broadly (Sudoku solver, exact cover).

## Test cases

```python
def solve_n_queens(n):
    result = []
    cols_used = set()
    diag1 = set()
    diag2 = set()
    placement = [-1] * n
    def backtrack(r):
        if r == n:
            board = ["".join("Q" if placement[i] == j else "." for j in range(n)) for i in range(n)]
            result.append(board)
            return
        for c in range(n):
            if c in cols_used or (r + c) in diag1 or (r - c) in diag2:
                continue
            cols_used.add(c); diag1.add(r + c); diag2.add(r - c)
            placement[r] = c
            backtrack(r + 1)
            cols_used.remove(c); diag1.remove(r + c); diag2.remove(r - c)
    backtrack(0)
    return result

def _run_tests():
    # n=1: one solution
    assert solve_n_queens(1) == [["Q"]]
    # n=4: two solutions
    r4 = solve_n_queens(4)
    assert len(r4) == 2
    assert sorted(r4) == sorted([[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]])
    # n=5: 10 solutions
    assert len(solve_n_queens(5)) == 10
    # no solution for n=2 or n=3
    assert solve_n_queens(2) == []
    assert solve_n_queens(3) == []
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Hash Tables](../../../data-structures/hash-tables/), columns and diagonals as O(1) sets
- [Arrays](../../../data-structures/arrays/), the board representation
