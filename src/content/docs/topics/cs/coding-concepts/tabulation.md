---
title: Tabulation
description: "Bottom-up DP tactics for filling states in dependency order without recursion."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-11-04
---

## Tactic

Tabulation is bottom-up dynamic programming. Instead of asking recursion to discover states, you choose an order and fill the table from base cases toward the final answer.

The invariant is dependency order. When the loop reaches a state, every state needed to compute it has already been filled.

The design work is drawing arrows between states. If `dp[i]` depends on `dp[i - 1]` and `dp[i - 2]`, iterate `i` upward. If a grid cell depends on top and left, scan rows and columns. If an interval depends on shorter intervals, iterate by length.

### Prefix-length DP and the empty prefix

A useful state convention is `dp[i] = the answer for the first i input items`. The index counts items rather than identifying the last item's position. For an input of length `n`, that creates `n + 1` states: the empty prefix at `0`, then prefixes of lengths `1` through `n`.

```text
Input index:        0    1    2
Input:             [A,   B,   C]

Prefix length:      0    1    2    3
Items considered:   []  [A] [A,B] [A,B,C]
Current item:       -    A    B    C
Input lookup:       -  [0]  [1]  [2]
```

At state `i`, the newly considered item is `input[i - 1]`. This single sentence determines the table size, input lookup, final answer (`dp[n]`), and often the loop bounds. It also prevents the common mismatch of setting `dp[1]` from `input[0]` but later treating `i` as an input index.

The empty-prefix state is an explicit base case, sometimes called a sentinel state. Its value follows the meaning of the problem, not a universal initialization rule:

| Problem | State meaning | Empty state | Transition |
| --- | --- | --- | --- |
| [House Robber](../../coding-problems/1d-dynamic-programming/198-house-robber/) | Best money from the first `i` houses | `dp[0] = 0`: no houses yield no money | `max(dp[i - 1], dp[i - 2] + nums[i - 1])` for `i >= 2`, with `dp[1] = nums[0]` |
| [Climbing Stairs](../../coding-problems/1d-dynamic-programming/070-climbing-stairs/) | Number of ways to climb exactly `i` steps | `dp[0] = 1`: one empty sequence of moves | `dp[i - 1] + dp[i - 2]` for `i >= 2`, with `dp[1] = 1` |
| [Word Break](../../coding-problems/1d-dynamic-programming/139-word-break/) | Whether the first `i` characters can be segmented | `dp[0] = True`: a valid empty prefix | Any split `j` with `dp[j]` true and `s[j:i]` a dictionary word |

Climbing Stairs uses an amount climbed rather than a prefix of an input array, but the same explicit zero-state convention applies. Adding a final move to the empty sequence creates a valid path. House Robber instead starts from zero accumulated value.

The question being answered determines how earlier states combine: add counts of disjoint possibilities, maximize competing scores, minimize costs, or accept any feasible transition. Do not copy an addition or base value just because another problem also reads two earlier states.

An alternative convention, `dp[i] = the answer through input index i`, is equally valid. It uses `n` slots and ends at `dp[n - 1]`. Choose one definition and derive every index from it. Likewise, derive the loop start from the dependencies: a recurrence reading `i - 2` needs its initial states filled before starting at `2`. Python negative indexing is not a substitute for a missing DP base case.

## Value

The value is predictable evaluation and no recursion overhead. Tabulation also makes state compression easier because the dependency distance is visible in the loop structure.

### Direct complexity example

- **Brute force:** Use recursion with repeated calls or cache lookups for every transition: time may be fine with memoization, but stack overhead and unreachable-order reasoning remain.
- **With this tactic:** Fill each state once in loop order: $O(\text{states} \times \text{transition cost})$ time.
- **Space:** The table costs $O(\text{states})$ space before compression. Rolling arrays often reduce a row-based table to $O(\text{width})$ or $O(1)$.

## Challenges this solves

- climbing stairs
- coin change
- unique paths
- edit distance
- knapsack tables
- sequence alignment

## When to use it

Use this tactic when these conditions are true:

- base cases are clear
- the dependency order is acyclic and easy to loop over
- recursion depth would be annoying
- you want to inspect or optimize memory layout

## When not to use it

Reach for a different tactic when these warning signs appear:

- the dependency order is hard to derive and memoization is clearer
- most states are unreachable
- the state graph has cycles
- a greedy invariant removes the need for a table

## Terminology clues

These prompt words often point toward this concept:

- bottom-up
- table
- dp array
- fill order
- base case
- transition
- previous row
- previous state

## Problems that use it

- [62. Unique Paths](../../coding-problems/2d-dynamic-programming/062-unique-paths/)
- [70. Climbing Stairs](../../coding-problems/1d-dynamic-programming/070-climbing-stairs/)
- [139. Word Break](../../coding-problems/1d-dynamic-programming/139-word-break/)
- [198. House Robber](../../coding-problems/1d-dynamic-programming/198-house-robber/)
- [322. Coin Change](../../coding-problems/1d-dynamic-programming/322-coin-change/)
- [1143. Longest Common Subsequence](../../coding-problems/2d-dynamic-programming/1143-longest-common-subsequence/)

## Related concepts

- [Dynamic programming](../dynamic-programming/)
- [Memoization](../memoization/)
- [State compression](../state-compression/)
