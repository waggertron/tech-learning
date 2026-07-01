---
title: Constraint Search
description: "Pruned search tactics for problems where each choice must satisfy local and global constraints."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Constraint search is backtracking with stronger pruning. Each choice must satisfy local rules now and preserve the possibility of satisfying global rules later.

The invariant is consistency. The partial assignment has no violated constraints, and each unfilled position still has at least one possible value unless the branch is already dead.

Good constraint search chooses the most constrained next move, not just the next position in input order. That can shrink the branching factor before recursion begins.

## Value

The value is practical speed on search spaces that are theoretically large. The worst case may remain exponential, but early contradiction checks remove most branches in structured puzzles.

### Direct complexity example

- **Brute force:** Try all assignments and validate the full board at the end: $O(k^n)$ time for `n` positions and `k` choices.
- **With this tactic:** Check constraints during assignment and pick constrained positions first: worst-case still exponential, but the explored tree is often much smaller.
- **Space:** Space is usually $O(n)$ recursion depth plus sets, bitmasks, or counters for constraints.

## Challenges this solves

- N-Queens
- Sudoku-style placement
- word search pruning
- graph coloring
- combination search with limits

## When to use it

Use this tactic when these conditions are true:

- each choice has local validity rules
- invalid partial states are easy to detect
- a variable can have a small candidate set
- the problem asks for one or all valid assignments

## When not to use it

Reach for a different tactic when these warning signs appear:

- constraints do not prune until the full answer is built
- the state repeats and should be memoized
- the objective has optimal substructure that DP captures
- a greedy rule has a proof and search is unnecessary

## Terminology clues

These prompt words often point toward this concept:

- valid placement
- constraint
- cannot share
- board
- assign
- candidate
- prune
- backtrack

## Problems that use it

- [10. Regular Expression Matching](../coding-problems/2d-dynamic-programming/010-regular-expression-matching/)
- [36. Valid Sudoku](../coding-problems/arrays-and-hashing/036-valid-sudoku/)
- [51. N-Queens](../coding-problems/backtracking/051-n-queens/)
- [79. Word Search](../coding-problems/backtracking/079-word-search/)

## Related concepts

- [Backtracking](./backtracking/)
- [Memoization](./memoization/)
- [Flood fill](./flood-fill/)
