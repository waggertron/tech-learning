---
title: Binary Search
description: "Monotonic search tactics for cutting a sorted or ordered search space in half until one answer remains."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Binary search keeps a search interval and removes half of it after each comparison. The move only works when the remaining candidates have an order that tells you which half cannot contain the answer.

The invariant is that the answer, if it exists, is inside `[lo, hi]` or inside a half-open range such as `[lo, hi)`. Every branch must preserve that invariant. Most binary search bugs are boundary bugs, not idea bugs.

Pick a range convention before coding. Decide whether `hi` is inclusive, what `mid` means, and how the loop terminates. For lower-bound style searches, the predicate is usually false on one side and true on the other.

## Value

The value is logarithmic elimination. It is one of the few tactics that changes linear search into logarithmic search without using extra memory.

### Direct complexity example

- **Brute force:** Scan a sorted array for a target or boundary: $O(n)$ time and $O(1)$ space.
- **With this tactic:** Discard half the candidates each iteration: $O(\log n)$ time and $O(1)$ space.
- **Space:** Recursive binary search uses $O(\log n)$ stack space. Iterative binary search keeps $O(1)$ space.

## Challenges this solves

- target lookup in sorted data
- first or last occurrence
- lower bound and upper bound
- minimum true predicate
- ordered answer spaces

## When to use it

Use this tactic when these conditions are true:

- the candidates are sorted or logically ordered
- a comparison tells you one side is impossible
- the prompt asks for `O(log n)` time
- you can phrase the goal as finding the first true or last false position

## When not to use it

Reach for a different tactic when these warning signs appear:

- the data has no monotonic structure
- the cost of checking the middle is already too expensive
- updates happen between searches and the structure is not maintained
- floating-point precision makes termination unclear without a fixed iteration count

## Terminology clues

These prompt words often point toward this concept:

- sorted
- logarithmic
- first occurrence
- last occurrence
- lower bound
- minimum value
- monotonic
- search space

## Problems that use it

- [33. Search in Rotated Sorted Array](../coding-problems/binary-search/033-search-in-rotated-sorted-array/)
- [74. Search a 2D Matrix](../coding-problems/binary-search/074-search-a-2d-matrix/)
- [153. Find Minimum in Rotated Sorted Array](../coding-problems/binary-search/153-find-minimum-in-rotated-sorted-array/)
- [162. Find Peak Element](../coding-problems/binary-search/162-find-peak-element/)
- [167. Two Sum II, Input Array Is Sorted](../coding-problems/two-pointers/167-two-sum-ii/)
- [704. Binary Search](../coding-problems/binary-search/704-binary-search/)
- [875. Koko Eating Bananas](../coding-problems/binary-search/875-koko-eating-bananas/)
- [981. Time Based Key-Value Store](../coding-problems/binary-search/981-time-based-key-value-store/)

## Related concepts

- [Binary search on answer](./binary-search-on-answer/)
- [Modified binary search](./modified-binary-search/)
- [Sorting as preprocessing](./sorting-as-preprocessing/)
