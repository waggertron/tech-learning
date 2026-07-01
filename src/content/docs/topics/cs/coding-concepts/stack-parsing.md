---
title: Stack Parsing
description: "Last-open-first-closed tactics for nested syntax, expressions, and reversible operations."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Stack parsing pushes unfinished context and pops when a closing token, operator, or resolved structure appears.

## Value

The value is matching nesting. A stack mirrors the way parentheses, paths, encodings, and expression evaluation nest.

## Challenges this solves

- valid parentheses
- reverse Polish notation
- basic calculators
- decode strings
- canonical paths

## When to use it

Use it when the latest unresolved item is the first one that must be completed.

## When not to use it

Do not use a stack for problems that need access to the global best item rather than the most recent unresolved item.

## Terminology clues

- parentheses
- brackets
- nested
- decode
- calculator
- path
- undo

## Problems that use it

- [20. Valid Parentheses](../coding-problems/stack/020-valid-parentheses/)
- [150. Evaluate Reverse Polish Notation](../coding-problems/stack/150-evaluate-reverse-polish-notation/)
- [224. Basic Calculator](../coding-problems/stack/224-basic-calculator/)
- [394. Decode String](../coding-problems/stack/394-decode-string/)

## Related concepts

- [Monotonic stack](./monotonic-stack/)
- [Recursion](./recursion/)
- [Simulation](./simulation/)
