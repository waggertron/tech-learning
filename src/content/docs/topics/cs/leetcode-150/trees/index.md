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

1. [226. Invert Binary Tree (Easy)](./226-invert-binary-tree/)
2. [104. Maximum Depth of Binary Tree (Easy)](./104-maximum-depth-of-binary-tree/)
3. [543. Diameter of Binary Tree (Easy)](./543-diameter-of-binary-tree/)
4. [110. Balanced Binary Tree (Easy)](./110-balanced-binary-tree/)
5. [100. Same Tree (Easy)](./100-same-tree/)
6. [572. Subtree of Another Tree (Easy)](./572-subtree-of-another-tree/)
7. [235. Lowest Common Ancestor of a BST (Medium)](./235-lowest-common-ancestor-of-a-bst/)
8. [102. Binary Tree Level Order Traversal (Medium)](./102-binary-tree-level-order-traversal/)
9. [199. Binary Tree Right Side View (Medium)](./199-binary-tree-right-side-view/)
10. [1448. Count Good Nodes in Binary Tree (Medium)](./1448-count-good-nodes-in-binary-tree/)
11. [98. Validate Binary Search Tree (Medium)](./098-validate-binary-search-tree/)
12. [230. Kth Smallest Element in a BST (Medium)](./230-kth-smallest-element-in-a-bst/)
13. [105. Construct Binary Tree from Preorder and Inorder Traversal (Medium)](./105-construct-binary-tree-from-preorder-and-inorder-traversal/)
14. [124. Binary Tree Maximum Path Sum (Hard)](./124-binary-tree-maximum-path-sum/)
15. [297. Serialize and Deserialize Binary Tree (Hard)](./297-serialize-and-deserialize-binary-tree/)

## Key patterns unlocked here

- **Recursive mirror operation**, Invert Binary Tree.
- **Height DFS**, Max Depth, Diameter (height + side-effect accumulator), Balanced.
- **Simultaneous structural comparison**, Same Tree, Subtree of Another.
- **BST-specific shortcuts**, LCA of BST, Validate BST, Kth Smallest.
- **BFS template**, Level Order, Right Side View (last of each level).
- **Path-DP DFS**, Count Good Nodes, Max Path Sum.
- **Traversal-pair reconstruction**, Build Tree from Preorder+Inorder.
- **DFS with null markers**, Serialize and Deserialize.
