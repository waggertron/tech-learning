---
title: Bit Manipulation
description: "Binary-representation tactics for masks, toggles, arithmetic shortcuts, and set-like operations."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Bit manipulation works directly with the binary representation of integers. The moves are masks, shifts, toggles, and bitwise combination operations.

The invariant is per-bit independence. XOR can cancel equal bits, AND can test membership in a mask, OR can set bits, and shifts can move values between bit positions.

Translate the problem into bit facts before coding. Ask what each bit means, whether bits interact through carries, and whether signed representation matters in the language.

## Value

The value is constant-time work over fixed-width integers. Bit operations often replace arrays of booleans, repeated division, or pairwise cancellation logic.

### Direct complexity example

- **Brute force:** Count, store, or compare flags with arrays or repeated arithmetic: $O(w)$ time per value for word size `w`, sometimes with $O(w)$ space.
- **With this tactic:** Use bitwise operations that run in constant time for machine-sized integers: $O(1)$ per operation.
- **Space:** Space is usually $O(1)$ unless masks are stored for many states.

## Challenges this solves

- single number with XOR
- counting set bits
- reverse bits
- sum without plus
- missing number
- power of two checks

## When to use it

Use this tactic when these conditions are true:

- the prompt mentions bits or binary
- values can be represented as flags
- XOR cancellation fits pairs or parity
- constraints use fixed-width integers

## When not to use it

Reach for a different tactic when these warning signs appear:

- numbers exceed safe integer width in the language
- the problem is clearer and fast enough with arithmetic
- bit interactions through carries make a simple mask wrong
- negative number representation is unspecified

## Terminology clues

These prompt words often point toward this concept:

- bit
- binary
- XOR
- mask
- shift
- set bit
- power of two
- without arithmetic

## Problems that use it

- [136. Single Number](../../coding-problems/bit-manipulation/136-single-number/)
- [190. Reverse Bits](../../coding-problems/bit-manipulation/190-reverse-bits/)
- [191. Number of 1 Bits](../../coding-problems/bit-manipulation/191-number-of-1-bits/)
- [268. Missing Number](../../coding-problems/bit-manipulation/268-missing-number/)
- [371. Sum of Two Integers](../../coding-problems/bit-manipulation/371-sum-of-two-integers/)

## Related concepts

- [Bitmask state](../bitmask-state/)
- [Math and number theory](../math-and-number-theory/)
- [Subsets and combinations](../subsets-and-combinations/)
