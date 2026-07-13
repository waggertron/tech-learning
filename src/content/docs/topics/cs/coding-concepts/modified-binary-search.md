---
title: Modified Binary Search
description: "Binary-search variants for rotated arrays, peak finding, and data where the ordering is present but disguised."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Modified binary search handles data where the order exists but is disguised. Rotated arrays, peak arrays, and matrix-as-array searches still let one comparison eliminate a side.

The invariant is not simply sorted left and sorted right. It is the property that survives the transformation: one half is sorted, the slope points toward a peak, or a flattened index maps to row and column order.

Start by naming what the middle tells you. In a rotated array, compare `nums[mid]` with an endpoint to identify the sorted half. In peak finding, compare `nums[mid]` with `nums[mid + 1]` to know which side contains a peak.

## Value

The value is preserving logarithmic time when a normal binary search template looks unsafe. The tactic keeps the halving idea but swaps the comparison for one tailored to the structure.

### Direct complexity example

- **Brute force:** Scan for a rotated-array target, minimum, or peak: $O(n)$ time and $O(1)$ space.
- **With this tactic:** Use the transformed ordering to halve the range: $O(\log n)$ time and $O(1)$ space.
- **Space:** The space stays constant for iterative implementations.

## Challenges this solves

- search in rotated sorted array
- find minimum in rotated array
- peak element
- search a sorted matrix
- first bad version style predicates

## When to use it

Use this tactic when these conditions are true:

- the prompt says sorted but rotated, shifted, or partially ordered
- a local comparison reveals which side is safe to discard
- the expected complexity is logarithmic
- duplicates do not fully destroy the ordering signal

## When not to use it

Reach for a different tactic when these warning signs appear:

- duplicates make both halves ambiguous and the worst case becomes linear
- the structure has many local peaks but the problem needs a specific global one
- a direct index map is not available for the transformed space
- a simple binary search already fits

## Terminology clues

These prompt words often point toward this concept:

- rotated
- shifted
- peak
- mountain
- sorted matrix
- find minimum
- partially sorted
- O(log n)

## Problems that use it

- [4. Median of Two Sorted Arrays](../../coding-problems/binary-search/004-median-of-two-sorted-arrays/)
- [33. Search in Rotated Sorted Array](../../coding-problems/binary-search/033-search-in-rotated-sorted-array/)
- [153. Find Minimum in Rotated Sorted Array](../../coding-problems/binary-search/153-find-minimum-in-rotated-sorted-array/)
- [162. Find Peak Element](../../coding-problems/binary-search/162-find-peak-element/)
- [981. Time Based Key-Value Store](../../coding-problems/binary-search/981-time-based-key-value-store/)

## Related concepts

- [Binary search](../binary-search/)
- [Binary search on answer](../binary-search-on-answer/)
- [Divide and conquer](../divide-and-conquer/)
