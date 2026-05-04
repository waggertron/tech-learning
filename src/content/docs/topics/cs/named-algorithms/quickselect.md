---
title: "Quickselect"
description: "Find the kth smallest element in expected O(n) time by partitioning like quicksort but only recursing into the half that contains the target rank."
parent: named-algorithms
tags: [algorithms, sorting, arrays, partitioning, interviews]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it does

Given an unsorted array and a target rank `k`, Quickselect returns the `k`th smallest element in **expected O(n) time** without fully sorting the array.

It's the canonical answer to "find the kth largest" interview questions and is the engine behind LeetCode 215 and 973. Named after Tony Hoare (also the inventor of Quicksort), who published it in 1961.

The key insight: you do not need a sorted array to know where one element ranks. A single partition operation places the pivot in its final sorted position and tells you instantly whether the target rank is to the left, to the right, or right here.

## The core idea, in one sentence

> After partitioning around a pivot, the pivot lands at its final sorted position. If that position equals `k`, you are done. If `k` is smaller, recurse left. If `k` is larger, recurse right.

That single decision, eliminate the half that cannot contain the answer, is the entire algorithm. Unlike Quicksort, which recurses into both halves, Quickselect recurses into exactly one.

## The Lomuto partition scheme

Lomuto is the simpler of the two common partition schemes. It uses a single forward-scan pointer and always picks the last element as the pivot.

The invariant after each pass:

```
  [elements <= pivot | elements > pivot | pivot]
  ^                  ^                  ^
  0..store-1         store..j-1         end
```

```python
def lomuto_partition(arr, lo, hi):
    pivot = arr[hi]          # always pick the last element
    store = lo               # everything left of 'store' is <= pivot

    for j in range(lo, hi):
        if arr[j] <= pivot:
            arr[store], arr[j] = arr[j], arr[store]
            store += 1

    arr[store], arr[hi] = arr[hi], arr[store]   # place pivot in its slot
    return store                                 # pivot's final index
```

After this function returns, `arr[store]` is in its correct sorted position. Everything at indices `< store` is smaller or equal; everything at indices `> store` is larger. The pivot never moves again.

## The Quickselect algorithm

With `lomuto_partition` in hand, Quickselect is a loop that narrows the search window:

```python
def quickselect(arr, k):
    """Return the kth smallest element (k is 0-indexed)."""
    lo, hi = 0, len(arr) - 1

    while lo < hi:
        pivot_idx = lomuto_partition(arr, lo, hi)

        if pivot_idx == k:
            return arr[pivot_idx]       # lucky: pivot landed exactly at k
        elif k < pivot_idx:
            hi = pivot_idx - 1          # target is in the left half
        else:
            lo = pivot_idx + 1          # target is in the right half

    return arr[lo]                      # lo == hi, single element remaining
```

This is the iterative form. It is equivalent to the recursive version but avoids call-stack overhead. The array is modified in place; call on a copy if you need to preserve the original.

## Walk through: find the 3rd smallest in `[3, 1, 5, 2, 4]`

Target: `k = 2` (0-indexed, so the 3rd smallest).

**Initial state:**

```
arr = [3, 1, 5, 2, 4]
lo=0, hi=4, target k=2
```

**Step 1: partition with pivot = arr[4] = 4**

Scan left to right, move elements <= 4 to the front:

```
j=0: arr[0]=3 <= 4  ->  swap(0,0), store=1   [3, 1, 5, 2, 4]
j=1: arr[1]=1 <= 4  ->  swap(1,1), store=2   [3, 1, 5, 2, 4]
j=2: arr[2]=5 >  4  ->  no swap              [3, 1, 5, 2, 4]
j=3: arr[3]=2 <= 4  ->  swap(2,3), store=3   [3, 1, 2, 5, 4]

place pivot: swap(3,4)  ->  [3, 1, 2, 4, 5]
pivot_idx = 3
```

Pivot `4` is now at index 3. `k=2 < 3`, so recurse left: `hi = 2`.

**Step 2: partition `[3, 1, 2]` with pivot = arr[2] = 2**

```
j=0: arr[0]=3 >  2  ->  no swap              [3, 1, 2]
j=1: arr[1]=1 <= 2  ->  swap(0,1), store=1   [1, 3, 2]

place pivot: swap(1,2)  ->  [1, 2, 3]
pivot_idx = 1
```

