---
title: Sequence DP
description: "Order-aware DP tactics for strings and arrays where prefixes or positions define reusable states."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Sequence DP uses indices into one or more sequences as state. A transition consumes one character, one element, or a pair of positions.

## Value

The value is making order explicit. Problems about subsequences, substrings, edits, and segmentation become manageable once the prefix state is named.

## Challenges this solves

- longest subsequence
- edit distance
- palindrome expansion
- word segmentation
- interleaving strings

## When to use it

Use it when the answer depends on preserving sequence order and comparing prefixes or suffixes.

## When not to use it

Do not use sequence DP when order does not matter. Counting, sorting, or set logic may be simpler.

## Terminology clues

- subsequence
- substring
- prefix
- suffix
- edit
- palindrome
- can segment

## Problems that use it

- [300. Longest Increasing Subsequence](../coding-problems/1d-dynamic-programming/300-longest-increasing-subsequence/)
- [1143. Longest Common Subsequence](../coding-problems/2d-dynamic-programming/1143-longest-common-subsequence/)
- [647. Palindromic Substrings](../coding-problems/1d-dynamic-programming/647-palindromic-substrings/)
- [139. Word Break](../coding-problems/1d-dynamic-programming/139-word-break/)

## Related concepts

- [Dynamic programming](./dynamic-programming/)
- [Memoization](./memoization/)
- [Binary search](./binary-search/)
