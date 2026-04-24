---
title: "206. Reverse Linked List"
description: Reverse a singly linked list.
parent: linked-list
tags: [leetcode, neetcode-150, linked-lists, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the head of a singly linked list, reverse the list and return the new head.

**Example**
- `head = [1,2,3,4,5]` → `[5,4,3,2,1]`
- `head = [1,2]` → `[2,1]`
- `head = []` → `[]`

LeetCode 206 · [Link](https://leetcode.com/problems/reverse-linked-list/) · *Easy*

## Approach 1: Brute force, collect values, rebuild

Walk the list and store values in an array; build a fresh list in reverse.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    values = []
    cur = head
    while cur:
        values.append(cur.val)
        cur = cur.next
    dummy = ListNode()
    tail = dummy
    for v in reversed(values):
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) for the values array + new list.

Correct but wasteful.

## Approach 2: Iterative three-pointer reversal (optimal)

Walk the list once, re-pointing each `next` backward. Needs three pointers: `prev`, `curr`, and a scratch `next` saved before overwriting `curr.next`.

```python
def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

The canonical interview answer. Memorize the three-pointer dance, it underlies many harder linked-list problems (25 Reverse Nodes in k-Group, 92 Reverse Between).

## Approach 3: Recursive reversal

Recursively reverse the tail, then flip the current node's link.

```python
def reverse_list(head):
    if not head or not head.next:
        return head
    new_head = reverse_list(head.next)
    head.next.next = head
    head.next = None
    return new_head
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n) recursion depth.

Elegant but uses stack frames proportional to n, can stack-overflow for very long lists (Python's default recursion limit is 1000).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Collect + rebuild | O(n) | O(n) |
| **Iterative three-pointer** | **O(n)** | **O(1)** |
| Recursive | O(n) | O(n) stack |

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/), pointer reversal; foundational pattern
