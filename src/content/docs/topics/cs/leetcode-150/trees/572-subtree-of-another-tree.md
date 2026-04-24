---
title: "572. Subtree of Another Tree"
description: Given the roots of two trees, determine whether one is a subtree of the other.
parent: trees
tags: [leetcode, neetcode-150, trees, recursion, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the roots of two binary trees `root` and `subRoot`, return `true` if `subRoot` appears as an identical subtree of `root`.

**Example**
- `root = [3,4,5,1,2]`, `subRoot = [4,1,2]` → `true`
- `root = [3,4,5,1,2,null,null,null,null,0]`, `subRoot = [4,1,2]` → `false`

LeetCode 572 · [Link](https://leetcode.com/problems/subtree-of-another-tree/) · *Easy*

## Approach 1: Brute force, at every node of `root`, check Same Tree

DFS `root`; at each node, run `isSameTree` against `subRoot`.

```python
def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)

def is_subtree(root, subRoot):
    if not root:
        return False
    if is_same_tree(root, subRoot):
        return True
    return is_subtree(root.left, subRoot) or is_subtree(root.right, subRoot)
```

**Complexity**
- **Time:** O(m · n). For each of m nodes in `root`, do an O(n) check.
- **Space:** O(h_root + h_sub) recursion.

The most common interview answer and usually acceptable.

## Approach 2: Serialize both, substring search

Serialize each tree with delimiters so concatenated children can't accidentally match across boundaries. Then check whether `serialize(subRoot)` is a substring of `serialize(root)`.

```python
def is_subtree(root, subRoot):
    def serialize(node):
        if not node:
            return "#"
        return f",{node.val},({serialize(node.left)})({serialize(node.right)})"
    return serialize(subRoot) in serialize(root)
```

**Complexity**
- **Time:** O((m + n)²) worst case using Python's `in` (substring search is typically O(m · n) in the interpreter). With **KMP** or **Z-function**, drops to O(m + n).
- **Space:** O(m + n) for the strings.

### Why the delimiters matter
Without unique delimiters, `serialize(subRoot)` could match a substring of `serialize(root)` that doesn't correspond to an actual subtree, for example, matching a prefix of one node's serialization plus a suffix of another. The delimiter pattern I used (`,val,(L)(R)`) ensures a node's serialization has unambiguous start and end.

## Approach 3: Hash each subtree (Merkle-style)

Assign each subtree a hash using a recurrence: `hash(node) = H(val, hash(left), hash(right))`. Compute the target hash for `subRoot`, then DFS `root` comparing hashes.

```python
def is_subtree(root, subRoot):
    target = None
    def h(node):
        nonlocal target
        if not node:
            return 0
        return hash((node.val, h(node.left), h(node.right)))

    target = h(subRoot)

    found = False
    def dfs(node):
        nonlocal found
        if not node or found:
            return 0
        sig = hash((node.val, dfs(node.left), dfs(node.right)))
        if sig == target:
            # confirm with same-tree check (collisions possible)
            if _same(node, subRoot):
                found = True
        return sig

    def _same(a, b):
        if not a and not b:
            return True
        if not a or not b or a.val != b.val:
            return False
        return _same(a.left, b.left) and _same(a.right, b.right)

    dfs(root)
    return found
```

**Complexity**
- **Time:** O(m + n) amortized (assuming no hash collisions); O(m · n) worst case with collision confirmation.
- **Space:** O(h_root).

Included because the hash-each-subtree pattern appears in problem 652 (Find Duplicate Subtrees) and generalizes to Merkle trees outside LeetCode.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| **Nested DFS + isSameTree** | O(m · n) | O(h) |
| Serialize + substring | O(m + n) with KMP; O(mn) naive | O(m + n) |
| Subtree hashing | O(m + n) expected | O(h) |

Approach 1 is what most interviewers expect; Approach 2 with KMP is the asymptotically-optimal answer; Approach 3 is the deepest but most bug-prone.

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/), paired structural check with prefix/substring intuition
