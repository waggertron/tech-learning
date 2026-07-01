---
title: Tree Traversal
description: "Recursive and iterative tactics for visiting tree nodes with path, depth, or structural state."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Tree traversal chooses an order, preorder, inorder, postorder, or level order, and carries the state needed at each node.

## Value

The value is matching the traversal order to the question. Many tree problems become simple once the return value or side effect is clear.

## Challenges this solves

- depth and height
- structural comparison
- path state
- BST ordering
- level order views

## When to use it

Use it when each node can be solved from its children, ancestors, or neighbors at the same depth.

## When not to use it

Do not use recursive traversal blindly on very deep trees in languages with small recursion limits.

## Terminology clues

- binary tree
- root
- leaf
- subtree
- path
- depth
- level

## Problems that use it

- [104. Maximum Depth of Binary Tree](../coding-problems/trees/104-maximum-depth-of-binary-tree/)
- [226. Invert Binary Tree](../coding-problems/trees/226-invert-binary-tree/)
- [102. Binary Tree Level Order Traversal](../coding-problems/trees/102-binary-tree-level-order-traversal/)
- [1448. Count Good Nodes in Binary Tree](../coding-problems/trees/1448-count-good-nodes-in-binary-tree/)

## Related concepts

- [DFS](./dfs/)
- [BFS](./bfs/)
- [Recursion](./recursion/)
