---
title: Stack
description: 7 problems covering classic stack patterns — matched delimiters, expression evaluation, backtracking, and the monotonic stack (which unlocks several O(n) solutions that look like they need O(n²)).
parent: leetcode-150
tags: [leetcode, neetcode-150, stacks]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

A stack is LIFO — you push and pop from the same end. In interviews it shows up in four distinct patterns:

- **Matched delimiters** — push opens, pop and compare on closes.
- **Expression evaluation** — operands on the stack, apply operator when you see one (RPN) or use the shunting-yard idea (infix).
- **Backtracking / combinatorial generation** — the call stack plus local state acts as the stack; recursion is the natural expression.
- **Monotonic stack** — maintain a stack whose values are monotonically increasing or decreasing. Each element is pushed and popped once, so problems like "next greater element" become O(n).

## Problems

1. [20. Valid Parentheses](./020-valid-parentheses/) — *Easy*
2. [155. Min Stack](./155-min-stack/) — *Medium*
3. [150. Evaluate Reverse Polish Notation](./150-evaluate-reverse-polish-notation/) — *Medium*
4. [22. Generate Parentheses](./022-generate-parentheses/) — *Medium*
5. [739. Daily Temperatures](./739-daily-temperatures/) — *Medium*
6. [853. Car Fleet](./853-car-fleet/) — *Medium*
7. [84. Largest Rectangle in Histogram](./084-largest-rectangle-in-histogram/) — *Hard*

## Key patterns unlocked here

- **Open/close matching** — Valid Parentheses.
- **Composite stack state** — Min Stack (each entry carries running aggregate).
- **Postfix evaluation** — Evaluate Reverse Polish Notation.
- **Recursive backtracking with an open/close invariant** — Generate Parentheses.
- **Monotonic decreasing stack for next-greater** — Daily Temperatures.
- **Sort + monotonic stack** — Car Fleet.
- **Monotonic stack for max-rectangle** — Largest Rectangle in Histogram (canonical hard stack problem).
