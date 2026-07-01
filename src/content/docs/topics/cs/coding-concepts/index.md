---
title: Coding Concepts
description: "Approach concepts for recognizing, choosing, and explaining the tactics behind coding interview problems."
category: cs
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

Coding concepts are the tactics behind the problem catalog. A problem category tells you where a problem lives. A concept page tells you what mental move makes the solution work.

The same problem can link to several concepts. That overlap is intentional. `3Sum` is sorting as preprocessing plus two pointers. `Course Schedule` is graph traversal plus topological sort plus cycle detection. `Sliding Window Maximum` is sliding window plus monotonic queue. The links should explain the transferable ideas, not force every problem into one bucket.

## How to use these pages

- Start with the terminology clues when you are stuck on a prompt.
- Check "When not to use it" before committing to a pattern.
- Use the problem links as drills for that tactic.
- Add a problem backlink under `## Related concepts` when a page clearly exercises the concept.

## Linear and Ordered Data

| Concept | What it helps you notice |
| --- | --- |
| [Array Scans](./array-scans/) | Linear pass tactics for reading an array once, carrying just enough state, and avoiding nested loops. |
| [Two Pointers](./two-pointers/) | Two-index tactics for shrinking search space while preserving an invariant between positions. |
| [Fast and Slow Pointers](./fast-and-slow-pointers/) | Pointer-speed tactics for cycle detection, middle finding, and linked-list distance constraints. |
| [Sliding Window](./sliding-window/) | Contiguous-range tactics for maintaining a valid subarray or substring while endpoints move forward. |
| [Prefix Sums](./prefix-sums/) | Accumulation tactics for answering range-sum and subarray-count questions from differences between checkpoints. |
| [Difference Arrays](./difference-arrays/) | Range-update tactics that mark changes at boundaries and recover final values with a prefix scan. |
| [Hash Map Counting](./hash-map-counting/) | Frequency-table tactics for turning membership, complement, and multiplicity questions into direct lookups. |
| [Sorting as Preprocessing](./sorting-as-preprocessing/) | Order-first tactics that pay O(n log n) so adjacency, monotonic movement, or greedy choice becomes visible. |

## Search and Ranges

| Concept | What it helps you notice |
| --- | --- |
| [Binary Search](./binary-search/) | Monotonic search tactics for cutting a sorted or ordered search space in half until one answer remains. |
| [Binary Search on Answer](./binary-search-on-answer/) | Feasibility-search tactics for finding the smallest or largest value that satisfies a monotonic condition. |
| [Modified Binary Search](./modified-binary-search/) | Binary-search variants for rotated arrays, peak finding, and data where the ordering is present but disguised. |
| [Intervals](./intervals/) | Range-boundary tactics for overlap, containment, scheduling, and sweep-line problems. |
| [Merge Intervals](./merge-intervals/) | Sorted-boundary tactics for combining overlapping ranges and maintaining the current covered span. |

## Optimization and DP

| Concept | What it helps you notice |
| --- | --- |
| [Greedy Algorithms](./greedy-algorithms/) | Local-choice tactics for solving optimization and reachability problems when a provable invariant protects the future. |
| [Greedy Exchange Arguments](./greedy-exchange-arguments/) | Proof tactics for showing that a greedy choice can be swapped into an optimal solution without making it worse. |
| [Dynamic Programming](./dynamic-programming/) | State-and-transition tactics for solving overlapping subproblems with cached answers. |
| [Memoization](./memoization/) | Top-down caching tactics for preserving recursive clarity while avoiding repeated subproblem work. |
| [Tabulation](./tabulation/) | Bottom-up DP tactics for filling states in dependency order without recursion. |
| [State Compression](./state-compression/) | DP memory tactics for keeping only the previous states needed for the next transition. |
| [Knapsack Patterns](./knapsack-patterns/) | Choose-or-skip DP tactics for capacity, subset, and target-sum problems. |
| [Sequence DP](./sequence-dp/) | Order-aware DP tactics for strings and arrays where prefixes or positions define reusable states. |
| [Grid DP](./grid-dp/) | Row-column DP tactics for paths, matrix states, and local moves with directional dependencies. |

## Recursive Search

