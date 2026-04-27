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

Given the head of a linked list and an integer `k`, reverse the nodes in groups of `k` and return the modified list. If the number of remaining nodes at the tail is less than `k`, leave them as-is. Modify node pointers in place, values must not be changed.

**Example**
- `head = [1,2,3,4,5]`, `k = 2` → `[2,1,4,3,5]`
- `head = [1,2,3,4,5]`, `k = 3` → `[3,2,1,4,5]`
- `head = [1,2,3,4,5,6]`, `k = 3` → `[3,2,1,6,5,4]`

LeetCode 25 · [Link](https://leetcode.com/problems/reverse-nodes-in-k-group/) · *Hard*

## Approach 1: Brute force, collect values, reverse in groups, rebuild

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
        values.append(cur.val)         # L1: O(1) per node, n total
        cur = cur.next
    n = len(values)
    i = 0
    while i + k <= n:
        values[i:i + k] = reversed(values[i:i + k])  # L2: O(k) per group
        i += k
    dummy = ListNode()
    tail = dummy
    for v in values:
        tail.next = ListNode(v)        # L3: O(1) per node
        tail = tail.next
    return dummy.next
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the list, k = group size parameter.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (collect) | O(1) | n | O(n) |
| **L2 (reverse slice)** | **O(k)** | **n/k groups** | **O(n)** ← dominates |
| L3 (rebuild) | O(1) | n | O(n) |

Each node is reversed once (L2) and rebuilt once (L3), so each phase is O(n). The total is O(n) but with linear extra space.

**Complexity**
- **Time:** O(n), driven by L1/L2/L3 all being O(n).
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
        for _ in range(k):                   # L1: advance k steps to find group end
            kth = kth.next
            if not kth:
                return dummy.next
        group_next = kth.next

        # 2. Reverse this group of k nodes
        prev, curr = group_next, group_prev.next
        while curr is not group_next:        # L2: reverse k links
            nxt = curr.next
            curr.next = prev                 # L3: O(1) pointer reversal
            prev = curr
            curr = nxt

        # 3. Reattach: the old first node is now the tail of the reversed group
        tmp = group_prev.next
        group_prev.next = kth               # L4: O(1) stitch to prior chunk
        group_prev = tmp
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the list, k = group size parameter.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (find k-th node) | O(1) | k per group, n/k groups = n total | O(n) |
| **L2-L3 (reverse k links)** | **O(1)** | **k per group, n/k groups = n total** | **O(n)** ← dominates |
| L4 (stitch) | O(1) | n/k groups | O(n/k) |

Each node is touched twice: once during the "find k-th" scan (L1) and once during reversal (L3). The overall cost is O(2n) = O(n).

**Complexity**
- **Time:** O(n). Each node is visited a constant number of times (L1 + L3).
- **Space:** O(1).

### Walkthrough
- `group_prev` anchors the node just before the current k-group.
- `kth` advances k steps; if it falls off the end, we're done (leave remainder as-is).
- Reverse the group in place using the three-pointer reversal from problem 206, stopping when we hit `group_next`.
- `tmp = group_prev.next` was the old first node, now the tail, becomes the next iteration's `group_prev`.

## Approach 3: Recursive reversal per group

Reverse the first k nodes if possible, then recurse on the remainder.

```python
def reverse_k_group(head, k):
    # Check there are at least k nodes
    count = 0
    cur = head
    while cur and count < k:              # L1: count up to k nodes
        cur = cur.next
        count += 1
    if count < k:
        return head

    # Reverse k nodes starting from head
    prev, curr = None, head
    for _ in range(k):                    # L2: reverse k pointers
        nxt = curr.next
        curr.next = prev                  # L3: O(1) reversal
        prev = curr
        curr = nxt
    # head is now the tail of the reversed group; curr is the (k+1)-th node
    head.next = reverse_k_group(curr, k) # L4: recurse on remainder
    return prev
```

**Where the time goes, line by line**

*Variables: n = number of nodes in the list, k = group size parameter.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (count check) | O(1) | k per group | O(n) total |
| **L2-L3 (reverse k)** | **O(1)** | **k per group, n/k groups** | **O(n)** ← dominates |
| L4 (recurse) | O(1) per frame | n/k frames | O(n/k) stack depth |

The recursion depth is n/k (one frame per group), not n. If k = 1 (no reversal needed) depth is n; if k = n (one big reversal) depth is 1.

**Complexity**
- **Time:** O(n), driven by L1 + L2-L3 each visiting every node once.
- **Space:** O(n / k) recursion depth.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_025.py and run.
# Uses the iterative in-place approach (Approach 2).

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

def reverse_k_group(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy
    while True:
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next
        group_next = kth.next
        prev, curr = group_next, group_prev.next
        while curr is not group_next:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        tmp = group_prev.next
        group_prev.next = kth
        group_prev = tmp

def _run_tests():
    # k=2: [1,2,3,4,5] -> [2,1,4,3,5]
    assert to_list(reverse_k_group(from_list([1,2,3,4,5]), 2)) == [2,1,4,3,5]
    # k=3: [1,2,3,4,5] -> [3,2,1,4,5]
    assert to_list(reverse_k_group(from_list([1,2,3,4,5]), 3)) == [3,2,1,4,5]
    # k=3 with even multiple: [1,2,3,4,5,6] -> [3,2,1,6,5,4]
    assert to_list(reverse_k_group(from_list([1,2,3,4,5,6]), 3)) == [3,2,1,6,5,4]
    # k=1: no change
    assert to_list(reverse_k_group(from_list([1,2,3]), 1)) == [1,2,3]
    # k equals length: full reversal
    assert to_list(reverse_k_group(from_list([1,2,3]), 3)) == [3,2,1]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Summary

| Approach | Time | Space | In-place? |
| --- | --- | --- | --- |
| Array + rebuild | O(n) | O(n) | No |
| **Iterative with group_prev** | **O(n)** | **O(1)** | Yes |
| Recursive | O(n) | O(n/k) stack | Yes |

The iterative in-place version is the canonical answer, it composes three-pointer reversal (problem 206) with careful group-boundary bookkeeping.

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/), segmented in-place reversal with sentinel head
