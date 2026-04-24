---
title: "202. Happy Number"
description: A happy number eventually reaches 1 under the "sum of squares of digits" operation.
parent: math-and-geometry
tags: [leetcode, neetcode-150, math, cycle-detection, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

A number `n` is *happy* if repeatedly replacing it with the sum of squares of its digits eventually reaches 1. If the sequence enters a cycle without hitting 1, `n` is not happy.

**Example**
- `n = 19` → `true` (1² + 9² = 82 → 68 → 100 → 1)
- `n = 2` → `false`

LeetCode 202 · [Link](https://leetcode.com/problems/happy-number/) · *Easy*

## Approach 1: Hash set of seen values

Repeatedly apply the operation; if you revisit, it's a cycle (not happy). If you reach 1, it's happy.

```python
def is_happy(n):
    def next_n(x):
        return sum(int(d) ** 2 for d in str(x))

    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = next_n(n)
    return n == 1
```

**Complexity**
- **Time:** O(log n · k) where k is the number of iterations.
- **Space:** O(k).

## Approach 2: Floyd's tortoise and hare (canonical, O(1) space)

Treat the sequence as a linked list. If it cycles (not happy), the two pointers meet.

```python
def is_happy(n):
    def next_n(x):
        total = 0
        while x:
            total += (x % 10) ** 2
            x //= 10
        return total

    slow = fast = n
    while True:
        slow = next_n(slow)
        fast = next_n(next_n(fast))
        if fast == 1:
            return True
        if slow == fast:
            return False
```

**Complexity**
- **Time:** Same as Approach 1.
- **Space:** O(1).

## Approach 3: Mathematical shortcut

Every non-happy cycle contains 4. So if you ever see 4, return false.

```python
def is_happy(n):
    def next_n(x):
        total = 0
        while x:
            total += (x % 10) ** 2
            x //= 10
        return total

    while n != 1 and n != 4:
        n = next_n(n)
    return n == 1
```

**Complexity**
- **Time:** O(log n · k).
- **Space:** O(1).

### Why `4` works
For any number ≤ 9999, the happy iteration either reaches 1 or enters the cycle `4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 → ...`. For larger numbers, one iteration brings them under 9999. Any unhappy number eventually hits 4; happy numbers don't.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Hash set | O(log n · k) | O(k) |
| **Floyd's cycle detection** | **O(log n · k)** | **O(1)** |
| "Check for 4" shortcut | O(log n · k) | O(1) |

Floyd's is the generalizable answer (applies to any deterministic next-state sequence); the "4 trick" is the cutest.

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/), Floyd's on a numeric sequence treated as a linked list
- [Hash Tables](../../../data-structures/hash-tables/), seen-set variant
