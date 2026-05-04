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
- [Dijkstra's algorithm](./dijkstra/), single-source shortest paths on non-negative weighted graphs in O((V + E) log V)
- [Breadth-First Search](./bfs/), level-by-level graph and grid traversal; shortest path in unweighted graphs
- [Depth-First Search](./dfs/), commit-and-backtrack traversal; cycle detection, topological sort, connected components
- [Floyd's tortoise and hare](./floyds/), cycle detection and cycle-start location in O(n) time and O(1) space
- [Bellman-Ford](./bellman-ford/), shortest paths with negative edge weights and negative-cycle detection
- [Kahn's algorithm](./kahns/), topological sort via BFS; cycle detection falls out naturally
- [Tarjan's algorithm](./tarjans/), strongly connected components in a single DFS pass

## Coming soon
- Karatsuba multiplication, sub-quadratic integer multiplication
- Knuth-Morris-Pratt (KMP), substring search in linear time
- Quickselect, kth-smallest in expected O(n)
- Boyer-Moore majority vote, find the >n/2 element in O(1) space

## Related topics

- [Graph Theory](../graph-theory/), deep dive into graph terminology, types, components, SCCs, DAGs, and weighted-graph problem modeling
- [Data Structures](../data-structures/), the structures these algorithms operate on
- [LeetCode 150 (NeetCode)](../leetcode-150/), the problem catalog where these algorithms get exercised
- [Common algorithms cheat sheet](../../../posts/2026-04-27-common-algorithms-cheat-sheet/), shorter reference card style
