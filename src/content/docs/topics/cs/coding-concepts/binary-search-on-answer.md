---
title: Binary Search on Answer
description: "Feasibility-search tactics for finding the smallest or largest value that satisfies a monotonic condition."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Binary search on answer searches values, not indices. A helper function answers whether a candidate value is feasible, and feasibility must be monotonic.

## Value

The value is turning optimization into decision. If checking a candidate is easier than constructing the optimum directly, this tactic is often the cleanest route.

## Challenges this solves

- minimum feasible speed
- capacity or threshold search
- minimize the maximum
- maximize the minimum
- water-level or time constraints

## When to use it

Use it when the prompt asks for a minimum or maximum value and larger candidates only make feasibility easier, or only make it harder.

## When not to use it

Do not use it if candidate feasibility is not monotonic or if the check is as expensive as brute-forcing every answer.

## Terminology clues

- minimum speed
- capacity
- can finish within
- smallest possible
- largest possible
- threshold
- feasible

## Problems that use it

- [875. Koko Eating Bananas](../coding-problems/binary-search/875-koko-eating-bananas/)
- [778. Swim in Rising Water](../coding-problems/advanced-graphs/778-swim-in-rising-water/)

## Related concepts

- [Binary search](./binary-search/)
- [Greedy algorithms](./greedy-algorithms/)
- [Shortest paths](./shortest-paths/)
