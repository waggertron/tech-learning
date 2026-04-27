---
title: Trees
description: 15 problems covering binary trees and BSTs, traversals, recursion over subtrees, tree DP, BST invariants, and serialization.
parent: leetcode-150
tags: [leetcode, neetcode-150, trees, bst]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

The largest NeetCode category for a reason: trees reward recursive thinking, and most tree problems reduce to "define a function on a node, recurse into the subtrees, combine the results." Master the following patterns and most of the set falls out:

- **Four traversals**, preorder, inorder, postorder, level-order (BFS).
- **Subtree recursion**, compute something for `root` from results on `root.left` and `root.right`.
- **Tree DP**, when each node's answer needs multiple pieces of info from its children, return a tuple.
- **BST invariants**, in-order gives sorted order; bounds propagate down during validation.
- **Serialization**, DFS (usually preorder with null markers) or BFS encodes the shape.

## Problems

1. [226. Invert Binary Tree (Easy)](./226-invert-binary-tree/)
2. [104. Maximum Depth of Binary Tree (Easy)](./104-maximum-depth-of-binary-tree/)
3. [543. Diameter of Binary Tree (Easy)](./543-diameter-of-binary-tree/)
4. [110. Balanced Binary Tree (Easy)](./110-balanced-binary-tree/)
5. [100. Same Tree (Easy)](./100-same-tree/)
6. [572. Subtree of Another Tree (Easy)](./572-subtree-of-another-tree/)
7. [235. Lowest Common Ancestor of a BST (Medium)](./235-lowest-common-ancestor-of-a-bst/)
8. [102. Binary Tree Level Order Traversal (Medium)](./102-binary-tree-level-order-traversal/)
9. [199. Binary Tree Right Side View (Medium)](./199-binary-tree-right-side-view/)
10. [1448. Count Good Nodes in Binary Tree (Medium)](./1448-count-good-nodes-in-binary-tree/)
11. [98. Validate Binary Search Tree (Medium)](./098-validate-binary-search-tree/)
12. [230. Kth Smallest Element in a BST (Medium)](./230-kth-smallest-element-in-a-bst/)
13. [105. Construct Binary Tree from Preorder and Inorder Traversal (Medium)](./105-construct-binary-tree-from-preorder-and-inorder-traversal/)
14. [124. Binary Tree Maximum Path Sum (Hard)](./124-binary-tree-maximum-path-sum/)
15. [297. Serialize and Deserialize Binary Tree (Hard)](./297-serialize-and-deserialize-binary-tree/)

## Key patterns unlocked here

- **Recursive mirror operation**, Invert Binary Tree.
- **Height DFS**, Max Depth, Diameter (height + side-effect accumulator), Balanced.
- **Simultaneous structural comparison**, Same Tree, Subtree of Another.
- **BST-specific shortcuts**, LCA of BST, Validate BST, Kth Smallest.
- **BFS template**, Level Order, Right Side View (last of each level).
- **Path-DP DFS**, Count Good Nodes, Max Path Sum.
- **Traversal-pair reconstruction**, Build Tree from Preorder+Inorder.
- **DFS with null markers**, Serialize and Deserialize.

## BFS level-separation techniques

Level-order BFS puts nodes into a queue. The queue gives you nodes in the right order, but it doesn't tell you where one level ends and the next begins. Three tricks solve this. All are O(n) time and O(n) space; the differences are code clarity and constant-factor overhead.

### Technique 1: level_size snapshot (preferred)

Before processing a level, snapshot the queue length. That count is exactly how many nodes belong to the current level, because all of this level's nodes are already in the queue before any of their children get enqueued.

```python
from collections import deque

def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)      # snapshot: children added after this don't count
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result
```

The `level_size` snapshot is the key detail. You add children *inside* the loop, but the loop runs exactly `level_size` times, so those children belong to the next iteration of the outer `while`. No sentinel, no second queue, no off-by-one to track.

Problems that use this directly: **102 (Level Order Traversal)**, **199 (Right Side View)** (take the last node of each level), **637 (Average of Levels)**.

### Technique 2: sentinel (None marker)

Insert a `None` into the queue after the last node of each level. When you dequeue a `None`, the level just ended. If the queue is non-empty, push another `None` to mark the end of the next level.

```python
def level_order_sentinel(root):
    if not root:
        return []
    result = []
    queue = deque([root, None])   # None marks end of level 0
    level = []
    while queue:
        node = queue.popleft()
        if node is None:
            result.append(level)
            level = []
            if queue:             # don't push a sentinel onto an empty queue
                queue.append(None)
        else:
            level.append(node.val)
            if node.left:  queue.append(node.left)
            if node.right: queue.append(node.right)
    return result
```

The sentinel approach works but requires the `if queue` guard to avoid an infinite loop (sentinel dequeued, queue empty, sentinel enqueued, repeat). It's also harder to scan at a glance because the level boundary is implicit in the `None` check rather than a counted loop. Useful to know for interviews where the interviewer asks "how else could you do it?"

### Technique 3: two queues

Keep two separate queues: `current` for the level being processed, `next_level` for the children being collected. Drain `current` completely, then swap.

```python
def level_order_two_queues(root):
    if not root:
        return []
    result = []
    current = deque([root])
    while current:
        level = []
        next_level = deque()
        while current:
            node = current.popleft()
            level.append(node.val)
            if node.left:  next_level.append(node.left)
            if node.right: next_level.append(node.right)
        result.append(level)
        current = next_level
    return result
```

The two-queue version makes the level boundary structural: one queue per level, swapped when empty. It allocates a new `deque` each level, which adds minor overhead but makes the intent unambiguous. Older textbooks use this form; most modern solutions prefer the snapshot.

### When to reach for each

| Situation | Reach for |
| --- | --- |
| General level-order work | `level_size` snapshot |
| Interviewer asks for alternatives | Sentinel or two-queue |
| Teaching the concept from scratch | Two-queue (most explicit) |

The snapshot is the default. Two or three lines shorter than the others, no sentinel bookkeeping, and the level boundary falls out of the loop bound naturally.
