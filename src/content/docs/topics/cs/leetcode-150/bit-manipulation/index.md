---
title: Bit Manipulation
description: 7 problems that live at the level of the CPU, XOR identities, popcount, bit tricks, and emulating arithmetic with bitwise ops.
parent: leetcode-150
tags: [leetcode, neetcode-150, bit-manipulation]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Bit manipulation is a small but powerful toolkit. Memorize the primitives:

- **XOR identities**, `a ^ a = 0`, `a ^ 0 = a`, XOR is commutative and associative. Used for "find the unique element."
- **Brian Kernighan's trick**, `n & (n, 1)` clears the lowest set bit. Counts set bits in O(popcount).
- **Bit-wise iteration**, `n & 1` tests the LSB; `n >>= 1` shifts right.
- **Sum without `+`**, `a ^ b` is sum-without-carry, `(a & b) << 1` is the carry. Loop until carry = 0.

## Problems

1. [136. Single Number](./136-single-number/), *Easy*
2. [191. Number of 1 Bits](./191-number-of-1-bits/), *Easy*
3. [338. Counting Bits](./338-counting-bits/), *Easy*
4. [190. Reverse Bits](./190-reverse-bits/), *Easy*
5. [268. Missing Number](./268-missing-number/), *Easy*
6. [371. Sum of Two Integers](./371-sum-of-two-integers/), *Medium*
7. [7. Reverse Integer](./007-reverse-integer/), *Medium*

## Key patterns unlocked here

- **XOR of all elements**, Single Number.
- **Popcount via shift or Kernighan**, Number of 1 Bits.
- **DP using `popcount(i) = popcount(i >> 1) + (i & 1)`**, Counting Bits.
- **Bit-by-bit reversal**, Reverse Bits.
- **XOR-of-indices-XOR-of-values**, Missing Number.
- **XOR + carry for `+`**, Sum of Two Integers (language-dependent).
- **Digit-by-digit with overflow check**, Reverse Integer.
