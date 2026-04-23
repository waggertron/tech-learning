---
title: Two Pointers
description: 5 problems that define the two-pointer pattern — walking from both ends, maintaining an invariant between indices, and collapsing O(n²) into O(n).
parent: leetcode-150
tags: [leetcode, neetcode-150, two-pointers]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

"Two pointers" is a family of array/string algorithms where two indices move through the input together, maintaining an invariant that lets you prune or conclude without re-scanning. The pattern most often works on **sorted** data or on **palindrome-shaped** symmetry; it converts many O(n²) brute forces into O(n).

Three pointer movements cover almost all problems:

- **Converging** — one pointer from each end, move the one whose value fails an invariant inward.
- **Same-direction** — both pointers advance left-to-right; "slow" marks a write position, "fast" marks a read position. Often overlaps with sliding window.
- **Trailing** — a second pointer lags behind the first by a fixed offset (Remove Nth From End of a linked list).

## Problems

1. [125. Valid Palindrome](./125-valid-palindrome/) — *Easy*
2. [167. Two Sum II — Input Array Is Sorted](./167-two-sum-ii/) — *Medium*
3. [15. 3Sum](./015-3sum/) — *Medium*
4. [11. Container With Most Water](./011-container-with-most-water/) — *Medium*
5. [42. Trapping Rain Water](./042-trapping-rain-water/) — *Hard*

## Key patterns unlocked here

- **Symmetric check with converging pointers** — Valid Palindrome.
- **Sorted-array complement search** — Two Sum II. The pattern that generalizes to 3Sum and 4Sum.
- **Sort + fixed anchor + two pointers** — 3Sum; the bread and butter of n-sum problems.
- **Greedy movement on the shorter side** — Container With Most Water; the "why two pointers work" proof case.
- **Bidirectional max tracking** — Trapping Rain Water (classic two-pointer alternative to prefix/suffix-max arrays).
