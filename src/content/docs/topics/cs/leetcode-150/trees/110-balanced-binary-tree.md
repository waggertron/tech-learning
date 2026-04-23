---
title: "110. Balanced Binary Tree"
description: Determine whether a binary tree is height-balanced.
parent: trees
tags: [leetcode, neetcode-150, trees, dfs, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a binary tree, determine if it is height-balanced: for every node, the left and right subtree heights differ by at most 1.

**Example**
- `root = [3,9,20,null,null,15,7]` → `true`
- `root = [1,2,2,3,3,null,null,4,4]` → `false`
- `root = []` → `true`

LeetCode 110 · [Link](https://leetcode.com/problems/balanced-binary-tree/) · *Easy*

## Approach 1: Top-down recompute heights at each node

For each node, compute heights of both subtrees, compare, then recurse.

```python
def is_balanced(root):
    def height(node):
        if not node:
            return 0
        return 1 + max(height(node.left), height(node.right))

    if not root:
        return True
    if abs(height(root.left) - height(root.right)) > 1:
        return False
    return is_balanced(root.left) and is_balanced(root.right)
```

**Complexity**
- **Time:** O(n²) worst case (skewed tree).
- **Space:** O(h) recursion.

Redundant work: we re-walk every subtree many times.

## Approach 2: Bottom-up DFS with -1 sentinel (optimal)

Return the height of each subtree, or `-1` if it's already unbalanced. A node returns `-1` if either child did.

```python
def is_balanced(root):
    def height(node):
        if not node:
            return 0
        lh = height(node.left)
        if lh == -1:
            return -1
        rh = height(node.right)
        if rh == -1:
            return -1
        if abs(lh - rh) > 1:
            return -1
        return 1 + max(lh, rh)

    return height(root) != -1
```

**Complexity**
- **Time:** O(n). Each node visited once.
- **Space:** O(h) recursion.

### Pattern
This is the "sentinel value" version of the diameter pattern: we want a single value back from the DFS, but we also need to propagate a failure condition. `-1` is a legal "never going to match" sentinel because valid heights are ≥ 0.

An alternative is to return a tuple `(balanced: bool, height: int)` — same complexity, marginally more code, but perhaps cleaner for larger invariant checks.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Top-down height per node | O(n²) | O(h) |
| **Bottom-up with sentinel** | **O(n)** | **O(h)** |

The bottom-up form is the canonical fix for any "top-down recomputation" tree antipattern.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/) — height DFS with short-circuit sentinel
