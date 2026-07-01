---
title: Monotonic Stack
description: "Ordered-stack tactics for nearest greater, nearest smaller, and span-style questions."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

A monotonic stack keeps candidates in increasing or decreasing order. When a new value breaks the order, popped items have found their next greater or smaller boundary.

## Value

The value is one-pass nearest-neighbor discovery. Each element is pushed once and popped once.

## Challenges this solves

- next greater element
- daily temperatures
- largest rectangle
- subarray minimum contribution
- collision resolution

## When to use it

Use it when each item needs the nearest earlier or later item that is greater or smaller.

## When not to use it

Do not use it when the relationship is not nearest-boundary based. A heap or sort may be more appropriate.

## Terminology clues

- next greater
- next smaller
- previous greater
- span
- temperature waits
- rectangle area

## Problems that use it

- [739. Daily Temperatures](../coding-problems/stack/739-daily-temperatures/)
- [84. Largest Rectangle in Histogram](../coding-problems/stack/084-largest-rectangle-in-histogram/)
- [503. Next Greater Element II](../coding-problems/stack/503-next-greater-element-ii/)
- [907. Sum of Subarray Minimums](../coding-problems/stack/907-sum-of-subarray-minimums/)

## Related concepts

- [Monotonic queue](./monotonic-queue/)
- [Stack parsing](./stack-parsing/)
- [Array scans](./array-scans/)
