---
title: Math and Number Theory
description: "Arithmetic tactics for problems driven by divisibility, digits, modular behavior, and numeric identities."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Math and number theory use arithmetic structure instead of search. Divisibility, remainders, digit behavior, and identities can replace loops over candidates.

The invariant is a numeric property that stays true across transformations. Examples include gcd preserving common divisors, modular equivalence preserving remainders, and exponentiation by squaring preserving the product represented by processed bits.

The first move is to rewrite the prompt as an equation or congruence. Once the equation is visible, the algorithm is often a short loop over digits, factors, bits, or remainders.

## Value

The value is eliminating unnecessary enumeration. A formula, gcd, modulo class, or logarithmic exponentiation can reduce work by orders of magnitude.

### Direct complexity example

- **Brute force:** Try every divisor, repeated multiplication, or every numeric candidate: $O(n)$ or worse depending on the value range.
- **With this tactic:** Use gcd, modulo arithmetic, digit loops, or exponentiation by squaring: often $O(\log n)$ or $O(\sqrt n)$ time depending on the operation.
- **Space:** Space is usually $O(1)$, unless storing factors, primes, or large intermediate strings is required.

## Challenges this solves

- gcd of strings
- power function
- reverse integer
- happy number
- pairs divisible by k
- manual arithmetic on strings

## When to use it

Use this tactic when these conditions are true:

- the prompt mentions divisibility, remainder, digits, powers, gcd, or modulo
- the input values are large but their arithmetic structure is small
- checking all candidates is too slow
- a known identity preserves the answer

## When not to use it

Reach for a different tactic when these warning signs appear:

- the problem is really about ordering or traversal
- numeric overflow or precision changes the rules
- a formula is guessed without proof
- constraints are tiny and direct simulation is clearer

## Terminology clues

These prompt words often point toward this concept:

- divisible
- modulo
- remainder
- gcd
- prime
- power
- digits
- integer

## Problems that use it

- [7. Reverse Integer](../../coding-problems/bit-manipulation/007-reverse-integer/)
- [43. Multiply Strings](../../coding-problems/math-and-geometry/043-multiply-strings/)
- [50. Pow(x, n)](../../coding-problems/math-and-geometry/050-pow-x-n/)
- [66. Plus One](../../coding-problems/math-and-geometry/066-plus-one/)
- [190. Reverse Bits](../../coding-problems/bit-manipulation/190-reverse-bits/)
- [191. Number of 1 Bits](../../coding-problems/bit-manipulation/191-number-of-1-bits/)
- [202. Happy Number](../../coding-problems/math-and-geometry/202-happy-number/)
- [268. Missing Number](../../coding-problems/bit-manipulation/268-missing-number/)
- [371. Sum of Two Integers](../../coding-problems/bit-manipulation/371-sum-of-two-integers/)
- [459. Repeated Substring Pattern](../../coding-problems/arrays-and-hashing/459-repeated-substring-pattern/)
- [1071. Greatest Common Divisor of Strings](../../coding-problems/arrays-and-hashing/1071-greatest-common-divisor-of-strings/)
- [2013. Detect Squares](../../coding-problems/math-and-geometry/2013-detect-squares/)

## Related concepts

- [Bit manipulation](../bit-manipulation/)
- [Simulation](../simulation/)
- [Cycle detection](../cycle-detection/)
