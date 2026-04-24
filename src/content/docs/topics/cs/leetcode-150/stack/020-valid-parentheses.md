---
title: "20. Valid Parentheses"
description: Determine whether a string of brackets (), [], {} is correctly nested and closed.
parent: stack
tags: [leetcode, neetcode-150, stacks, strings, easy]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s` containing only the characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`, determine if the input is valid. An input is valid if every open bracket is closed by the same type in the correct order.

**Example**
- `s = "()"` → `true`
- `s = "()[]{}"` → `true`
- `s = "(]"` → `false`
- `s = "([)]"` → `false`

LeetCode 20 · [Link](https://leetcode.com/problems/valid-parentheses/) · *Easy*

## Approach 1: Brute force, repeated replacement

Repeatedly remove innermost pairs (`"()"`, `"[]"`, `"{}"`) until the string stops changing. Valid iff the final string is empty.

```python
def is_valid(s: str) -> bool:
    while "()" in s or "[]" in s or "{}" in s:
        s = s.replace("()", "").replace("[]", "").replace("{}", "")
    return s == ""
```

**Complexity**
- **Time:** O(n²). Each pass can remove O(n) pairs; there can be O(n) passes.
- **Space:** O(n) for each intermediate string.

Cute but genuinely quadratic. Shows the intuition (innermost pairs cancel) without the optimal representation.

## Approach 2: Stack with if/elif chain

Push opens; on a close, pop and verify the types match.

```python
def is_valid(s: str) -> bool:
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        else:
            if not stack:
                return False
            top = stack.pop()
            if (ch == ")" and top != "(") or \
               (ch == "]" and top != "[") or \
               (ch == "}" and top != "{"):
                return False
    return not stack
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

## Approach 3: Stack with a pair-map (cleanest)

Replace the `if/elif` chain with a dictionary mapping closers to their matching openers.

```python
def is_valid(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs.values():
            stack.append(ch)
        else:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Repeated replacement | O(n²) | O(n) |
| Stack + if/elif | O(n) | O(n) |
| **Stack + pair-map** | **O(n)** | **O(n)** |

All stack approaches have the same asymptotic complexity; the pair-map version is the cleanest to write and generalizes to larger character sets.

## Related data structures

- [Stacks](../../../data-structures/stacks/), LIFO matching of open/close delimiters
- [Strings](../../../data-structures/strings/), input
- [Hash Tables](../../../data-structures/hash-tables/), pair-map for close→open lookup
