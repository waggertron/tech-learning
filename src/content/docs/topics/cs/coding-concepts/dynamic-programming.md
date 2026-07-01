---
title: Dynamic Programming
description: "State-and-transition tactics for solving overlapping subproblems with cached answers."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Dynamic programming defines a state, a recurrence, base cases, and an evaluation order. Each state answers one reusable subproblem.

## Value

The value is controlled reuse. DP turns exponential repeated search into polynomial work when subproblems overlap.

## Challenges this solves

- counting ways
- minimum cost
- maximum score
- sequence alignment
- choice with constraints
- grid paths

## When to use it

Use it when a brute-force recursion asks the same question many times, or when a decision splits into smaller versions of the same problem.

## When not to use it

Do not use DP when there is no overlapping subproblem structure. A one-pass greedy invariant or direct formula may be cleaner.

## Terminology clues

- number of ways
- min cost
- max profit
- can form
- choose or skip
- optimal substructure
- overlapping subproblems

## Problems that use it

- [198. House Robber](../coding-problems/1d-dynamic-programming/198-house-robber/)
- [322. Coin Change](../coding-problems/1d-dynamic-programming/322-coin-change/)
- [1143. Longest Common Subsequence](../coding-problems/2d-dynamic-programming/1143-longest-common-subsequence/)
- [72. Edit Distance](../coding-problems/2d-dynamic-programming/072-edit-distance/)

## Related concepts

- [Memoization](./memoization/)
- [Tabulation](./tabulation/)
- [State compression](./state-compression/)
- [Greedy algorithms](./greedy-algorithms/)
