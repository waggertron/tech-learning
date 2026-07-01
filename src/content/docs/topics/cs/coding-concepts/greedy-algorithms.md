---
title: Greedy Algorithms
description: "Local-choice tactics for solving optimization and reachability problems when a provable invariant protects the future."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Greedy algorithms make the locally best move and rely on an invariant that this move never makes the global answer worse.

## Value

The value is speed and simplicity. When the proof holds, greedy often replaces DP or search with one scan or one sorted scan.

## Challenges this solves

- reachability frontiers
- partitioning by last occurrence
- running best subarray
- choosing earliest finish or smallest valid item
- range of possible states

## When to use it

Use it when a local choice dominates all alternatives, or when any optimal solution can be transformed to include the greedy choice.

## When not to use it

Do not use it just because the algorithm feels intuitive. If there is no exchange argument or monotone invariant, try DP or search.

## Terminology clues

- locally optimal
- minimum number of
- can reach
- earliest
- latest
- maximum profit
- choose greedily

## Problems that use it

- [55. Jump Game](../coding-problems/greedy/055-jump-game/)
- [134. Gas Station](../coding-problems/greedy/134-gas-station/)
- [763. Partition Labels](../coding-problems/greedy/763-partition-labels/)
- [53. Maximum Subarray](../coding-problems/greedy/053-maximum-subarray/)

## Related concepts

- [Greedy exchange arguments](./greedy-exchange-arguments/)
- [Dynamic programming](./dynamic-programming/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
