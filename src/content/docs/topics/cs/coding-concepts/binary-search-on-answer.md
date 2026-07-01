---
title: Binary Search on Answer
description: "Feasibility-search tactics for finding the smallest or largest value that satisfies a monotonic condition."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Binary search on answer searches values rather than positions. You guess a possible answer, run a feasibility check, and use monotonicity to keep the half that can still contain the optimum.

The invariant is a true-false boundary over answer values. For minimization, values below the answer are impossible and values at or above it are feasible. For maximization, the direction is reversed.

The hard part is the predicate. It must answer yes or no for one candidate without solving the whole optimization directly. If the predicate is not monotonic, binary search will confidently throw away valid answers.

## Value

The value is replacing an optimization search over many possible values with logarithmically many feasibility checks. It is especially useful when direct construction is messy but checking a candidate is simple.

### Direct complexity example

- **Brute force:** Try every possible speed, capacity, day, or threshold: $O(R \cdot f(n))$ time for answer range size `R` and check cost `f(n)`.
- **With this tactic:** Binary search the threshold: $O(\log R \cdot f(n))$ time and usually $O(1)$ extra space.
- **Space:** The predicate may use extra space, but many interview versions use a single scan with constant state.

## Challenges this solves

- minimum feasible speed
- capacity planning
- split array largest sum
- ship packages within days
- maximize minimum distance

## When to use it

Use this tactic when these conditions are true:

- the problem asks for the smallest value that works or largest value that works
- a candidate answer can be checked greedily or with a scan
- feasibility only gets easier or only gets harder as the candidate changes
- the value range is large but ordered

## When not to use it

Reach for a different tactic when these warning signs appear:

- the predicate flips between true and false multiple times
- constructing the feasibility check is as hard as the original problem
- the answer range is tiny enough for direct enumeration
- precision requirements are not clear for real-valued answers

## Terminology clues

These prompt words often point toward this concept:

- minimum possible
- maximize the minimum
- capacity
- speed
- threshold
- within days
- feasible
- can we

## Problems that use it

- [778. Swim in Rising Water](../coding-problems/advanced-graphs/778-swim-in-rising-water/)
- [875. Koko Eating Bananas](../coding-problems/binary-search/875-koko-eating-bananas/)

## Related concepts

- [Binary search](./binary-search/)
- [Greedy algorithms](./greedy-algorithms/)
- [Shortest paths](./shortest-paths/)
