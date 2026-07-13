---
title: Bit Manipulation
description: "7 problems that live at the level of the CPU, XOR identities, popcount, bit tricks, and emulating arithmetic with bitwise ops."
parent: coding-problems
tags: [leetcode, neetcode-150, bit-manipulation]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## The useful bit tricks

Bit manipulation problems look strange until the identities become mechanical. The goal is not to write clever code for its own sake. The goal is to replace a count, parity check, set membership question, or arithmetic carry with operations the machine already performs directly.

- **XOR identities**: `a ^ a = 0`, `a ^ 0 = a`, XOR is commutative and associative. Used for "find the unique element."
- **Brian Kernighan's trick**: `n & (n - 1)` clears the lowest set bit. Repeating it counts set bits in $O(popcount)$ rather than always scanning every bit position.
- **Bitwise iteration**: `n & 1` tests the least-significant bit. `n >>= 1` shifts the next bit into place.
- **Sum without `+`**: `a ^ b` is sum-without-carry, `(a & b) << 1` is the carry. Loop until carry = 0.

Watch the language boundary. Python integers are unbounded, so problems that ask for 32-bit arithmetic often need an explicit mask such as `0xFFFFFFFF`. JavaScript bitwise operators coerce through signed 32-bit integers. Go, Java, and C-family languages make signedness and overflow behavior more visible. The algorithm may be the same, but the edge-case code is language-specific.

## Problems

1. [136. Single Number (Easy)](./136-single-number/)
2. [191. Number of 1 Bits (Easy)](./191-number-of-1-bits/)
3. [338. Counting Bits (Easy)](./338-counting-bits/)
4. [190. Reverse Bits (Easy)](./190-reverse-bits/)
5. [268. Missing Number (Easy)](./268-missing-number/)
6. [371. Sum of Two Integers (Medium)](./371-sum-of-two-integers/)
7. [7. Reverse Integer (Medium)](./007-reverse-integer/)

## Key patterns unlocked here

- **XOR of all elements**: Single Number.
- **Popcount via shift or Kernighan**: Number of 1 Bits.
- **DP using `popcount(i) = popcount(i >> 1) + (i & 1)`**: Counting Bits.
- **Bit-by-bit reversal**: Reverse Bits.
- **XOR-of-indices-XOR-of-values**: Missing Number.
- **XOR + carry for `+`**: Sum of Two Integers (language-dependent).
- **Digit-by-digit with overflow check**: Reverse Integer.

## How to recognize the category

Reach for bit manipulation when the prompt is about parity, powers of two, set bits, missing or duplicated values under XOR-friendly constraints, or arithmetic without ordinary operators. A phrase like "every value appears twice except one" is usually an XOR prompt. A phrase like "number of 1 bits" or "Hamming weight" points to popcount. A phrase like "without using `+` or `-`" points to carry simulation.

Avoid bit tricks when the input is not actually bit-shaped. If the problem needs ordering, frequency ranking, graph reachability, or arbitrary precision decimal behavior, a bitwise rewrite usually hides the real structure.
