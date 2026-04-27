---
title: Math & Geometry
description: 8 problems covering matrix manipulation, cycle detection on numeric sequences, fast exponentiation, and big-integer tricks.
parent: leetcode-150
tags: [leetcode, neetcode-150, math, geometry]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

Math & Geometry is a grab-bag of problems where the algorithmic insight is often a specific math identity or matrix trick rather than a general pattern. Common techniques:

- **In-place matrix operations**, rotate via transpose + reverse; spiral walking with boundary shrinking.
- **Cycle detection on digit sequences**, Happy Number (Floyd's tortoise and hare).
- **Fast exponentiation**, Pow(x, n) by squaring.
- **Big-integer arithmetic on strings / grids**, Multiply Strings, Plus One.
- **Counting point configurations**, Detect Squares.

## Problems

1. [48. Rotate Image (Medium)](./048-rotate-image/)
2. [54. Spiral Matrix (Medium)](./054-spiral-matrix/)
3. [73. Set Matrix Zeroes (Medium)](./073-set-matrix-zeroes/)
4. [202. Happy Number (Easy)](./202-happy-number/)
5. [66. Plus One (Easy)](./066-plus-one/)
6. [50. Pow(x, n) (Medium)](./050-pow-x-n/)
7. [43. Multiply Strings (Medium)](./043-multiply-strings/)
8. [2013. Detect Squares (Medium)](./2013-detect-squares/)

## Key patterns unlocked here

- **Transpose + row-reverse**, Rotate Image.
- **Boundary-shrinking traversal**, Spiral Matrix.
- **Using first row/column as markers**, Set Matrix Zeroes (O(1) space).
- **Floyd's on numeric sequence**, Happy Number.
- **Digit-by-digit carry**, Plus One.
- **Exponentiation by squaring**, Pow(x, n).
- **Schoolbook multiplication on digit arrays**, Multiply Strings.
- **Point counting with hash map**, Detect Squares.
