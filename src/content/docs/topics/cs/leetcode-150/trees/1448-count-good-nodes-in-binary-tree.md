---
title: "1448. Count Good Nodes in Binary Tree"
description: Count nodes on every root-to-node path that are ≥ every value above them.
parent: trees
tags: [leetcode, neetcode-150, trees, dfs, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a binary tree, a node `X` in the tree is called **good** if, along the path from root to `X`, there are no nodes with a value greater than `X`. Return the number of good nodes.

**Example**
- `root = [3,1,4,3,null,1,5]` → `4` (roots 3, 4, 5, and the left subtree's 3)
- `root = [3,3,null,4,2]` → `3`
- `root = [1]` → `1`

LeetCode 1448 · [Link](https://leetcode.com/problems/count-good-nodes-in-binary-tree/) · *Medium*

## Approach 1: Brute force, for each node, walk up to the root

For every node, walk its ancestor chain to verify the invariant.

```python
def good_nodes(root):
    # Build parent pointers with BFS/DFS, then check each node.
    from collections import deque
    parent = {root: None}
    q = deque([root])
    while q:
        n = q.popleft()
        for child in (n.left, n.right):
            if child:
                parent[child] = n
                q.append(child)
    count = 0
    for node in parent:
        is_good = True
        cur, v = parent[node], node.val
        while cur is not None:
            if cur.val > v:
                is_good = False
                break
            cur = parent[cur]
        if is_good:
            count += 1
    return count
```

**Complexity**
- **Time:** O(n · h). Each of n nodes walks up O(h).
- **Space:** O(n) for the parent map.

Wasteful, we're re-walking ancestor chains that largely overlap.

## Approach 2: DFS carrying running max (optimal)

Walk top-down with the running maximum seen so far on the root-to-current path. A node is good iff `node.val >= running_max`.

```python
def good_nodes(root):
    def dfs(node, max_so_far):
        if not node:
            return 0
        good = 1 if node.val >= max_so_far else 0
        new_max = max(max_so_far, node.val)
        return good + dfs(node.left, new_max) + dfs(node.right, new_max)
    return dfs(root, float('-inf'))
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h) recursion.

### Pattern: "path-state DFS"
Carry a running invariant (max, min, sum, seen-set) as a parameter. Works for every "a node is X iff the root-to-node path is Y" problem.

## Approach 3: Iterative DFS with explicit path state

Stack of `(node, max_so_far)` pairs.

```python
def good_nodes(root):
    if not root:
        return 0
    stack = [(root, float('-inf'))]
    count = 0
    while stack:
        node, mx = stack.pop()
        if node.val >= mx:
            count += 1
        new_max = max(mx, node.val)
        if node.left:
            stack.append((node.left, new_max))
        if node.right:
            stack.append((node.right, new_max))
    return count
```

**Complexity**
- **Time:** O(n).
- **Space:** O(h).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Ancestor walks | O(n · h) | O(n) |
| **DFS with running max** | **O(n)** | **O(h)** |
| Iterative DFS with state | O(n) | O(h) |

The recursive path-state DFS is the canonical answer and the template for many "longest increasing path" / "valid-along-path" tree problems.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/), path-state DFS pattern
