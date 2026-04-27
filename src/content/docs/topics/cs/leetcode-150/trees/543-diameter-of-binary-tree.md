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
        return 1 + max(height(node.left), height(node.right))  # L1: O(n) subtree walk

    best = 0
    def visit(node):
        nonlocal best
        if not node:
            return
        best = max(best, height(node.left) + height(node.right))  # L2: O(n) per node
        visit(node.left)                                           # L3: recurse
        visit(node.right)

    visit(root)
    return best
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the tree, h = tree height.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L2 (`height` calls)** | **O(n)** | **n nodes** | **O(n²)** ← dominates |
| L3 (recurse visit) | O(1) dispatch | n | O(n) |

`height` is called for every node via `visit`, and each call walks the full subtree. Redundant work accumulates quadratically.

**Complexity**
- **Time:** O(n²). `height` is called for every node, each call is O(n) worst case, driven by L2.
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
        left = height(node.left)              # L1: recurse left
        right = height(node.right)            # L2: recurse right
        best = max(best, left + right)        # L3: O(1) update diameter
        return 1 + max(left, right)           # L4: O(1) return height to parent

    height(root)
    return best
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the tree, h = tree height.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1/L2 (recurse) | O(1) dispatch | n | O(n) |
| L3 (update diameter) | O(1) | n | O(n) |
| **L4 (return height)** | **O(1)** | **n** | **O(n)** ← dominates (all lines tie) |

Each node is visited exactly once. The side-effect at L3 accumulates the global answer without requiring a second pass.

**Complexity**
- **Time:** O(n), driven by L1/L2 visiting every node once.
- **Space:** O(h) recursion depth.

### Pattern: "side-effect accumulator during a DFS that returns something else"
This is the template for a whole class of tree problems, including 124 Max Path Sum, 1245 Tree Diameter, and many others. The DFS returns a "local contribution to the parent" (here, the height), and the diameter is updated as a side effect based on the *combined* contributions from both children.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| For each node, recompute heights | O(n²) | O(h) |
| **Single DFS with accumulator** | **O(n)** | **O(h)** |

There's no meaningful middle tier here, this is the jump from "obvious recursive statement" to the realization that you can compute height *and* update diameter in one DFS.

## Test cases

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(vals):
    if not vals: return None
    root = TreeNode(vals[0])
    q = [root]
    i = 1
    while q and i < len(vals):
        node = q.pop(0)
        if i < len(vals) and vals[i] is not None:
            node.left = TreeNode(vals[i])
            q.append(node.left)
        i += 1
        if i < len(vals) and vals[i] is not None:
            node.right = TreeNode(vals[i])
            q.append(node.right)
        i += 1
    return root

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

def _run_tests():
    assert diameter_of_binary_tree(build_tree([1, 2, 3, 4, 5])) == 3
    assert diameter_of_binary_tree(build_tree([1, 2])) == 1
    assert diameter_of_binary_tree(build_tree([1])) == 0
    # skewed tree: diameter = n-1 edges
    t = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4))))
    assert diameter_of_binary_tree(t) == 3
    # diameter through node 2 (both children): [1,2,null,3,4]
    t2 = build_tree([1, 2, None, 3, 4])
    assert diameter_of_binary_tree(t2) == 2  # path 3->2->4, both at depth 1 from 2
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/), height + accumulator DFS
