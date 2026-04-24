---
title: "543. Diameter of Binary Tree"
description: Return the length of the longest path between any two nodes in a binary tree.
parent: trees
tags: [leetcode, neetcode-150, trees, dfs, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the root of a binary tree, return the length of the diameter, the longest path between any two nodes in the tree. The path may or may not pass through the root. Length is measured in **edges**.

**Example**
- `root = [1,2,3,4,5]` → `3` (path: `4 → 2 → 1 → 3` or `5 → 2 → 1 → 3`)

LeetCode 543 · [Link](https://leetcode.com/problems/diameter-of-binary-tree/) · *Easy*

## Approach 1: Brute force, for each node, compute left + right heights

At every node, compute the height of its left and right subtrees, and track the max of `(left + right)`.

```python
def diameter_of_binary_tree(root):
    def height(node):
        if not node:
            return 0
        return 1 + max(height(node.left), height(node.right))

    best = 0
    def visit(node):
        nonlocal best
        if not node:
            return
        best = max(best, height(node.left) + height(node.right))
        visit(node.left)
        visit(node.right)

    visit(root)
    return best
```

**Complexity**
- **Time:** O(n²). `height` is called for every node, each call is O(n) worst case.
- **Space:** O(h) recursion.

## Approach 2: Single DFS that returns height and updates diameter (optimal)

Rewrite `height` so that while computing a node's height, it *also* updates a running maximum diameter. Each node is visited once.

```python
def diameter_of_binary_tree(root):
    best = 0

    def height(node):
        nonlocal best
        if not node:
            return 0
        left = height(node.left)
        right = height(node.right)
        best = max(best, left + right)
        return 1 + max(left, right)

    height(root)
    return best
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h) recursion depth.

### Pattern: "side-effect accumulator during a DFS that returns something else"
This is the template for a whole class of tree problems, including 124 Max Path Sum, 1245 Tree Diameter, and many others. The DFS returns a "local contribution to the parent" (here, the height), and the diameter is updated as a side effect based on the *combined* contributions from both children.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| For each node, recompute heights | O(n²) | O(h) |
| **Single DFS with accumulator** | **O(n)** | **O(h)** |

There's no meaningful middle tier here, this is the jump from "obvious recursive statement" to the realization that you can compute height *and* update diameter in one DFS.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/), height + accumulator DFS
