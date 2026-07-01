---
title: Coding Problems
description: "180+ LeetCode problems organized by pattern category: NeetCode 150 as the core, plus bonus problems drawn from data-structure and algorithm deep dives."
category: cs
tags: [leetcode, interviews, neetcode-150, algorithms]
status: draft
created: 2026-04-23
updated: 2026-05-07
---

## Overview

This section covers 180+ LeetCode problems organized by pattern category. The core set is the [NeetCode 150](https://neetcode.io/roadmap), the de facto modern interview prep list and a superset of Blind 75. Beyond that, each category includes bonus problems drawn from the data-structure and algorithm pages on this site -- problems that reinforce the same patterns but fall outside the curated 150.

**NeetCode 150 problems** are tagged `neetcode-150` in their frontmatter. **Bonus problems** appear in the same category directories without that tag.

Every problem page includes:

1. **Brute force**: the most direct approach, always correct, often $O(n²)$ or worse.
2. **Improved / optimal**: the interview-level answer, best achievable time and space.

Each approach has working Python, line-labeled code, and a per-line complexity table. Many pages also include a **How to recognize this pattern** section covering the signal in the problem statement, a counterexample that breaks the tempting-but-wrong approach, and a table of related problems with the same shape.

For the reusable tactics behind those solutions, use [Coding Concepts](../coding-concepts/). Those pages explain ideas like two pointers, sliding windows, greedy exchange arguments, memoization, graph traversal, heaps, and monotonic structures, then link back to representative problems.

## Categories

| Category | Problems |
| --- | --- |
| [Arrays & Hashing](./arrays-and-hashing/) | 15 |
| [Two Pointers](./two-pointers/) | 5 |
| [Sliding Window](./sliding-window/) | 8 |
| [Stack](./stack/) | 16 |
| [Binary Search](./binary-search/) | 8 |
| [Linked List](./linked-list/) | 14 |
| [Trees](./trees/) | 17 |
| [Heap / Priority Queue](./heap-priority-queue/) | 7 |
| [Backtracking](./backtracking/) | 9 |
| [Tries](./tries/) | 3 |
| [Graphs](./graphs/) | 19 |
| [Advanced Graphs](./advanced-graphs/) | 8 |
| [1-D Dynamic Programming](./1d-dynamic-programming/) | 12 |
| [2-D Dynamic Programming](./2d-dynamic-programming/) | 11 |
| [Greedy](./greedy/) | 8 |
| [Intervals](./intervals/) | 6 |
| [Math & Geometry](./math-and-geometry/) | 8 |
| [Bit Manipulation](./bit-manipulation/) | 7 |

## Browse by difficulty

Pattern-grouping is the default. Difficulty is the orthogonal axis when you want to ramp up gradually or save the hard set for last.

- [Easy problems](./by-difficulty/easy/) (36 problems)
- [Medium problems](./by-difficulty/medium/) (118 problems)
- [Hard problems](./by-difficulty/hard/) (26 problems)
- [By-difficulty hub](./by-difficulty/), all three together

## How to use

Work through a category end-to-end. Within each problem:

- **Read the prompt.** Try to solve without scrolling.
- **If stuck, read only Approach 1 (brute force).** Reimplement yourself.
- **Compare your solution with the optimal approach.** Understand *why* the gap closes: usually a hash map, a monotonic structure, or a clever invariant.
- **Check the "How to recognize this pattern" section** if the page has one. It contains the signal to look for and the counterexample that breaks the wrong approach.

Complexity sections use standard Big-O notation. `n` is the input size unless otherwise noted.

## References

- [NeetCode 150, official list](https://neetcode.io/practice)
- [NeetCode roadmap](https://neetcode.io/roadmap), organized by pattern
- [NeetCode YouTube channel](https://www.youtube.com/@NeetCode), video walkthroughs for every problem
- [Grind 75](https://www.techinterviewhandbook.org/grind75), alternative curated list, includes many overlapping problems
- [Blind 75](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU), the subset that started it all
- [LeetCode patterns](https://seanprashad.com/leetcode-patterns/), problem list organized by common patterns

## Related topics

- [Data structures](../data-structures/), the longer-form reference for the structures used in every solution.
- [Named algorithms](../named-algorithms/), the canonical algorithms that show up inside these problems: Dijkstra, Tarjan, KMP, Floyd's, and more.
- [Coding concepts](../coding-concepts/), the approach vocabulary behind the problem solutions.
