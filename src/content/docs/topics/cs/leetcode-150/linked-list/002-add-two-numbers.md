---
title: "2. Add Two Numbers"
description: Add two numbers represented by linked lists in reverse order.
parent: linked-list
tags: [leetcode, neetcode-150, linked-lists, math, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

You are given two non-empty linked lists representing two non-negative integers. The digits are stored in **reverse order**, with each node containing a single digit. Add the two numbers and return the sum as a linked list.

**Example**
- `l1 = [2,4,3]` (342), `l2 = [5,6,4]` (465) → `[7,0,8]` (807)
- `l1 = [0]`, `l2 = [0]` → `[0]`
- `l1 = [9,9,9,9,9,9,9]`, `l2 = [9,9,9,9]` → `[8,9,9,9,0,0,0,1]`

LeetCode 2 · [Link](https://leetcode.com/problems/add-two-numbers/) · *Medium*

## Approach 1: Brute force — convert to int, add, rebuild

Decode both lists to integers, add, rebuild the result list.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def add_two_numbers(l1, l2):
    def decode(head):
        num, place = 0, 1
        while head:
            num += head.val * place
            place *= 10
            head = head.next
        return num

    total = decode(l1) + decode(l2)
    dummy = ListNode()
    tail = dummy
    if total == 0:
        return ListNode(0)
    while total:
        tail.next = ListNode(total % 10)
        tail = tail.next
        total //= 10
    return dummy.next
```

**Complexity**
- **Time:** O(max(n, m)).
- **Space:** O(max(n, m)).

Works in Python because ints are arbitrary-precision. In Java/C++/JS, breaks once the number exceeds 64-bit (common in test cases with ~100-digit inputs).

## Approach 2: Iterative digit-by-digit with carry (optimal, language-agnostic)

Walk both lists in parallel, summing corresponding digits plus carry.

```python
def add_two_numbers(l1, l2):
    dummy = ListNode()
    tail = dummy
    carry = 0
    while l1 or l2 or carry:
        v = carry
        if l1:
            v += l1.val
            l1 = l1.next
        if l2:
            v += l2.val
            l2 = l2.next
        carry, digit = divmod(v, 10)
        tail.next = ListNode(digit)
        tail = tail.next
    return dummy.next
```

**Complexity**
- **Time:** O(max(n, m)).
- **Space:** O(max(n, m)) for the output.

## Approach 3: Recursive digit-by-digit with carry

Recurse one digit at a time.

```python
def add_two_numbers(l1, l2, carry=0):
    if not l1 and not l2 and not carry:
        return None
    v = carry
    nxt1 = nxt2 = None
    if l1:
        v += l1.val
        nxt1 = l1.next
    if l2:
        v += l2.val
        nxt2 = l2.next
    node = ListNode(v % 10)
    node.next = add_two_numbers(nxt1, nxt2, v // 10)
    return node
```

**Complexity**
- **Time:** O(max(n, m)).
- **Space:** O(max(n, m)) recursion + output.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Decode → add → encode | O(max(n, m)) | O(max(n, m)) | Breaks on big ints in most languages |
| **Iterative + carry** | **O(max(n, m))** | **O(max(n, m))** | Canonical, language-agnostic |
| Recursive + carry | O(max(n, m)) | O(max(n, m)) stack | Elegant; stack cost |

The iterative carry loop is the workhorse for digit arithmetic on linked lists — it also solves 445 (Add Two Numbers II, big-endian variant with stacks or reversal).

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/) — digit-by-digit traversal with dummy head
