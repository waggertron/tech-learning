---
title: Sliding Window
description: "Contiguous-range tactics for maintaining a valid subarray or substring while endpoints move forward."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Sliding window keeps a left and right boundary around a contiguous region. The right side expands to include new data, and the left side contracts until the window is valid again.

## Value

The value is avoiding repeated range work. Counts, sums, and constraints are updated incrementally instead of recomputed for every possible substring.

## Challenges this solves

- longest valid substring
- minimum covering substring
- fixed-size window maximum
- subarray sums with non-negative values
- frequency constraints

## When to use it

Use it when the answer is contiguous and the validity of a range can be repaired by moving one boundary forward.

## When not to use it

Do not use the basic window when removing from the left does not monotonically improve validity. Negative numbers and non-local constraints often require prefix sums or dynamic programming instead.

## Terminology clues

- substring
- subarray
- contiguous
- longest
- shortest
- at most k
- no repeating
- window

## Problems that use it

- [3. Longest Substring Without Repeating Characters](../coding-problems/sliding-window/003-longest-substring-without-repeating-characters/)
- [76. Minimum Window Substring](../coding-problems/sliding-window/076-minimum-window-substring/)
- [424. Longest Repeating Character Replacement](../coding-problems/sliding-window/424-longest-repeating-character-replacement/)
- [567. Permutation in String](../coding-problems/sliding-window/567-permutation-in-string/)

## Related concepts

- [Two pointers](./two-pointers/)
- [Prefix sums](./prefix-sums/)
- [Monotonic queue](./monotonic-queue/)