| Concept | What it helps you notice |
| --- | --- |
| [Backtracking](./backtracking/) | Search-tree tactics for exploring choices, undoing state, and pruning invalid branches. |
| [Subsets and Combinations](./subsets-and-combinations/) | Choice-set tactics for generating selected groups while controlling duplicates and order. |
| [Permutations](./permutations/) | Ordering tactics for generating arrangements where the same items in a different order are different answers. |
| [Constraint Search](./constraint-search/) | Pruned search tactics for problems where each choice must satisfy local and global constraints. |
| [Recursion](./recursion/) | Self-similar problem-solving tactics for trees, divide-and-conquer, and search branches. |
| [Divide and Conquer](./divide-and-conquer/) | Split-solve-combine tactics for reducing a problem into independent smaller pieces. |

## Graphs and Trees

| Concept | What it helps you notice |
| --- | --- |
| [Tree Traversal](./tree-traversal/) | Recursive and iterative tactics for visiting tree nodes with path, depth, or structural state. |
| [DFS](./dfs/) | Depth-first traversal tactics for exploring one branch fully before backtracking to alternatives. |
| [BFS](./bfs/) | Breadth-first traversal tactics for level order, shortest unweighted paths, and expanding frontiers. |
| [Graph Traversal](./graph-traversal/) | Visited-state tactics for exploring nodes, edges, components, and reachability relationships. |
| [Topological Sort](./topological-sort/) | Dependency-order tactics for DAGs, prerequisites, and detecting cycles in directed graphs. |
| [Union Find](./union-find/) | Disjoint-set tactics for tracking connected components as edges arrive. |
| [Shortest Paths](./shortest-paths/) | Path-cost tactics for finding minimum distance, time, risk, or transformation count through a graph. |
| [Dijkstra](./dijkstra/) | Non-negative weighted shortest-path tactics using a priority queue frontier. |
| [Bellman-Ford](./bellman-ford/) | Repeated-relaxation tactics for shortest paths with negative edges, bounded stops, or layered constraints. |
| [Flood Fill](./flood-fill/) | Grid traversal tactics for expanding through adjacent cells that share a condition. |

## Specialized Structures

| Concept | What it helps you notice |
| --- | --- |
| [Heap and Priority Queue](./heap-and-priority-queue/) | Priority-frontier tactics for repeatedly extracting the smallest, largest, or most urgent item. |
| [Top K](./top-k/) | Selection tactics for finding the largest, smallest, or most frequent K items without fully ordering everything. |
| [K-way Merge](./k-way-merge/) | Multi-stream ordering tactics for combining several sorted sources through one priority queue. |
| [Monotonic Stack](./monotonic-stack/) | Ordered-stack tactics for nearest greater, nearest smaller, and span-style questions. |
| [Monotonic Queue](./monotonic-queue/) | Deque tactics for maintaining a window minimum or maximum as the window slides. |
| [Stack Parsing](./stack-parsing/) | Last-open-first-closed tactics for nested syntax, expressions, and reversible operations. |
| [Trie Prefix Search](./trie-prefix-search/) | Prefix-tree tactics for sharing common string prefixes and pruning word search branches. |

## Bits, Math, and Simulation

| Concept | What it helps you notice |
| --- | --- |
| [Bit Manipulation](./bit-manipulation/) | Binary-representation tactics for masks, toggles, arithmetic shortcuts, and set-like operations. |
| [Bitmask State](./bitmask-state/) | Compact-state tactics for representing chosen items, visited sets, and small DP dimensions as integer masks. |
| [Linked List Pointer Rewiring](./linked-list-pointer-rewiring/) | Node-link tactics for changing list structure without losing the rest of the chain. |
| [Cycle Detection](./cycle-detection/) | Repeated-state tactics for finding loops in linked lists, graphs, arrays, and numeric processes. |
| [Simulation](./simulation/) | State-machine tactics for faithfully executing rules while keeping state small and explicit. |
| [Math and Number Theory](./math-and-number-theory/) | Arithmetic tactics for problems driven by divisibility, digits, modular behavior, and numeric identities. |

## References

- [NeetCode roadmap](https://neetcode.io/roadmap), pattern-first problem organization.
- [Tech Interview Handbook algorithms guide](https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/), interview algorithm and data-structure review.
- [AlgoMonster flowchart](https://algo.monster/flowchart), decision flow for choosing common interview patterns.
- [Grokking the Coding Interview](https://www.designgurus.io/course/grokking-the-coding-interview), pattern-based interview preparation.

## Related topics

- [Coding Problems](../coding-problems/), the problem catalog these concept pages cross-link with.
- [Data Structures](../data-structures/), the concrete containers many tactics rely on.
- [Named Algorithms](../named-algorithms/), canonical algorithms that deserve deeper standalone treatment.
