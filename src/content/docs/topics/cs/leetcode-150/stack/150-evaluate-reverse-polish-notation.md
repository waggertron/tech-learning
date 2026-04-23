---
title: "150. Evaluate Reverse Polish Notation"
description: Evaluate an arithmetic expression given in Reverse Polish (postfix) notation.
parent: stack
tags: [leetcode, neetcode-150, stacks, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Evaluate an arithmetic expression in Reverse Polish Notation. Valid operators are `+`, `-`, `*`, `/`. Each operand can be an integer or another expression. Division between two integers truncates toward zero.

**Example**
- `tokens = ["2","1","+","3","*"]` → `9` (≡ `(2 + 1) * 3`)
- `tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]` → `22`

LeetCode 150 · [Link](https://leetcode.com/problems/evaluate-reverse-polish-notation/) · *Medium*

## Approach 1: Stack with explicit if/elif branching

Standard RPN evaluation: push operands; on operator, pop two and apply.

```python
def eval_rpn(tokens: list[str]) -> int:
    stack = []
    for tok in tokens:
        if tok in ("+", "-", "*", "/"):
            b = stack.pop()
            a = stack.pop()
            if tok == "+":
                stack.append(a + b)
            elif tok == "-":
                stack.append(a - b)
            elif tok == "*":
                stack.append(a * b)
            else:
                # truncate toward zero
                stack.append(int(a / b))
        else:
            stack.append(int(tok))
    return stack[0]
```

**Complexity**
- **Time:** O(n). Each token processed once.
- **Space:** O(n). Stack depth at most O(n).

## Approach 2: Stack with operator dictionary (cleaner)

Replace the if/elif branching with a dict of lambdas.

```python
def eval_rpn(tokens: list[str]) -> int:
    ops = {
        "+": lambda a, b: a + b,
        "-": lambda a, b: a - b,
        "*": lambda a, b: a * b,
        "/": lambda a, b: int(a / b),   # truncate toward zero
    }
    stack = []
    for tok in tokens:
        if tok in ops:
            b = stack.pop()
            a = stack.pop()
            stack.append(ops[tok](a, b))
        else:
            stack.append(int(tok))
    return stack[0]
```

**Complexity**
- **Time:** O(n).
- **Space:** O(n).

Functionally identical, easier to extend (new operators) and easier to read.

## Approach 3: In-place evaluation on the tokens list (space optimization)

Reuse the input list as the operand stack — no separate stack allocation. Asymptotically the same but often the "clever" interview answer.

```python
def eval_rpn(tokens: list[str]) -> int:
    ops = {
        "+": lambda a, b: a + b,
        "-": lambda a, b: a - b,
        "*": lambda a, b: a * b,
        "/": lambda a, b: int(a / b),
    }
    i = 0
    while i < len(tokens):
        tok = tokens[i]
        if tok in ops:
            b = int(tokens[i - 1])
            a = int(tokens[i - 2])
            result = ops[tok](a, b)
            tokens[i - 2] = str(result)
            del tokens[i - 1:i + 1]
            i -= 1
        else:
            i += 1
    return int(tokens[0])
```

**Complexity**
- **Time:** O(n²) in the worst case because `del tokens[i-1:i+1]` is O(n). Not recommended in practice.
- **Space:** O(1) extra.

Included for discussion — the space saving isn't worth the time cost.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Stack + if/elif | O(n) | O(n) | Verbose |
| **Stack + operator dict** | **O(n)** | **O(n)** | Cleanest |
| In-place on tokens | O(n²) | O(1) | Space at time cost — avoid |

## Related data structures

- [Stacks](../../../data-structures/stacks/) — postfix evaluation is the textbook stack use case
