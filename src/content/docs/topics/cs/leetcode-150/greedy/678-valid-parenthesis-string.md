---
title: "678. Valid Parenthesis String (Medium)"
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
    def f(i, opens):                            # L1: O(n²) unique states
        if opens < 0:
            return False                        # L2: prune negative opens
        if i == len(s):
            return opens == 0                   # L3: valid iff balanced
        if s[i] == '(':
            return f(i + 1, opens + 1)         # L4: O(1) per memoized call
        if s[i] == ')':
            return f(i + 1, opens - 1)         # L5: O(1)
        # '*': try all three interpretations
        return (f(i + 1, opens + 1)            # L6: treat as '('
                or f(i + 1, opens)             # L7: treat as empty
                or f(i + 1, opens - 1))        # L8: treat as ')'
    return f(0, 0)
```

**Where the time goes, line by line**

*Variables: n = len(s).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (unique states) | O(1) | n * n | O(n²) |
| **L6-L8 (star branches)** | **O(1) memoized** | **up to n²** | **O(n²)** ← dominates |

There are O(n²) distinct (i, opens) states; each is computed once due to memoization.

**Complexity**
- **Time:** O(n²). States = `n × n`, each O(1).
- **Space:** O(n²) for the memo table.

## Approach 3: Two-pointer range of possible open counts (optimal)

Track `lo` and `hi`, the minimum and maximum possible number of unclosed `(` so far:

- `(` → both `lo` and `hi` increase.
- `)` → both decrease; clamp `lo` at 0.
- `*` → `lo` can decrease (if `*` = `)`) and `hi` can increase (if `*` = `(`).

If `hi < 0` at any point, there are unmatched `)`. At the end, `0 ∈ [lo, hi]` means a valid interpretation exists.

```python
def check_valid_string(s):
    lo = hi = 0                     # L1: O(1)
    for ch in s:                    # L2: single pass, n iterations
        if ch == '(':
            lo += 1                 # L3: O(1)
            hi += 1                 # L4: O(1)
        elif ch == ')':
            lo -= 1                 # L5: O(1)
            hi -= 1                 # L6: O(1)
        else:
            lo -= 1                 # L7: O(1), star acts as ')'
            hi += 1                 # L8: O(1), star acts as '('
        if hi < 0:                  # L9: too many unmatched ')'
            return False
        if lo < 0:
            lo = 0                  # L10: clamp, star already absorbed the deficit
    return lo == 0                  # L11: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(s).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init) | O(1) | 1 | O(1) |
| **L2-L10 (scan)** | **O(1)** | **n** | **O(n)** ← dominates |
| L11 (final check) | O(1) | 1 | O(1) |

A single pass over the string; all operations per character are O(1).

**Complexity**
- **Time:** O(n), driven by L2/L3-L10 (single linear scan).
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

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_678.py and run.
# Uses the canonical implementation (Approach 3: range of possible opens).

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

def _run_tests():
    assert check_valid_string("()") == True
    assert check_valid_string("(*)") == True
    assert check_valid_string("(*))") == True
    assert check_valid_string("((") == False
    assert check_valid_string("*") == True        # star acts as empty
    assert check_valid_string("(*") == True       # star closes the open paren
    assert check_valid_string(")") == False       # unmatched close
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Strings](../../../data-structures/strings/), input
- [Stacks](../../../data-structures/stacks/), two-stack alternative
