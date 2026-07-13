---
title: Binary Search
description: "8 problems that teach binary search in all its forms: on sorted arrays, on rotated arrays, on the answer space, and on partitioned structures."
parent: coding-problems
tags: [leetcode, neetcode-150, binary-search]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## The binary-search invariant

Binary search is deceptively simple: halve the search space using a comparison. The discipline comes from getting the invariants right, open vs. closed intervals, off-by-one at the boundaries, and correct loop termination. Once the basic template is solid, the pattern generalizes in three ways:

- **On sorted data**: the textbook case (Binary Search, Search in 2D Matrix).
- **On rotated / partially-sorted data**: use the fact that one half is always sorted (Find Minimum in Rotated, Search in Rotated).
- **On the answer space**: when the *value* you're solving for is monotonic in feasibility (Koko Eating Bananas, Capacity to Ship, Minimum Days to Make Bouquets).

The core question is always the same: can one comparison prove that half the search space cannot contain the answer? If yes, binary search is possible. If no, the array being sorted is not enough.

## How to choose the variant

| Prompt shape | Variant | What the comparison proves |
| --- | --- | --- |
| Sorted array, find exact target | Classic binary search | Target is left, right, or found at mid. |
| Sorted matrix with row ordering | Flattened index search | A virtual 1-D index maps back to `(row, col)`. |
| Rotated sorted array | Modified binary search | At least one half is sorted, so one side can be discarded. |
| Minimum feasible speed/capacity/day | Binary search on answer | Feasibility changes from false to true at one boundary. |
| Time-stamped values | Per-key binary search | Timestamps are sorted inside each key's history. |
| Median across two sorted arrays | Partition search | Left partitions must contain the lower half of values. |
| Peak in a slope-shaped array | Slope-direction search | The larger neighbor points toward at least one peak. |

For answer-space problems, write the predicate first. It should read like `can_finish(speed)` or `is_enough(capacity)`. Then prove it is monotonic: once a speed is fast enough, every larger speed is also fast enough. Without that one-way boundary, binary search on the answer is guessing.

## Problems

1. [704. Binary Search (Easy)](./704-binary-search/)
2. [74. Search a 2D Matrix (Medium)](./074-search-a-2d-matrix/)
3. [875. Koko Eating Bananas (Medium)](./875-koko-eating-bananas/)
4. [153. Find Minimum in Rotated Sorted Array (Medium)](./153-find-minimum-in-rotated-sorted-array/)
5. [33. Search in Rotated Sorted Array (Medium)](./033-search-in-rotated-sorted-array/)
6. [981. Time Based Key-Value Store (Medium)](./981-time-based-key-value-store/)
7. [4. Median of Two Sorted Arrays (Hard)](./004-median-of-two-sorted-arrays/)

**Bonus problems (same pattern, outside NeetCode 150):**

- [162. Find Peak Element (Medium)](./162-find-peak-element/) -- binary search on a non-sorted array using local slope direction.

## Key patterns unlocked here

- **Canonical iterative binary search**: 704.
- **Flattening a matrix to 1D**: 74.
- **Binary search on the answer space**: 875 (template for dozens of variations).
- **Detecting the sorted half**: 153 and 33.
- **Per-key timeline binary search**: 981 (`bisect` on timestamps).
- **Partition search on two arrays**: 4 (the canonical hard binary-search problem).
- **Slope-direction binary search on unimodal arrays**: 162.

## Common mistakes

- Moving both bounds past `mid` without proving the answer cannot be `mid`.
- Mixing closed interval (`left <= right`) and half-open interval (`left < right`) templates in one solution.
- Returning `mid` instead of the boundary variable in first-true or last-true searches.
- Applying answer-space binary search before proving the predicate is monotonic.
- Treating a rotated array as fully sorted. One half is sorted, not both.

## How the problems fit together

[Binary Search](./704-binary-search/) is the template page. [Search a 2D Matrix](./074-search-a-2d-matrix/) shows that "sorted" can be virtual. [Koko Eating Bananas](./875-koko-eating-bananas/) is the answer-space template and is worth practicing until the predicate-first habit is automatic.

[Find Minimum in Rotated Sorted Array](./153-find-minimum-in-rotated-sorted-array/) and [Search in Rotated Sorted Array](./033-search-in-rotated-sorted-array/) teach partial order. [Time Based Key-Value Store](./981-time-based-key-value-store/) moves binary search inside a data structure. [Median of Two Sorted Arrays](./004-median-of-two-sorted-arrays/) is the hard capstone: the search target is not a value but a valid partition.

## Related concepts

- [Binary search](../../coding-concepts/binary-search/), the base invariant and templates.
- [Modified binary search](../../coding-concepts/modified-binary-search/), rotated arrays and slope-directed search.
- [Binary search on answer](../../coding-concepts/binary-search-on-answer/), feasibility predicates over value ranges.
- [Sorting as preprocessing](../../coding-concepts/sorting-as-preprocessing/), why order makes pruning possible.
