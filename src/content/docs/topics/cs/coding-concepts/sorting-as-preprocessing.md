---
title: Sorting as Preprocessing
description: "Order-first tactics that pay O(n log n) so adjacency, monotonic movement, or greedy choice becomes visible."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Sorting as preprocessing changes the problem from arbitrary order to a structured order. After that, duplicates group together, intervals align, and pointer moves become meaningful.

## Value

The value is exposing hidden structure. A sort often trades $O(n^2)$ uncertainty for a clean $O(n log n)$ scan.

## Challenges this solves

- deduplication
- n-sum search
- interval merging
- greedy scheduling
- frequency consumption in order

## When to use it

Use it when original order is irrelevant or when the answer depends on relative ordering rather than positions.

## When not to use it

Do not sort when the original index order is part of the answer, or when the prompt requires stable original positions.

## Terminology clues

- return any order
- pairs or triples
- merge
- minimum removals
- schedule
- sort first
- can reorder

## Problems that use it

- [15. 3Sum](../coding-problems/two-pointers/015-3sum/)
- [56. Merge Intervals](../coding-problems/intervals/056-merge-intervals/)
- [846. Hand of Straights](../coding-problems/greedy/846-hand-of-straights/)
- [435. Non-overlapping Intervals](../coding-problems/intervals/435-non-overlapping-intervals/)

## Related concepts

- [Two pointers](./two-pointers/)
- [Intervals](./intervals/)
- [Greedy algorithms](./greedy-algorithms/)
