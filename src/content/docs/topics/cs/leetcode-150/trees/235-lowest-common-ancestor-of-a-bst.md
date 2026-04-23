---
title: "235. Lowest Common Ancestor of a BST"
description: Find the LCA of two nodes in a Binary Search Tree.
parent: trees
tags: [leetcode, neetcode-150, trees, bst, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the root of a Binary Search Tree (BST) and two nodes `p` and `q`, return their lowest common ancestor (LCA) — the lowest node that has both `p` and `q` as descendants (where a node is a descendant of itself).

**Example**
- `root = [6,2,8,0,4,7,9,null,null,3,5]`, `p = 2`, `q = 8` → `6`
- Same tree, `p = 2`, `q = 4` → `2`

LeetCode 235 · [Link](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) · *Medium*

## Approach 1: Generic LCA (ignore BST property)

Works for any binary tree. Recurse into both subtrees; the LCA is the node where the paths diverge.

```python
def lowest_common_ancestor(root, p, q):
    if not root or root is p or root is q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left or right
```

**Complexity**
- **Time:** O(n). Whole tree visited worst case.
- **Space:** O(h) recursion.

Correct but throws away the BST invariant.

## Approach 2: Recursive BST walk

Use the ordering: if both `p` and `q` are less than `root`, go left; if both greater, go right; otherwise `root` is the split point = the LCA.

```python
def lowest_common_ancestor(root, p, q):
    if p.val < root.val and q.val < root.val:
        return lowest_common_ancestor(root.left, p, q)
    if p.val > root.val and q.val > root.val:
        return lowest_common_ancestor(root.right, p, q)
    return root
```

**Complexity**
- **Time:** O(h). Follow a single root-to-split path.
- **Space:** O(h) recursion.

For balanced BSTs, O(log n); for skewed, O(n).

## Approach 3: Iterative BST walk (optimal space)

Same logic without recursion.

```python
def lowest_common_ancestor(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    return None
```

**Complexity**
- **Time:** O(h).
- **Space:** **O(1)**.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Generic LCA | O(n) | O(h) |
| Recursive BST walk | O(h) | O(h) |
| **Iterative BST walk** | **O(h)** | **O(1)** |

The iterative BST walk is optimal. For generic binary trees (not BSTs), see problem 236 — which needs Approach 1.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/) — BST ordering invariant; iterative walk
