---
title: "20. Valid Parentheses (Easy)"
description: "Determine whether a string of brackets (), [], {} is correctly nested and closed."
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
    while "()" in s or "[]" in s or "{}" in s:           # L1: O(n) scan per iteration
        s = s.replace("()", "").replace("[]", "").replace("{}", "")  # L2: O(n) per replace
    return s == ""                                        # L3: O(n) comparison
```

**Where the time goes, line by line**

*Variables: n = len(s).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (scan for pairs)** | **O(n)** | **up to n/2** | **O(n²)** ← dominates |
| **L2 (three replaces)** | **O(n) each** | **up to n/2** | **O(n²)** ← dominates |
| L3 (final check) | O(n) | 1 | O(n) |

Each pass removes at least one pair and shrinks the string by 2. Up to n/2 passes, each O(n), gives O(n²) total.

**Complexity**
- **Time:** O(n²), driven by L1/L2 (up to n/2 passes, each O(n)).
- **Space:** O(n) for each intermediate string.

Cute but genuinely quadratic. Shows the intuition (innermost pairs cancel) without the optimal representation.

## Approach 2: Stack with if/elif chain

Push opens; on a close, pop and verify the types match.

```python
def is_valid(s: str) -> bool:
    stack = []                                 # L1: O(1) empty stack
    for ch in s:                               # L2: n iterations
        if ch in "([{":                        # L3: O(1) set-like check
            stack.append(ch)                   # L4: O(1) push
        else:
            if not stack:                      # L5: O(1) empty check
                return False
            top = stack.pop()                  # L6: O(1) pop
            if (ch == ")" and top != "(") or \
               (ch == "]" and top != "[") or \
               (ch == "}" and top != "{"):     # L7: O(1) type check
                return False
    return not stack                           # L8: O(1) all opens matched
```

**Where the time goes, line by line**

*Variables: n = len(s).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| L2 (loop) | O(1) | n | O(n) |
| **L3-L7 (per-char work)** | **O(1)** | **n** | **O(n)** ← dominates |
| L8 (final check) | O(1) | 1 | O(1) |

Each character is pushed or popped exactly once.

**Complexity**
- **Time:** O(n), driven by L3-L7 (one push or pop per character).
- **Space:** O(n) for the stack (at most n/2 open brackets).

## Approach 3: Stack with a pair-map (cleanest)

Replace the `if/elif` chain with a dictionary mapping closers to their matching openers.

```python
def is_valid(s: str) -> bool:
    pairs = {")": "(", "]": "[", "}": "{"}     # L1: O(1) constant dict
    stack = []                                  # L2: O(1)
    for ch in s:                                # L3: n iterations
        if ch in pairs.values():               # L4: O(1) check (set of 3)
            stack.append(ch)                   # L5: O(1) push
        else:
            if not stack or stack.pop() != pairs[ch]:  # L6: O(1) pop + lookup
                return False
    return not stack                            # L7: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(s).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L2 (init) | O(1) | 1 | O(1) |
| L3 (loop) | O(1) | n | O(n) |
| **L4-L6 (per-char: push or pop+check)** | **O(1)** | **n** | **O(n)** ← dominates |
| L7 (final check) | O(1) | 1 | O(1) |

Same O(n) work, but the pair-map removes all branching.

**Complexity**
- **Time:** O(n), driven by L4-L6 (one push or pop+check per character).
- **Space:** O(n) for the stack.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Repeated replacement | O(n²) | O(n) |
| Stack + if/elif | O(n) | O(n) |
| **Stack + pair-map** | **O(n)** | **O(n)** |

All stack approaches have the same asymptotic complexity; the pair-map version is the cleanest to write and generalizes to larger character sets.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_valid_parentheses.py and run.
# Uses the canonical implementation (Approach 3: stack + pair-map).

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

def _run_tests():
    assert is_valid("()") == True
    assert is_valid("()[]{}") == True
    assert is_valid("(]") == False
    assert is_valid("([)]") == False
    assert is_valid("{[]}") == True
    assert is_valid("") == True
    assert is_valid("(") == False
    assert is_valid(")") == False
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Stacks](../../../data-structures/stacks/), LIFO matching of open/close delimiters
- [Strings](../../../data-structures/strings/), input
- [Hash Tables](../../../data-structures/hash-tables/), pair-map for close→open lookup
