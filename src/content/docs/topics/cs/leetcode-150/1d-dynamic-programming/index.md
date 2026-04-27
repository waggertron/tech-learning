---
title: 1-D Dynamic Programming
description: 12 problems covering one-dimensional DP, defining a state, writing a recurrence, memoization vs. bottom-up, and space optimization.
parent: leetcode-150
tags: [leetcode, neetcode-150, dp, dynamic-programming]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Dynamic programming is about **(a)** defining a state that captures the subproblem, **(b)** writing a recurrence between states, and **(c)** choosing between top-down memoization and bottom-up tabulation. The 1-D category is where you build the reflex:

- **Top-down (memo)**, natural recursion + cache. Write the recursion first; add `@lru_cache`; done.
- **Bottom-up (tabulation)**, iterative, usually cleaner once you trust the recurrence. Often admits space optimization from O(n) to O(1).
- **Space optimization**, if `dp[i]` only depends on `dp[i-1]`, `dp[i-2]`, …, keep a sliding window.

## Problems

1. [70. Climbing Stairs (Easy)](./070-climbing-stairs/)
2. [746. Min Cost Climbing Stairs (Easy)](./746-min-cost-climbing-stairs/)
3. [198. House Robber (Medium)](./198-house-robber/)
4. [213. House Robber II (Medium)](./213-house-robber-ii/)
5. [5. Longest Palindromic Substring (Medium)](./005-longest-palindromic-substring/)
6. [647. Palindromic Substrings (Medium)](./647-palindromic-substrings/)
7. [91. Decode Ways (Medium)](./091-decode-ways/)
8. [322. Coin Change (Medium)](./322-coin-change/)
9. [152. Maximum Product Subarray (Medium)](./152-maximum-product-subarray/)
10. [139. Word Break (Medium)](./139-word-break/)
11. [300. Longest Increasing Subsequence (Medium)](./300-longest-increasing-subsequence/)
12. [416. Partition Equal Subset Sum (Medium)](./416-partition-equal-subset-sum/)

## Key patterns unlocked here

- **Fibonacci recurrence**, Climbing Stairs, Min Cost Climbing Stairs.
- **Take-or-skip DP**, House Robber (+ circular variant).
- **Expand around center / DP table**, Palindromic Substrings.
- **Carry-two-states**, Maximum Product Subarray (track max AND min).
- **Unbounded knapsack**, Coin Change.
- **0/1 knapsack**, Partition Equal Subset Sum.
- **LIS via DP or patience sort**, Longest Increasing Subsequence.
- **Index DP on strings**, Decode Ways, Word Break.
