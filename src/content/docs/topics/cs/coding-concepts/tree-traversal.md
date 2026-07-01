---
title: Tree Traversal
description: "Recursive and iterative tactics for visiting tree nodes with path, depth, or structural state."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Tree traversal visits nodes while carrying path, depth, or subtree state. Recursion fits naturally because each child is the root of a smaller tree.

The invariant depends on traversal order. Preorder handles a node before children, inorder exposes sorted order in a BST, postorder solves children before the parent, and level order groups nodes by depth.

Choose the traversal from the data dependency. If the parent needs child answers, use postorder. If children need path state from ancestors, use preorder. If the answer is by level, use BFS.

## Value

The value is using tree structure instead of treating nodes as arbitrary graph nodes. Since a tree has no cycles, traversal can avoid a visited set when parent links are absent.

### Direct complexity example

- **Brute force:** For each node, recompute information by scanning its subtree repeatedly: $O(n^2)$ time in skewed cases.
- **With this tactic:** Return or carry the needed state in one traversal: $O(n)$ time.
- **Space:** Recursive DFS uses $O(h)$ stack space for tree height. BFS level order can use $O(w)$ space for maximum width.

## Challenges this solves

- max depth
- same tree
- path sums
- BST validation
- level order output
- subtree aggregation

## When to use it

Use this tactic when these conditions are true:

- the input is hierarchical
- each node has children and no cycles
- the answer depends on path or subtree information
- the prompt asks for level, depth, ancestor, descendant, or BST order

## When not to use it

Reach for a different tactic when these warning signs appear:

- the structure can contain cycles and needs graph traversal with visited state
- the tree is too deep for recursion without an iterative version
- random access by value is needed and traversal alone is too slow
- the problem needs updates and queries over a dynamic tree

## Terminology clues

These prompt words often point toward this concept:

- tree
- root
- leaf
- subtree
- depth
- level order
- ancestor
- BST

## Problems that use it

- [98. Validate Binary Search Tree](../coding-problems/trees/098-validate-binary-search-tree/)
- [102. Binary Tree Level Order Traversal](../coding-problems/trees/102-binary-tree-level-order-traversal/)
- [104. Maximum Depth of Binary Tree](../coding-problems/trees/104-maximum-depth-of-binary-tree/)
- [105. Construct Binary Tree from Preorder and Inorder Traversal](../coding-problems/trees/105-construct-binary-tree-from-preorder-and-inorder-traversal/)
- [110. Balanced Binary Tree](../coding-problems/trees/110-balanced-binary-tree/)
- [124. Binary Tree Maximum Path Sum](../coding-problems/trees/124-binary-tree-maximum-path-sum/)
- [199. Binary Tree Right Side View](../coding-problems/trees/199-binary-tree-right-side-view/)
- [208. Implement Trie (Prefix Tree)](../coding-problems/tries/208-implement-trie/)
- [226. Invert Binary Tree](../coding-problems/trees/226-invert-binary-tree/)
- [230. Kth Smallest Element in a BST](../coding-problems/trees/230-kth-smallest-element-in-a-bst/)
- [235. Lowest Common Ancestor of a BST](../coding-problems/trees/235-lowest-common-ancestor-of-a-bst/)
- [297. Serialize and Deserialize Binary Tree](../coding-problems/trees/297-serialize-and-deserialize-binary-tree/)
- [337. House Robber III](../coding-problems/trees/337-house-robber-iii/)
- [543. Diameter of Binary Tree](../coding-problems/trees/543-diameter-of-binary-tree/)
- [572. Subtree of Another Tree](../coding-problems/trees/572-subtree-of-another-tree/)
- [968. Binary Tree Cameras](../coding-problems/trees/968-binary-tree-cameras/)
- [1448. Count Good Nodes in Binary Tree](../coding-problems/trees/1448-count-good-nodes-in-binary-tree/)

## Related concepts

- [DFS](./dfs/)
- [BFS](./bfs/)
- [Recursion](./recursion/)
