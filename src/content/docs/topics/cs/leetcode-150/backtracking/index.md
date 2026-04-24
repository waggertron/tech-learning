---
title: Backtracking
description: 9 problems where the answer is built one choice at a time, with an undo step that lets you try a different branch when the current one fails.
parent: leetcode-150
tags: [leetcode, neetcode-150, backtracking, recursion]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Backtracking is DFS on an implicit tree of partial solutions. The template:

```
def backtrack(path, choices):
    if terminal(path):
        record(path)
        return
    for choice in choices:
        if not valid(path, choice):
            continue
        path.append(choice)
        backtrack(path, next_choices(path))
        path.pop()           # undo, this is what makes it "back" tracking
```

The three moving parts:

- **The path**, a mutable list of choices made so far. Use `append`/`pop`; passing the path avoids O(n) slicing per call.
- **The choices**, a list of options at the current level.
- **The pruning**, predicates that skip dead branches. Pruning is usually what distinguishes a fast backtracking solution from a slow one.

Classic patterns: subsets, combinations, permutations, grid DFS, and constraint-satisfaction problems like N-Queens.

## Problems

1. [78. Subsets](./078-subsets/), *Medium*
2. [39. Combination Sum](./039-combination-sum/), *Medium*
3. [46. Permutations](./046-permutations/), *Medium*
4. [90. Subsets II](./090-subsets-ii/), *Medium*
5. [40. Combination Sum II](./040-combination-sum-ii/), *Medium*
6. [79. Word Search](./079-word-search/), *Medium*
7. [131. Palindrome Partitioning](./131-palindrome-partitioning/), *Medium*
8. [17. Letter Combinations of a Phone Number](./017-letter-combinations-of-a-phone-number/), *Medium*
9. [51. N-Queens](./051-n-queens/), *Hard*

## Key patterns unlocked here

- **Include/exclude recursion**, Subsets.
- **Target-sum with start index (no reuse vs. with reuse)**, Combination Sum I and II.
- **Permutation with "used" array or in-place swap**, Permutations.
- **Dedup via sort + skip-at-same-level**, Subsets II, Combination Sum II.
- **Grid DFS with mutation-as-visited**, Word Search.
- **Backtracking + precomputed palindrome DP**, Palindrome Partitioning.
- **Cartesian-product DFS**, Letter Combinations.
- **Constraint satisfaction with conflict sets**, N-Queens.
