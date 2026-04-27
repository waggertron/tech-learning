---
title: "21. Merge Two Sorted Lists (Easy)"
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
            values.append(head.val)    # L1: O(1) per node
            head = head.next
    values.sort()                      # L2: O((n+m) log(n+m))
    dummy = ListNode()
    tail = dummy
    for v in values:
        tail.next = ListNode(v)        # L3: O(1) per value
        tail = tail.next
    return dummy.next
```

**Where the time goes, line by line**

*Variables: n = number of nodes in l1, m = number of nodes in l2.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (collect) | O(1) | n + m | O(n + m) |
| **L2 (sort)** | **O((n+m) log(n+m))** | **1** | **O((n+m) log(n+m))** ← dominates |
| L3 (rebuild) | O(1) | n + m | O(n + m) |

Sorting throws away the fact that both lists are already sorted. The next two approaches exploit that structure.

**Complexity**
- **Time:** O((n + m) log(n + m)). Sort dominates (L2).
- **Space:** O(n + m).

Wasteful, ignores the sorted structure.

## Approach 2: Iterative in-place splicing (optimal)

Two pointers walk down both lists; at each step, splice the smaller head onto the tail of the merged list. A dummy head simplifies the edge case where the merged list is empty.

```python
def merge_two_lists(l1, l2):
    dummy = ListNode()
    tail = dummy
    while l1 and l2:                        # L1: loop while both non-empty
        if l1.val <= l2.val:
            tail.next, l1 = l1, l1.next    # L2: splice l1 node, advance l1
        else:
            tail.next, l2 = l2, l2.next    # L3: splice l2 node, advance l2
        tail = tail.next                    # L4: advance tail
    tail.next = l1 or l2                   # L5: O(1) attach remainder
    return dummy.next
```

**Where the time goes, line by line**

*Variables: n = number of nodes in l1, m = number of nodes in l2.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (loop test) | O(1) | min(n, m) + 1 | O(min(n, m)) |
| **L2 or L3 (splice)** | **O(1)** | **min(n, m)** | **O(min(n, m))** |
| L4 (advance tail) | O(1) | min(n, m) | O(min(n, m)) |
| L5 (attach remainder) | O(1) | 1 | O(1) |

The loop exits as soon as either list is exhausted (after min(n, m) steps), then L5 attaches the remainder in one pointer assignment. Total: O(n + m) because L5 conceptually covers the remaining max(n, m) - min(n, m) nodes without iterating over them.

**Complexity**
- **Time:** O(n + m). One pass (L1-L4) plus O(1) tail attachment (L5).
- **Space:** O(1). No new nodes allocated.

## Approach 3: Recursive merge

Pick the smaller head, recurse on the rest.

```python
def merge_two_lists(l1, l2):
    if not l1:                                    # L1: base case
        return l2
    if not l2:                                    # L2: base case
        return l1
    if l1.val <= l2.val:
        l1.next = merge_two_lists(l1.next, l2)   # L3: recurse with l1 advanced
        return l1
    l2.next = merge_two_lists(l1, l2.next)       # L4: recurse with l2 advanced
    return l2
```

**Where the time goes, line by line**

*Variables: n = number of nodes in l1, m = number of nodes in l2.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1, L2 (base cases) | O(1) | up to 2 | O(1) |
| **L3 or L4 (recurse)** | **O(1) per frame** | **n + m** | **O(n + m)** ← dominates (stack depth) |

Each call consumes exactly one node (either l1 or l2 advances), so the depth equals n + m. Python's default stack limit (1000) can trigger on long lists.

**Complexity**
- **Time:** O(n + m).
- **Space:** O(n + m) recursion depth.

Elegant; stack-space trade-off.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_021.py and run.
# Uses the iterative splice approach (Approach 2).

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

def merge_two_lists(l1, l2):
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

def _run_tests():
    # Example: [1,2,4] + [1,3,4] -> [1,1,2,3,4,4]
    assert to_list(merge_two_lists(from_list([1,2,4]), from_list([1,3,4]))) == [1,1,2,3,4,4]
    # Both empty
    assert to_list(merge_two_lists(None, None)) == []
    # One empty
    assert to_list(merge_two_lists(None, from_list([0]))) == [0]
    assert to_list(merge_two_lists(from_list([1,3,5]), None)) == [1,3,5]
    # Different lengths
    assert to_list(merge_two_lists(from_list([1,2,3]), from_list([4,5,6,7]))) == [1,2,3,4,5,6,7]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Collect + sort + rebuild | O((n+m) log(n+m)) | O(n+m) |
| **Iterative splice** | **O(n+m)** | **O(1)** |
| Recursive | O(n+m) | O(n+m) stack |

The iterative splice is the canonical answer and a prerequisite for problem 23 (Merge k Sorted Lists).

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/), pointer splicing with dummy head
