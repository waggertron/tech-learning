---
title: Array Scans
description: "Linear pass tactics for reading an array once, carrying just enough state, and avoiding nested loops."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Array scans turn a brute-force "try every pair or subarray" idea into a pass over positions. The tactic is to decide what information from the left, right, or current prefix is enough to make the next decision.

## Value

The value is mechanical speed. If each element can be processed once, many $O(n^2)$ checks collapse to $O(n)$ with small memory.

## Challenges this solves

- running best or running worst values
- single-pass validation
- prefix or suffix accumulation
- detecting whether a local condition has appeared before

## When to use it

Use it when the input is already in traversal order and the decision for index `i` only needs a compact summary of earlier or later positions.

## When not to use it

Do not force a scan when each position needs arbitrary historical lookup, global reordering, or many future choices. That usually points to a hash map, heap, sort, or dynamic programming state.

## Terminology clues

- single pass
- in order
- for each element
- running maximum
- running minimum
- prefix
- suffix
- can you do it in O(n)

## Problems that use it

- [217. Contains Duplicate](../coding-problems/arrays-and-hashing/217-contains-duplicate/)
- [121. Best Time to Buy and Sell Stock](../coding-problems/sliding-window/121-best-time-to-buy-and-sell-stock/)
- [238. Product of Array Except Self](../coding-problems/arrays-and-hashing/238-product-of-array-except-self/)

## Related concepts

- [Prefix sums](./prefix-sums/)
- [Sliding window](./sliding-window/)
- [Greedy algorithms](./greedy-algorithms/)
