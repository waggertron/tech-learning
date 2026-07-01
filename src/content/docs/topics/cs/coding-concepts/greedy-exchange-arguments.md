---
title: Greedy Exchange Arguments
description: "Proof tactics for showing that a greedy choice can be swapped into an optimal solution without making it worse."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

A greedy exchange argument is the proof tool behind many greedy algorithms. It shows that if an optimal solution does not use the greedy choice, you can exchange part of that solution for the greedy choice without making the result worse.

The invariant is compatibility with some optimum. After each greedy step, at least one optimal solution remains that agrees with every choice already made.

To use it, name the greedy choice, take an arbitrary optimal solution, find the first place it differs, and swap in the greedy choice. The proof succeeds only if the swapped solution stays valid and keeps the same or better objective.

## Value

The value is knowing when greedy is not just plausible. Many wrong greedy answers sound reasonable until a counterexample appears. Exchange reasoning is the guardrail that separates a theorem from a hunch.

### Direct complexity example

- **Brute force:** Prove greedy by testing examples only: fast to write, but no complexity guarantee and no protection against hidden cases.
- **With this tactic:** Use exchange reasoning to justify a one-pass, sorted, or heap-based greedy algorithm: the algorithm cost stays the same, often $O(n)$ or $O(n \log n)$, but the proof becomes durable.
- **Space:** The proof itself uses no runtime space. The algorithm it supports may use constant space, sorted storage, or a heap depending on the tactic.

## Challenges this solves

- interval scheduling proofs
- minimum arrows and removals
- choosing smallest feasible item
- earliest deadline or earliest finish rules
- minimum spanning tree cut arguments

## When to use it

Use this tactic when these conditions are true:

- you can describe a tempting local choice
- the choice order is sorted by one key
- you need to convince yourself greedy is exact
- the problem asks for an optimum and DP feels too broad

## When not to use it

Reach for a different tactic when these warning signs appear:

- the swap breaks feasibility
- the objective changes in a way you cannot bound
- choices interact through hidden state
- a simple counterexample shows local best is not global best

## Terminology clues

These prompt words often point toward this concept:

- prove greedy
- exchange
- swap
- without loss of generality
- earliest
- smallest feasible
- cut property
- stays optimal

## Problems that use it

- [11. Container With Most Water](../coding-problems/two-pointers/011-container-with-most-water/)
- [134. Gas Station](../coding-problems/greedy/134-gas-station/)
- [435. Non-overlapping Intervals](../coding-problems/intervals/435-non-overlapping-intervals/)
- [846. Hand of Straights](../coding-problems/greedy/846-hand-of-straights/)

## Related concepts

- [Greedy algorithms](./greedy-algorithms/)
- [Intervals](./intervals/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
