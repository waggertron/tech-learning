---
title: Sorting as Preprocessing
description: "Order-first tactics that pay O(n log n) so adjacency, monotonic movement, or greedy choice becomes visible."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Sorting as preprocessing pays an ordering cost to expose structure. After sorting, equal values become adjacent, intervals line up by boundary, and pointer movement gains a monotonic reason.

The invariant after sorting is that moving forward never hides a smaller key behind you. That lets a scan merge intervals, skip duplicates, stop early, or move two pointers based on a comparison.

The key question is whether original order matters. If the problem asks about subsequences, original indices, or stable positions, sorting may destroy the answer. If the problem asks about sets, pairs, ranges, or relative value order, sorting often clarifies it.

## Value

The value is reducing a hard unordered search into a simple ordered pass. The sort costs $O(n \log n)$, but it can remove an $O(n^2)$ or backtracking step.

### Direct complexity example

- **Brute force:** Compare every interval or every pair in arbitrary order: $O(n^2)$ time and $O(1)$ to $O(n)$ space.
- **With this tactic:** Sort once, then scan or use two pointers: $O(n \log n)$ time plus a linear pass.
- **Space:** Space is whatever the language sort uses. In-place sorts can be $O(1)$ auxiliary space, while stable or boxed sorts may use $O(n)$ space.

## Challenges this solves

- duplicate control
- interval merging
- meeting rooms and schedules
- n-sum
- greedy selection by earliest finish or smallest cost

## When to use it

Use this tactic when these conditions are true:

- relative order is irrelevant to the answer
- adjacent equal or overlapping items become easy after ordering
- a monotonic scan or two-pointer proof appears after sorting
- the target complexity can afford $O(n \log n)$

## When not to use it

Reach for a different tactic when these warning signs appear:

- the prompt depends on original index order
- a linear hash or scan solution exists and sorting is slower
- the values are streaming and cannot be reordered
- the input is already in the only meaningful order

## Terminology clues

These prompt words often point toward this concept:

- sort first
- ordered
- ascending
- lexicographic
- overlap
- duplicates
- closest
- smallest first

## Problems that use it

- [15. 3Sum](../coding-problems/two-pointers/015-3sum/)
- [49. Group Anagrams](../coding-problems/arrays-and-hashing/049-group-anagrams/)
- [56. Merge Intervals](../coding-problems/intervals/056-merge-intervals/)
- [242. Valid Anagram](../coding-problems/arrays-and-hashing/242-valid-anagram/)
- [349. Intersection of Two Arrays](../coding-problems/arrays-and-hashing/349-intersection-of-two-arrays/)
- [435. Non-overlapping Intervals](../coding-problems/intervals/435-non-overlapping-intervals/)
- [846. Hand of Straights](../coding-problems/greedy/846-hand-of-straights/)
- [853. Car Fleet](../coding-problems/stack/853-car-fleet/)
- [1489. Find Critical and Pseudo-Critical Edges in MST](../coding-problems/advanced-graphs/1489-critical-and-pseudo-critical-edges/)

## Related concepts

- [Two pointers](./two-pointers/)
- [Intervals](./intervals/)
- [Greedy algorithms](./greedy-algorithms/)