Pivot `2` is at index 1. `k=2 > 1`, so recurse right: `lo = 2`.

**Step 3: lo == hi == 2**

Loop exits. `arr[2] = 3`. The 3rd smallest element is **3**.

Final array state: `[1, 2, 3, 4, 5]` (the subarray got sorted as a side effect, but only within the window we touched).

## Complexity

| Metric       | Cost                      | Notes                                        |
| ------------ | ------------------------- | -------------------------------------------- |
| Time (avg)   | O(n) expected             | Geometric series, see below                  |
| Time (worst) | O(n^2)                    | Sorted input with always-last-element pivot  |
| Space        | O(1) iterative            | No recursion stack in the iterative form     |
| Space        | O(n) recursive worst case | Recursion depth equals partition imbalance   |

## Why expected O(n)

When the pivot splits the array roughly in half each time, the work per level halves:

```
Level 0: n  elements to scan
Level 1: n/2 elements to scan
Level 2: n/4 elements to scan
...

Total = n + n/2 + n/4 + n/8 + ...
      = n * (1 + 1/2 + 1/4 + ...)
      = n * 2
      = 2n
      = O(n)
```

This is the geometric series converging to 2n. A perfect 50/50 split is not required. Any split with a constant fraction of the array in each side (say 25/75) still gives a geometric series, and that series still converges to O(n).

The expected qualifier exists because the pivot position is random. On average over all possible pivot choices, the split is close enough to 50/50 for the series to dominate. With adversarial input where every pivot is always the minimum or maximum, every partition eliminates only one element, giving T(n) = T(n-1) + n, which solves to O(n^2).

## Randomized pivot: making worst case extremely unlikely

The one-line fix that makes adversarial inputs irrelevant in practice:

```python
import random

def lomuto_partition(arr, lo, hi):
    # Swap a random element into the last slot before partitioning
    rand_idx = random.randint(lo, hi)
    arr[rand_idx], arr[hi] = arr[hi], arr[rand_idx]

    pivot = arr[hi]
    store = lo
    for j in range(lo, hi):
        if arr[j] <= pivot:
            arr[store], arr[j] = arr[j], arr[store]
            store += 1
    arr[store], arr[hi] = arr[hi], arr[store]
    return store
```

With a randomized pivot, the probability of hitting the worst case repeatedly is astronomically small. For any fixed input, the expected runtime is O(n) regardless of input order. This is the version to use in practice.

## Median-of-medians: O(n) worst-case guaranteed

If you need guaranteed O(n) worst case (not just expected), the **median-of-medians** algorithm achieves it by choosing a provably good pivot:

1. Divide the array into groups of 5.
2. Find the median of each group (by sorting each group of 5, which costs O(1) per group).
3. Recursively find the median of those medians.
4. Use that median-of-medians as the pivot.

The resulting pivot is guaranteed to be between the 30th and 70th percentile of the array. That means each partition eliminates at least 30% of the elements. The recurrence is T(n) = T(n/5) + T(7n/10) + O(n), which solves to O(n).

In practice, median-of-medians is roughly 5x slower than randomized Quickselect due to the constant factors in the pivot-finding step. For real workloads, randomized Quickselect is always preferred. Median-of-medians matters for theoretical guarantees, adversarial inputs, or real-time systems where worst-case latency is a hard constraint.

## Hoare vs. Lomuto partition

Both partition schemes work correctly with Quickselect. They differ in mechanics and performance:

```
Lomuto:
  - Pivot: arr[hi], placed at its final position in one pass
  - One pointer (store) scanning forward
  - ~3x more swaps on average than Hoare
  - Simpler to read and reason about
  - Breaks on arrays of all-equal elements without a three-way partition

Hoare:
  - Pivot: arr[lo] (or any element), NOT placed in its final position
  - Two pointers (lo, hi) marching toward each other
  - Fewer swaps on average
  - Returns a split index, not the pivot's final index: requires adjustment in Quickselect
  - Slightly harder to implement correctly
```

For learning and interviews, Lomuto is the one to know cold. In production libraries, Hoare (or its variants like the fat-partition / Dutch National Flag variant) is preferred because fewer swaps matter at scale.

