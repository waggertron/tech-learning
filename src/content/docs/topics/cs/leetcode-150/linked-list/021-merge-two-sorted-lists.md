---
title: "21. Merge Two Sorted Lists"
description: Merge two sorted linked lists into one sorted linked list.
parent: linked-list
tags: [leetcode, neetcode-150, linked-lists, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the heads of two sorted linked lists `list1` and `list2`, merge them into one sorted list by splicing together their nodes. Return the head of the merged list.

**Example**
- `list1 = [1,2,4]`, `list2 = [1,3,4]` → `[1,1,2,3,4,4]`
- `list1 = []`, `list2 = []` → `[]`
- `list1 = []`, `list2 = [0]` → `[0]`

LeetCode 21 · [Link](https://leetcode.com/problems/merge-two-sorted-lists/) · *Easy*

## Approach 1: Brute force, collect values, sort, rebuild

Walk both lists into one array, sort it, rebuild a fresh list.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(l1, l2):
    values = []
    for head in (l1, l2):
        while head:
            values.append(head.val)
            head = head.next
    values.sort()
    dummy = ListNode()
    tail = dummy
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next
```

**Complexity**
- **Time:** O((n + m) log(n + m)). Sort dominates.
- **Space:** O(n + m).

Wasteful, ignores the sorted structure.

## Approach 2: Iterative in-place splicing (optimal)

Two pointers walk down both lists; at each step, splice the smaller head onto the tail of the merged list. A dummy head simplifies the edge case where the merged list is empty.

```python
def merge_two_lists(l1, l2):
    dummy = ListNode()
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next, l1 = l1, l1.next
        else:
            tail.next, l2 = l2, l2.next
        tail = tail.next
    tail.next = l1 or l2   # attach whichever remains
    return dummy.next
```

**Complexity**
- **Time:** O(n + m). One pass.
- **Space:** O(1). No new nodes allocated.

## Approach 3: Recursive merge

Pick the smaller head, recurse on the rest.

```python
def merge_two_lists(l1, l2):
    if not l1:
        return l2
    if not l2:
        return l1
    if l1.val <= l2.val:
        l1.next = merge_two_lists(l1.next, l2)
        return l1
    l2.next = merge_two_lists(l1, l2.next)
    return l2
```

**Complexity**
- **Time:** O(n + m).
- **Space:** O(n + m) recursion depth.

Elegant; stack-space trade-off.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Collect + sort + rebuild | O((n+m) log(n+m)) | O(n+m) |
| **Iterative splice** | **O(n+m)** | **O(1)** |
| Recursive | O(n+m) | O(n+m) stack |

The iterative splice is the canonical answer and a prerequisite for problem 23 (Merge k Sorted Lists).

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/), pointer splicing with dummy head
