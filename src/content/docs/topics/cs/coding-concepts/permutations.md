---
title: Permutations
description: "Ordering tactics for generating arrangements where the same items in a different order are different answers."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Permutations generate arrangements where order matters. The same items in a different order are different answers.

The invariant is the used set or remaining pool. At depth `i`, the prefix has length `i` and contains no repeated item unless repetition is explicitly allowed.

The usual implementation chooses an unused item for the next position. For duplicate values, sorting plus a same-depth skip rule prevents identical arrangements from being emitted more than once.

## Value

The value is matching the output space exactly. Permutation search is factorial, so the implementation needs to avoid extra duplicate work and validate constraints as early as possible.

### Direct complexity example

- **Brute force:** Generate all length-`n` sequences with repetition and filter invalid ones: $O(n^n)$ time.
- **With this tactic:** Track used items and generate each permutation once: $O(n! \cdot n)$ output-sized time.
- **Space:** Space is $O(n)$ for recursion and used tracking, plus the output list.

## Challenges this solves

- all orderings
- phone keypad paths where order follows positions
- itinerary reconstruction with ordered choices
- arrangements under constraints
- unique permutations

## When to use it

Use this tactic when these conditions are true:

- the answer changes when chosen items are reordered
- each position in the output needs one remaining item
- the prompt asks for arrangements or orderings
- constraints are small enough for factorial output

## When not to use it

Reach for a different tactic when these warning signs appear:

- order does not matter and combinations are enough
- only the best arrangement is needed and DP or greedy can avoid enumeration
- the input size makes factorial output impossible
- the problem is actually topological ordering with dependencies

## Terminology clues

These prompt words often point toward this concept:

- permutation
- arrangement
- order matters
- reorder
- all possible orders
- used
- remaining
- itinerary

## Problems that use it

- [17. Letter Combinations of a Phone Number](../../coding-problems/backtracking/017-letter-combinations-of-a-phone-number/)
- [46. Permutations](../../coding-problems/backtracking/046-permutations/)
- [51. N-Queens](../../coding-problems/backtracking/051-n-queens/)
- [332. Reconstruct Itinerary](../../coding-problems/advanced-graphs/332-reconstruct-itinerary/)

## Related concepts

- [Backtracking](../backtracking/)
- [Subsets and combinations](../subsets-and-combinations/)
- [Constraint search](../constraint-search/)
