---
title: "102. Binary Tree Level Order Traversal (Medium)"
description: Return the values of a binary tree in level-order, one list per level.
parent: trees
tags: [leetcode, neetcode-150, trees, bfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the root of a binary tree, return the level-order traversal of its nodes' values, a list of lists, where the i-th list contains the values at depth `i`.

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
    q = deque([root])              # L1: O(1) init
    while q:
        level = []
        for _ in range(len(q)):    # L2: iterate over current level only
            node = q.popleft()     # L3: O(1) dequeue
            level.append(node.val) # L4: O(1) record value
            if node.left:
                q.append(node.left)   # L5: O(1) enqueue left
            if node.right:
                q.append(node.right)  # L6: O(1) enqueue right
        result.append(level)       # L7: O(1) amortized
    return result
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the tree, h = tree height, w = max tree width.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (level loop) | O(1) overhead | n total iterations | O(n) |
| L3 (dequeue) | O(1) | n | O(n) |
| L4 (append val) | O(1) | n | O(n) |
| **L5/L6 (enqueue children)** | **O(1)** | **n** | **O(n)** ← dominates (all lines tie) |
| L7 (append level) | O(1) amortized | h levels | O(h) |

Every node is enqueued and dequeued exactly once. The `len(q)` snapshot at the start of each outer loop iteration is what allows us to separate levels without storing depth tags.

**Complexity**
- **Time:** O(n), driven by L3/L4/L5/L6 processing each node once.
- **Space:** O(w) for the queue (w = max width).

## Approach 2: DFS with depth-indexed lists

Walk preorder, tracking depth; append to the list at that depth. First visit at depth `d` creates the level list.

```python
def level_order(root):
    result = []
    def dfs(node, depth):
        if not node:
            return
        if depth == len(result):       # L1: first visit at this depth
            result.append([])
        result[depth].append(node.val) # L2: O(1) append
        dfs(node.left, depth + 1)      # L3: recurse left
        dfs(node.right, depth + 1)     # L4: recurse right
    dfs(root, 0)
    return result
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the tree, h = tree height, w = max tree width.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (depth check) | O(1) | n | O(n) |
| **L2 (append val)** | **O(1)** | **n** | **O(n)** ← dominates (all lines tie) |
| L3/L4 (recurse) | O(1) dispatch | n | O(n) |

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
    q = deque([(root, 0)])          # L1: O(1) init with depth tag
    while q:
        node, d = q.popleft()       # L2: O(1) dequeue
        levels[d].append(node.val)  # L3: O(1) append to depth bucket
        if node.left:
            q.append((node.left, d + 1))   # L4: O(1) enqueue
        if node.right:
            q.append((node.right, d + 1))  # L5: O(1) enqueue
    return [levels[d] for d in range(len(levels))]  # L6: O(n) reconstruct
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the tree, h = tree height, w = max tree width.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (dequeue) | O(1) | n | O(n) |
| **L3 (append)** | **O(1)** | **n** | **O(n)** ← dominates (all lines tie) |
| L4/L5 (enqueue) | O(1) | n | O(n) |
| L6 (reconstruct) | O(n) | 1 | O(n) |

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

Approach 1 is the textbook BFS template, memorize it. Same structure is reused in problems 199 (Right Side View), 515 (Largest per Row), 103 (Zigzag Level Order), and many others.

## Test cases

```python
from collections import deque

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

def _run_tests():
    assert level_order(build_tree([3, 9, 20, None, None, 15, 7])) == [[3], [9, 20], [15, 7]]
    assert level_order(build_tree([1])) == [[1]]
    assert level_order(None) == []
    # skewed tree
    t = TreeNode(1, TreeNode(2, TreeNode(3)))
    assert level_order(t) == [[1], [2], [3]]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/), hierarchy
- [Queues](../../../data-structures/queues/), BFS engine with per-level batching
