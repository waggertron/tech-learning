---
title: "23. Merge k Sorted Lists (Hard)"
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
            values.append(head.val)    # L1: O(1) per node, N total
            head = head.next
    values.sort()                      # L2: O(N log N)
    dummy = ListNode()
    tail = dummy
    for v in values:
        tail.next = ListNode(v)        # L3: O(1) per node
        tail = tail.next
    return dummy.next
```

**Where the time goes, line by line**

*Variables: k = number of input lists, N = total nodes across all lists.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (collect) | O(1) | N | O(N) |
| **L2 (sort)** | **O(N log N)** | **1** | **O(N log N)** ← dominates |
| L3 (rebuild) | O(1) | N | O(N) |

Collecting and rebuilding are both O(N); the sort at L2 is the only superlinear step.

**Complexity**
- **Time:** O(N log N), driven by L2.
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
    for head in lists:                     # L1: k iterations
        result = merge_two(result, head)   # L2: each merge is O(current size)
    return result
```

**Where the time goes, line by line**

*Variables: k = number of input lists, N = total nodes across all lists.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (iterate k lists) | O(1) overhead | k | O(k) |
| **L2 (merge_two)** | **O(i · N/k) for i-th merge** | **k** | **O(k · N)** ← dominates |

The i-th call to `merge_two` merges a result of size `(i-1) · N/k` with a list of size `N/k`, costing O(i · N/k). Summing i from 1 to k gives O(N/k · k(k+1)/2) = O(k · N). Early merges are cheap; the final merge is the most expensive.

**Complexity**
- **Time:** O(k · N), driven by L2 accumulating work across iterations.
- **Space:** O(1).

Simple but slow for large k.

## Approach 3a: Divide-and-conquer pairwise merge (optimal)

Merge lists in pairs like merge sort, O(log k) levels, O(N) work each.

```python
def merge_k_lists(lists):
    if not lists:
        return None
    while len(lists) > 1:           # L1: log k rounds
        merged = []
        for i in range(0, len(lists), 2):   # L2: pair up adjacent lists
            a = lists[i]
            b = lists[i + 1] if i + 1 < len(lists) else None
            merged.append(merge_two(a, b))  # L3: merge each pair
        lists = merged
    return lists[0]
```

**Where the time goes, line by line**

*Variables: k = number of input lists, N = total nodes across all lists.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (outer loop) | O(1) overhead | log k rounds | O(log k) |
| L2 (pair iteration) | O(1) overhead | k/2 per round | O(k) total |
| **L3 (merge_two per round)** | **O(N) total per round** | **log k rounds** | **O(N log k)** ← dominates |

At each round, the total work across all pairwise merges is O(N) (every node is touched once). There are log k rounds, giving O(N log k).

**Complexity**
- **Time:** O(N log k), driven by L3 across log k rounds.
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
            heapq.heappush(heap, (head.val, i, head))  # L1: O(log k) per push
    dummy = ListNode()
    tail = dummy
    while heap:                                          # L2: N iterations total
        val, i, node = heapq.heappop(heap)             # L3: O(log k) per pop
        tail.next = node
        tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))  # L4: O(log k)
    return dummy.next
```

**Where the time goes, line by line**

*Variables: k = number of input lists, N = total nodes across all lists.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (seed heap) | O(log k) | k | O(k log k) |
| L2 (loop) | O(1) | N | O(N) |
| **L3 (heappop)** | **O(log k)** | **N** | **O(N log k)** ← dominates |
| L4 (heappush) | O(log k) | up to N | O(N log k) |

The heap never exceeds k entries (one per list). Each of the N nodes triggers one pop and (conditionally) one push, each costing O(log k).

**Complexity**
- **Time:** O(N log k). Each of N pops/pushes on a heap of size at most k (L3/L4).
- **Space:** O(k) for the heap.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_023.py and run.
# Uses the min-heap approach (Approach 3b).
import heapq

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out

def from_list(vals):
    dummy = ListNode()
    cur = dummy
    for v in vals:
        cur.next = ListNode(v)
        cur = cur.next
    return dummy.next

def merge_k_lists(lists):
    heap = []
    for i, head in enumerate(lists):
        if head:
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

def _run_tests():
    # Example: [[1,4,5],[1,3,4],[2,6]] -> [1,1,2,3,4,4,5,6]
    result = merge_k_lists([from_list([1,4,5]), from_list([1,3,4]), from_list([2,6])])
    assert to_list(result) == [1,1,2,3,4,4,5,6]
    # Empty input
    assert merge_k_lists([]) is None
    # Single empty list
    assert to_list(merge_k_lists([None])) == []
    # Single non-empty list
    assert to_list(merge_k_lists([from_list([1,2,3])])) == [1,2,3]
    # Two lists, one empty
    assert to_list(merge_k_lists([from_list([1,2]), None])) == [1,2]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

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
