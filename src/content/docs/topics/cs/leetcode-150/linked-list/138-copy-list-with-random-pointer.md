---
title: "138. Copy List with Random Pointer"
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

## Approach 1: Brute force — index-based two-pass

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
        originals.append(cur)
        copies.append(Node(cur.val))
        cur = cur.next
    idx = {node: i for i, node in enumerate(originals)}
    for i, node in enumerate(originals):
        if i + 1 < len(copies):
            copies[i].next = copies[i + 1]
        if node.random is not None:
            copies[i].random = copies[idx[node.random]]
    return copies[0]
```

**Complexity**
- **Time:** O(n).
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
        old_to_new[cur] = Node(cur.val)
        cur = cur.next
    cur = head
    while cur:
        old_to_new[cur].next = old_to_new.get(cur.next)
        old_to_new[cur].random = old_to_new.get(cur.random)
        cur = cur.next
    return old_to_new[head]
```

**Complexity**
- **Time:** O(n).
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
        copy = Node(cur.val, cur.next)
        cur.next = copy
        cur = copy.next

    # 2. Set random pointers on the copies
    cur = head
    while cur:
        if cur.random:
            cur.next.random = cur.random.next
        cur = cur.next.next

    # 3. Split the two interwoven lists apart
    dummy = Node(0)
    copy_tail = dummy
    cur = head
    while cur:
        copy = cur.next
        cur.next = copy.next
        copy_tail.next = copy
        copy_tail = copy
        cur = cur.next
    return dummy.next
```

**Complexity**
- **Time:** O(n). Three linear passes.
- **Space:** O(1) extra (excluding output).

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Index map | O(n) | O(n) | Straightforward but extra bookkeeping |
| **Hash map old → new** | **O(n)** | **O(n)** | Cleanest to write |
| Interwoven nodes | O(n) | **O(1)** | Optimal space; trickier to bookkeep |

The hash-map approach is the production-style answer. The interwoven-nodes trick is the canonical "optimize to O(1) extra space" flex.

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/) — two-dimensional pointer graphs
- [Hash Tables](../../../data-structures/hash-tables/) — old-to-new mapping
