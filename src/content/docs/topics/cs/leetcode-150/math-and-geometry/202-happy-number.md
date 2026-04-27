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
        return sum(int(d) ** 2 for d in str(x))    # L1: O(log x) digits

    seen = set()
    while n != 1 and n not in seen:                 # L2: loop k iterations
        seen.add(n)                                 # L3: O(1) amortized
        n = next_n(n)                               # L4: O(log n)
    return n == 1
```

**Where the time goes, line by line**

*Variables: n = the input integer, k = number of iterations until cycle or 1 (bounded constant for inputs fitting 32 bits).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (digit sum) | O(log x) | k | O(k · log n) |
| L2 (loop guard) | O(1) | k | O(k) |
| **L3, L4 (add + next)** | **O(log n)** | **k** | **O(k · log n)** ← dominates |

For 32-bit integers, after one step the value drops below 9999 (at most 4 digits each squared = max 324), so k is effectively bounded by a small constant. In practice this is O(log n) total.

**Complexity**
- **Time:** O(log n · k) where k is the number of iterations.
- **Space:** O(k) for the seen set.

## Approach 2: Floyd's tortoise and hare (canonical, O(1) space)

Treat the sequence as a linked list. If it cycles (not happy), the two pointers meet.

```python
def is_happy(n):
    def next_n(x):
        total = 0
        while x:                        # L1: O(log x) digit extraction
            total += (x % 10) ** 2
            x //= 10
        return total

    slow = fast = n
    while True:
        slow = next_n(slow)             # L2: one step
        fast = next_n(next_n(fast))     # L3: two steps
        if fast == 1:
            return True                 # L4: happy
        if slow == fast:
            return False                # L5: cycle detected
```

**Where the time goes, line by line**

*Variables: n = the input integer, k = iterations until slow and fast meet (bounded constant for 32-bit inputs).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (digit extraction) | O(log x) | k | O(k · log n) |
| **L2, L3 (slow/fast advance)** | **O(log n)** | **k** | **O(k · log n)** ← dominates |
| L4, L5 (termination checks) | O(1) | k | O(k) |

Same asymptotic cost as Approach 1; the win is space, not time.

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

    while n != 1 and n != 4:           # L1: loop until 1 or known cycle marker
        n = next_n(n)                   # L2: O(log n)
    return n == 1
```

**Where the time goes, line by line**

*Variables: n = the input integer, k = iterations until 1 or 4 (bounded constant for 32-bit inputs).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1, L2 (loop)** | **O(log n)** | **k** | **O(k · log n)** ← dominates |

Same cost as Approaches 1 and 2; the "check for 4" is just a constant-factor improvement on the exit condition.

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

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_202.py and run.
# Uses the canonical implementation (Approach 2: Floyd's cycle detection).

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

def _run_tests():
    assert is_happy(19) == True
    assert is_happy(2) == False
    assert is_happy(1) == True     # 1 is trivially happy
    assert is_happy(7) == True     # 7 is happy (7->49->97->130->10->1)
    assert is_happy(4) == False    # 4 is the cycle entry for unhappy numbers
    assert is_happy(100) == True   # 1^2+0+0 = 1 immediately
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Linked Lists](../../../data-structures/linked-lists/), Floyd's on a numeric sequence treated as a linked list
- [Hash Tables](../../../data-structures/hash-tables/), seen-set variant
