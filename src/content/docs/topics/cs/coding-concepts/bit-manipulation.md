---
title: Bit Manipulation
description: "Binary-representation tactics for masks, toggles, arithmetic shortcuts, and set-like operations."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Bit manipulation treats integers as bit fields. XOR, AND, OR, shifts, and masks extract or update compact state.

## Value

The value is constant-space representation. Some parity, uniqueness, and state problems become simple when viewed bit by bit.

## Challenges this solves

- single unique element
- count set bits
- reverse bits
- addition without plus
- subset masks

## When to use it

Use it when the problem talks about binary representation, powers of two, parity, toggling, or fixed-size sets.

## When not to use it

Do not use bit tricks if they obscure a simple hash/set solution and the problem does not require the memory or arithmetic constraint.

## Terminology clues

- bit
- binary
- xor
- without +
- power of two
- mask
- set bits

## Problems that use it

- [136. Single Number](../coding-problems/bit-manipulation/136-single-number/)
- [190. Reverse Bits](../coding-problems/bit-manipulation/190-reverse-bits/)
- [191. Number of 1 Bits](../coding-problems/bit-manipulation/191-number-of-1-bits/)
- [371. Sum of Two Integers](../coding-problems/bit-manipulation/371-sum-of-two-integers/)

## Related concepts

- [Bitmask state](./bitmask-state/)
- [Math and number theory](./math-and-number-theory/)
- [Subsets and combinations](./subsets-and-combinations/)
