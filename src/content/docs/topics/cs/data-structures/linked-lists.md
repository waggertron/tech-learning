---
title: Linked Lists
description: Sequences of nodes connected by pointers, O(1) insert/delete at known positions, O(n) access by index. Interview staple for pointer-manipulation exercises.
parent: data-structures
tags: [data-structures, linked-lists, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

A linked list is a sequence of **nodes** where each node holds data plus a pointer to the next node (singly linked) or pointers to both the next and previous nodes (doubly linked). Elements are not contiguous in memory, so there's no constant-time index access. What you get in exchange: constant-time insert and delete at a known position, no shifting required.

Linked lists are less common in modern application code (dynamic arrays dominate) but remain heavily featured in interviews as pointer-manipulation exercises, and they're a critical building block for composite structures like LRU caches.

## In-depth description

A **singly linked list** has a `head` pointer and each node has a `next` field. Traversal is forward-only. Insert/delete at the head is O(1); at an arbitrary index given the previous node pointer is O(1); at a given index (without a cached pointer) is O(n) because you have to walk to it. A tail pointer makes append O(1).

A **doubly linked list** has `prev` and `next` on each node. The extra pointer enables O(1) removal given any node reference, critical for LRU caches where you get a node from a hash map and need to splice it out. Cost: 1 extra pointer per node.

Core interview techniques:

- **Reversal**, iterative (three-pointer: prev, curr, next) and recursive; a fundamental building block.
- **Floyd's cycle detection** (tortoise and hare), two pointers at different speeds detect cycles in O(n) with O(1) space; also finds cycle start and array-as-linked-list duplicates.
- **Two-pointer (slow/fast)**, find the middle in one pass, find the n-th from end, etc.
- **Dummy head nodes**, prepend a sentinel to simplify edge cases around the head.
- **Merge**, classic two-pointer merge of sorted lists; basis of merge sort on lists.

## Time complexity

| Operation | Singly (best case) | Doubly |
| --- | --- | --- |
| Access by index | O(n) | O(n) |
| Search | O(n) | O(n) |
| Insert/delete at head | O(1) | O(1) |
| Insert/delete at tail (with tail pointer) | O(1) | O(1) |
| Insert/delete given node | O(1) w/ prev | O(1) |
| Space | O(n) | O(n) |

## Common uses in DSA

1. **Pointer manipulation / reversal**, Reverse Linked List, Reverse Nodes in k-Group, Swap Nodes in Pairs, Reorder List.
2. **Cycle detection and related**, Linked List Cycle (has cycle?), Linked List Cycle II (find cycle start), Find the Duplicate Number (array-as-list).
3. **Merging and sorting**, Merge Two Sorted Lists, Merge k Sorted Lists (heap + list), Sort List (merge sort on list).
4. **Two-pointer distance problems**, Remove Nth Node From End, Middle of the Linked List, Intersection of Two Linked Lists.
5. **LRU cache**, Doubly linked list + hash map for O(1) get/put; canonical interview composite problem.

**Canonical LeetCode problems:** #19 Remove Nth Node From End, #21 Merge Two Sorted Lists, #138 Copy List with Random Pointer, #141 Linked List Cycle, #142 Linked List Cycle II, #143 Reorder List, #146 LRU Cache, #206 Reverse Linked List, #287 Find the Duplicate Number.

## Python example

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Build a linked list from an iterable
def build(values):
    dummy = ListNode()
    tail = dummy
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next

# Reverse (iterative), O(n), O(1) space
def reverse(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# Floyd's cycle detection, O(n), O(1) space
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

# Find middle node (slow/fast pointers)
def middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow

# Merge two sorted lists in place
def merge(l1, l2):
    dummy = ListNode()
    tail = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next, l1 = l1, l1.next
        else:
            tail.next, l2 = l2, l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next

# Remove the Nth node from the end (two-pointer)
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

## LeetCode problems

Linked lists appear in 13 NeetCode 150 problems across 3 categories.

**Linked List:**
- [2. Add Two Numbers](../../leetcode-150/linked-list/002-add-two-numbers/)
- [19. Remove Nth Node From End of List](../../leetcode-150/linked-list/019-remove-nth-node-from-end-of-list/), offset two-pointer
- [21. Merge Two Sorted Lists](../../leetcode-150/linked-list/021-merge-two-sorted-lists/)
- [23. Merge k Sorted Lists](../../leetcode-150/linked-list/023-merge-k-sorted-lists/), min-heap of heads
- [25. Reverse Nodes in k-Group](../../leetcode-150/linked-list/025-reverse-nodes-in-k-group/)
- [138. Copy List with Random Pointer](../../leetcode-150/linked-list/138-copy-list-with-random-pointer/)
- [141. Linked List Cycle](../../leetcode-150/linked-list/141-linked-list-cycle/), Floyd's tortoise and hare
- [143. Reorder List](../../leetcode-150/linked-list/143-reorder-list/), mid + reverse + weave
- [146. LRU Cache](../../leetcode-150/linked-list/146-lru-cache/), doubly linked list + hash map
- [206. Reverse Linked List](../../leetcode-150/linked-list/206-reverse-linked-list/)
- [287. Find the Duplicate Number](../../leetcode-150/linked-list/287-find-the-duplicate-number/), array-as-linked-list

**Heap / Priority Queue:**
- [355. Design Twitter](../../leetcode-150/heap-priority-queue/355-design-twitter/), could use linked lists for per-user feed

**Math & Geometry:**
- [202. Happy Number](../../leetcode-150/math-and-geometry/202-happy-number/), Floyd's on a numeric sequence

## References

- [Linked list, Wikipedia](https://en.wikipedia.org/wiki/Linked_list)
- [Floyd's cycle-finding algorithm](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_tortoise_and_hare)
- [LRU Cache, LeetCode](https://leetcode.com/problems/lru-cache/)
- [Linked list problems, NeetCode](https://neetcode.io/roadmap)
