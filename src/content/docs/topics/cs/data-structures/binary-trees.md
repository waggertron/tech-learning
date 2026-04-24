---
title: Binary Trees & BSTs
description: Hierarchical structures where each node has up to two children. BSTs add the left < node < right invariant, enabling O(log n) operations when balanced.
parent: data-structures
tags: [data-structures, trees, bst, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

A **binary tree** is a hierarchical structure where each node has up to two children (left, right). A **binary search tree (BST)** adds a single invariant: for every node, all values in its left subtree are less, and all values in its right subtree are greater. That invariant is what enables O(log n) search, insert, and delete in a balanced tree. Most interview tree problems reduce to recursion, define a function on a node and combine subtree results.

## In-depth description

**Traversals** are the starting point:

- **Preorder** (root → left → right), useful for serializing the structure itself.
- **Inorder** (left → root → right), on a BST, yields values in sorted order. Critical insight.
- **Postorder** (left → right → root), useful for subtree computations (delete, aggregate up).
- **Level-order** (BFS), traverse by depth using a queue; used for level-dependent problems.

Vanilla BSTs degrade to O(n) on sorted input (they become a linked list). **Self-balancing variants**, AVL, red-black trees, B-trees, maintain O(log n) depth via rotations. Java's `TreeMap`/`TreeSet` and C++'s `std::map`/`std::set` are red-black trees. Python has no built-in balanced BST; use `sortedcontainers.SortedList` or build workarounds.

**Interview patterns:**

- **Recursion on subtrees**, define `f(node)` in terms of `f(node.left)` and `f(node.right)`. Max Depth, Diameter, Symmetric, Invert are all one-liners in this form.
- **Returning tuples from recursion**, when you need multiple pieces of info about a subtree (e.g., "max depth *and* whether balanced"), return a tuple.
- **Tree DP**, when a decision at a node depends on decisions at its children; e.g., House Robber III, Binary Tree Cameras.
- **Iterative traversal**, replace recursion with an explicit stack (prevents stack overflow on deep trees).
- **LCA (Lowest Common Ancestor)**, recursive case analysis; a staple.

## Time complexity

| Operation | Balanced BST | Unbalanced | Vanilla binary tree |
| --- | --- | --- | --- |
| Search | O(log n) | O(n) | O(n) |
| Insert | O(log n) | O(n) | - |
| Delete | O(log n) | O(n) | - |
| Traversal | O(n) | O(n) | O(n) |
| Space | O(n) | O(n) | O(n) |

## Common uses in DSA

1. **Hierarchical data modeling**, file systems, DOM, ASTs, expression trees.
2. **Ordered map / sorted set operations**, `TreeMap`, `std::map`, `SortedList` for "give me the next-largest key" and range queries.
3. **Recursive subtree problems**, Maximum Depth, Invert Binary Tree, Diameter, Symmetric Tree, Path Sum.
4. **Lowest Common Ancestor**, LCA of a Binary Tree, LCA of a BST.
5. **Tree DP and serialization**, House Robber III, Binary Tree Cameras, Serialize and Deserialize Binary Tree.

**Canonical LeetCode problems:** #98 Validate BST, #104 Maximum Depth, #226 Invert Binary Tree, #235 LCA of a BST, #297 Serialize and Deserialize Binary Tree, #543 Diameter of Binary Tree, #572 Subtree of Another Tree.

## Python example

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Inorder traversal (recursive)
def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# Level-order (BFS)
def level_order(root):
    if not root:
        return []
    result, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        result.append(level)
    return result

# Max depth
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

# Validate BST (using inorder property: sorted strictly ascending)
def is_valid_bst(root, low=float('-inf'), high=float('inf')):
    if not root:
        return True
    if not (low < root.val < high):
        return False
    return (is_valid_bst(root.left, low, root.val)
            and is_valid_bst(root.right, root.val, high))

# Lowest Common Ancestor
def lca(root, p, q):
    if not root or root is p or root is q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    return root if left and right else (left or right)
```

## LeetCode problems

Binary trees (and BSTs) drive all 15 NeetCode 150 problems in the Trees category.

**Trees:**
- [226. Invert Binary Tree](../../leetcode-150/trees/226-invert-binary-tree/)
- [104. Maximum Depth of Binary Tree](../../leetcode-150/trees/104-maximum-depth-of-binary-tree/)
- [543. Diameter of Binary Tree](../../leetcode-150/trees/543-diameter-of-binary-tree/), height + accumulator DFS
- [110. Balanced Binary Tree](../../leetcode-150/trees/110-balanced-binary-tree/), bottom-up DFS with sentinel
- [100. Same Tree](../../leetcode-150/trees/100-same-tree/)
- [572. Subtree of Another Tree](../../leetcode-150/trees/572-subtree-of-another-tree/)
- [235. Lowest Common Ancestor of a BST](../../leetcode-150/trees/235-lowest-common-ancestor-of-a-bst/), iterative BST walk
- [102. Binary Tree Level Order Traversal](../../leetcode-150/trees/102-binary-tree-level-order-traversal/)
- [199. Binary Tree Right Side View](../../leetcode-150/trees/199-binary-tree-right-side-view/)
- [1448. Count Good Nodes in Binary Tree](../../leetcode-150/trees/1448-count-good-nodes-in-binary-tree/), path-state DFS
- [98. Validate Binary Search Tree](../../leetcode-150/trees/098-validate-binary-search-tree/), recursive bounds
- [230. Kth Smallest Element in a BST](../../leetcode-150/trees/230-kth-smallest-element-in-a-bst/), iterative inorder
- [105. Construct Binary Tree from Preorder and Inorder](../../leetcode-150/trees/105-construct-binary-tree-from-preorder-and-inorder-traversal/)
- [124. Binary Tree Maximum Path Sum](../../leetcode-150/trees/124-binary-tree-maximum-path-sum/), tree DP with accumulator
- [297. Serialize and Deserialize Binary Tree](../../leetcode-150/trees/297-serialize-and-deserialize-binary-tree/)

## References

- [Binary tree, Wikipedia](https://en.wikipedia.org/wiki/Binary_tree)
- [Red-black tree, Wikipedia](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)
- [CLRS Chapter 12: Binary Search Trees](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)
- [Tree problems, NeetCode roadmap](https://neetcode.io/roadmap)
