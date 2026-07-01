---
title: Recursion
description: "Self-similar problem-solving tactics for trees, divide-and-conquer, and search branches."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Recursion solves a problem by solving smaller problems with the same shape. The useful parts are the base case, the recursive contract, and how results combine.

## Value

The value is matching nested structure. Trees, DFS, and backtracking often read directly as recursive definitions.

## Challenges this solves

- tree traversal
- subtree aggregation
- divide and conquer
- backtracking
- recursive DP

## When to use it

Use it when the data or decision tree is naturally nested and each call has a smaller scope.

## When not to use it

Do not use recursion when depth can exceed stack limits or when an iterative stack is clearer.

## Terminology clues

- tree
- subproblem
- recursive
- root and children
- divide
- choose and recurse

## Problems that use it

- [100. Same Tree](../coding-problems/trees/100-same-tree/)
- [104. Maximum Depth of Binary Tree](../coding-problems/trees/104-maximum-depth-of-binary-tree/)
- [226. Invert Binary Tree](../coding-problems/trees/226-invert-binary-tree/)
- [78. Subsets](../coding-problems/backtracking/078-subsets/)

## Related concepts

- [Tree traversal](./tree-traversal/)
- [DFS](./dfs/)
- [Backtracking](./backtracking/)
- [Divide and conquer](./divide-and-conquer/)
