---
title: "25. Reverse Nodes in k-Group"
description: Reverse the nodes of a linked list k at a time, leaving any remainder of fewer than k nodes as-is.
parent: linked-list
tags: [leetcode, neetcode-150, linked-lists, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given the head of a linked list and an integer `k`, reverse the nodes in groups of `k` and return the modified list. If the number of remaining nodes at the tail is less than `k`, leave them as-is. Modify node pointers in place — values must not be changed.

**Example**
- `head = [1,2,3,4,5]`, `k = 2` → `[2,1,4,3,5]`
- `head = [1,2,3,4,5]`, `k = 3` → `[3,2,1,4,5]`
- `head = [1,2,3,4,5,6]`, `k = 3` → `[3,2,1,6,5,4]`

LeetCode 25 · [Link](https://leetcode.com/problems/reverse-nodes-in-k-group/) · *Hard*

## Approach 1: Brute force — collect values, reverse in groups, rebuild

Decode the list to a value array, reverse groups of `k`, rebuild.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_k_group(head, k):
    values = []
    cur = head
    while cur:
        values.append(cur.val)
        cur = cur.next
    n = len(values)
    i = 0
    while i + k <= n:
        values[i:i + k] = reversed(values[i:i + k])
        i += k
    dummy = ListNode()
    tail = dummy
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

Violates the "modify pointers in place" requirement but clarifies the semantics.

## Approach 2: Iterative in-place reversal with group pointer (optimal)

Walk the list; for each k-group, verify there are k nodes ahead, then reverse exactly k links and stitch to the prior chunk.

```python
def reverse_k_group(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy

    while True:
        # 1. Find the k-th node from group_prev
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next
        group_next = kth.next

        # 2. Reverse this group of k nodes
        prev, curr = group_next, group_prev.next
        while curr is not group_next:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt

        # 3. Reattach: the old first node is now the tail of the reversed group
        tmp = group_prev.next
        group_prev.next = kth
        group_prev = tmp
```

**Complexity**
- **Time:** O(n). Each node is visited a constant number of times.
- **Space:** O(1).

### Walkthrough
- `group_prev` anchors the node just before the current k-group.
- `kth` advances k steps; if it falls off the end, we're done (leave remainder as-is).
- Reverse the group in place using the three-pointer reversal from problem 206, stopping when we hit `group_next`.
- `tmp = group_prev.next` was the old first node, now the tail — becomes the next iteration's `group_prev`.

## Approach 3: Recursive reversal per group

Reverse the first k nodes if possible, then recurse on the remainder.

```python
def reverse_k_group(head, k):
    # Check there are at least k nodes
    count = 0
    cur = head
    while cur and count < k:
        cur = cur.next
        count += 1
    if count < k:
        return head

    # Reverse k nodes starting from head
    prev, curr = None, head
    for _ in range(k):
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    # head is now the tail of the reversed group; curr is the (k+1)-th node
    head.next = reverse_k_group(curr, k)
    return prev
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n / k) recursion depth.

## Summary

| Approach | Time | Space | In-place? |
| --- | --- | --- | --- |
| Array + rebuild | O(n) | O(n) | No |
| **Iterative with group_prev** | **O(n)** | **O(1)** | Yes |
| Recursive | O(n) | O(n/k) stack | Yes |

The iterative in-place version is the canonical answer — it composes three-pointer reversal (problem 206) with careful group-boundary bookkeeping.

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/) — segmented in-place reversal with sentinel head
