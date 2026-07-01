---
title: Binary Search
description: "Monotonic search tactics for cutting a sorted or ordered search space in half until one answer remains."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Binary search keeps a search interval and uses a midpoint test to discard half. The hard part is defining the predicate and preserving the invariant around the remaining answer.

## Value

The value is logarithmic search. Any ordered space with a monotonic yes/no boundary can often be solved in $O(log n)$ checks.

## Challenges this solves

- exact lookup
- first or last valid index
- rotated sorted arrays
- matrix search
- time-indexed lookup

## When to use it

Use it when the search space is sorted, virtually sorted, or has a monotonic predicate.

## When not to use it

Do not use it when the predicate can switch from true to false multiple times. That breaks the boundary model.

## Terminology clues

- sorted
- minimum possible
- maximum possible
- first true
- last false
- rotated
- log n

## Problems that use it

- [704. Binary Search](../coding-problems/binary-search/704-binary-search/)
- [33. Search in Rotated Sorted Array](../coding-problems/binary-search/033-search-in-rotated-sorted-array/)
- [74. Search a 2D Matrix](../coding-problems/binary-search/074-search-a-2d-matrix/)
- [981. Time Based Key-Value Store](../coding-problems/binary-search/981-time-based-key-value-store/)

## Related concepts

- [Binary search on answer](./binary-search-on-answer/)
- [Modified binary search](./modified-binary-search/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
