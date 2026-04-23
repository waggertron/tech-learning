---
title: "230. Kth Smallest Element in a BST"
description: Return the kth smallest value in a Binary Search Tree.
parent: trees
tags: [leetcode, neetcode-150, trees, bst, dfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the root of a BST and an integer `k`, return the `k`-th smallest value in the tree (1-indexed).

**Example**
- `root = [3,1,4,null,2]`, `k = 1` → `1`
- `root = [5,3,6,2,4,null,null,1]`, `k = 3` → `3`

Follow-up: if the BST is frequently modified and you need many kth-smallest queries, how would you optimize?

LeetCode 230 · [Link](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) · *Medium*

## Approach 1: Full inorder traversal into a list

Collect all values in sorted order via inorder, then index.

```python
def kth_smallest(root, k):
    def inorder(node):
        return inorder(node.left) + [node.val] + inorder(node.right) if node else []
    return inorder(root)[k - 1]
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) for the list.

Works but doesn't exploit "early termination" once we've hit k.

## Approach 2: Recursive inorder with a counter (early exit)

Same inorder, but track a running count and short-circuit.

```python
def kth_smallest(root, k):
    count = [0]
    result = [None]
    def inorder(node):
        if not node or result[0] is not None:
            return
        inorder(node.left)
        count[0] += 1
        if count[0] == k:
            result[0] = node.val
            return
        inorder(node.right)
    inorder(root)
    return result[0]
```

**Complexity**
- **Time:** O(h + k). Early exit after k visits.
- **Space:** O(h) recursion.

## Approach 3: Iterative inorder with an explicit stack (optimal)

Simulate inorder with a stack; pop exactly k times.

```python
def kth_smallest(root, k):
    stack = []
    node = root
    while node or stack:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        k -= 1
        if k == 0:
            return node.val
        node = node.right
    return -1
```

**Complexity**
- **Time:** O(h + k).
- **Space:** O(h).

### Follow-up (mutable tree)
If the tree changes frequently, augment each node with `left_subtree_count`. Then kth-smallest becomes O(h) without traversal — compare `k` against `left.count + 1` at each node to decide which direction to go. That's how many interview databases and self-balancing BST libraries implement O(log n) order statistics.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Full inorder list | O(n) | O(n) |
| Recursive inorder + counter | O(h + k) | O(h) |
| **Iterative inorder + stack** | **O(h + k)** | **O(h)** |

The iterative inorder is the canonical answer. It's also the natural structure for related problems (next-in-inorder, inorder successor).

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/) — inorder traversal yields sorted order
- [Stacks](../../../data-structures/stacks/) — iterative inorder
