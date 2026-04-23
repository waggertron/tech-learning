---
title: "104. Maximum Depth of Binary Tree"
description: Return the maximum depth of a binary tree.
parent: trees
tags: [leetcode, neetcode-150, trees, recursion, bfs, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the root of a binary tree, return its maximum depth — the number of nodes along the longest path from the root to a leaf.

**Example**
- `root = [3,9,20,null,null,15,7]` → `3`
- `root = [1,null,2]` → `2`

LeetCode 104 · [Link](https://leetcode.com/problems/maximum-depth-of-binary-tree/) · *Easy*

## Approach 1: Recursive DFS (canonical one-liner)

Depth of a node is 1 + max depth of its children.

```python
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h) recursion.

## Approach 2: BFS level count

Count levels with a queue.

```python
from collections import deque

def max_depth(root):
    if not root:
        return 0
    q = deque([root])
    depth = 0
    while q:
        depth += 1
        for _ in range(len(q)):
            node = q.popleft()
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return depth
```

**Complexity**
- **Time:** O(n).
- **Space:** O(w).

Useful when recursion depth is a concern; also the starting point for level-order problems.

## Approach 3: Iterative DFS carrying depth

Stack of `(node, current_depth)` pairs.

```python
def max_depth(root):
    if not root:
        return 0
    stack = [(root, 1)]
    best = 0
    while stack:
        node, d = stack.pop()
        best = max(best, d)
        if node.left:
            stack.append((node.left, d + 1))
        if node.right:
            stack.append((node.right, d + 1))
    return best
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| **Recursive DFS** | O(n) | O(h) |
| BFS level count | O(n) | O(w) |
| Iterative DFS with depth | O(n) | O(h) |

All optimal; the one-line recursion is the canonical answer.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/) — height computation
- [Queues](../../../data-structures/queues/) — BFS level count
