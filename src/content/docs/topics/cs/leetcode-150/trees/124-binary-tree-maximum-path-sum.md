---
title: "124. Binary Tree Maximum Path Sum"
description: Return the maximum path sum in a binary tree. A path is any sequence of adjacent nodes, not necessarily through the root.
parent: trees
tags: [leetcode, neetcode-150, trees, dfs, tree-dp, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge, and a node can appear at most once. The path does **not** need to pass through the root.

Given the root of a binary tree, return the maximum path sum of any non-empty path. Node values may be negative.

**Example**
- `root = [1,2,3]` → `6` (`2 → 1 → 3`)
- `root = [-10,9,20,null,null,15,7]` → `42` (`15 → 20 → 7`)

LeetCode 124 · [Link](https://leetcode.com/problems/binary-tree-maximum-path-sum/) · *Hard*

## Approach 1: Brute force, DFS from every node

For every node, treat it as the "top" of a path and compute the best path going down either side. Track the max across all nodes.

```python
def max_path_sum(root):
    def max_gain(node):
        # best straight-down path starting here
        if not node:
            return 0
        left = max(0, max_gain(node.left))
        right = max(0, max_gain(node.right))
        return node.val + max(left, right)

    best = float('-inf')

    def visit(node):
        nonlocal best
        if not node:
            return
        left = max(0, max_gain(node.left))
        right = max(0, max_gain(node.right))
        best = max(best, node.val + left + right)
        visit(node.left)
        visit(node.right)

    visit(root)
    return best
```

**Complexity**
- **Time:** O(n²). `max_gain` called at every node, each call O(n).
- **Space:** O(h) recursion.

## Approach 2: Single DFS with side-effect accumulator (optimal)

At each node, compute the max "straight-down gain" the node can contribute to its parent, at most one of its children, since a path is simple. While doing so, also consider the path that *passes through* the current node (using both children) and update a running best.

```python
def max_path_sum(root):
    best = float('-inf')

    def max_gain(node):
        nonlocal best
        if not node:
            return 0
        left = max(0, max_gain(node.left))
        right = max(0, max_gain(node.right))
        # best path passing through this node (uses both children)
        best = max(best, node.val + left + right)
        # return straight-down gain (one child at most) to the parent
        return node.val + max(left, right)

    max_gain(root)
    return best
```

**Complexity**
- **Time:** O(n). Each node visited once.
- **Space:** O(h) recursion.

### The three moving parts
1. **Return value**, `node.val + max(left, right)`, the best path *including this node that can continue up to the parent*. Can only use one child.
2. **Side-effect update**, `node.val + left + right`, the best path *peaking at this node*. Uses both children.
3. **`max(0, ...)`**, negative subtree contributions are ignored; we pretend that branch isn't there.

This is the same pattern as problem 543 (Diameter of Binary Tree), refined for weighted paths.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| DFS from every node | O(n²) | O(h) |
| **Single DFS with accumulator** | **O(n)** | **O(h)** |

This pattern, DFS returns a "local gain to parent," side-effect tracks "global best through this node", is one of the most important templates in tree DP. It also solves problem 543 and 687.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/), tree DP with side-effect accumulator
