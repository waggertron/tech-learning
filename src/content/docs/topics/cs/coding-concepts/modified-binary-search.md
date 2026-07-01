---
title: Modified Binary Search
description: "Binary-search variants for rotated arrays, peak finding, and data where the ordering is present but disguised."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Modified binary search keeps the half-discard idea but changes the midpoint logic. Instead of a plain comparison to target, the midpoint reveals which side is sorted, where a peak could live, or which timestamp is closest.

## Value

The value is rescuing logarithmic search when the array is not simply sorted from left to right.

## Challenges this solves

- rotated sorted arrays
- minimum in rotated arrays
- peak finding
- time-based predecessor queries
- partition-based median search

## When to use it

Use it when a normal binary search almost works but the comparison needs additional structure.

## When not to use it

Do not use it if there is no reliable way to identify which half can be discarded.

## Terminology clues

- rotated
- peak
- minimum in sorted array
- timestamp
- closest not greater
- partition

## Problems that use it

- [153. Find Minimum in Rotated Sorted Array](../coding-problems/binary-search/153-find-minimum-in-rotated-sorted-array/)
- [162. Find Peak Element](../coding-problems/binary-search/162-find-peak-element/)
- [4. Median of Two Sorted Arrays](../coding-problems/binary-search/004-median-of-two-sorted-arrays/)
- [981. Time Based Key-Value Store](../coding-problems/binary-search/981-time-based-key-value-store/)

## Related concepts

- [Binary search](./binary-search/)
- [Binary search on answer](./binary-search-on-answer/)
- [Divide and conquer](./divide-and-conquer/)
