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

1. [78. Subsets (Medium)](./078-subsets/)
2. [39. Combination Sum (Medium)](./039-combination-sum/)
3. [46. Permutations (Medium)](./046-permutations/)
4. [90. Subsets II (Medium)](./090-subsets-ii/)
5. [40. Combination Sum II (Medium)](./040-combination-sum-ii/)
6. [79. Word Search (Medium)](./079-word-search/)
7. [131. Palindrome Partitioning (Medium)](./131-palindrome-partitioning/)
8. [17. Letter Combinations of a Phone Number (Medium)](./017-letter-combinations-of-a-phone-number/)
9. [51. N-Queens (Hard)](./051-n-queens/)

## Key patterns unlocked here

- **Include/exclude recursion**, Subsets.
- **Target-sum with start index (no reuse vs. with reuse)**, Combination Sum I and II.
- **Permutation with "used" array or in-place swap**, Permutations.
- **Dedup via sort + skip-at-same-level**, Subsets II, Combination Sum II.
- **Grid DFS with mutation-as-visited**, Word Search.
- **Backtracking + precomputed palindrome DP**, Palindrome Partitioning.
- **Cartesian-product DFS**, Letter Combinations.
- **Constraint satisfaction with conflict sets**, N-Queens.
