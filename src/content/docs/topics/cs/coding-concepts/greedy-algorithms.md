---
title: Greedy Algorithms
description: "Local-choice tactics for solving optimization and reachability problems when a provable invariant protects the future."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Greedy algorithms make a local choice and commit to it. The choice is not a guess. It is protected by an invariant that says no future decision can make this local decision worse than an alternative.

The invariant often tracks the best reachable boundary, the cheapest valid item, the earliest finish time, or the largest remaining capacity. If you can explain why keeping only that one summary is enough, the greedy solution is probably real.

A good way to find the greedy move is to compare two neighboring decisions. Ask what happens if an optimal solution does not take the choice you want. If you can swap your choice in without hurting the answer, you have the start of an exchange proof.

## Value

The value is collapsing a search or DP state into one maintained fact. Greedy solutions are often short because they avoid remembering every path, but they require a stronger proof than DP.

### Direct complexity example

- **Brute force:** Try every sequence of choices with backtracking or DP: exponential time or $O(n^2)$ to $O(nk)$ state, depending on the problem.
- **With this tactic:** Keep the protected local summary in one scan or after sorting: often $O(n)$ or $O(n \log n)$ time with $O(1)$ extra space.
- **Space:** Some greedy algorithms use a heap, set, or sorted list, which raises space to $O(n)$ and time to $O(n \log n)$.

## Challenges this solves

- reachability frontiers
- interval scheduling
- stock profit accumulation
- minimum removals
- partitioning by last occurrence

## When to use it

Use this tactic when these conditions are true:

- a local best choice can be justified by an invariant
- the problem asks for minimum or maximum but future state is summarized compactly
- sorting by one key reveals a natural choice order
- DP works but seems to keep more state than necessary

## When not to use it

Reach for a different tactic when these warning signs appear:

- a local choice can block a better future arrangement
- the problem has overlapping subproblems and no exchange argument
- small counterexamples break the proposed rule
- the objective depends on a combination of choices that the summary cannot represent

## Terminology clues

These prompt words often point toward this concept:

- maximum reach
- earliest finish
- minimum number
- can reach
- local choice
- optimal
- profit
- schedule

## Problems that use it

- [45. Jump Game II](../../coding-problems/greedy/045-jump-game-ii/)
- [53. Maximum Subarray](../../coding-problems/greedy/053-maximum-subarray/)
- [55. Jump Game](../../coding-problems/greedy/055-jump-game/)
- [121. Best Time to Buy and Sell Stock](../../coding-problems/sliding-window/121-best-time-to-buy-and-sell-stock/)
- [122. Best Time to Buy and Sell Stock II](../../coding-problems/greedy/122-best-time-to-buy-and-sell-stock-ii/)
- [134. Gas Station](../../coding-problems/greedy/134-gas-station/)
- [334. Increasing Triplet Subsequence](../../coding-problems/greedy/334-increasing-triplet-subsequence/)
- [621. Task Scheduler](../../coding-problems/heap-priority-queue/621-task-scheduler/)
- [678. Valid Parenthesis String](../../coding-problems/greedy/678-valid-parenthesis-string/)
- [763. Partition Labels](../../coding-problems/greedy/763-partition-labels/)
- [1584. Min Cost to Connect All Points](../../coding-problems/advanced-graphs/1584-min-cost-to-connect-all-points/)
- [1899. Merge Triplets to Form Target Triplet](../../coding-problems/greedy/1899-merge-triplets-to-form-target-triplet/)

## Related concepts

- [Greedy exchange arguments](../greedy-exchange-arguments/)
- [Dynamic programming](../dynamic-programming/)
- [Sorting as preprocessing](../sorting-as-preprocessing/)
