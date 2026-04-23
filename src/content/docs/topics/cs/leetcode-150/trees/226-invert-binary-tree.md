---
title: "226. Invert Binary Tree"
description: Invert (mirror) a binary tree by swapping every left and right child.
parent: trees
tags: [leetcode, neetcode-150, trees, recursion, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the root of a binary tree, invert the tree and return its root. Inverting swaps the left and right children at every node.

**Example**
- `root = [4,2,7,1,3,6,9]` → `[4,7,2,9,6,3,1]`

LeetCode 226 · [Link](https://leetcode.com/problems/invert-binary-tree/) · *Easy*

## Approach 1: Recursive DFS (canonical)

Swap children at the current node, then recurse into each subtree.

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h) recursion depth (O(log n) balanced, O(n) skewed).

The one-liner swap is the canonical interview answer.

## Approach 2: Iterative BFS with a queue

Level-order walk, swapping children at each popped node.

```python
from collections import deque

def invert_tree(root):
    if not root:
        return None
    q = deque([root])
    while q:
        node = q.popleft()
        node.left, node.right = node.right, node.left
        if node.left:
            q.append(node.left)
        if node.right:
            q.append(node.right)
    return root
```

**Complexity**
- **Time:** O(n).
- **Space:** O(w) — max width of the tree.

## Approach 3: Iterative DFS with a stack

Same as BFS but with a LIFO stack instead of a FIFO queue.

```python
def invert_tree(root):
    if not root:
        return None
    stack = [root]
    while stack:
        node = stack.pop()
        node.left, node.right = node.right, node.left
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    return root
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| **Recursive DFS** | O(n) | O(h) |
| Iterative BFS | O(n) | O(w) |
| Iterative DFS | O(n) | O(h) |

All three are optimal in time. The recursive one-liner is the canonical answer; the iterative variants are useful when recursion depth is a concern on skewed trees.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/) — subtree recursion mirror
