---
title: Array Scans
description: "Linear pass tactics for reading an array once, carrying just enough state, and avoiding nested loops."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-13
---

## Tactic

Array scans turn a sequence into a stream of decisions. The move is to walk left to right or right to left once, carrying the smallest piece of state that makes the next item meaningful.

The invariant is the summary of everything already seen. That summary might be a best value, a running count, a last position, a candidate answer, or a flag. If the summary is enough to answer the next step, a nested loop is probably unnecessary.

Design the scan by saying what the state means before reading `nums[i]`, then update the answer and state in a fixed order. Many bugs come from updating the state before the answer when the current element is not supposed to compare with itself.

## Value

A scan is valuable because it replaces repeated re-reading with one controlled pass. It is often the first simplification before a more named tactic appears: prefix sums are scans with checkpoints, greedy reachability is a scan with a frontier, and Kadane-style DP is a scan with a compressed state.

### Direct complexity example

- **Brute force:** Check every start and end pair for a property: $O(n^2)$ time and $O(1)$ extra space.
- **With this tactic:** Carry the needed summary while reading each value once: $O(n)$ time and usually $O(1)$ extra space.
- **Space:** If the summary is a frequency table or set, the scan may spend $O(k)$ space for the distinct values it needs to remember.

## Challenges this solves

- maximum or minimum so far
- first or last occurrence tracking
- one-pass profit and reachability
- counting events while preserving order

## When to use it

Use this tactic when these conditions are true:

- the answer depends on a prefix, suffix, or best-so-far value
- each element only needs information from one side
- the input order matters and sorting would destroy the meaning
- the brute force repeats the same prefix or suffix work

## When not to use it

Reach for a different tactic when these warning signs appear:

- a future item can invalidate many earlier choices in a way the state cannot summarize
- the problem asks for arbitrary range queries many times and needs preprocessing
- the needed state grows into all previous pairs or all previous subarrays

## Terminology clues

These prompt words often point toward this concept:

- single pass
- in one traversal
- maximum so far
- running
- previous
- last seen
- best profit
- left to right

## Problems that use it

- [1. Two Sum](../../coding-problems/arrays-and-hashing/001-two-sum/)
- [20. Valid Parentheses](../../coding-problems/stack/020-valid-parentheses/)
- [28. Find the Index of the First Occurrence in a String](../../coding-problems/sliding-window/028-find-the-index-of-the-first-occurrence/)
- [45. Jump Game II](../../coding-problems/greedy/045-jump-game-ii/)
- [48. Rotate Image](../../coding-problems/math-and-geometry/048-rotate-image/)
- [53. Maximum Subarray](../../coding-problems/greedy/053-maximum-subarray/)
- [54. Spiral Matrix](../../coding-problems/math-and-geometry/054-spiral-matrix/)
- [55. Jump Game](../../coding-problems/greedy/055-jump-game/)
- [73. Set Matrix Zeroes](../../coding-problems/math-and-geometry/073-set-matrix-zeroes/)
- [74. Search a 2D Matrix](../../coding-problems/binary-search/074-search-a-2d-matrix/)
- [84. Largest Rectangle in Histogram](../../coding-problems/stack/084-largest-rectangle-in-histogram/)
- [121. Best Time to Buy and Sell Stock](../../coding-problems/sliding-window/121-best-time-to-buy-and-sell-stock/)
- [122. Best Time to Buy and Sell Stock II](../../coding-problems/greedy/122-best-time-to-buy-and-sell-stock-ii/)
- [125. Valid Palindrome](../../coding-problems/two-pointers/125-valid-palindrome/)
- [128. Longest Consecutive Sequence](../../coding-problems/arrays-and-hashing/128-longest-consecutive-sequence/)
- [134. Gas Station](../../coding-problems/greedy/134-gas-station/)
- [136. Single Number](../../coding-problems/bit-manipulation/136-single-number/)
- [152. Maximum Product Subarray](../../coding-problems/1d-dynamic-programming/152-maximum-product-subarray/)
- [189. Rotate Array](../../coding-problems/two-pointers/189-rotate-array/)
- [217. Contains Duplicate](../../coding-problems/arrays-and-hashing/217-contains-duplicate/)
- [228. Summary Ranges](../../coding-problems/arrays-and-hashing/228-summary-ranges/)
- [238. Product of Array Except Self](../../coding-problems/arrays-and-hashing/238-product-of-array-except-self/)
- [271. Encode and Decode Strings](../../coding-problems/arrays-and-hashing/271-encode-and-decode-strings/)
- [334. Increasing Triplet Subsequence](../../coding-problems/greedy/334-increasing-triplet-subsequence/)
- [387. First Unique Character in a String](../../coding-problems/arrays-and-hashing/387-first-unique-character/)
- [443. String Compression](../../coding-problems/two-pointers/443-string-compression/)
- [459. Repeated Substring Pattern](../../coding-problems/arrays-and-hashing/459-repeated-substring-pattern/)
- [503. Next Greater Element II](../../coding-problems/stack/503-next-greater-element-ii/)
- [704. Binary Search](../../coding-problems/binary-search/704-binary-search/)
- [739. Daily Temperatures](../../coding-problems/stack/739-daily-temperatures/)
- [1071. Greatest Common Divisor of Strings](../../coding-problems/arrays-and-hashing/1071-greatest-common-divisor-of-strings/)
- [1249. Minimum Remove to Make Valid Parentheses](../../coding-problems/stack/1249-minimum-remove-valid-parens/)
- [1899. Merge Triplets to Form Target Triplet](../../coding-problems/greedy/1899-merge-triplets-to-form-target-triplet/)

## Related concepts

- [Prefix sums](../prefix-sums/)
- [Sliding window](../sliding-window/)
- [Greedy algorithms](../greedy-algorithms/)
