---
title: DFS
description: "Depth-first traversal tactics for exploring one branch fully before backtracking to alternatives."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

DFS explores one branch fully before returning to try alternatives. It can be written with recursion or an explicit stack.

The invariant is the visited state and the current path. In graph DFS, visited prevents cycles from causing infinite recursion. In tree DFS, the acyclic structure often makes visited unnecessary.

DFS is strongest when the answer depends on connected regions, paths, finishing times, or recursive substructure. It is not naturally shortest-path by edge count unless you explore every path or add more state.

## Value

The value is low overhead exploration. DFS reaches deep structure quickly and stores only the active path plus visited state.

### Direct complexity example

- **Brute force:** Start a fresh search from every node without remembering visited nodes: $O(V \cdot (V + E))$ time in a graph.
- **With this tactic:** Mark visited nodes and traverse each edge a bounded number of times: $O(V + E)$ time.
- **Space:** Space is $O(V)$ for visited plus $O(depth)$ stack. In the worst case, depth can be $O(V)$.

## Challenges this solves

- connected components
- cycle detection
- topological sort by finish time
- island counting
- tree recursion
- path existence

## When to use it

Use this tactic when these conditions are true:

- you need to explore all reachable nodes
- depth or path context matters
- the graph can be marked visited
- recursive decomposition is clear

## When not to use it

Reach for a different tactic when these warning signs appear:

- the problem asks for shortest unweighted path and BFS gives the first answer by level
- recursion depth is unsafe and an iterative stack is not planned
- edge weights require Dijkstra or Bellman-Ford
- you need level-by-level processing

## Terminology clues

These prompt words often point toward this concept:

- DFS
- depth first
- connected component
- visited
- path exists
- island
- recursive traversal
- finish time

## Problems that use it

- [98. Validate Binary Search Tree](../coding-problems/trees/098-validate-binary-search-tree/)
- [100. Same Tree](../coding-problems/trees/100-same-tree/)
- [110. Balanced Binary Tree](../coding-problems/trees/110-balanced-binary-tree/)
- [124. Binary Tree Maximum Path Sum](../coding-problems/trees/124-binary-tree-maximum-path-sum/)
- [130. Surrounded Regions](../coding-problems/graphs/130-surrounded-regions/)
- [133. Clone Graph](../coding-problems/graphs/133-clone-graph/)
- [200. Number of Islands](../coding-problems/graphs/200-number-of-islands/)
- [211. Design Add and Search Words Data Structure](../coding-problems/tries/211-design-add-and-search-words-data-structure/)
- [230. Kth Smallest Element in a BST](../coding-problems/trees/230-kth-smallest-element-in-a-bst/)
- [235. Lowest Common Ancestor of a BST](../coding-problems/trees/235-lowest-common-ancestor-of-a-bst/)
- [297. Serialize and Deserialize Binary Tree](../coding-problems/trees/297-serialize-and-deserialize-binary-tree/)
- [332. Reconstruct Itinerary](../coding-problems/advanced-graphs/332-reconstruct-itinerary/)
- [543. Diameter of Binary Tree](../coding-problems/trees/543-diameter-of-binary-tree/)
- [572. Subtree of Another Tree](../coding-problems/trees/572-subtree-of-another-tree/)
- [695. Max Area of Island](../coding-problems/graphs/695-max-area-of-island/)
- [1192. Critical Connections in a Network](../coding-problems/advanced-graphs/1192-critical-connections/)
- [1448. Count Good Nodes in Binary Tree](../coding-problems/trees/1448-count-good-nodes-in-binary-tree/)

## Related concepts

- [Graph traversal](./graph-traversal/)
- [Tree traversal](./tree-traversal/)
- [BFS](./bfs/)
- [Backtracking](./backtracking/)
