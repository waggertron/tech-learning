---
title: Stack Parsing
description: "Last-open-first-closed tactics for nested syntax, expressions, and reversible operations."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Stack parsing uses last-in-first-out memory for nested syntax and reversible operations. Each opener waits on the stack until its matching closer or operator appears.

The invariant is that the stack represents unresolved context. For parentheses, it is the open delimiters. For calculators, it may be pending signs or partial values. For path simplification, it is the current canonical path components.

The parser usually scans once. On each token, decide whether to push context, resolve the top context, or combine values. The top of stack is the only unresolved item that a closing token can legally match.

## Value

The value is handling nesting without searching backward through the whole prefix. The stack gives direct access to the most recent unresolved context.

### Direct complexity example

- **Brute force:** For each closing token, scan backward to find the matching opener: $O(n^2)$ time in deeply nested input.
- **With this tactic:** Push open context and pop on close: $O(n)$ time.
- **Space:** Space is $O(d)$ for nesting depth, which can be $O(n)$ in the worst case.

## Challenges this solves

- valid parentheses
- basic calculator
- decode string
- simplify path
- remove invalid parentheses
- reverse Polish notation

## When to use it

Use this tactic when these conditions are true:

- the input is nested
- the most recent unresolved item must be resolved first
- tokens open and close scopes
- operations can be undone or combined in reverse order

## When not to use it

Reach for a different tactic when these warning signs appear:

- the grammar needs full precedence parsing beyond a stack template
- the relationship is not nested or LIFO
- you need random access to earlier tokens
- a counter is enough because types and nesting details do not matter

## Terminology clues

These prompt words often point toward this concept:

- parentheses
- brackets
- nested
- decode
- calculator
- path
- LIFO
- matching

## Problems that use it

- [20. Valid Parentheses](../../coding-problems/stack/020-valid-parentheses/)
- [22. Generate Parentheses](../../coding-problems/stack/022-generate-parentheses/)
- [71. Simplify Path](../../coding-problems/stack/071-simplify-path/)
- [150. Evaluate Reverse Polish Notation](../../coding-problems/stack/150-evaluate-reverse-polish-notation/)
- [155. Min Stack](../../coding-problems/stack/155-min-stack/)
- [224. Basic Calculator](../../coding-problems/stack/224-basic-calculator/)
- [394. Decode String](../../coding-problems/stack/394-decode-string/)
- [678. Valid Parenthesis String](../../coding-problems/greedy/678-valid-parenthesis-string/)
- [735. Asteroid Collision](../../coding-problems/stack/735-asteroid-collision/)
- [1047. Remove All Adjacent Duplicates In String](../../coding-problems/stack/1047-remove-all-adjacent-duplicates/)
- [1249. Minimum Remove to Make Valid Parentheses](../../coding-problems/stack/1249-minimum-remove-valid-parens/)

## Related concepts

- [Monotonic stack](../monotonic-stack/)
- [Recursion](../recursion/)
- [Simulation](../simulation/)
