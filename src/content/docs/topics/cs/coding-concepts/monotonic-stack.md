---
title: Monotonic Stack
description: "Ordered-stack tactics for nearest greater, nearest smaller, and span-style questions."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

A monotonic stack stores candidates in increasing or decreasing order. When a new value breaks the order, popped items have found their next greater, next smaller, or boundary.

The invariant is that unresolved items remain useful in stack order. If the current value makes the top item useless, it will also be the first value that resolves that item.

Think of the stack as holding questions waiting for an answer. Daily Temperatures stores days waiting for a warmer day. Histogram bars wait for the first smaller boundary that ends their rectangle.

## Value

The value is replacing repeated nearest-neighbor scans with one pass. Each index enters and leaves the stack at most once.

### Direct complexity example

- **Brute force:** For every index, scan left or right to find the next greater or smaller value: $O(n^2)$ time.
- **With this tactic:** Push and pop each index once with a monotonic invariant: $O(n)$ time.
- **Space:** Space is $O(n)$ in the worst case when the sequence is already monotonic and nothing pops early.

## Challenges this solves

- next greater element
- daily temperatures
- largest rectangle in histogram
- sum of subarray minimums
- span problems

## When to use it

Use this tactic when these conditions are true:

- the prompt asks for nearest greater or nearest smaller
- a value resolves earlier unresolved values
- each item needs a boundary to the left or right
- a quadratic scan repeats the same comparisons

## When not to use it

Reach for a different tactic when these warning signs appear:

- the condition is not ordered by greater or smaller comparisons
- you need arbitrary range minimum queries many times
- updates happen online after queries
- a simple running maximum is enough

## Terminology clues

These prompt words often point toward this concept:

- next greater
- next smaller
- nearest
- span
- warmer
- histogram
- monotonic
- previous less

## Problems that use it

- [84. Largest Rectangle in Histogram](../coding-problems/stack/084-largest-rectangle-in-histogram/)
- [496. Next Greater Element I](../coding-problems/stack/496-next-greater-element-i/)
- [503. Next Greater Element II](../coding-problems/stack/503-next-greater-element-ii/)
- [739. Daily Temperatures](../coding-problems/stack/739-daily-temperatures/)
- [853. Car Fleet](../coding-problems/stack/853-car-fleet/)
- [907. Sum of Subarray Minimums](../coding-problems/stack/907-sum-of-subarray-minimums/)

## Related concepts

- [Monotonic queue](./monotonic-queue/)
- [Stack parsing](./stack-parsing/)
- [Array scans](./array-scans/)
