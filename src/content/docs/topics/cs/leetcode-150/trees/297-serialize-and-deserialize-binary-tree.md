---
title: "297. Serialize and Deserialize Binary Tree"
description: Convert a binary tree to a string and back.
parent: trees
tags: [leetcode, neetcode-150, trees, bfs, dfs, design, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Design an algorithm to serialize a binary tree to a string and deserialize that string back to the original tree. There's no required format, just that serialize/deserialize are inverses.

**Example**
- `root = [1,2,3,null,null,4,5]` → some string, then back to `[1,2,3,null,null,4,5]`

LeetCode 297 · [Link](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) · *Hard*

## Approach 1: BFS with null markers

Serialize level-by-level, using a sentinel (`"#"`) for missing children. Deserialize by consuming the tokens in order and wiring up children with a queue.

```python
from collections import deque

class Codec:
    def serialize(self, root):
        if not root:
            return ""
        parts = []
        q = deque([root])
        while q:
            node = q.popleft()
            if node:
                parts.append(str(node.val))
                q.append(node.left)
                q.append(node.right)
            else:
                parts.append("#")
        return ",".join(parts)

    def deserialize(self, data):
        if not data:
            return None
        tokens = data.split(",")
        root = TreeNode(int(tokens[0]))
        q = deque([root])
        i = 1
        while q and i < len(tokens):
            node = q.popleft()
            if tokens[i] != "#":
                node.left = TreeNode(int(tokens[i]))
                q.append(node.left)
            i += 1
            if i < len(tokens) and tokens[i] != "#":
                node.right = TreeNode(int(tokens[i]))
                q.append(node.right)
            i += 1
        return root
```

**Complexity**
- **Time:** O(n) for both.
- **Space:** O(n) output + O(w) queue.

The LeetCode's own serialization format uses this approach; it's the easiest to debug visually.

## Approach 2: Preorder DFS with null markers (often cleanest)

Recursive serialize in preorder, emitting `"#"` for missing children. Deserialize recursively consuming tokens from an iterator.

```python
class Codec:
    def serialize(self, root):
        parts = []
        def rec(node):
            if not node:
                parts.append("#")
                return
            parts.append(str(node.val))
            rec(node.left)
            rec(node.right)
        rec(root)
        return ",".join(parts)

    def deserialize(self, data):
        tokens = iter(data.split(","))
        def rec():
            val = next(tokens)
            if val == "#":
                return None
            node = TreeNode(int(val))
            node.left = rec()
            node.right = rec()
            return node
        return rec()
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) output + O(h) recursion.

Shortest correct answer and arguably the cleanest.

## Approach 3: Postorder DFS with null markers

Symmetric to preorder but emits children before the parent. Deserialize by consuming tokens right-to-left.

```python
class Codec:
    def serialize(self, root):
        parts = []
        def rec(node):
            if not node:
                parts.append("#")
                return
            rec(node.left)
            rec(node.right)
            parts.append(str(node.val))
        rec(root)
        return ",".join(parts)

    def deserialize(self, data):
        tokens = data.split(",")
        def rec():
            val = tokens.pop()
            if val == "#":
                return None
            node = TreeNode(int(val))
            # NB: right child is deserialized before left because we pop from the end
            node.right = rec()
            node.left = rec()
            return node
        return rec()
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) + O(h).

Less common in practice; included to show the symmetry.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| **BFS with null markers** | O(n) | O(n) + O(w) | Matches LeetCode's own display format |
| **Preorder DFS** | O(n) | O(n) + O(h) | Shortest and cleanest |
| Postorder DFS | O(n) | O(n) + O(h) | Symmetric curiosity |

Preorder DFS is the interview-favorite. BFS is easier to eyeball-debug.

### Aside: size of the serialization
With null markers, every internal node contributes 1 value token and every leaf contributes 1 value + 2 nulls. A tree with `n` nodes has `n + 1` null slots (the external "holes"), giving a total of `2n + 1` tokens, linear in `n`.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/), structural encoding / decoding
- [Queues](../../../data-structures/queues/), BFS-based serialization
- [Stacks](../../../data-structures/stacks/), DFS-based serialization (recursion stack)
