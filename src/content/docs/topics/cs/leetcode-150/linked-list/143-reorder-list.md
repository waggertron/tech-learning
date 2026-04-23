---
title: "143. Reorder List"
description: Reorder a linked list L₀ → L₁ → … → Lₙ₋₁ → Lₙ into L₀ → Lₙ → L₁ → Lₙ₋₁ → L₂ → …
parent: linked-list
tags: [leetcode, neetcode-150, linked-lists, two-pointers, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a singly linked list `L: L₀ → L₁ → … → Lₙ₋₁ → Lₙ`, reorder it in place so that it becomes `L₀ → Lₙ → L₁ → Lₙ₋₁ → L₂ → Lₙ₋₂ → …`.

**Example**
- `head = [1,2,3,4]` → `[1,4,2,3]`
- `head = [1,2,3,4,5]` → `[1,5,2,4,3]`

LeetCode 143 · [Link](https://leetcode.com/problems/reorder-list/) · *Medium*

## Approach 1: Brute force — copy to array, re-link by index

Walk the list into an array; use two pointers from both ends to reassemble.

```python
def reorder_list(head) -> None:
    if not head:
        return
    nodes = []
    cur = head
    while cur:
        nodes.append(cur)
        cur = cur.next
    i, j = 0, len(nodes) - 1
    while i < j:
        nodes[i].next = nodes[j]
        i += 1
        if i == j:
            break
        nodes[j].next = nodes[i]
        j -= 1
    nodes[i].next = None
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) for the array.

## Approach 2: Use a deque (slightly cleaner)

Push nodes into a deque; pop alternately from the left and right.

```python
from collections import deque

def reorder_list(head) -> None:
    if not head:
        return
    dq = deque()
    cur = head
    while cur:
        dq.append(cur)
        cur = cur.next
    take_left = True
    tail = None
    while dq:
        node = dq.popleft() if take_left else dq.pop()
        if tail:
            tail.next = node
        tail = node
        take_left = not take_left
    tail.next = None
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) for the deque.

## Approach 3: Find middle + reverse second half + merge (optimal)

Three sub-routines, each O(n) and O(1) space:

1. Find middle with slow/fast pointers.
2. Reverse the second half in place.
3. Weave the two halves.

```python
def reorder_list(head) -> None:
    if not head or not head.next:
        return

    # 1. Find middle (slow ends at middle)
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next

    # 2. Reverse second half
    prev, curr = None, slow.next
    slow.next = None     # cut the list in two
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    second = prev

    # 3. Weave
    first = head
    while second:
        t1 = first.next
        t2 = second.next
        first.next = second
        second.next = t1
        first = t1
        second = t2
```

**Complexity**
- **Time:** O(n). Three linear passes.
- **Space:** O(1).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Array of nodes | O(n) | O(n) |
| Deque | O(n) | O(n) |
| **Find middle + reverse + weave** | **O(n)** | **O(1)** |

The optimal approach composes three fundamental linked-list moves — it's the canonical test that you know the primitives.

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/) — three-primitive composition
