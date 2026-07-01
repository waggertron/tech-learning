---
title: Simulation
description: "State-machine tactics for faithfully executing rules while keeping state small and explicit."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Simulation follows the problem rules step by step. The key is choosing state that captures exactly what can change and ignoring irrelevant details.

## Value

The value is correctness under messy rules. Many implementation-heavy problems are not algorithmically deep, but they punish vague state.

## Challenges this solves

- collisions
- matrix rotation
- spiral traversal
- feeds and timelines
- string encodings
- game-like state updates

## When to use it

Use it when the prompt gives procedural rules and the main work is preserving those rules exactly.

## When not to use it

Do not simulate every step when a formula, greedy invariant, or aggregate count gives the answer directly.

## Terminology clues

- simulate
- process operations
- after each step
- rules
- state
- design

## Problems that use it

- [735. Asteroid Collision](../coding-problems/stack/735-asteroid-collision/)
- [54. Spiral Matrix](../coding-problems/math-and-geometry/054-spiral-matrix/)
- [48. Rotate Image](../coding-problems/math-and-geometry/048-rotate-image/)
- [355. Design Twitter](../coding-problems/heap-priority-queue/355-design-twitter/)

## Related concepts

- [Stack parsing](./stack-parsing/)
- [Array scans](./array-scans/)
- [Math and number theory](./math-and-number-theory/)
