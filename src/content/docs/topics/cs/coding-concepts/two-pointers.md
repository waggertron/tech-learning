---
title: Two Pointers
description: "Two-index tactics for shrinking search space while preserving an invariant between positions."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Two pointers put two positions under deliberate control. One pointer can start at each end, both can move forward at different speeds, or one can read while the other writes a compacted result.

The invariant explains why moving one pointer discards work safely. In a sorted pair search, a sum that is too small proves the left value cannot pair with the current right value. In a palindrome check, matching endpoints prove the unresolved work is inside the boundary.

Use the pointer movement as the proof. Before writing code, state what region has already been eliminated and what region still contains every possible answer. If neither pointer movement eliminates a region, the tactic is only guesswork.

## Value

The value is search-space pruning without extra structure. Two pointers often turns a pair or boundary question from a quadratic enumeration into a linear walk, and it does that while keeping memory constant.

### Direct complexity example

- **Brute force:** Try every pair in a sorted array: $O(n^2)$ time and $O(1)$ space.
- **With this tactic:** Move `left` or `right` based on the invariant: $O(n)$ time and $O(1)$ space.
- **Space:** Sorting first costs $O(n \log n)$ time and may cost $O(n)$ space depending on the language sort. If the input is already sorted, the pointer phase is the whole cost.

## Challenges this solves

- sorted pair search
- palindrome and symmetry checks
- in-place compaction
- container or boundary optimization
- n-sum after sorting

## When to use it

Use this tactic when these conditions are true:

- the input is sorted or can be sorted without losing required order
- a low or high value tells you which side cannot work
- the task compares positions rather than building all combinations
- the answer can be maintained while boundaries move inward or forward

## When not to use it

Reach for a different tactic when these warning signs appear:

- the array order is meaningful and sorting would change the answer
- moving either pointer is not justified by a monotonic fact
- the best choice may require remembering many earlier values, which points to hashing or DP

## Terminology clues

These prompt words often point toward this concept:

- sorted array
- pair
- palindrome
- from both ends
- in-place
- remove duplicates
- closest sum
- left and right

## Problems that use it

- [5. Longest Palindromic Substring](../../coding-problems/1d-dynamic-programming/005-longest-palindromic-substring/)
- [11. Container With Most Water](../../coding-problems/two-pointers/011-container-with-most-water/)
- [15. 3Sum](../../coding-problems/two-pointers/015-3sum/)
- [21. Merge Two Sorted Lists](../../coding-problems/linked-list/021-merge-two-sorted-lists/)
- [25. Reverse Nodes in k-Group](../../coding-problems/linked-list/025-reverse-nodes-in-k-group/)
- [28. Find the Index of the First Occurrence in a String](../../coding-problems/sliding-window/028-find-the-index-of-the-first-occurrence/)
- [42. Trapping Rain Water](../../coding-problems/two-pointers/042-trapping-rain-water/)
- [125. Valid Palindrome](../../coding-problems/two-pointers/125-valid-palindrome/)
- [160. Intersection of Two Linked Lists](../../coding-problems/linked-list/160-intersection-of-two-linked-lists/)
- [167. Two Sum II, Input Array Is Sorted](../../coding-problems/two-pointers/167-two-sum-ii/)
- [189. Rotate Array](../../coding-problems/two-pointers/189-rotate-array/)
- [443. String Compression](../../coding-problems/two-pointers/443-string-compression/)
- [647. Palindromic Substrings](../../coding-problems/1d-dynamic-programming/647-palindromic-substrings/)

## Related concepts

- [Fast and slow pointers](../fast-and-slow-pointers/)
- [Sliding window](../sliding-window/)
- [Sorting as preprocessing](../sorting-as-preprocessing/)
