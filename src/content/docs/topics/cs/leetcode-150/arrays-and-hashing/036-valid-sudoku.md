---
title: "36. Valid Sudoku"
description: Determine whether a 9×9 Sudoku board is valid, no duplicates in any row, column, or 3×3 box.
parent: arrays-and-hashing
tags: [leetcode, neetcode-150, arrays, hash-tables, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Determine whether a 9×9 Sudoku board is **valid** (note: not necessarily solvable; just that the current filled cells don't violate any rules):

1. Each row contains the digits 1–9 without repetition.
2. Each column contains the digits 1–9 without repetition.
3. Each of the nine 3×3 sub-boxes contains the digits 1–9 without repetition.

Empty cells are `'.'`.

LeetCode 36 · [Link](https://leetcode.com/problems/valid-sudoku/) · *Medium*

## Approach 1: Brute force, three separate passes

Check rows, then columns, then boxes, each with a fresh set.

```python
def is_valid_sudoku(board: list[list[str]]) -> bool:
    # Rows
    for row in board:
        seen = set()
        for ch in row:
            if ch == '.':
                continue
            if ch in seen:
                return False
            seen.add(ch)

    # Columns
    for c in range(9):
        seen = set()
        for r in range(9):
            ch = board[r][c]
            if ch == '.':
                continue
            if ch in seen:
                return False
            seen.add(ch)

    # 3x3 boxes
    for br in range(0, 9, 3):
        for bc in range(0, 9, 3):
            seen = set()
            for r in range(br, br + 3):
                for c in range(bc, bc + 3):
                    ch = board[r][c]
                    if ch == '.':
                        continue
                    if ch in seen:
                        return False
                    seen.add(ch)
    return True
```

**Complexity**
- **Time:** O(81) = O(1). Fixed board size.
- **Space:** O(9) = O(1) for each set.

Works, but reads the board three times. The larger Big-O lesson: a "constant-sized" input has O(1) time regardless of method; the engineering question is clarity.

## Approach 2: Single pass with nine sets per dimension

Maintain 9 row-sets, 9 column-sets, and 9 box-sets; one pass over the board.

```python
def is_valid_sudoku(board: list[list[str]]) -> bool:
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]

    for r in range(9):
        for c in range(9):
            ch = board[r][c]
            if ch == '.':
                continue
            b = (r // 3) * 3 + (c // 3)
            if ch in rows[r] or ch in cols[c] or ch in boxes[b]:
                return False
            rows[r].add(ch)
            cols[c].add(ch)
            boxes[b].add(ch)
    return True
```

**Complexity**
- **Time:** O(81) = O(1).
- **Space:** O(81) = O(1).

One pass, short-circuits on the first conflict.

## Approach 3: Bitmask-based single pass (optimal constant factors)

Replace each set with a 9-bit integer. Bit `i` is set if digit `i+1` is already present.

```python
def is_valid_sudoku(board: list[list[str]]) -> bool:
    rows = [0] * 9
    cols = [0] * 9
    boxes = [0] * 9

    for r in range(9):
        for c in range(9):
            ch = board[r][c]
            if ch == '.':
                continue
            bit = 1 << (int(ch), 1)
            b = (r // 3) * 3 + (c // 3)
            if rows[r] & bit or cols[c] & bit or boxes[b] & bit:
                return False
            rows[r] |= bit
            cols[c] |= bit
            boxes[b] |= bit
    return True
```

**Complexity**
- **Time:** O(1). Same as the hash-set version but with constant-factor gains from integer bit ops vs. set ops.
- **Space:** O(1). 27 integers vs. 27 sets of up to 9 strings.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| 3 separate passes | O(1) | O(1) | Easiest to read |
| Single pass, 27 sets | O(1) | O(1) | Short-circuit on first conflict |
| **Single pass, bitmasks** | **O(1)** | **O(1)** | Fastest constant factor |

All approaches are formally O(1) because the board is fixed-size; the differences are clarity and constant-factor speed. The bitmask version is the classic "good-enough-for-interview" flex.

## Related data structures

- [Arrays](../../../data-structures/arrays/), the 9×9 board; indexing arithmetic for the box number
- [Hash Tables](../../../data-structures/hash-tables/), per-row/col/box membership sets