The Dutch National Flag variant (three-way partition) handles duplicates efficiently: it partitions into `[< pivot | == pivot | > pivot]`. If your array has many repeated elements and the target rank falls in the equal segment, you are done immediately.

## Application: LeetCode 215, Kth Largest Element in an Array

"Find the kth largest element in an unsorted array."

Kth largest is equivalent to `(n - k)`th smallest (0-indexed). Translate the rank once at the top and then call standard Quickselect:

```python
import random

def find_kth_largest(nums, k):
    """LeetCode 215. Returns the kth largest element."""
    target = len(nums) - k     # convert: kth largest = (n-k)th smallest

    def partition(lo, hi):
        rand_idx = random.randint(lo, hi)
        nums[rand_idx], nums[hi] = nums[hi], nums[rand_idx]
        pivot = nums[hi]
        store = lo
        for j in range(lo, hi):
            if nums[j] <= pivot:
                nums[store], nums[j] = nums[j], nums[store]
                store += 1
        nums[store], nums[hi] = nums[hi], nums[store]
        return store

    lo, hi = 0, len(nums) - 1
    while lo < hi:
        idx = partition(lo, hi)
        if idx == target:
            return nums[idx]
        elif target < idx:
            hi = idx - 1
        else:
            lo = idx + 1

    return nums[lo]
```

Example: `nums = [3, 2, 1, 5, 6, 4]`, `k = 2`. The 2nd largest is `5`. Target index = `6 - 2 = 4`. Quickselect finds `nums[4] = 5` after at most a few partitions.

Detailed walkthrough: [LeetCode 215, Kth Largest Element in an Array](../leetcode-150/heap-priority-queue/215-kth-larget-element-in-an-array/).

## Application: LeetCode 973, K Closest Points to Origin

"Given a list of points, return the k closest to the origin."

The key insight: you only need to partition on Euclidean distance. You do not need to compute `sqrt` because comparing squared distances preserves order:

```python
import random

def k_closest(points, k):
    """LeetCode 973. Returns the k closest points to origin."""

    def dist_sq(p):
        return p[0] ** 2 + p[1] ** 2

    def partition(lo, hi):
        rand_idx = random.randint(lo, hi)
        points[rand_idx], points[hi] = points[hi], points[rand_idx]
        pivot_d = dist_sq(points[hi])
        store = lo
        for j in range(lo, hi):
            if dist_sq(points[j]) <= pivot_d:
                points[store], points[j] = points[j], points[store]
                store += 1
        points[store], points[hi] = points[hi], points[store]
        return store

    lo, hi = 0, len(points) - 1
    target = k - 1            # 0-indexed: we want indices 0..k-1 in final position

    while lo < hi:
        idx = partition(lo, hi)
        if idx == target:
            break
        elif target < idx:
            hi = idx - 1
        else:
            lo = idx + 1

    return points[:k]
```

After the loop, `points[0..k-1]` contains the k closest points (not necessarily sorted among themselves). The partition ensures every point in `points[:k]` is closer than every point in `points[k:]`.

Detailed walkthrough: [LeetCode 973, K Closest Points to Origin](../leetcode-150/heap-priority-queue/973-k-closest-points-to-origin/).

## When a heap beats Quickselect

Quickselect modifies the input array. A min-heap or max-heap keeps the array intact and can be better in specific situations:

| Scenario                        | Quickselect      | Heap                  | Prefer      |
| ------------------------------- | ---------------- | --------------------- | ----------- |
| k is tiny (k << n)              | O(n) always      | O(n + k log n)        | Heap for small k |
| k is large (k close to n)       | O(n) always      | O(n + k log n) = O(n log n) | Quickselect |
| Data arrives as a stream        | Not applicable   | O(n log k)            | Heap        |
| Array must stay unmodified      | Need a copy      | Reads only            | Heap        |
| Average case, array in memory   | O(n) expected    | O(n log k)            | Quickselect |

The crossover for "tiny k" is roughly when `k log n < n`, which at `n = 10^6` means k under about 50,000. In practice, if you are finding the single minimum or maximum, a single linear scan beats both.

