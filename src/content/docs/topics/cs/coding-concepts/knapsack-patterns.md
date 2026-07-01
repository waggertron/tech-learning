---
title: Knapsack Patterns
description: "Choose-or-skip DP tactics for capacity, subset, and target-sum problems."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Knapsack patterns model decisions as choose or skip under a capacity, target, or budget. Each item asks whether it enters the solution, and the state records the remaining or used capacity.

The invariant is that after processing some prefix of items, the DP state records the best value or feasibility for each capacity. For 0/1 knapsack, each item can be used once. For unbounded knapsack, the same item can be reused.

The direction of the capacity loop carries meaning. In 0/1 knapsack, iterate capacity backward so the current item is not reused in the same round. In unbounded knapsack, iterate forward when reuse is allowed.

## Value

The value is converting exponential subset choice into a table indexed by item and capacity. This gives a systematic way to solve partition, target sum, and coin-style problems.

### Direct complexity example

- **Brute force:** Enumerate all subsets of `n` items: $O(2^n)$ time and $O(n)$ recursion depth.
- **With this tactic:** Use DP over items and target capacity: $O(nC)$ time, where `C` is the capacity or target value.
- **Space:** A full table uses $O(nC)$ space. A one-dimensional capacity array often reduces it to $O(C)$ space.

## Challenges this solves

- partition equal subset sum
- target sum
- coin change variants
- minimum coins
- bounded and unbounded choices

## When to use it

Use this tactic when these conditions are true:

- each item can be chosen or skipped
- there is a target sum, capacity, or budget
- the order of chosen items does not matter unless stated
- the constraints make pseudo-polynomial time acceptable

## When not to use it

Reach for a different tactic when these warning signs appear:

- capacity is too large for $O(nC)$
- item order matters and the state needs position ordering
- fractional choices are allowed and greedy sorting may fit
- there is no reusable target or capacity dimension

## Terminology clues

These prompt words often point toward this concept:

- subset
- partition
- target sum
- capacity
- coins
- choose or skip
- 0/1
- unbounded

## Problems that use it

- [322. Coin Change](../coding-problems/1d-dynamic-programming/322-coin-change/)
- [416. Partition Equal Subset Sum](../coding-problems/1d-dynamic-programming/416-partition-equal-subset-sum/)
- [494. Target Sum](../coding-problems/2d-dynamic-programming/494-target-sum/)
- [518. Coin Change II](../coding-problems/2d-dynamic-programming/518-coin-change-ii/)

## Related concepts

- [Dynamic programming](./dynamic-programming/)
- [Tabulation](./tabulation/)
- [State compression](./state-compression/)
