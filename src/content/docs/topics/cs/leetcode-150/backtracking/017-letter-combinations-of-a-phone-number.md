---
title: "17. Letter Combinations of a Phone Number"
description: Return all possible letter combinations that a phone-keypad string could represent.
parent: backtracking
tags: [leetcode, neetcode-150, backtracking, recursion, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string of digits 2–9, return all possible letter combinations the digits could represent on a standard phone keypad. `1` has no letters; `0` is not in the input.

```
2: "abc", 3: "def", 4: "ghi", 5: "jkl",
6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz"
```

**Example**
- `digits = "23"` → `["ad","ae","af","bd","be","bf","cd","ce","cf"]`
- `digits = ""` → `[]`
- `digits = "2"` → `["a","b","c"]`

LeetCode 17 · [Link](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) · *Medium*

## Approach 1: Iterative cartesian product

Build combinations digit-by-digit, extending each partial string with each letter of the next digit.

```python
def letter_combinations(digits):
    if not digits:
        return []
    mapping = {"2":"abc","3":"def","4":"ghi","5":"jkl",
               "6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}
    result = [""]
    for d in digits:
        result = [prefix + ch for prefix in result for ch in mapping[d]]
    return result
```

**Complexity**
- **Time:** O(4ⁿ · n) worst case. Up to 4 letters per digit, n digits.
- **Space:** O(4ⁿ · n) for the output.

## Approach 2: Backtracking DFS (canonical)

Recursively build one combination at a time.

```python
def letter_combinations(digits):
    if not digits:
        return []
    mapping = {"2":"abc","3":"def","4":"ghi","5":"jkl",
               "6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}
    result = []
    path = []

    def backtrack(i):
        if i == len(digits):
            result.append("".join(path))
            return
        for ch in mapping[digits[i]]:
            path.append(ch)
            backtrack(i + 1)
            path.pop()

    backtrack(0)
    return result
```

**Complexity**
- **Time:** O(4ⁿ · n).
- **Space:** O(n) recursion + output.

## Approach 3: `itertools.product`

Python one-liner using the standard library.

```python
from itertools import product

def letter_combinations(digits):
    if not digits:
        return []
    mapping = {"2":"abc","3":"def","4":"ghi","5":"jkl",
               "6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}
    return ["".join(p) for p in product(*(mapping[d] for d in digits))]
```

**Complexity**
- **Time:** O(4ⁿ · n).
- **Space:** O(4ⁿ · n).

Production-correct; rarely accepted in an interview that wants the algorithm.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Iterative cartesian product | O(4ⁿ · n) | O(4ⁿ · n) |
| **Backtracking DFS** | **O(4ⁿ · n)** | **O(n)** recursion |
| `itertools.product` | O(4ⁿ · n) | O(4ⁿ · n) |

All optimal in time. Backtracking is smallest in recursion-stack terms and is the "show you understand the algorithm" interview answer.

## Related data structures

- [Hash Tables](../../../data-structures/hash-tables/), digit → letters map
- [Strings](../../../data-structures/strings/), output
