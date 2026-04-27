---
title: "138. Copy List with Random Pointer (Medium)"
description: Deep copy a linked list where each node also has a random pointer to any node in the list (or null).
parent: linked-list
tags: [leetcode, neetcode-150, linked-lists, hash-tables, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

A linked list of length `n` is given where each node contains an extra random pointer that could point to any node in the list, or to `null`. Construct a **deep copy** of the list and return its head. The deep copy must consist of entirely new nodes with the same value; the `next` and `random` of the new nodes must point to new nodes (never to original nodes).

LeetCode 138 · [Link](https://leetcode.com/problems/copy-list-with-random-pointer/) · *Medium*

## Approach 1: Brute force, index-based two-pass

First pass: walk the list, store nodes in an array, create a parallel array of new nodes.
Second pass: for each original node, find its random's index, set the new node's random to the corresponding new node.

```python
class Node:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

def copy_random_list(head):
    if not head:
        return None
    originals = []
    copies = []
    cur = head
    while cur:
        originals.append(cur)          # L1: collect originals, O(1) each
        copies.append(Node(cur.val))   # L2: create copies, O(1) each
        cur = cur.next
    idx = {node: i for i, node in enumerate(originals)}  # L3: O(n) index map
    for i, node in enumerate(originals):
        if i + 1 < len(copies):
            copies[i].next = copies[i + 1]      # L4: wire next, O(1)
        if node.random is not None:
            copies[i].random = copies[idx[node.random]]  # L5: wire random, O(1)
    return copies[0]
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the list.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L2 (collect + copy) | O(1) | n | O(n) |
| L3 (build index map) | O(n) | 1 | O(n) |
| **L4-L5 (wire pointers)** | **O(1)** | **n** | **O(n)** ← all phases equal |

All phases are O(n); the bottleneck is the constant factor from three separate passes. L3 builds the index map in O(n); L5 uses it in O(1) per node.

**Complexity**
- **Time:** O(n), driven by all three phases equally.
- **Space:** O(n).

## Approach 2: Hash map old → new

Two passes with a dict mapping each original node to its copy. First pass creates copies; second pass wires `next` and `random`.

```python
def copy_random_list(head):
    if not head:
        return None
    old_to_new = {}
    cur = head
    while cur:
        old_to_new[cur] = Node(cur.val)    # L1: O(1) create + store copy
        cur = cur.next
    cur = head
    while cur:
        old_to_new[cur].next = old_to_new.get(cur.next)    # L2: O(1) wire next
        old_to_new[cur].random = old_to_new.get(cur.random) # L3: O(1) wire random
        cur = cur.next
    return old_to_new[head]
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the list.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (create copies) | O(1) | n | O(n) |
| **L2-L3 (wire pointers)** | **O(1) each** | **n each** | **O(n)** ← all phases equal |

Two clean passes, each O(n). No index arithmetic needed: `old_to_new.get(cur.random)` returns `None` when `cur.random is None`, handling the null case automatically.

**Complexity**
- **Time:** O(n), driven by L1 and L2/L3 equally.
- **Space:** O(n) for the dict.

Cleaner than Approach 1; same asymptotics. This is usually the interview-acceptable answer.

## Approach 3: Interwoven nodes (optimal, O(1) extra space)

Three passes, no hash map:

1. Insert each copy right after its original: `A → A' → B → B' → C → C'`.
2. Set each `A'.random = A.random.next` (the copy of `A.random`).
3. Unzip: separate the interwoven lists, restore originals' `next`.

```python
def copy_random_list(head):
    if not head:
        return None

    # 1. Interleave copies
    cur = head
    while cur:
        copy = Node(cur.val, cur.next)    # L1: O(1) create interleaved copy
        cur.next = copy
        cur = copy.next

    # 2. Set random pointers on the copies
    cur = head
    while cur:
        if cur.random:
            cur.next.random = cur.random.next  # L2: O(1) set copy's random
        cur = cur.next.next

    # 3. Split the two interwoven lists apart
    dummy = Node(0)
    copy_tail = dummy
    cur = head
    while cur:
        copy = cur.next
        cur.next = copy.next               # L3: O(1) restore original next
        copy_tail.next = copy              # L4: O(1) link copy list
        copy_tail = copy
        cur = cur.next
    return dummy.next
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the list.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (interleave) | O(1) | n | O(n) |
| **L2 (set random)** | **O(1)** | **n** | **O(n)** ← all three passes equal |
| L3-L4 (unzip) | O(1) | n | O(n) |

Three O(n) passes; no hash map allocated. The key insight at L2: `cur.random.next` is precisely the copy of `cur.random` because every original node is immediately followed by its copy in the interleaved list.

**Complexity**
- **Time:** O(n). Three linear passes (L1, L2, L3/L4).
- **Space:** O(1) extra (excluding output).

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_138.py and run.
# Uses the hash-map approach (Approach 2).

class Node:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

def copy_random_list(head):
    if not head:
        return None
    old_to_new = {}
    cur = head
    while cur:
        old_to_new[cur] = Node(cur.val)
        cur = cur.next
    cur = head
    while cur:
        old_to_new[cur].next = old_to_new.get(cur.next)
        old_to_new[cur].random = old_to_new.get(cur.random)
        cur = cur.next
    return old_to_new[head]

def _run_tests():
    # Empty list
    assert copy_random_list(None) is None

    # Single node, random points to itself
    n1 = Node(1)
    n1.random = n1
    copy = copy_random_list(n1)
    assert copy is not n1
    assert copy.val == 1
    assert copy.random is copy  # copy's random points to itself (not original)

    # Two nodes: [[7,None],[13,0]] where 13's random points to node at index 0
    a = Node(7)
    b = Node(13)
    a.next = b
    b.random = a   # index 0
    copy = copy_random_list(a)
    assert copy is not a
    assert copy.val == 7
    assert copy.next.val == 13
    assert copy.next.random is copy  # copy's node 13 random -> copy's node 7

    # Three nodes, random=None for some
    x = Node(1)
    y = Node(2)
    z = Node(3)
    x.next = y; y.next = z
    x.random = z; y.random = None; z.random = x
    copy = copy_random_list(x)
    assert copy.val == 1
    assert copy.random.val == 3
    assert copy.next.random is None
    assert copy.next.next.random is copy
    # Verify deep copy (no shared nodes)
    orig_nodes = set()
    cur = x
    while cur:
        orig_nodes.add(id(cur))
        cur = cur.next
    cur = copy
    while cur:
        assert id(cur) not in orig_nodes
        cur = cur.next

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Index map | O(n) | O(n) | Straightforward but extra bookkeeping |
| **Hash map old → new** | **O(n)** | **O(n)** | Cleanest to write |
| Interwoven nodes | O(n) | **O(1)** | Optimal space; trickier to bookkeep |

The hash-map approach is the production-style answer. The interwoven-nodes trick is the canonical "optimize to O(1) extra space" flex.

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/), two-dimensional pointer graphs
- [Hash Tables](../../../data-structures/hash-tables/), old-to-new mapping