For streaming data (elements arrive one at a time), a max-heap of size k is the standard approach: push each new element, pop if size exceeds k. Final heap contains the k smallest. That is O(n log k) overall and works without loading the full array into memory.

## Things that are not Quickselect

- **Sorting the whole array then indexing**: O(n log n) and correct, but slower for a single rank query.
- **Building a heap and popping k times**: O(n + k log n), reasonable for small k, not for large k.
- **Binary search on value range**: works only on bounded integers (counting sort territory), not general comparisons.
- **nth_element in C++ STL**: that is exactly Quickselect (introsort variant), already in your standard library if you use C++.

If the problem asks for the top-k elements (not just one), Quickselect still applies: after the partition the first k elements are the k smallest (unordered). If you need them sorted, sort just those k in O(k log k).

## LeetCode exercises

- [215, Kth Largest Element in an Array](../leetcode-150/heap-priority-queue/215-kth-larget-element-in-an-array/)
- [973, K Closest Points to Origin](../leetcode-150/heap-priority-queue/973-k-closest-points-to-origin/)

## Test cases

```python
import random

def quickselect(arr, k):
    """Return the kth smallest (0-indexed). Modifies arr in place."""
    arr = arr[:]   # copy so tests are independent
    lo, hi = 0, len(arr) - 1

    def partition(lo, hi):
        rand_idx = random.randint(lo, hi)
        arr[rand_idx], arr[hi] = arr[hi], arr[rand_idx]
        pivot = arr[hi]
        store = lo
        for j in range(lo, hi):
            if arr[j] <= pivot:
                arr[store], arr[j] = arr[j], arr[store]
                store += 1
        arr[store], arr[hi] = arr[hi], arr[store]
        return store

    while lo < hi:
        idx = partition(lo, hi)
        if idx == k:
            return arr[idx]
        elif k < idx:
            hi = idx - 1
        else:
            lo = idx + 1

    return arr[lo]

def _run_tests():
    # Basic cases
    assert quickselect([3, 1, 5, 2, 4], 0) == 1    # smallest
    assert quickselect([3, 1, 5, 2, 4], 2) == 3    # 3rd smallest
    assert quickselect([3, 1, 5, 2, 4], 4) == 5    # largest
    # Single element
    assert quickselect([42], 0) == 42
    # All equal
    assert quickselect([7, 7, 7, 7], 2) == 7
    # Duplicates
    assert quickselect([3, 1, 3, 2, 3], 2) == 3
    assert quickselect([3, 1, 3, 2, 3], 1) == 2
    # Already sorted
    assert quickselect([1, 2, 3, 4, 5], 3) == 4
    # Reverse sorted
    assert quickselect([5, 4, 3, 2, 1], 1) == 2
    # Negatives
    assert quickselect([-3, -1, -4, -1, -5, -9], 0) == -9
    assert quickselect([-3, -1, -4, -1, -5, -9], 5) == -1
    # Two elements
    assert quickselect([2, 1], 0) == 1
    assert quickselect([2, 1], 1) == 2
    # Verify against sorted reference on random inputs
    for _ in range(200):
        arr = [random.randint(-100, 100) for _ in range(random.randint(1, 50))]
        k = random.randint(0, len(arr) - 1)
        expected = sorted(arr)[k]
        assert quickselect(arr, k) == expected, f"Failed: arr={arr}, k={k}"

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

The fuzz loop at the end runs 200 random trials against a sorted reference. If any partition logic is off, it will surface quickly.

## References

- Hoare, C. A. R. (1961). "Algorithm 65: Find." *Communications of the ACM*, 4(7), 321-322. The original paper.
- Blum, M., Floyd, R., Pratt, V., Rivest, R., and Tarjan, R. (1973). "Time bounds for selection." *Journal of Computer and System Sciences*, 7(4), 448-461. The median-of-medians proof.
- Sedgewick, R. and Wayne, K. (2011). *Algorithms, 4th edition.* Addison-Wesley. Chapter 2.5 covers selection in depth with Hoare's original scheme.

## Related topics

- [Kadane's algorithm](./kadane/), another named linear-time algorithm
- [LeetCode 215 and 973 (Heap / Priority Queue)](../leetcode-150/heap-priority-queue/), the two canonical Quickselect problems
- [Data Structures](../data-structures/), arrays and heaps underlying these algorithms
