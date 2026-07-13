---
title: State Compression
description: "DP memory tactics for keeping only the previous states needed for the next transition."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

State compression keeps only the DP states that future transitions still need. A full table is replaced by a few variables, a rolling row, or a compact bitmask.

The invariant is dependency distance. If `dp[i]` only depends on `dp[i - 1]` and `dp[i - 2]`, older states can be discarded. If a grid row only depends on the row above, one row may be enough.

Compress after the full recurrence is correct. Premature compression hides mistakes because names like `prev` and `curr` are less descriptive than table entries.

## Value

The value is memory reduction without changing the mathematical recurrence. It often changes an accepted solution into the interview-quality version.

### Direct complexity example

- **Brute force:** Store the full DP table for a one-dimensional recurrence or grid: $O(n)$ or $O(mn)$ space.
- **With this tactic:** Keep only the previous states needed by the next transition: $O(1)$ for many 1D recurrences, or $O(n)$ for a grid row.
- **Space:** Time usually stays the same as the full DP. The saving is mostly space, although cache locality can improve constants.

## Challenges this solves

- house robber
- climbing stairs
- stock state machines
- grid path rows
- knapsack capacity arrays

## When to use it

Use this tactic when these conditions are true:

- the recurrence only looks back a fixed number of steps
- only the previous row or column is needed
- the full table is not needed for reconstruction
- memory constraints are tight

## When not to use it

Reach for a different tactic when these warning signs appear:

- the final answer requires reconstructing the full path or choices
- future transitions need arbitrary earlier states
- compression makes update order easy to get wrong
- clarity matters more than memory for the current constraints

## Terminology clues

These prompt words often point toward this concept:

- optimize space
- rolling array
- previous two
- in-place DP
- constant space
- memory limit
- state machine

## Problems that use it

- [62. Unique Paths](../../coding-problems/2d-dynamic-programming/062-unique-paths/)
- [198. House Robber](../../coding-problems/1d-dynamic-programming/198-house-robber/)
- [213. House Robber II](../../coding-problems/1d-dynamic-programming/213-house-robber-ii/)
- [309. Best Time to Buy and Sell Stock with Cooldown](../../coding-problems/2d-dynamic-programming/309-best-time-to-buy-and-sell-stock-with-cooldown/)
- [714. Best Time to Buy and Sell Stock with Transaction Fee](../../coding-problems/2d-dynamic-programming/714-best-time-to-buy-and-sell-stock-with-transaction-fee/)
- [746. Min Cost Climbing Stairs](../../coding-problems/1d-dynamic-programming/746-min-cost-climbing-stairs/)

## Related concepts

- [Dynamic programming](../dynamic-programming/)
- [Tabulation](../tabulation/)
- [Bitmask state](../bitmask-state/)
