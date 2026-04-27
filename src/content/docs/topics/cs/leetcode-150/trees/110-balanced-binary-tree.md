---
title: "110. Balanced Binary Tree (Easy)"
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
        return 1 + max(height(node.left), height(node.right))  # L1: O(n) subtree walk

    if not root:
        return True
    if abs(height(root.left) - height(root.right)) > 1:  # L2: O(n) height checks
        return False
    return is_balanced(root.left) and is_balanced(root.right)  # L3: recurse children
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the tree, h = tree height.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (height walk)** | **O(n)** | **n nodes** | **O(n²)** ← dominates |
| L2 (abs check) | O(1) | n | O(n) |
| L3 (recurse children) | O(1) dispatch | n | O(n) |

For each of the n nodes, `height` walks the entire subtree beneath it. In a balanced tree of depth log n, the total work is O(n log n); in a skewed tree, it's O(n²).

**Complexity**
- **Time:** O(n²) worst case (skewed tree), driven by L1 re-walking subtrees.
- **Space:** O(h) recursion.

Redundant work: we re-walk every subtree many times.

## Approach 2: Bottom-up DFS with -1 sentinel (optimal)

Return the height of each subtree, or `-1` if it's already unbalanced. A node returns `-1` if either child did.

```python
def is_balanced(root):
    def height(node):
        if not node:
            return 0
        lh = height(node.left)            # L1: recurse left
        if lh == -1:
            return -1                     # L2: propagate failure up
        rh = height(node.right)           # L3: recurse right
        if rh == -1:
            return -1                     # L4: propagate failure up
        if abs(lh - rh) > 1:
            return -1                     # L5: O(1) balance check
        return 1 + max(lh, rh)           # L6: O(1) return height

    return height(root) != -1
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the tree, h = tree height.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1/L3 (recurse) | O(1) dispatch | n | O(n) |
| L2/L4 (sentinel check) | O(1) | n | O(n) |
| L5 (balance check) | O(1) | n | O(n) |
| **L6 (return height)** | **O(1)** | **n** | **O(n)** ← dominates (all lines tie) |

Each node is visited exactly once. The `-1` sentinel short-circuits traversal of subtrees that are already known to be unbalanced.

**Complexity**
- **Time:** O(n). Each node visited once, driven by L1/L3.
- **Space:** O(h) recursion.

### Pattern
This is the "sentinel value" version of the diameter pattern: we want a single value back from the DFS, but we also need to propagate a failure condition. `-1` is a legal "never going to match" sentinel because valid heights are >= 0.

An alternative is to return a tuple `(balanced: bool, height: int)`, same complexity, marginally more code, but perhaps cleaner for larger invariant checks.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Top-down height per node | O(n²) | O(h) |
| **Bottom-up with sentinel** | **O(n)** | **O(h)** |

The bottom-up form is the canonical fix for any "top-down recomputation" tree antipattern.

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

def _run_tests():
    assert is_balanced(build_tree([3, 9, 20, None, None, 15, 7])) == True
    assert is_balanced(build_tree([1, 2, 2, 3, 3, None, None, 4, 4])) == False
    assert is_balanced(None) == True
    assert is_balanced(build_tree([1])) == True
    # skewed tree of depth 4: not balanced
    t = TreeNode(1, TreeNode(2, TreeNode(3, TreeNode(4))))
    assert is_balanced(t) == False
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/), height DFS with short-circuit sentinel
