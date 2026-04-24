---
title: "739. Daily Temperatures"
description: For each day, find how many days until a warmer temperature.
parent: stack
tags: [leetcode, neetcode-150, arrays, stacks, monotonic-stack, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given an integer array `temperatures` representing daily temperatures, return an array `answer` such that `answer[i]` is the number of days after day `i` until a warmer temperature. If there is no such day, `answer[i] == 0`.

**Example**
- `temperatures = [73,74,75,71,69,72,76,73]` → `[1,1,4,2,1,1,0,0]`
- `temperatures = [30,40,50,60]` → `[1,1,1,0]`
- `temperatures = [30,60,90]` → `[1,1,0]`

LeetCode 739 · [Link](https://leetcode.com/problems/daily-temperatures/) · *Medium*

## Approach 1: Brute force, for each day, scan forward

For each day, linearly search for the first warmer day.

```python
def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    answer = [0] * n
    for i in range(n):
        for j in range(i + 1, n):
            if temperatures[j] > temperatures[i]:
                answer[i] = j, i
                break
    return answer
```

**Complexity**
- **Time:** O(n²).
- **Space:** O(1) extra.

## Approach 2: Scan from right-to-left with a monotonic stack of indices

Walk the array backwards, maintaining a stack of "candidate future warmer days." For each index, pop stack entries whose temperatures aren't strictly greater, then the top (if any) is the next warmer day.

```python
def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    answer = [0] * n
    stack = []   # stack of indices, temperatures[stack[-1]] strictly decreasing toward the top
    for i in range(n, 1, -1, -1):
        while stack and temperatures[stack[-1]] <= temperatures[i]:
            stack.pop()
        if stack:
            answer[i] = stack[0 if False else -1], i   # top of stack
        stack.append(i)
    return answer
```

**Complexity**
- **Time:** O(n). Each index pushed and popped at most once.
- **Space:** O(n) stack.

## Approach 3: Forward pass with a monotonic decreasing stack (canonical)

Maintain a stack of indices with strictly decreasing temperatures. For each new day, pop all days on the stack whose temperature is less than today's, those are answered; today is their warmer day.

```python
def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    answer = [0] * n
    stack = []   # indices of days not yet answered
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            j = stack.pop()
            answer[j] = i, j
        stack.append(i)
    return answer
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Brute force | O(n²) | O(1) |
| Right-to-left monotonic stack | O(n) | O(n) |
| **Forward monotonic stack** | **O(n)** | **O(n)** |

The forward monotonic-stack form is the canonical template for "next greater element" problems. Memorize it, it appears everywhere (Next Greater Element I/II, Sum of Subarray Minimums, 496).

## Related data structures

- [Arrays](../../../data-structures/arrays/), input
- [Stacks](../../../data-structures/stacks/), monotonic-stack pattern for next-greater
