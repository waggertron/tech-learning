---
title: "102. Binary Tree Level Order Traversal"
description: Return the values of a binary tree in level-order — one list per level.
parent: trees
tags: [leetcode, neetcode-150, trees, bfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the root of a binary tree, return the level-order traversal of its nodes' values — a list of lists, where the i-th list contains the values at depth `i`.

**Example**
- `root = [3,9,20,null,null,15,7]` → `[[3],[9,20],[15,7]]`
- `root = [1]` → `[[1]]`
- `root = []` → `[]`

LeetCode 102 · [Link](https://leetcode.com/problems/binary-tree-level-order-traversal/) · *Medium*

## Approach 1: BFS with level counts (canonical)

Use a queue; at each iteration, note the current level's size and pop exactly that many nodes, grouping them into one level list.

```python
from collections import deque

def level_order(root):
    if not root:
        return []
    result = []
    q = deque([root])
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            if node.left:
                q.append(node.left)
            if node.right:
                q.append(node.right)
        result.append(level)
    return result
```

**Complexity**
- **Time:** O(n).
- **Space:** O(w).

## Approach 2: DFS with depth-indexed lists

Walk preorder, tracking depth; append to the list at that depth. First visit at depth `d` creates the level list.

```python
def level_order(root):
    result = []
    def dfs(node, depth):
        if not node:
            return
        if depth == len(result):
            result.append([])
        result[depth].append(node.val)
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)
    dfs(root, 0)
    return result
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h) recursion + O(n) output.

Elegant; good when you already have a DFS template you want to reuse.

## Approach 3: BFS with single flat queue and depth tags

Put `(node, depth)` in the queue; use dict-of-lists keyed by depth.

```python
from collections import deque, defaultdict

def level_order(root):
    if not root:
        return []
    levels = defaultdict(list)
    q = deque([(root, 0)])
    while q:
        node, d = q.popleft()
        levels[d].append(node.val)
        if node.left:
            q.append((node.left, d + 1))
        if node.right:
            q.append((node.right, d + 1))
    return [levels[d] for d in range(len(levels))]
```

**Complexity**
- **Time:** O(n).
- **Space:** O(w + n).

Slightly more overhead than Approach 1; useful when you need non-contiguous depth handling.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| **BFS with level counts** | O(n) | O(w) |
| DFS with depth-indexed lists | O(n) | O(h) |
| BFS with `(node, depth)` tags | O(n) | O(w + n) |

Approach 1 is the textbook BFS template — memorize it. Same structure is reused in problems 199 (Right Side View), 515 (Largest per Row), 103 (Zigzag Level Order), and many others.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/) — hierarchy
- [Queues](../../../data-structures/queues/) — BFS engine with per-level batching
