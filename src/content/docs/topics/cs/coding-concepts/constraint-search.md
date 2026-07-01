---
title: Constraint Search
description: "Pruned search tactics for problems where each choice must satisfy local and global constraints."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Constraint search is backtracking with strong validity checks. The search tries choices, rejects impossible partial states early, and restores state after each branch.

## Value

The value is pruning. Good constraints turn impossible exponential search into a much smaller practical tree.

## Challenges this solves

- board placement
- word path search
- pattern matching
- valid partitioning
- constraint satisfaction

## When to use it

Use it when a partial answer can be checked before it becomes complete.

## When not to use it

Do not use it without pruning when the branching factor is huge and repeated states are common. Add memoization or a stronger representation.

## Terminology clues

- valid placement
- cannot reuse
- board
- constraint
- path exists
- search all choices

## Problems that use it

- [79. Word Search](../coding-problems/backtracking/079-word-search/)
- [51. N-Queens](../coding-problems/backtracking/051-n-queens/)
- [10. Regular Expression Matching](../coding-problems/2d-dynamic-programming/010-regular-expression-matching/)
- [36. Valid Sudoku](../coding-problems/arrays-and-hashing/036-valid-sudoku/)

## Related concepts

- [Backtracking](./backtracking/)
- [Memoization](./memoization/)
- [Flood fill](./flood-fill/)
