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

- `add(point)` — add a 2D point (with possible duplicates).
- `count(point)` — count the number of axis-aligned squares whose corners include three stored points and the given query point.

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

## Approach 1: Brute force — pairwise check

On `count(p)`, scan every stored point pair and test whether they form a square with `p`.

**Complexity**
- `count`: O(n²).
- Space: O(n).

## Approach 2: Count map + diagonal fix (canonical)

Fix the query point `(qx, qy)`. For each stored point `(x, y)`:

- If `|x - qx| == |y - qy|` and neither is 0 → `(x, y)` is a diagonal corner of a square with `(qx, qy)`.
- The other two corners are `(x, qy)` and `(qx, y)`.
- Count the squares: `counts[(x, y)] * counts[(x, qy)] * counts[(qx, y)]`.

Use a `Counter` of points.

```python
from collections import defaultdict

class DetectSquares:
    def __init__(self):
        self.counts = defaultdict(int)
        self.points = set()   # distinct points for iteration

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
```

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
        self.counts[tuple(point)] += 1
        self.by_x[point[0]].add(point[1])

    def count(self, point):
        qx, qy = point
        total = 0
        for y in self.by_x[qx]:
            if y == qy:
                continue
            side = abs(y - qy)
            for dx in (-side, side):
                nx = qx + dx
                total += (self.counts.get((qx, y), 0)
                          * self.counts.get((nx, qy), 0)
                          * self.counts.get((nx, y), 0))
        return total
```

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

## Related data structures

- [Hash Tables](../../../data-structures/hash-tables/) — point-multiset counts; column index
