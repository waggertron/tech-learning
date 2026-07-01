---
title: Math and Number Theory
description: "Arithmetic tactics for problems driven by divisibility, digits, modular behavior, and numeric identities."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Math tactics replace search with a property: divisibility, modular equivalence, digit decomposition, exponentiation by squaring, or a greatest-common-divisor identity.

## Value

The value is directness. A small identity can remove whole loops or avoid representing huge numbers.

## Challenges this solves

- digit operations
- fast power
- string multiplication
- happy number cycles
- GCD-based repetition
- modulo pairing

## When to use it

Use it when the prompt is mostly about numbers, digits, divisibility, powers, or repeated arithmetic transformations.

## When not to use it

Do not force a clever identity when simulation or parsing is the clearer source of correctness.

## Terminology clues

- digits
- mod
- divisible
- power
- gcd
- without converting
- integer overflow

## Problems that use it

- [202. Happy Number](../coding-problems/math-and-geometry/202-happy-number/)
- [50. Pow(x, n)](../coding-problems/math-and-geometry/050-pow-x-n/)
- [43. Multiply Strings](../coding-problems/math-and-geometry/043-multiply-strings/)
- [1071. Greatest Common Divisor of Strings](../coding-problems/arrays-and-hashing/1071-greatest-common-divisor-of-strings/)

## Related concepts

- [Bit manipulation](./bit-manipulation/)
- [Simulation](./simulation/)
- [Cycle detection](./cycle-detection/)
