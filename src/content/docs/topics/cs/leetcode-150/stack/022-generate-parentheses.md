---
title: "22. Generate Parentheses"
description: Generate all combinations of n pairs of well-formed parentheses.
parent: stack
tags: [leetcode, neetcode-150, stacks, backtracking, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given `n` pairs of parentheses, generate all combinations of well-formed parentheses.

**Example**
- `n = 3` → `["((()))","(()())","(())()","()(())","()()()"]`
- `n = 1` → `["()"]`

LeetCode 22 · [Link](https://leetcode.com/problems/generate-parentheses/) · *Medium*

## Approach 1: Brute force — generate every 2n-char string, filter valid

Enumerate all 2^(2n) strings over `{(, )}`, keep the valid ones.

```python
def generate_parenthesis(n: int) -> list[str]:
    def is_valid(s):
        balance = 0
        for ch in s:
            balance += 1 if ch == "(" else -1
            if balance < 0:
                return False
        return balance == 0

    result = []
    def rec(s):
        if len(s) == 2 * n:
            if is_valid(s):
                result.append(s)
            return
        rec(s + "(")
        rec(s + ")")
    rec("")
    return result
```

**Complexity**
- **Time:** O(2^(2n) · n). Exponentially many strings, each validated in O(n).
- **Space:** O(n) recursion depth (plus output).

## Approach 2: Prune invalid strings during generation

Track running balance during the recursion. Abort a branch as soon as `close > open` or `open > n`.

```python
def generate_parenthesis(n: int) -> list[str]:
    result = []
    def rec(s, opens, closes):
        if opens > n or closes > opens:
            return
        if len(s) == 2 * n:
            result.append(s)
            return
        rec(s + "(", opens + 1, closes)
        rec(s + ")", opens, closes + 1)
    rec("", 0, 0)
    return result
```

**Complexity**
- **Time:** O(4^n / sqrt(n)) — the n-th Catalan number times a linear factor. Much smaller than the brute-force 4^n.
- **Space:** O(n) recursion.

## Approach 3: Backtracking with the exact open/close invariant (optimal)

Same idea, phrased so the invariants are explicit: at each step you can add `(` if `opens < n`, and `)` if `closes < opens`.

```python
def generate_parenthesis(n: int) -> list[str]:
    result = []
    path = []

    def backtrack(opens, closes):
        if opens == n and closes == n:
            result.append("".join(path))
            return
        if opens < n:
            path.append("(")
            backtrack(opens + 1, closes)
            path.pop()
        if closes < opens:
            path.append(")")
            backtrack(opens, closes + 1)
            path.pop()

    backtrack(0, 0)
    return result
```

**Complexity**
- **Time:** O(4^n / sqrt(n)). Same asymptotic as Approach 2; the count of well-formed sequences is the n-th Catalan number.
- **Space:** O(n) recursion + output.

Using a single `path` list with `append`/`pop` avoids string concatenation (O(n) per append); the final join happens only on full paths.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Enumerate all + validate | O(2^(2n) · n) | O(n) |
| Prune during generation | O(4^n / √n) | O(n) |
| **Backtracking with invariants** | **O(4^n / √n)** | **O(n)** |

Approach 3 is the canonical answer and the cleanest expression of the idea. The output is inherently exponential, so you can't beat the Catalan bound.

## Related data structures

- [Stacks](../../../data-structures/stacks/) — the recursion stack is the backtracking frontier
