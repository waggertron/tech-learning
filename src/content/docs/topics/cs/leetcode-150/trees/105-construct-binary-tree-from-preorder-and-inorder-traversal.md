---
title: "105. Construct Binary Tree from Preorder and Inorder Traversal"
description: Reconstruct a binary tree from its preorder and inorder traversal lists.
parent: trees
tags: [leetcode, neetcode-150, trees, recursion, hash-tables, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given two integer arrays `preorder` and `inorder` representing the preorder and inorder traversals of a binary tree (assume unique values), reconstruct and return the tree.

**Example**
- `preorder = [3,9,20,15,7]`, `inorder = [9,3,15,20,7]` → `[3,9,20,null,null,15,7]`
- `preorder = [-1]`, `inorder = [-1]` → `[-1]`

LeetCode 105 · [Link](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) · *Medium*

## Approach 1: Recursive with `list.index` per call

First element of `preorder` is the root. Find it in `inorder` to split left/right subtrees. Recurse.

```python
def build_tree(preorder, inorder):
    if not preorder:
        return None
    root_val = preorder[0]
    root = TreeNode(root_val)
    mid = inorder.index(root_val)
    root.left = build_tree(preorder[1:mid + 1], inorder[:mid])
    root.right = build_tree(preorder[mid + 1:], inorder[mid + 1:])
    return root
```

**Complexity**
- **Time:** O(n²). `list.index` is O(n); called O(n) times.
- **Space:** O(n²) across slices; O(n) for the tree.

## Approach 2: Hash map inorder index + pointer recursion (optimal)

Precompute `val -> index` in `inorder` once (O(n)). Pass index ranges into the recursion instead of slicing.

```python
def build_tree(preorder, inorder):
    inorder_idx = {v: i for i, v in enumerate(inorder)}
    pre_i = [0]

    def rec(in_l, in_r):
        if in_l > in_r:
            return None
        root_val = preorder[pre_i[0]]
        pre_i[0] += 1
        root = TreeNode(root_val)
        mid = inorder_idx[root_val]
        root.left = rec(in_l, mid - 1)
        root.right = rec(mid + 1, in_r)
        return root

    return rec(0, len(inorder) - 1)
```

**Complexity**
- **Time:** O(n). Each node constructed in O(1) given the index.
- **Space:** O(n) for the map + O(h) recursion.

### Why the preorder index is shared state
We consume the preorder from left to right — but we must process the left subtree completely *before* starting the right subtree. By sharing a single counter (`pre_i`) across recursive calls, the left subtree's exhaustion naturally positions us at the right subtree's root.

## Approach 3: Iterative with a stack

More code; rarely preferred unless recursion depth is a specific concern. The iterative form pushes preorder values while walking the inorder until the top matches; then pops and assigns to the next preorder root. Pattern is subtle; I'll skip the full implementation in favor of the cleaner recursive hash-map version.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Recursive with `list.index` | O(n²) | O(n²) slices |
| **Hash map + recursion** | **O(n)** | **O(n)** |
| Iterative stack | O(n) | O(n) |

The hash-map + recursion pattern generalizes to problem 106 (Build from Inorder + Postorder) — same code with the preorder cursor replaced by a right-to-left postorder cursor.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/) — reconstruction from traversals
- [Hash Tables](../../../data-structures/hash-tables/) — O(1) index lookup in inorder
