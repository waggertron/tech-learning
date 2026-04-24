---
title: "23. Merge k Sorted Lists"
description: Merge k sorted linked lists into one sorted list.
parent: linked-list
tags: [leetcode, neetcode-150, linked-lists, heaps, divide-and-conquer, hard]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given an array of `k` linked lists, each sorted in ascending order. Merge them into one sorted linked list and return its head.

**Example**
- `lists = [[1,4,5],[1,3,4],[2,6]]` → `[1,1,2,3,4,4,5,6]`
- `lists = []` → `[]`
- `lists = [[]]` → `[]`

Let `N` = total number of nodes across all `k` lists.

LeetCode 23 · [Link](https://leetcode.com/problems/merge-k-sorted-lists/) · *Hard*

## Approach 1: Brute force, dump values, sort, rebuild

Walk every list, collect values, sort, rebuild.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists):
    values = []
    for head in lists:
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
- **Time:** O(N log N).
- **Space:** O(N).

Ignores sortedness.

## Approach 2: Sequential pairwise merge

Merge list 0 with list 1, then the result with list 2, etc.

```python
def merge_two(l1, l2):
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

def merge_k_lists(lists):
    result = None
    for head in lists:
        result = merge_two(result, head)
    return result
```

**Complexity**
- **Time:** O(k · N). The i-th merge touches roughly `i · (N / k)` nodes; summed over i = 1..k gives O(k · N).
- **Space:** O(1).

Simple but slow for large k.

## Approach 3a: Divide-and-conquer pairwise merge (optimal)

Merge lists in pairs like merge sort, O(log k) levels, O(N) work each.

```python
def merge_k_lists(lists):
    if not lists:
        return None
    while len(lists) > 1:
        merged = []
        for i in range(0, len(lists), 2):
            a = lists[i]
            b = lists[i + 1] if i + 1 < len(lists) else None
            merged.append(merge_two(a, b))
        lists = merged
    return lists[0]
```

**Complexity**
- **Time:** **O(N log k)**.
- **Space:** O(log k) if implemented recursively; O(k) for the merged array in this iterative form.

## Approach 3b: Min-heap of heads (optimal)

Put the head of each list in a min-heap keyed by value. Repeatedly pop the smallest and push its `next`.

```python
import heapq

def merge_k_lists(lists):
    heap = []
    for i, head in enumerate(lists):
        if head:
            # index `i` breaks ties in Python (ListNodes aren't comparable)
            heapq.heappush(heap, (head.val, i, head))
    dummy = ListNode()
    tail = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node
        tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next
```

**Complexity**
- **Time:** **O(N log k)**. Each of N pops/pushes on a heap of size ≤ k.
- **Space:** O(k) for the heap.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Dump + sort + rebuild | O(N log N) | O(N) |
| Sequential pairwise | O(k · N) | O(1) |
| **Divide-and-conquer** | **O(N log k)** | **O(k)** aux |
| **Min-heap of heads** | **O(N log k)** | **O(k)** |

Both optimal approaches are O(N log k). Use the heap when lists may be very long and you want to avoid deep recursion; use divide-and-conquer when you want pure pointer splicing with no auxiliary structures beyond the recursion stack.

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/), pointer splicing
- [Heaps / Priority Queues](../../../data-structures/heaps/), min-heap of list heads (k-way merge pattern)
