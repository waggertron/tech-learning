---
title: Tabulation
description: "Bottom-up DP tactics for filling states in dependency order without recursion."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Tabulation is bottom-up dynamic programming. Instead of asking recursion to discover states, you choose an order and fill the table from base cases toward the final answer.

The invariant is dependency order. When the loop reaches a state, every state needed to compute it has already been filled.

The design work is drawing arrows between states. If `dp[i]` depends on `dp[i - 1]` and `dp[i - 2]`, iterate `i` upward. If a grid cell depends on top and left, scan rows and columns. If an interval depends on shorter intervals, iterate by length.

## Value

The value is predictable evaluation and no recursion overhead. Tabulation also makes state compression easier because the dependency distance is visible in the loop structure.

### Direct complexity example

- **Brute force:** Use recursion with repeated calls or cache lookups for every transition: time may be fine with memoization, but stack overhead and unreachable-order reasoning remain.
- **With this tactic:** Fill each state once in loop order: $O(\text{states} \times \text{transition cost})$ time.
- **Space:** The table costs $O(\text{states})$ space before compression. Rolling arrays often reduce a row-based table to $O(\text{width})$ or $O(1)$.

## Challenges this solves

- climbing stairs
- coin change
- unique paths
- edit distance
- knapsack tables
- sequence alignment

## When to use it

Use this tactic when these conditions are true:

- base cases are clear
- the dependency order is acyclic and easy to loop over
- recursion depth would be annoying
- you want to inspect or optimize memory layout

## When not to use it

Reach for a different tactic when these warning signs appear:

- the dependency order is hard to derive and memoization is clearer
- most states are unreachable
- the state graph has cycles
- a greedy invariant removes the need for a table

## Terminology clues

These prompt words often point toward this concept:

- bottom-up
- table
- dp array
- fill order
- base case
- transition
- previous row
- previous state

## Problems that use it

- [62. Unique Paths](../coding-problems/2d-dynamic-programming/062-unique-paths/)
- [70. Climbing Stairs](../coding-problems/1d-dynamic-programming/070-climbing-stairs/)
- [322. Coin Change](../coding-problems/1d-dynamic-programming/322-coin-change/)
- [1143. Longest Common Subsequence](../coding-problems/2d-dynamic-programming/1143-longest-common-subsequence/)

## Related concepts

- [Dynamic programming](./dynamic-programming/)
- [Memoization](./memoization/)
- [State compression](./state-compression/)
