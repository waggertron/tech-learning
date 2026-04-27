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

## Approach 1: Brute force, two passes (count, then remove)

First pass: count length `L`. Second pass: advance `L - n` steps, then splice.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    L = 0
    cur = head
    while cur:                            # L1: first pass, count length
        L += 1                            # L2: O(1) per step
        cur = cur.next
    cur = dummy
    for _ in range(L - n):               # L3: second pass, advance L-n steps
        cur = cur.next                    # L4: O(1) per step
    cur.next = cur.next.next             # L5: O(1) splice
    return dummy.next
```

**Where the time goes, line by line**

*Variables: L = number of nodes in the list, n = the parameter (position from end).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L2 (count pass) | O(1) | L | O(L) |
| **L3-L4 (advance pass)** | **O(1)** | **L - n** | **O(L)** ← dominates |
| L5 (splice) | O(1) | 1 | O(1) |

Both passes are O(L); together they give O(2L) = O(L). The second pass only goes L - n steps, but in the worst case (n = 1) that's still L - 1 steps.

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
        if not node:                         # L1: base case
            return 0
        k = rec(node.next) + 1              # L2: recurse deeper, O(1) on return
        if k == n + 1:
            node.next = node.next.next       # L3: O(1) splice at right depth
        return k
    rec(dummy)
    return dummy.next
```

**Where the time goes, line by line**

*Variables: L = number of nodes in the list, n = the parameter (position from end).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (base case) | O(1) | 1 | O(1) |
| **L2 (recurse)** | **O(1) per frame** | **L + 1** | **O(L)** ← dominates (stack depth) |
| L3 (splice) | O(1) | 1 | O(1) |

The recursion unwinds L + 1 frames (including the dummy). Each frame does O(1) work; all cost is in the stack depth.

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
    for _ in range(n + 1):              # L1: advance fast n+1 steps
        fast = fast.next                # L2: O(1) per step
    while fast:                         # L3: walk both until fast falls off
        slow = slow.next                # L4: O(1) per step
        fast = fast.next               # L5: O(1) per step
    slow.next = slow.next.next         # L6: O(1) splice
    return dummy.next
```

**Where the time goes, line by line**

*Variables: L = number of nodes in the list, n = the parameter (position from end).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L2 (offset phase) | O(1) | n + 1 | O(n) |
| **L3-L5 (walk phase)** | **O(1)** | **L - n** | **O(L)** ← dominates |
| L6 (splice) | O(1) | 1 | O(1) |

Total steps = (n + 1) + (L - n) = L + 1, so exactly one pass over the list. The dummy node ensures `slow` has a valid `.next` even when removing the head (n == L).

**Complexity**
- **Time:** O(L). One pass.
- **Space:** O(1).

### Why the dummy node matters
When `n == L` (removing the head), the `slow` pointer needs to land "one before the head." A dummy sentinel makes "one before the head" a real node, so the splice logic is uniform regardless of whether we're removing the head.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_019.py and run.
# Uses the two-pointer offset approach (Approach 3).

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

def _run_tests():
    # Example: remove 2nd from end of [1,2,3,4,5] -> [1,2,3,5]
    assert to_list(remove_nth_from_end(from_list([1,2,3,4,5]), 2)) == [1,2,3,5]
    # Single element, remove it
    assert to_list(remove_nth_from_end(from_list([1]), 1)) == []
    # Two elements, remove last
    assert to_list(remove_nth_from_end(from_list([1,2]), 1)) == [1]
    # Two elements, remove first (n == L)
    assert to_list(remove_nth_from_end(from_list([1,2]), 2)) == [2]
    # Remove head of longer list
    assert to_list(remove_nth_from_end(from_list([1,2,3,4,5]), 5)) == [2,3,4,5]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Summary

| Approach | Time | Space | Passes |
| --- | --- | --- | --- |
| Two-pass count + remove | O(L) | O(1) | 2 |
| Recursive | O(L) | O(L) stack | 1 |
| **Two-pointer offset** | **O(L)** | **O(1)** | **1** |

The offset-n two-pointer trick generalizes to "find the k-th from end" and variants.

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/), two-pointer distance pattern with dummy head
