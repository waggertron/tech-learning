---
title: "2. Add Two Numbers (Medium)"
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

## Approach 1: Brute force, convert to int, add, rebuild

Decode both lists to integers, add, rebuild the result list.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def add_two_numbers(l1, l2):
    def decode(head):                      # L1: helper, O(n) total
        num, place = 0, 1
        while head:
            num += head.val * place        # L2: O(1) per digit
            place *= 10
            head = head.next
        return num

    total = decode(l1) + decode(l2)        # L3: O(n + m) combined
    dummy = ListNode()
    tail = dummy
    if total == 0:
        return ListNode(0)
    while total:
        tail.next = ListNode(total % 10)   # L4: O(1) per output digit
        tail = tail.next
        total //= 10
    return dummy.next
```

**Where the time goes, line by line**

*Variables: n = number of nodes in l1, m = number of nodes in l2.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (decode digit) | O(1) | n + m | O(n + m) |
| L3 (sum two ints) | O(d) where d = digits | 1 | O(max(n, m)) |
| **L4 (build output)** | **O(1)** | **max(n, m) + 1** | **O(max(n, m))** ← dominates |

All three phases are O(max(n, m)); the output list length is the bottleneck in practice. In Python, big-int addition on step L3 is O(d) for d-digit numbers, but d = max(n, m), so the overall complexity doesn't change.

**Complexity**
- **Time:** O(max(n, m)), driven by all phases equally (L2/L3/L4).
- **Space:** O(max(n, m)).

Works in Python because ints are arbitrary-precision. In Java/C++/JS, breaks once the number exceeds 64-bit (common in test cases with ~100-digit inputs).

## Approach 2: Iterative digit-by-digit with carry (optimal, language-agnostic)

Walk both lists in parallel, summing corresponding digits plus carry.

```python
def add_two_numbers(l1, l2):
    dummy = ListNode()
    tail = dummy
    carry = 0
    while l1 or l2 or carry:           # L1: loop condition, up to max(n,m)+1 times
        v = carry                       # L2: O(1) reset accumulator
        if l1:
            v += l1.val                 # L3: O(1) consume l1 digit
            l1 = l1.next
        if l2:
            v += l2.val                 # L4: O(1) consume l2 digit
            l2 = l2.next
        carry, digit = divmod(v, 10)   # L5: O(1) split carry and digit
        tail.next = ListNode(digit)    # L6: O(1) append to output
        tail = tail.next
    return dummy.next
```

**Where the time goes, line by line**

*Variables: n = number of nodes in l1, m = number of nodes in l2.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (loop test) | O(1) | max(n, m) + 1 | O(max(n, m)) |
| L2-L4 (read digits) | O(1) | max(n, m) | O(max(n, m)) |
| L5 (divmod) | O(1) | max(n, m) | O(max(n, m)) |
| **L6 (build output node)** | **O(1)** | **max(n, m) + 1** | **O(max(n, m))** ← dominates |

Every line is O(1) per iteration; the loop runs at most max(n, m) + 1 times (the +1 is for a possible final carry propagation). No hidden quadratic: each digit is consumed exactly once and each output node is allocated exactly once.

**Complexity**
- **Time:** O(max(n, m)), driven by L1/L6 (loop iterations and output construction).
- **Space:** O(max(n, m)) for the output.

## Approach 3: Recursive digit-by-digit with carry

Recurse one digit at a time.

```python
def add_two_numbers(l1, l2, carry=0):
    if not l1 and not l2 and not carry:   # L1: base case, O(1)
        return None
    v = carry                              # L2: O(1)
    nxt1 = nxt2 = None
    if l1:
        v += l1.val                        # L3: O(1)
        nxt1 = l1.next
    if l2:
        v += l2.val                        # L4: O(1)
        nxt2 = l2.next
    node = ListNode(v % 10)               # L5: O(1) allocate output node
    node.next = add_two_numbers(nxt1, nxt2, v // 10)  # L6: recurse
    return node
```

**Where the time goes, line by line**

*Variables: n = number of nodes in l1, m = number of nodes in l2.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L4 (base + read) | O(1) | max(n, m) + 1 | O(max(n, m)) |
| L5 (allocate node) | O(1) | max(n, m) + 1 | O(max(n, m)) |
| **L6 (recursive call)** | **O(1) per frame** | **max(n, m) + 1** | **O(max(n, m))** ← dominates (stack depth) |

The recursion depth equals the output length, so both time and stack space are O(max(n, m)). Python's default recursion limit of 1000 can be a real constraint for long inputs.

**Complexity**
- **Time:** O(max(n, m)), driven by L6 recursion depth.
- **Space:** O(max(n, m)) recursion + output.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_002.py and run.
# Uses the iterative carry approach (Approach 2).

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

def _run_tests():
    # Example: 342 + 465 = 807
    assert to_list(add_two_numbers(from_list([2,4,3]), from_list([5,6,4]))) == [7,0,8]
    # Both zero
    assert to_list(add_two_numbers(from_list([0]), from_list([0]))) == [0]
    # Carry propagation: 9999999 + 9999 = 10009998
    assert to_list(add_two_numbers(from_list([9,9,9,9,9,9,9]), from_list([9,9,9,9]))) == [8,9,9,9,0,0,0,1]
    # Single digit, no carry
    assert to_list(add_two_numbers(from_list([1]), from_list([2]))) == [3]
    # Different lengths, carry at end
    assert to_list(add_two_numbers(from_list([5]), from_list([5]))) == [0,1]
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Decode → add → encode | O(max(n, m)) | O(max(n, m)) | Breaks on big ints in most languages |
| **Iterative + carry** | **O(max(n, m))** | **O(max(n, m))** | Canonical, language-agnostic |
| Recursive + carry | O(max(n, m)) | O(max(n, m)) stack | Elegant; stack cost |

The iterative carry loop is the workhorse for digit arithmetic on linked lists, it also solves 445 (Add Two Numbers II, big-endian variant with stacks or reversal).

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/), digit-by-digit traversal with dummy head
