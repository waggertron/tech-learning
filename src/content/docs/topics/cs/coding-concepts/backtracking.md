---
title: Backtracking
description: "Search-tree tactics for exploring choices, undoing state, and pruning invalid branches."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Backtracking explores a decision tree one partial candidate at a time. It chooses an option, recurses, then undoes the choice before trying the next option.

The invariant is that the current partial candidate is valid under the rules checked so far. Pruning cuts off branches as soon as they cannot lead to a complete answer.

The undo step matters. Mutating a shared list, board, or set is efficient, but every mutation needs a matching cleanup. Copying state is simpler but can add large hidden costs.

## Value

The value is controlled exhaustive search. Backtracking does not magically remove exponential complexity, but it makes exponential search readable and prunable.

### Direct complexity example

- **Brute force:** Generate every raw candidate and validate only at the end: often $O(b^d \cdot d)$ time, where many branches are doomed early.
- **With this tactic:** Validate and prune during construction: worst-case still exponential, but practical work can drop sharply.
- **Space:** Space is $O(d)$ recursion depth plus the current candidate, not counting the output. Copy-heavy versions can use much more.

## Challenges this solves

- subsets and combinations
- permutations
- N-Queens
- word search
- constraint puzzles
- combination sum

## When to use it

Use this tactic when these conditions are true:

- the problem asks for all valid arrangements or choices
- each choice affects the remaining choices
- invalid partial candidates can be detected early
- the constraints are small enough for exponential search

## When not to use it

Reach for a different tactic when these warning signs appear:

- only one optimum is needed and DP or greedy can summarize the search
- the branching factor and depth make exhaustive search impossible
- there are repeated states that should be memoized
- the problem has no natural partial validity check

## Terminology clues

These prompt words often point toward this concept:

- all combinations
- all permutations
- place
- choose
- valid board
- search
- undo
- prune

## Problems that use it

- [17. Letter Combinations of a Phone Number](../../coding-problems/backtracking/017-letter-combinations-of-a-phone-number/)
- [22. Generate Parentheses](../../coding-problems/stack/022-generate-parentheses/)
- [39. Combination Sum](../../coding-problems/backtracking/039-combination-sum/)
- [40. Combination Sum II](../../coding-problems/backtracking/040-combination-sum-ii/)
- [46. Permutations](../../coding-problems/backtracking/046-permutations/)
- [51. N-Queens](../../coding-problems/backtracking/051-n-queens/)
- [79. Word Search](../../coding-problems/backtracking/079-word-search/)
- [90. Subsets II](../../coding-problems/backtracking/090-subsets-ii/)
- [131. Palindrome Partitioning](../../coding-problems/backtracking/131-palindrome-partitioning/)
- [212. Word Search II](../../coding-problems/tries/212-word-search-ii/)

## Related concepts

- [Subsets and combinations](../subsets-and-combinations/)
- [Permutations](../permutations/)
- [Constraint search](../constraint-search/)
- [Memoization](../memoization/)
