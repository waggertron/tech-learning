---
title: "100. Same Tree"
description: Determine if two binary trees are structurally identical with the same values.
parent: trees
tags: [leetcode, neetcode-150, trees, recursion, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the roots of two binary trees `p` and `q`, return `true` if they are the same tree. Two binary trees are considered the same if they are structurally identical and the nodes have the same values.

**Example**
- `p = [1,2,3]`, `q = [1,2,3]` → `true`
- `p = [1,2]`, `q = [1,null,2]` → `false`

LeetCode 100 · [Link](https://leetcode.com/problems/same-tree/) · *Easy*

## Approach 1: Recursive DFS (canonical)

Compare roots, then recurse into matching children.

```python
def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q:
        return False
    return (p.val == q.val
            and is_same_tree(p.left, q.left)
            and is_same_tree(p.right, q.right))
```

**Complexity**
- **Time:** O(n). Visits each node once (worst case).
- **Space:** O(h) recursion depth.

## Approach 2: Iterative BFS over paired nodes

Queue of `(p_node, q_node)` pairs; compare, then enqueue corresponding children.

```python
from collections import deque

def is_same_tree(p, q):
    q_pairs = deque([(p, q)])
    while q_pairs:
        a, b = q_pairs.popleft()
        if not a and not b:
            continue
        if not a or not b or a.val != b.val:
            return False
        q_pairs.append((a.left, b.left))
        q_pairs.append((a.right, b.right))
    return True
```

**Complexity**
- **Time:** O(n).
- **Space:** O(w), width of the trees.

## Approach 3: Serialize and compare

Serialize both trees with null markers and compare the strings.

```python
def is_same_tree(p, q):
    def serialize(node):
        if not node:
            return "#"
        return f"{node.val},{serialize(node.left)},{serialize(node.right)}"
    return serialize(p) == serialize(q)
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) for the serialized strings.

Correct but wasteful; included because it shows the structural equality of the problem and serialization.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| **Recursive DFS** | O(n) | O(h) |
| Iterative BFS on pairs | O(n) | O(w) |
| Serialize + compare | O(n) | O(n) |

The recursive one-liner is the canonical answer. The paired-BFS variant is the template for iterative structural comparisons.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/), paired structural recursion
