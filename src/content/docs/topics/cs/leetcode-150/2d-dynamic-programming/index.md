---
title: 2-D Dynamic Programming
description: 11 problems covering DP on pairs of indices, grid paths, LCS, knapsack variants, and edit-distance-family recurrences.
parent: leetcode-150
tags: [leetcode, neetcode-150, dp, dynamic-programming]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

When the state needs two indices, usually "position in A × position in B" or "row × column in a grid", you get a 2-D DP table. The mental moves are the same as 1-D, just on a plane:

- **State**, `dp[i][j]` capturing some property of prefixes or a cell.
- **Recurrence**, usually `dp[i][j]` depends on `dp[i-1][j]`, `dp[i][j-1]`, or `dp[i-1][j-1]`.
- **Space optimization**, when `dp[i]` depends only on `dp[i-1]`, collapse to one row.

## Problems

1. [62. Unique Paths (Medium)](./062-unique-paths/)
2. [1143. Longest Common Subsequence (Medium)](./1143-longest-common-subsequence/)
3. [309. Best Time to Buy and Sell Stock with Cooldown (Medium)](./309-best-time-to-buy-and-sell-stock-with-cooldown/)
4. [518. Coin Change II (Medium)](./518-coin-change-ii/)
5. [494. Target Sum (Medium)](./494-target-sum/)
6. [97. Interleaving String (Medium)](./097-interleaving-string/)
7. [329. Longest Increasing Path in a Matrix (Hard)](./329-longest-increasing-path-in-a-matrix/)
8. [115. Distinct Subsequences (Hard)](./115-distinct-subsequences/)
9. [72. Edit Distance (Hard)](./072-edit-distance/)
10. [312. Burst Balloons (Hard)](./312-burst-balloons/)
11. [10. Regular Expression Matching (Hard)](./010-regular-expression-matching/)

## Key patterns unlocked here

- **Grid path DP**, Unique Paths.
- **LCS family**, Longest Common Subsequence, Edit Distance, Distinct Subsequences, Interleaving String.
- **State machine DP**, Stock with Cooldown.
- **Unbounded knapsack (counting)**, Coin Change II.
- **Sign-partition to subset-sum DP**, Target Sum.
- **Interval DP**, Burst Balloons.
- **Regex / pattern DP**, Regular Expression Matching.
- **Memoized DFS on a matrix**, Longest Increasing Path.
