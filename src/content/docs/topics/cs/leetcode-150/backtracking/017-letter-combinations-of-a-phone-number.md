---
title: "17. Letter Combinations of a Phone Number (Medium)"
description: Return all possible letter combinations that a phone-keypad string could represent.
parent: backtracking
tags: [leetcode, neetcode-150, backtracking, recursion, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Given a string of digits 2-9, return all possible letter combinations the digits could represent on a standard phone keypad. `1` has no letters; `0` is not in the input.

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
    for d in digits:                                     # L1: loop over n digits
        result = [prefix + ch for prefix in result for ch in mapping[d]]  # L2: extend each combo
    return result
```

**Where the time goes, line by line**

*Variables: n = len(digits), k = average letters per digit (3 or 4).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (outer loop) | O(1) overhead | n | O(n) |
| **L2 (list comprehension)** | **O(k · \|result\|)** | **n** | **O(k^n · n)** ← dominates |

After processing digit i, `result` has k^i entries each of length i. The comprehension at step i processes k^(i-1) × k entries. Total work is the sum over i of i × k^i = O(n · k^n).

**Complexity**
- **Time:** O(4^n · n) worst case, driven by L2 growing result at every step.
- **Space:** O(4^n · n) for the output.

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
            result.append("".join(path))  # L1: O(n) join when complete
            return
        for ch in mapping[digits[i]]:     # L2: loop over letters for digit i
            path.append(ch)               # L3: O(1) push
            backtrack(i + 1)              # L4: recurse
            path.pop()                    # L5: O(1) pop

    backtrack(0)
    return result
```

**Where the time goes, line by line**

*Variables: n = len(digits), k = average letters per digit (3 or 4).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (join + append) | O(n) | k^n leaves | O(k^n · n) |
| L2 (letter loop) | O(1) | k^n total | O(k^n) |
| **L3/L4/L5 (push/recurse/pop)** | **O(1)** | **k^n · n** | **O(k^n · n)** ← dominates |

The recursion tree has k^n leaves (one per combination) and n levels. Most work is at the leaves.

**Complexity**
- **Time:** O(4^n · n), driven by L1/L4 building k^n combinations of length n.
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
    return ["".join(p) for p in product(*(mapping[d] for d in digits))]  # L1: O(k^n · n)
```

**Where the time goes, line by line**

*Variables: n = len(digits), k = average letters per digit (3 or 4).*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1 (product + join)** | **O(n) per combo** | **k^n** | **O(k^n · n)** ← dominates |

**Complexity**
- **Time:** O(4^n · n).
- **Space:** O(4^n · n).

Production-correct; rarely accepted in an interview that wants the algorithm.

## Summary

| Approach | Time | Space |
| --- | --- | --- |
| Iterative cartesian product | O(4^n · n) | O(4^n · n) |
| **Backtracking DFS** | **O(4^n · n)** | **O(n)** recursion |
| `itertools.product` | O(4^n · n) | O(4^n · n) |

All optimal in time. Backtracking is smallest in recursion-stack terms and is the "show you understand the algorithm" interview answer.

## Test cases

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

def _run_tests():
    assert sorted(letter_combinations("23")) == sorted(["ad","ae","af","bd","be","bf","cd","ce","cf"])
    assert letter_combinations("") == []
    assert sorted(letter_combinations("2")) == ["a","b","c"]
    # digit 7 has 4 letters: pqrs
    assert sorted(letter_combinations("7")) == ["p","q","r","s"]
    # two-digit: 2+2 = 9 combinations
    assert len(letter_combinations("22")) == 9
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Hash Tables](../../../data-structures/hash-tables/), digit -> letters map
- [Strings](../../../data-structures/strings/), output
