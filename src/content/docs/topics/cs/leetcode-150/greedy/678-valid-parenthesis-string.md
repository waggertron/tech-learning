---
title: "678. Valid Parenthesis String"
description: Determine if a string of '(', ')', and '*' is valid, where '*' can be '(', ')', or empty.
parent: greedy
tags: [leetcode, neetcode-150, greedy, dp, stacks, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string `s` containing only `'('`, `')'`, and `'*'`, return `true` if `s` is a valid parenthesis string. `'*'` may represent `'('`, `')'`, or the empty string.

**Example**
- `s = "()"` → `true`
- `s = "(*)"` → `true`
- `s = "(*))"` → `true`
- `s = "(("` → `false`

LeetCode 678 · [Link](https://leetcode.com/problems/valid-parenthesis-string/) · *Medium*

## Approach 1: Brute force, try every `*` interpretation

Enumerate 3^(count of `*`) interpretations; test each as a plain parenthesis string. Exponential, skip past tiny inputs.

## Approach 2: Top-down DP on (index, open_count)

State: position and currently unclosed `(` count. Transitions depend on the character.

```python
from functools import lru_cache

def check_valid_string(s):
    @lru_cache(maxsize=None)
    def f(i, opens):
        if opens < 0:
            return False
        if i == len(s):
            return opens == 0
        if s[i] == '(':
            return f(i + 1, opens + 1)
        if s[i] == ')':
            return f(i + 1, opens, 1)
        # '*'
        return f(i + 1, opens + 1) or f(i + 1, opens) or f(i + 1, opens, 1)
    return f(0, 0)
```

**Complexity**
- **Time:** O(n²). States = `n × n`, each O(1).
- **Space:** O(n²).

## Approach 3: Two-pointer range of possible open counts (optimal)

Track `lo` and `hi`, the minimum and maximum possible number of unclosed `(` so far:

- `(` → both `lo` and `hi` increase.
- `)` → both decrease; clamp `lo` at 0.
- `*` → `lo` can decrease (if `*` = `)`) and `hi` can increase (if `*` = `(`).

If `hi < 0` at any point, there are unmatched `)`. At the end, `0 ∈ [lo, hi]` means a valid interpretation exists.

```python
def check_valid_string(s):
    lo = hi = 0
    for ch in s:
        if ch == '(':
            lo += 1
            hi += 1
        elif ch == ')':
            lo -= 1
            hi -= 1
        else:
            lo -= 1
            hi += 1
        if hi < 0:
            return False
        if lo < 0:
            lo = 0
    return lo == 0
```

**Complexity**
- **Time:** O(n).
- **Space:** O(1).

### Two-stack alternative
Push positions of `(` onto one stack and positions of `*` onto another; when you see `)`, pop from `(` first, else from `*`. At the end, ensure remaining `(` positions each have a later `*`. Same O(n), more bookkeeping.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate interpretations | 3^k | O(k) |
| DP on (i, opens) | O(n²) | O(n²) |
| **Range of possible opens** | **O(n)** | **O(1)** |

The `[lo, hi]` range trick is the elegant answer; `*` expands the range, `(` and `)` shift it.

## Related data structures

- [Strings](../../../data-structures/strings/), input
- [Stacks](../../../data-structures/stacks/), two-stack alternative
