---
title: Memoization
description: "Top-down caching tactics for preserving recursive clarity while avoiding repeated subproblem work."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Memoization writes the natural recursion first, then caches each state result by its parameters. Later calls return the stored answer.

## Value

The value is fast correctness. It lets you keep the brute-force state shape while cutting repeated branches.

## Challenges this solves

- recursive DP
- string segmentation
- target sums
- grid recursion
- regex matching
- game states

## When to use it

Use it when recursion is easy to write and the same `(index, remaining, mode)` state appears many times.

## When not to use it

Do not rely on memoization when recursion depth is too high for the language or when bottom-up order is simple and cheaper.

## Terminology clues

- recursive solution times out
- cache results
- same state
- top-down DP
- index and remaining

## Problems that use it

- [139. Word Break](../coding-problems/1d-dynamic-programming/139-word-break/)
- [494. Target Sum](../coding-problems/2d-dynamic-programming/494-target-sum/)
- [97. Interleaving String](../coding-problems/2d-dynamic-programming/097-interleaving-string/)
- [10. Regular Expression Matching](../coding-problems/2d-dynamic-programming/010-regular-expression-matching/)

## Related concepts

- [Dynamic programming](./dynamic-programming/)
- [Tabulation](./tabulation/)
- [Backtracking](./backtracking/)
