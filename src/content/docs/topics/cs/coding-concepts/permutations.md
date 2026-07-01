---
title: Permutations
description: "Ordering tactics for generating arrangements where the same items in a different order are different answers."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Permutation search fills positions one at a time. It tracks which items have already been used, then tries each unused item in the next slot.

## Value

The value is explicit control over order. It separates arrangement problems from subset problems where order is irrelevant.

## Challenges this solves

- all arrangements
- phone keypad expansions
- ordered path construction
- assignment search
- ranking or placement

## When to use it

Use it when the output treats `[a, b]` and `[b, a]` as different answers.

## When not to use it

Do not use permutation generation for combinations. It creates factorial duplication.

## Terminology clues

- permutation
- arrangement
- order matters
- all possible strings
- use each once

## Problems that use it

- [46. Permutations](../coding-problems/backtracking/046-permutations/)
- [17. Letter Combinations of a Phone Number](../coding-problems/backtracking/017-letter-combinations-of-a-phone-number/)
- [51. N-Queens](../coding-problems/backtracking/051-n-queens/)
- [332. Reconstruct Itinerary](../coding-problems/advanced-graphs/332-reconstruct-itinerary/)

## Related concepts

- [Backtracking](./backtracking/)
- [Subsets and combinations](./subsets-and-combinations/)
- [Constraint search](./constraint-search/)
