---
title: "2013. Detect Squares"
description: Design a data structure that counts axis-aligned squares formed by stored points.
parent: math-and-geometry
tags: [leetcode, neetcode-150, math, hash-tables, design, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Design a data structure with:

- `add(point)`, add a 2D point (with possible duplicates).
- `count(point)`, count the number of axis-aligned squares whose corners include three stored points and the given query point.

**Example**
```
d = DetectSquares()
d.add([3,10]); d.add([11,2]); d.add([3,2])
d.count([11,10])  // 1
d.count([14,8])   // 0
d.add([11,2])
d.count([11,10])  // 2
```

LeetCode 2013 · [Link](https://leetcode.com/problems/detect-squares/) · *Medium*

## Approach 1: Brute force, pairwise check

On `count(p)`, scan every stored point pair and test whether they form a square with `p`.

**Complexity**
- `count`: O(n²).
- Space: O(n).

## Approach 2: Count map + diagonal fix (canonical)

Fix the query point `(qx, qy)`. For each stored point `(x, y)`:

- If `|x - qx| == |y - qy|` and neither is 0, `(x, y)` is a diagonal corner of a square with `(qx, qy)`.
- The other two corners are `(x, qy)` and `(qx, y)`.
- Count the squares: `counts[(x, y)] * counts[(x, qy)] * counts[(qx, y)]`.

Use a `Counter` of points.

```python
from collections import defaultdict

class DetectSquares:
    def __init__(self):
        self.counts = defaultdict(int)          # L1: O(1)
        self.points = set()                     # L2: O(1), distinct points for iteration

    def add(self, point):
        p = (point[0], point[1])
        self.counts[p] += 1                     # L3: O(1) amortized
        self.points.add(p)                      # L4: O(1) amortized

    def count(self, point):
        qx, qy = point
        total = 0
        for x, y in list(self.points):          # L5: iterate all distinct points, O(n)
            if abs(x - qx) == abs(y - qy) and x != qx and y != qy:  # L6: O(1)
                total += (self.counts[(x, y)]
                          * self.counts[(x, qy)]
                          * self.counts[(qx, y)])  # L7: O(1)
        return total
```

**Where the time goes, line by line**

*Variables: n = number of distinct stored points.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L3, L4 (add) | O(1) amortized | 1 per call | O(1) per add |
| **L5-L7 (count scan)** | **O(1)** | **n** | **O(n)** ← dominates |

`add` is O(1); `count` scans all distinct stored points.

**Complexity**
- `add`: O(1) amortized.
- `count`: O(n).
- Space: O(n).

## Approach 3: Hash-map keyed by x-coordinate

Maintain `by_x[x] = set of y's seen at that x`. On `count(qx, qy)`, iterate y's at `qx`, compute side length = |y - qy|, check the two other corners.

```python
from collections import defaultdict

class DetectSquares:
    def __init__(self):
        self.counts = defaultdict(int)
        self.by_x = defaultdict(set)

    def add(self, point):
        self.counts[tuple(point)] += 1          # L1: O(1)
        self.by_x[point[0]].add(point[1])       # L2: O(1)

    def count(self, point):
        qx, qy = point
        total = 0
        for y in self.by_x[qx]:                # L3: iterate y's at qx, O(k)
            if y == qy:
                continue
            side = abs(y - qy)                  # L4: O(1)
            for dx in (-side, side):            # L5: two candidate x offsets
                nx = qx + dx
                total += (self.counts.get((qx, y), 0)
                          * self.counts.get((nx, qy), 0)
                          * self.counts.get((nx, y), 0))  # L6: O(1)
        return total
```

**Where the time goes, line by line**

*Variables: n = total stored points, k = number of distinct y-values at the queried x-coordinate.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1, L2 (add) | O(1) amortized | 1 per call | O(1) per add |
| **L3-L6 (count scan)** | **O(1)** | **k** | **O(k)** ← dominates |

`count` is O(k) where k is distinct y-values at `qx`; worst case k = n if all points share the same x.

**Complexity**
- `add`: O(1) amortized.
- `count`: O(k) where k = number of distinct y's at `qx`.
- Space: O(n).

Slightly more efficient than Approach 2 when points cluster along few columns.

## Summary

| Approach | `count` time | Space |
| --- | --- | --- |
| Pairwise scan | O(n²) | O(n) |
| **Count map + diagonal fix** | **O(n)** | **O(n)** |
| Keyed by x-coordinate | O(k) per column | O(n) |

The "fix a diagonal corner, multiply counts of the other three" pattern applies to many "count configurations" problems.

## Test cases

```python
# Quick smoke tests, paste into a REPL or save as test_2013.py and run.
# Uses the canonical implementation (Approach 2: count map + diagonal fix).

from collections import defaultdict

class DetectSquares:
    def __init__(self):
        self.counts = defaultdict(int)
        self.points = set()

    def add(self, point):
        p = (point[0], point[1])
        self.counts[p] += 1
        self.points.add(p)

    def count(self, point):
        qx, qy = point
        total = 0
        for x, y in list(self.points):
            if abs(x - qx) == abs(y - qy) and x != qx and y != qy:
                total += (self.counts[(x, y)]
                          * self.counts[(x, qy)]
                          * self.counts[(qx, y)])
        return total

def _run_tests():
    d = DetectSquares()
    d.add([3, 10]); d.add([11, 2]); d.add([3, 2])
    assert d.count([11, 10]) == 1
    assert d.count([14, 8]) == 0
    d.add([11, 2])
    assert d.count([11, 10]) == 2   # duplicate point doubles the count

    d2 = DetectSquares()
    assert d2.count([0, 0]) == 0   # empty data structure

    d3 = DetectSquares()
    d3.add([0, 0]); d3.add([2, 0]); d3.add([0, 2]); d3.add([2, 2])
    assert d3.count([0, 0]) == 1   # query is itself a corner of the square

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Hash Tables](../../../data-structures/hash-tables/), point-multiset counts; column index
