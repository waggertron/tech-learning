---
title: Trees
description: 15 problems covering binary trees and BSTs, traversals, recursion over subtrees, tree DP, BST invariants, and serialization.
parent: leetcode-150
tags: [leetcode, neetcode-150, trees, bst]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

The largest NeetCode category for a reason: trees reward recursive thinking, and most tree problems reduce to "define a function on a node, recurse into the subtrees, combine the results." Master the following patterns and most of the set falls out:

- **Four traversals**, preorder, inorder, postorder, level-order (BFS).
- **Subtree recursion**, compute something for `root` from results on `root.left` and `root.right`.
- **Tree DP**, when each node's answer needs multiple pieces of info from its children, return a tuple.
- **BST invariants**, in-order gives sorted order; bounds propagate down during validation.
- **Serialization**, DFS (usually preorder with null markers) or BFS encodes the shape.

## Problems

1. [226. Invert Binary Tree](./226-invert-binary-tree/), *Easy*
2. [104. Maximum Depth of Binary Tree](./104-maximum-depth-of-binary-tree/), *Easy*
3. [543. Diameter of Binary Tree](./543-diameter-of-binary-tree/), *Easy*
4. [110. Balanced Binary Tree](./110-balanced-binary-tree/), *Easy*
5. [100. Same Tree](./100-same-tree/), *Easy*
6. [572. Subtree of Another Tree](./572-subtree-of-another-tree/), *Easy*
7. [235. Lowest Common Ancestor of a BST](./235-lowest-common-ancestor-of-a-bst/), *Medium*
8. [102. Binary Tree Level Order Traversal](./102-binary-tree-level-order-traversal/), *Medium*
9. [199. Binary Tree Right Side View](./199-binary-tree-right-side-view/), *Medium*
10. [1448. Count Good Nodes in Binary Tree](./1448-count-good-nodes-in-binary-tree/), *Medium*
11. [98. Validate Binary Search Tree](./098-validate-binary-search-tree/), *Medium*
12. [230. Kth Smallest Element in a BST](./230-kth-smallest-element-in-a-bst/), *Medium*
13. [105. Construct Binary Tree from Preorder and Inorder Traversal](./105-construct-binary-tree-from-preorder-and-inorder-traversal/), *Medium*
14. [124. Binary Tree Maximum Path Sum](./124-binary-tree-maximum-path-sum/), *Hard*
15. [297. Serialize and Deserialize Binary Tree](./297-serialize-and-deserialize-binary-tree/), *Hard*

## Key patterns unlocked here

- **Recursive mirror operation**, Invert Binary Tree.
- **Height DFS**, Max Depth, Diameter (height + side-effect accumulator), Balanced.
- **Simultaneous structural comparison**, Same Tree, Subtree of Another.
- **BST-specific shortcuts**, LCA of BST, Validate BST, Kth Smallest.
- **BFS template**, Level Order, Right Side View (last of each level).
- **Path-DP DFS**, Count Good Nodes, Max Path Sum.
- **Traversal-pair reconstruction**, Build Tree from Preorder+Inorder.
- **DFS with null markers**, Serialize and Deserialize.
