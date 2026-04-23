---
title: "141. Linked List Cycle"
description: Determine whether a linked list contains a cycle.
parent: linked-list
tags: [leetcode, neetcode-150, linked-lists, two-pointers, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `head`, the head of a linked list, determine if the list has a cycle. A cycle exists if any node can be reached again by continuously following `next`.

**Example**
- `head = [3,2,0,-4]` with tail connected to index 1 → `true`
- `head = [1,2]` with tail connected to index 0 → `true`
- `head = [1]` with no cycle → `false`

LeetCode 141 · [Link](https://leetcode.com/problems/linked-list-cycle/) · *Easy*

## Approach 1: Brute force — hash set of visited nodes

Walk the list, storing each node in a hash set. If you encounter a node you've seen, there's a cycle.

```python
def has_cycle(head) -> bool:
    seen = set()
    cur = head
    while cur:
        if cur in seen:
            return True
        seen.add(cur)
        cur = cur.next
    return False
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

Simple and correct but uses linear extra memory.

## Approach 2: Mark-and-sweep (destructive variant)

Mutate each visited node to a sentinel value, detect on revisit. Trashes the list — not acceptable if the caller still needs it. Included only to contrast with the optimal.

## Approach 3: Floyd's tortoise and hare (optimal)

Two pointers: `slow` moves one step, `fast` moves two. If there's a cycle, they'll meet inside it; if there's no cycle, `fast` reaches the end.

```python
def has_cycle(head) -> bool:
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
```

**Complexity**
- **Time:** O(n). In a cycle of length k, the pointers meet within k steps of entering it.
- **Space:** O(1).

### Why it works
Once both pointers are inside the cycle, the gap between them decreases by 1 each step (slow advances 1, fast advances 2, relative to slow that's a +1). Eventually the gap is 0 — they meet. If there's no cycle, fast falls off the end.

### Follow-up (problem 142)
If you need the cycle *start* — not just existence — reset `slow` to head after the meet, then advance both by one step until they meet again. They meet at the cycle start. (Proof is a bit of modular arithmetic; trust the procedure.)

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Hash set of visited | O(n) | O(n) |
| **Floyd's tortoise and hare** | **O(n)** | **O(1)** |

The two-pointer technique here extends to 142 (Linked List Cycle II) and 287 (Find the Duplicate Number).

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/) — two-pointer cycle detection; Floyd's algorithm
