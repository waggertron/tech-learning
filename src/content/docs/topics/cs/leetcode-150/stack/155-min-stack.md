---
title: "155. Min Stack"
description: Design a stack that supports push, pop, top, and getMin all in O(1).
parent: stack
tags: [leetcode, neetcode-150, stacks, design, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Design a stack that supports `push`, `pop`, `top`, and `getMin` — all in O(1) time.

**Example**
```
MinStack ms = new MinStack();
ms.push(-2); ms.push(0); ms.push(-3);
ms.getMin();   // -3
ms.pop();
ms.top();      // 0
ms.getMin();   // -2
```

LeetCode 155 · [Link](https://leetcode.com/problems/min-stack/) · *Medium*

## Approach 1: Brute force — scan on getMin

Use a plain stack; compute `min(stack)` on every `getMin` call.

```python
class MinStack:
    def __init__(self):
        self.stack = []
    def push(self, val: int) -> None: self.stack.append(val)
    def pop(self) -> None: self.stack.pop()
    def top(self) -> int: return self.stack[-1]
    def getMin(self) -> int: return min(self.stack)
```

**Complexity**
- `push`, `pop`, `top`: O(1).
- `getMin`: **O(n)**.
- Space: O(n).

Fails the problem's O(1) requirement for `getMin`.

## Approach 2: Auxiliary min-stack

Maintain a parallel stack of running minimums. On `push`, push `min(val, current_min)` onto the aux stack; on `pop`, pop both.

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.mins = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        self.mins.append(val if not self.mins else min(val, self.mins[-1]))

    def pop(self) -> None:
        self.stack.pop()
        self.mins.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.mins[-1]
```

**Complexity**
- All operations: **O(1)**.
- Space: O(n) + O(n) = O(n).

## Approach 3: Single stack of `(value, running_min)` tuples (optimal, one container)

Same asymptotics as Approach 2 but with one container instead of two.

```python
class MinStack:
    def __init__(self):
        self.stack = []   # list of (value, running_min)

    def push(self, val: int) -> None:
        cur_min = val if not self.stack else min(val, self.stack[-1][1])
        self.stack.append((val, cur_min))

    def pop(self) -> None:
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1][0]

    def getMin(self) -> int:
        return self.stack[-1][1]
```

**Complexity**
- All operations: **O(1)**.
- Space: O(n).

### Optional refinement: store only min-changes on a second stack
A third variant pushes to the aux min-stack **only** when a new minimum is established (and pops when popping a value equal to the current min). Saves memory on heavily-duplicated stacks. Same asymptotics.

## Summary

| Approach | push/pop/top | getMin | Space |
| --- | --- | --- | --- |
| Scan on getMin | O(1) | O(n) | O(n) |
| **Auxiliary min-stack** | O(1) | **O(1)** | O(n) |
| **Tuple stack** | O(1) | **O(1)** | O(n) |

The tuple-stack and auxiliary-stack approaches are equivalent in Big-O. Pick by taste.

## Related data structures

- [Stacks](../../../data-structures/stacks/) — carrying running aggregate state per frame is a classic pattern
