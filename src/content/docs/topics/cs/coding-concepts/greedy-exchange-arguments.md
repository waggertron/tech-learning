---
title: Greedy Exchange Arguments
description: "Proof tactics for showing that a greedy choice can be swapped into an optimal solution without making it worse."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

An exchange argument starts with an optimal solution that may not use the greedy choice. It then swaps in the greedy choice and proves the solution remains valid and no worse.

## Value

The value is confidence. Greedy code is usually short, but the exchange proof is what makes it acceptable in an interview or review.

## Challenges this solves

- interval scheduling
- resource assignment
- container boundary movement
- sorted frequency consumption
- minimum removals

## When to use it

Use it when a local choice seems safe but needs proof against an arbitrary optimal solution.

## When not to use it

Do not use an exchange argument if choices interact through hidden future state that cannot survive the swap.

## Terminology clues

- prove greedy
- why is this safe
- earliest finish
- shorter side
- exchange
- without loss of optimality

## Problems that use it

- [11. Container With Most Water](../coding-problems/two-pointers/011-container-with-most-water/)
- [134. Gas Station](../coding-problems/greedy/134-gas-station/)
- [846. Hand of Straights](../coding-problems/greedy/846-hand-of-straights/)
- [435. Non-overlapping Intervals](../coding-problems/intervals/435-non-overlapping-intervals/)

## Related concepts

- [Greedy algorithms](./greedy-algorithms/)
- [Intervals](./intervals/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
