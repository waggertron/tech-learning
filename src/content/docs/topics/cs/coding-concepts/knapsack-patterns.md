---
title: Knapsack Patterns
description: "Choose-or-skip DP tactics for capacity, subset, and target-sum problems."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Knapsack patterns track what can be achieved after considering each item. The transition either uses the item or skips it.

## Value

The value is taming combinatorial choice. Instead of enumerating all subsets, states summarize capacities, sums, or counts.

## Challenges this solves

- subset sum
- partition into equal sums
- minimum coins
- count combinations
- assign signs to hit target

## When to use it

Use it when each item can be included, excluded, or used a limited number of times under a capacity-like constraint.

## When not to use it

Do not use knapsack when item order matters in the answer. Sequence DP or backtracking may be the real model.

## Terminology clues

- choose items
- target sum
- capacity
- subset
- partition
- coins
- can make amount

## Problems that use it

- [416. Partition Equal Subset Sum](../coding-problems/1d-dynamic-programming/416-partition-equal-subset-sum/)
- [494. Target Sum](../coding-problems/2d-dynamic-programming/494-target-sum/)
- [322. Coin Change](../coding-problems/1d-dynamic-programming/322-coin-change/)
- [518. Coin Change II](../coding-problems/2d-dynamic-programming/518-coin-change-ii/)

## Related concepts

- [Dynamic programming](./dynamic-programming/)
- [Tabulation](./tabulation/)
- [State compression](./state-compression/)
