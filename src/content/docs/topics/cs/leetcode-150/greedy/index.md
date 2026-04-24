---
title: Greedy
description: 8 problems where making the locally-optimal choice at each step yields the globally-optimal answer, and how to prove it does.
parent: leetcode-150
tags: [leetcode, neetcode-150, greedy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

A greedy algorithm makes the locally-optimal choice at each step, betting that local optima accumulate to a global optimum. Greedy is **fast** (usually O(n) or O(n log n)) but **hard to justify**: the subtle work is proving that the greedy choice doesn't paint you into a corner.

Two classic proof structures:

- **Exchange argument**, show that any optimal solution can be rewritten to use the greedy choice without worsening its value.
- **Monotone invariant**, show that a scalar (running max reach, sum, remaining count) strictly dominates the future.

## Problems

1. [53. Maximum Subarray](./053-maximum-subarray/), *Medium*
2. [55. Jump Game](./055-jump-game/), *Medium*
3. [45. Jump Game II](./045-jump-game-ii/), *Medium*
4. [134. Gas Station](./134-gas-station/), *Medium*
5. [846. Hand of Straights](./846-hand-of-straights/), *Medium*
6. [1899. Merge Triplets to Form Target Triplet](./1899-merge-triplets-to-form-target-triplet/), *Medium*
7. [763. Partition Labels](./763-partition-labels/), *Medium*
8. [678. Valid Parenthesis String](./678-valid-parenthesis-string/), *Medium*

## Key patterns unlocked here

- **Kadane's algorithm**, Maximum Subarray.
- **Running max reach**, Jump Game.
- **BFS-like level expansion**, Jump Game II.
- **Negative-prefix skip**, Gas Station.
- **Sorted frequencies + rolling consumption**, Hand of Straights.
- **Channel-wise feasibility check**, Merge Triplets.
- **Last-seen index sliding**, Partition Labels.
- **Range tracking of possible `(` counts**, Valid Parenthesis String.
