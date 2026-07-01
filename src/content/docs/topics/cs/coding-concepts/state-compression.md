---
title: State Compression
description: "DP memory tactics for keeping only the previous states needed for the next transition."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

State compression observes that many DP tables only need the previous row, previous column, or a few scalar states. The full table can be replaced with a rolling array or variables.

## Value

The value is lower memory with the same recurrence. It is often the final optimization after a clear table solution works.

## Challenges this solves

- linear DP with last two states
- grid DP using one row
- stock state machines
- rolling sequence comparisons

## When to use it

Use it after identifying exactly which prior states each transition reads.

## When not to use it

Do not compress too early if it hides the recurrence or if later reconstruction needs the whole table.

## Terminology clues

- optimize space
- only depends on previous
- rolling array
- two variables
- O(1) space

## Problems that use it

- [198. House Robber](../coding-problems/1d-dynamic-programming/198-house-robber/)
- [746. Min Cost Climbing Stairs](../coding-problems/1d-dynamic-programming/746-min-cost-climbing-stairs/)
- [714. Best Time to Buy and Sell Stock with Transaction Fee](../coding-problems/2d-dynamic-programming/714-best-time-to-buy-and-sell-stock-with-transaction-fee/)
- [62. Unique Paths](../coding-problems/2d-dynamic-programming/062-unique-paths/)

## Related concepts

- [Dynamic programming](./dynamic-programming/)
- [Tabulation](./tabulation/)
- [Bitmask state](./bitmask-state/)
