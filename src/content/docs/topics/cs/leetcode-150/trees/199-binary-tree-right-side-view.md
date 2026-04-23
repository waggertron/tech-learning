---
title: "199. Binary Tree Right Side View"
description: Return the values visible when standing to the right of a binary tree — one value per level, the rightmost.
parent: trees
tags: [leetcode, neetcode-150, trees, bfs, dfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the root of a binary tree, imagine standing on the right side of it. Return the values of the nodes you can see, ordered from top to bottom — one value per depth, the rightmost at that depth.

**Example**
- `root = [1,2,3,null,5,null,4]` → `[1, 3, 4]`
- `root = [1,null,3]` → `[1, 3]`
- `root = []` → `[]`

LeetCode 199 · [Link](https://leetcode.com/problems/binary-tree-right-side-view/) · *Medium*

## Approach 1: BFS, take the last node of each level

Standard level-order traversal; append the last value processed per level.

```python
from collections import deque

def right_side_view(root):
    if not root:
        return []
    result = []
    q = deque([root])
    while q:
        level_size = len(q)
        for i in range(level_size):
            node = q.popleft()
            if i == level_size - 1:
                result.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
    return result
```

**Complexity**
- **Time:** O(n).
- **Space:** O(w).

## Approach 2: BFS, always take the first right-first

Enqueue right child first, then left; then the first node popped at each level is the rightmost.

```python
from collections import deque

def right_side_view(root):
    if not root:
        return []
    result = []
    q = deque([root])
    while q:
        result.append(q[0].val)   # first dequeued at this level is rightmost
        for _ in range(len(q)):
            node = q.popleft()
            if node.right:
                q.append(node.right)
            if node.left:
                q.append(node.left)
    return result
```

**Complexity**
- **Time:** O(n).
- **Space:** O(w).

Same asymptotic, slightly tighter inner loop. Subtle reversal: we enqueue right before left so the first element of the next level is the rightmost.

## Approach 3: DFS right-first with depth tracking (optimal space)

Preorder-ish DFS that visits the right subtree first. The first node seen at each depth is the rightmost.

```python
def right_side_view(root):
    result = []
    def dfs(node, depth):
        if not node:
            return
        if depth == len(result):
            result.append(node.val)
        dfs(node.right, depth + 1)
        dfs(node.left, depth + 1)
    dfs(root, 0)
    return result
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h) recursion (≤ O(n), often O(log n)).

For balanced trees, `h = log n`, which is smaller than the BFS `w = n/2` at the last level.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| BFS + last per level | O(n) | O(w) |
| BFS right-first | O(n) | O(w) |
| **DFS right-first** | **O(n)** | **O(h)** |

All three are linear time. The DFS variant has smaller space for balanced trees; the BFS variant is arguably cleaner.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/) — depth-indexed value selection
- [Queues](../../../data-structures/queues/) — BFS variants
