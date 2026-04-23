---
title: "98. Validate Binary Search Tree"
description: Determine whether a binary tree is a valid BST.
parent: trees
tags: [leetcode, neetcode-150, trees, bst, dfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the root of a binary tree, determine if it is a valid Binary Search Tree:

- The left subtree of a node contains only nodes with keys strictly less than the node's key.
- The right subtree of a node contains only nodes with keys strictly greater than the node's key.
- Both the left and right subtrees must also be BSTs.

**Example**
- `root = [2,1,3]` → `true`
- `root = [5,1,4,null,null,3,6]` → `false` (4 > 3, violating BST)

LeetCode 98 · [Link](https://leetcode.com/problems/validate-binary-search-tree/) · *Medium*

## Approach 1: Brute force — check "all left < root < all right" at each node

For each node, walk its left subtree confirming all < node, and right subtree confirming all > node.

```python
def is_valid_bst(root):
    def all_less(node, val):
        if not node:
            return True
        return node.val < val and all_less(node.left, val) and all_less(node.right, val)

    def all_greater(node, val):
        if not node:
            return True
        return node.val > val and all_greater(node.left, val) and all_greater(node.right, val)

    if not root:
        return True
    return (all_less(root.left, root.val)
            and all_greater(root.right, root.val)
            and is_valid_bst(root.left)
            and is_valid_bst(root.right))
```

**Complexity**
- **Time:** O(n²) worst case.
- **Space:** O(h).

Correct but re-walks subtrees many times.

## Approach 2: Inorder traversal must be strictly increasing

An inorder walk of a BST yields values in sorted order. Compare each visited value to the previous.

```python
def is_valid_bst(root):
    prev = [float('-inf')]

    def inorder(node):
        if not node:
            return True
        if not inorder(node.left):
            return False
        if node.val <= prev[0]:
            return False
        prev[0] = node.val
        return inorder(node.right)

    return inorder(root)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h) recursion.

Elegant; the BST's defining property makes this a one-liner-ish implementation.

## Approach 3: Recursive with (low, high) bounds (optimal)

Pass tightening bounds down the tree: at any node, every value must fit strictly within `(low, high)`. When recursing left, `high` becomes the node's value; when recursing right, `low` becomes the node's value.

```python
def is_valid_bst(root):
    def validate(node, low, high):
        if not node:
            return True
        if not (low < node.val < high):
            return False
        return (validate(node.left, low, node.val)
                and validate(node.right, node.val, high))
    return validate(root, float('-inf'), float('inf'))
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h) recursion.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Nested all-less / all-greater | O(n²) | O(h) |
| Inorder monotonic check | O(n) | O(h) |
| **Recursive bounds** | **O(n)** | **O(h)** |

Both Approach 2 and Approach 3 are O(n); the bounds version scales more naturally to variants that need upper/lower constraints (insertion, range counting).

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/) — BST invariant propagation
