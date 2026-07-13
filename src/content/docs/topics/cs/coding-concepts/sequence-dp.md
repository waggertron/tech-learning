---
title: Sequence DP
description: "Order-aware DP tactics for strings and arrays where prefixes or positions define reusable states."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Sequence DP uses positions or prefixes as states. The state answers a question about `s[:i]`, `nums[:i]`, or a pair of prefixes such as `text1[:i]` and `text2[:j]`.

The invariant is that prefixes are already solved before longer prefixes. A transition usually consumes one character, compares two ending characters, or chooses whether to extend a previous subsequence.

The biggest design question is whether the problem is about substrings, subsequences, or prefixes. Substrings are contiguous and often need window or center logic. Subsequences preserve order but can skip items, which often points to DP.

## Value

The value is making order explicit. Sequence DP keeps enough history to answer future position choices without enumerating every possible subsequence or edit path.

### Direct complexity example

- **Brute force:** Generate all subsequences or all edit paths: exponential time in the sequence length.
- **With this tactic:** Use one or two position dimensions: often $O(n)$, $O(n^2)$, or $O(mn)$ time depending on the state.
- **Space:** Space ranges from $O(n)$ for one sequence to $O(mn)$ for two sequences, often reducible to one row when reconstruction is not needed.

## Challenges this solves

- longest common subsequence
- edit distance
- decode ways
- word break
- palindromic substrings
- longest increasing subsequence

## When to use it

Use this tactic when these conditions are true:

- the input is a string or ordered array
- choices consume prefixes or positions
- skipping or matching elements matters
- the answer asks for count, min edits, max length, or feasibility over order

## When not to use it

Reach for a different tactic when these warning signs appear:

- the problem only needs a contiguous window with local counts
- sorting destroys or solves the order question
- a greedy proof handles the position choices
- the state needs too many previous positions and requires another structure

## Terminology clues

These prompt words often point toward this concept:

- subsequence
- prefix
- edit
- decode
- match
- align
- palindrome
- longest increasing

## Problems that use it

- [5. Longest Palindromic Substring](../../coding-problems/1d-dynamic-programming/005-longest-palindromic-substring/)
- [115. Distinct Subsequences](../../coding-problems/2d-dynamic-programming/115-distinct-subsequences/)
- [131. Palindrome Partitioning](../../coding-problems/backtracking/131-palindrome-partitioning/)
- [139. Word Break](../../coding-problems/1d-dynamic-programming/139-word-break/)
- [300. Longest Increasing Subsequence](../../coding-problems/1d-dynamic-programming/300-longest-increasing-subsequence/)
- [647. Palindromic Substrings](../../coding-problems/1d-dynamic-programming/647-palindromic-substrings/)
- [1143. Longest Common Subsequence](../../coding-problems/2d-dynamic-programming/1143-longest-common-subsequence/)

## Related concepts

- [Dynamic programming](../dynamic-programming/)
- [Memoization](../memoization/)
- [Binary search](../binary-search/)
