---
title: Named Algorithms
description: "Algorithms with proper names worth knowing by sight: Kadane's, Floyd's, Dijkstra's, and the rest of the canon."
category: cs
tags: [algorithms, interviews]
status: draft
created: 2026-05-01
updated: 2026-05-01
---

A short canon of algorithms that show up by name in interviews, papers, and codebases. Each entry covers what the algorithm does, why it works, when it applies, and the variants you'll encounter.

The aim isn't comprehensiveness, it's pattern recognition: when you hear "running sum that resets on negatives," you should think *Kadane*; when you hear "fast pointer + slow pointer," you should think *Floyd*. Each page below gives you the shape, the proof sketch, and the family of related problems.

## Algorithms

- [Kadane's algorithm](./kadane/), maximum contiguous subarray sum in O(n), and its product / stock-price variants

## Coming soon

- Floyd's tortoise and hare, cycle detection in O(1) space
- Dijkstra's algorithm, shortest paths with non-negative weights
- Bellman-Ford, shortest paths with negative weights and cycle detection
- Kahn's algorithm, topological sort via BFS
- Tarjan's SCC, strongly connected components in one DFS
- Karatsuba multiplication, sub-quadratic integer multiplication
- Knuth-Morris-Pratt (KMP), substring search in linear time
- Quickselect, kth-smallest in expected O(n)
- Boyer-Moore majority vote, find the >n/2 element in O(1) space

## Related topics

- [Data Structures](../data-structures/), the structures these algorithms operate on
- [LeetCode 150 (NeetCode)](../leetcode-150/), the problem catalog where these algorithms get exercised
- [Common algorithms cheat sheet](../../../posts/2026-04-27-common-algorithms-cheat-sheet/), shorter reference card style
