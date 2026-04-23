---
title: "19. Remove Nth Node From End of List"
description: Remove the nth node from the end of a linked list in one pass.
parent: linked-list
tags: [leetcode, neetcode-150, linked-lists, two-pointers, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the head of a linked list, remove the `n`-th node from the end and return the new head. Follow-up: do it in one pass.

**Example**
- `head = [1,2,3,4,5]`, `n = 2` → `[1,2,3,5]`
- `head = [1]`, `n = 1` → `[]`
- `head = [1,2]`, `n = 1` → `[1]`

LeetCode 19 · [Link](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) · *Medium*

## Approach 1: Brute force — two passes (count, then remove)

First pass: count length `L`. Second pass: advance `L - n - 1` steps, then splice.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    L = 0
    cur = head
    while cur:
        L += 1
        cur = cur.next
    cur = dummy
    for _ in range(L - n):
        cur = cur.next
    cur.next = cur.next.next
    return dummy.next
```

**Complexity**
- **Time:** O(L). Two passes, each O(L).
- **Space:** O(1).

Works. Not one-pass.

## Approach 2: Recursive removal counting from the end

Recurse to the end, then decrement a counter on the way back up; at `n == 0`, splice the previous node.

```python
def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    def rec(node):
        if not node:
            return 0
        k = rec(node.next) + 1
        if k == n + 1:
            node.next = node.next.next
        return k
    rec(dummy)
    return dummy.next
```

**Complexity**
- **Time:** O(L).
- **Space:** O(L) recursion depth.

Elegant but uses stack proportional to list length.

## Approach 3: Two-pointer offset (optimal one-pass)

Advance `fast` by `n + 1` steps, then walk both pointers together. When `fast` falls off, `slow` sits one before the node to remove.

```python
def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    slow = fast = dummy
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        slow = slow.next
        fast = fast.next
    slow.next = slow.next.next
    return dummy.next
```

**Complexity**
- **Time:** O(L). One pass.
- **Space:** O(1).

### Why the dummy node matters
When `n == L` (removing the head), the `slow` pointer needs to land "one before the head." A dummy sentinel makes "one before the head" a real node, so the splice logic is uniform regardless of whether we're removing the head.

## Summary

| Approach | Time | Space | Passes |
| --- | --- | --- | --- |
| Two-pass count + remove | O(L) | O(1) | 2 |
| Recursive | O(L) | O(L) stack | 1 |
| **Two-pointer offset** | **O(L)** | **O(1)** | **1** |

The offset-n two-pointer trick generalizes to "find the k-th from end" and variants.

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/) — two-pointer distance pattern with dummy head
