---
title: Dynamic Programming
description: "State-and-transition tactics for solving overlapping subproblems with cached answers."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Dynamic programming defines a state, a recurrence, base cases, and an evaluation order. Each state answers one reusable subproblem.

The invariant is that every state is solved from smaller or already known states. In top-down form, the call stack discovers states and a cache remembers them. In bottom-up form, the table order guarantees dependencies are ready.

The main skill is state design. A state should include exactly the information needed to make the remaining decision independent of the earlier path. Too little state gives wrong reuse. Too much state explodes time and space.

## Value

The value is controlled reuse. DP turns repeated search into a table of unique questions, which is why it often converts exponential recursion into polynomial time.

### Direct complexity example

- **Brute force:** Explore all decision paths in a recursion tree: often $O(2^n)$ or worse, with repeated subproblems.
- **With this tactic:** Cache each unique state once: $O(\text{states} \times \text{transition cost})$ time.
- **Space:** Space is $O(\text{states})$ for the cache or table, sometimes reducible with state compression.

## Challenges this solves

- counting ways
- minimum cost
- maximum score
- sequence alignment
- choice with constraints
- grid paths

## When to use it

Use this tactic when these conditions are true:

- the brute force asks the same suffix or subproblem many times
- the answer for a larger problem can be built from smaller answers
- the prompt asks for min, max, count, or feasibility
- a greedy rule is tempting but not provable

## When not to use it

Reach for a different tactic when these warning signs appear:

- there is no overlapping subproblem structure
- a simple scan or greedy invariant keeps all needed information
- the state space is too large and needs a different model
- the recurrence depends on future choices in a cyclic way

## Terminology clues

These prompt words often point toward this concept:

- number of ways
- min cost
- max profit
- can form
- choose or skip
- optimal substructure
- overlapping subproblems
- recurrence

## Problems that use it

- [70. Climbing Stairs](../coding-problems/1d-dynamic-programming/070-climbing-stairs/)
- [72. Edit Distance](../coding-problems/2d-dynamic-programming/072-edit-distance/)
- [91. Decode Ways](../coding-problems/1d-dynamic-programming/091-decode-ways/)
- [97. Interleaving String](../coding-problems/2d-dynamic-programming/097-interleaving-string/)
- [115. Distinct Subsequences](../coding-problems/2d-dynamic-programming/115-distinct-subsequences/)
- [152. Maximum Product Subarray](../coding-problems/1d-dynamic-programming/152-maximum-product-subarray/)
- [198. House Robber](../coding-problems/1d-dynamic-programming/198-house-robber/)
- [213. House Robber II](../coding-problems/1d-dynamic-programming/213-house-robber-ii/)
- [300. Longest Increasing Subsequence](../coding-problems/1d-dynamic-programming/300-longest-increasing-subsequence/)
- [309. Best Time to Buy and Sell Stock with Cooldown](../coding-problems/2d-dynamic-programming/309-best-time-to-buy-and-sell-stock-with-cooldown/)
- [312. Burst Balloons](../coding-problems/2d-dynamic-programming/312-burst-balloons/)
- [322. Coin Change](../coding-problems/1d-dynamic-programming/322-coin-change/)
- [329. Longest Increasing Path in a Matrix](../coding-problems/2d-dynamic-programming/329-longest-increasing-path-in-a-matrix/)
- [337. House Robber III](../coding-problems/trees/337-house-robber-iii/)
- [338. Counting Bits](../coding-problems/bit-manipulation/338-counting-bits/)
- [416. Partition Equal Subset Sum](../coding-problems/1d-dynamic-programming/416-partition-equal-subset-sum/)
- [518. Coin Change II](../coding-problems/2d-dynamic-programming/518-coin-change-ii/)
- [714. Best Time to Buy and Sell Stock with Transaction Fee](../coding-problems/2d-dynamic-programming/714-best-time-to-buy-and-sell-stock-with-transaction-fee/)
- [746. Min Cost Climbing Stairs](../coding-problems/1d-dynamic-programming/746-min-cost-climbing-stairs/)
- [907. Sum of Subarray Minimums](../coding-problems/stack/907-sum-of-subarray-minimums/)
- [968. Binary Tree Cameras](../coding-problems/trees/968-binary-tree-cameras/)
- [1143. Longest Common Subsequence](../coding-problems/2d-dynamic-programming/1143-longest-common-subsequence/)

## Related concepts

- [Memoization](./memoization/)
- [Tabulation](./tabulation/)
- [State compression](./state-compression/)
- [Greedy algorithms](./greedy-algorithms/)
