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
    stack = []                                    # L1: O(1)
    for tok in tokens:                            # L2: n iterations
        if tok in ("+", "-", "*", "/"):           # L3: O(1) check
            b = stack.pop()                       # L4: O(1) pop
            a = stack.pop()                       # L5: O(1) pop
            if tok == "+":                        # L6: O(1)
                stack.append(a + b)               # L7: O(1)
            elif tok == "-":
                stack.append(a - b)               # L8: O(1)
            elif tok == "*":
                stack.append(a * b)               # L9: O(1)
            else:
                stack.append(int(a / b))          # L10: O(1) truncate toward zero
        else:
            stack.append(int(tok))                # L11: O(1) parse + push
    return stack[0]                               # L12: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(tokens).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L2 (loop) | O(1) | n | O(n) |
| **L3-L11 (per-token: push or pop+apply)** | **O(1)** | **n** | **O(n)** ← dominates |
| L12 (return) | O(1) | 1 | O(1) |

Each token is processed in O(1); one pass over all n tokens.

**Complexity**
- **Time:** O(n), driven by L3-L11 (one push or pop+apply per token).
- **Space:** O(n). Stack depth at most O(n).

## Approach 2: Stack with operator dictionary (cleaner)

Replace the if/elif branching with a dict of lambdas.

```python
def eval_rpn(tokens: list[str]) -> int:
    ops = {                                       # L1: O(1) constant dict
        "+": lambda a, b: a + b,
        "-": lambda a, b: a - b,
        "*": lambda a, b: a * b,
        "/": lambda a, b: int(a / b),             # truncate toward zero
    }
    stack = []                                    # L2: O(1)
    for tok in tokens:                            # L3: n iterations
        if tok in ops:                            # L4: O(1) dict lookup
            b = stack.pop()                       # L5: O(1)
            a = stack.pop()                       # L6: O(1)
            stack.append(ops[tok](a, b))          # L7: O(1) apply lambda
        else:
            stack.append(int(tok))                # L8: O(1) parse + push
    return stack[0]                               # L9: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(tokens).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (init ops dict) | O(1) | 1 | O(1) |
| L3 (loop) | O(1) | n | O(n) |
| **L4-L8 (per-token: push or apply)** | **O(1)** | **n** | **O(n)** ← dominates |
| L9 (return) | O(1) | 1 | O(1) |

Functionally identical to Approach 1; easier to extend (new operators) and easier to read.

**Complexity**
- **Time:** O(n), driven by L4-L8 (one push or pop+apply per token).
- **Space:** O(n).

## Approach 3: In-place evaluation on the tokens list (space optimization)

Reuse the input list as the operand stack, no separate stack allocation. Asymptotically the same but often the "clever" interview answer.

```python
def eval_rpn(tokens: list[str]) -> int:
    ops = {
        "+": lambda a, b: a + b,
        "-": lambda a, b: a - b,
        "*": lambda a, b: a * b,
        "/": lambda a, b: int(a / b),
    }
    i = 0
    while i < len(tokens):                        # L1: scans forward
        tok = tokens[i]                            # L2: O(1)
        if tok in ops:                             # L3: O(1)
            b = int(tokens[i - 1])                 # L4: O(1)
            a = int(tokens[i - 2])                 # L5: O(1)
            result = ops[tok](a, b)                # L6: O(1)
            tokens[i - 2] = str(result)            # L7: O(1) overwrite
            del tokens[i - 1:i + 1]               # L8: O(n) list shift
            i -= 1                                 # L9: O(1)
        else:
            i += 1                                 # L10: O(1)
    return int(tokens[0])                          # L11: O(1)
```

**Where the time goes, line by line**

*Variables: n = len(tokens).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1-L7, L9-L11 | O(1) | n | O(n) |
| **L8 (del slice)** | **O(n)** | **up to n/2** | **O(n²)** ← dominates |

`del tokens[i-1:i+1]` shifts all elements after the deletion point, costing O(n) per operator token.

**Complexity**
- **Time:** O(n²) in the worst case because `del tokens[i-1:i+1]` is O(n). Not recommended in practice.
- **Space:** O(1) extra.

Included for discussion, the space saving isn't worth the time cost.

## Summary

| Approach | Time | Space | Notes |
| --- | --- | --- | --- |
| Stack + if/elif | O(n) | O(n) | Verbose |
| **Stack + operator dict** | **O(n)** | **O(n)** | Cleanest |
| In-place on tokens | O(n²) | O(1) | Space at time cost, avoid |

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_eval_rpn.py and run.
# Uses the canonical implementation (Approach 2: stack + operator dict).

def eval_rpn(tokens: list[str]) -> int:
    ops = {
        "+": lambda a, b: a + b,
        "-": lambda a, b: a - b,
        "*": lambda a, b: a * b,
        "/": lambda a, b: int(a / b),
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

def _run_tests():
    assert eval_rpn(["2","1","+","3","*"]) == 9
    assert eval_rpn(["4","13","5","/","+"]) == 6
    assert eval_rpn(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]) == 22
    assert eval_rpn(["3"]) == 3
    assert eval_rpn(["6","2","/"]) == 3      # truncate toward zero
    assert eval_rpn(["7","2","/"]) == 3      # truncate: 7/2 = 3.5 -> 3
    assert eval_rpn(["-7","2","/"]) == -3    # truncate toward zero: -3.5 -> -3
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Stacks](../../../data-structures/stacks/), postfix evaluation is the textbook stack use case
