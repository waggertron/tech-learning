---
title: Tabulation
description: "Bottom-up DP tactics for filling states in dependency order without recursion."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Tabulation builds a table from base cases toward the final state. The loop order guarantees that every dependency is already known.

## Value

The value is predictable execution. It avoids recursion depth, makes memory shape explicit, and often enables space optimization.

## Challenges this solves

- linear recurrence
- grid paths
- coin-change tables
- sequence alignment
- edit distance

## When to use it

Use it when dependencies have a clear order, such as left to right, smaller amount to larger amount, or bottom-right to top-left.

## When not to use it

Do not force tabulation when reachable states are sparse and a top-down cache would visit far fewer states.

## Terminology clues

- bottom-up
- dp table
- base case row
- fill from
- previous states
- recurrence

## Problems that use it

- [70. Climbing Stairs](../coding-problems/1d-dynamic-programming/070-climbing-stairs/)
- [62. Unique Paths](../coding-problems/2d-dynamic-programming/062-unique-paths/)
- [322. Coin Change](../coding-problems/1d-dynamic-programming/322-coin-change/)
- [1143. Longest Common Subsequence](../coding-problems/2d-dynamic-programming/1143-longest-common-subsequence/)

## Related concepts

- [Dynamic programming](./dynamic-programming/)
- [Memoization](./memoization/)
- [State compression](./state-compression/)
