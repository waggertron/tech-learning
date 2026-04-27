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
    if is_same_tree(root, subRoot):          # L1: O(n) check at each node
        return True
    return is_subtree(root.left, subRoot) or is_subtree(root.right, subRoot)  # L2: recurse
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the tree, m = number of nodes in subRoot, h = height of root.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (`is_same_tree`)** | **O(m)** | **n nodes** | **O(m · n)** ← dominates |
| L2 (recurse children) | O(1) dispatch | n | O(n) |

At each of the n nodes in `root`, we do a full O(m) equality check of `subRoot`.

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
        return f",{node.val},({serialize(node.left)})({serialize(node.right)})"  # L1: O(n) build
    return serialize(subRoot) in serialize(root)  # L2: O((m+n)²) or O(m+n) with KMP
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the tree, m = number of nodes in subRoot, h = height of root.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (serialize) | O(n) total for root, O(m) for sub | 2 calls | O(n + m) |
| **L2 (substring search)** | **O(n · m) naive** | **1** | **O(n · m)** ← dominates |

Python's `in` for strings is naive O(n · m) in the worst case. With KMP or Z-function, L2 drops to O(n + m).

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
        return hash((node.val, h(node.left), h(node.right)))  # L1: O(1) per node

    target = h(subRoot)                                        # L2: O(m) hash subRoot

    found = False
    def dfs(node):
        nonlocal found
        if not node or found:
            return 0
        sig = hash((node.val, dfs(node.left), dfs(node.right)))  # L3: O(1) per node
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

**Where the time goes, line by line**

*Variables: n = number of nodes in the tree, m = number of nodes in subRoot, h = height of root.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (hash subRoot) | O(m) | 1 | O(m) |
| **L3 (hash root)** | **O(1) per node** | **n** | **O(n)** ← dominates |
| confirmation `_same` | O(m) | O(1) expected | O(m) amortized |

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

## Test cases

```python
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

def is_same_tree(p, q):
    if not p and not q: return True
    if not p or not q or p.val != q.val: return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)

def is_subtree(root, subRoot):
    if not root: return False
    if is_same_tree(root, subRoot): return True
    return is_subtree(root.left, subRoot) or is_subtree(root.right, subRoot)

def _run_tests():
    assert is_subtree(build_tree([3, 4, 5, 1, 2]), build_tree([4, 1, 2])) == True
    assert is_subtree(build_tree([3, 4, 5, 1, 2, None, None, None, None, 0]), build_tree([4, 1, 2])) == False
    # subRoot is the whole tree
    t = build_tree([1, 2, 3])
    assert is_subtree(t, t) == True
    # single node subroot
    assert is_subtree(build_tree([1, 2, 3]), build_tree([2])) == True
    assert is_subtree(build_tree([1, 2, 3]), build_tree([4])) == False
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Binary Trees & BSTs](../../../data-structures/binary-trees/), paired structural check with prefix/substring intuition
