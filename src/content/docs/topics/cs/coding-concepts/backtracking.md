---
title: Backtracking
description: "Search-tree tactics for exploring choices, undoing state, and pruning invalid branches."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Backtracking builds a partial answer, tries a choice, recurses, then undoes the choice before trying the next one.

## Value

The value is exhaustive search with discipline. It handles problems where all valid combinations, permutations, or placements may need to be explored.

## Challenges this solves

- subsets
- permutations
- combinations
- board placement
- word search
- partitioning

## When to use it

Use it when the prompt asks for all arrangements or when constraints are too intertwined for a simple greedy choice.

## When not to use it

Do not use raw backtracking when the same state repeats heavily. Add memoization or switch to DP.

## Terminology clues

- all possible
- generate
- combination
- permutation
- valid arrangement
- place
- choose

## Problems that use it

- [39. Combination Sum](../coding-problems/backtracking/039-combination-sum/)
- [46. Permutations](../coding-problems/backtracking/046-permutations/)
- [51. N-Queens](../coding-problems/backtracking/051-n-queens/)
- [79. Word Search](../coding-problems/backtracking/079-word-search/)

## Related concepts

- [Subsets and combinations](./subsets-and-combinations/)
- [Permutations](./permutations/)
- [Constraint search](./constraint-search/)
- [Memoization](./memoization/)
