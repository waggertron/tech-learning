---
title: Heaps / Priority Queues
description: Tree-backed structures satisfying the heap property — O(1) find-min/max, O(log n) push/pop. The go-to for top-K, k-way merge, and Dijkstra.
parent: data-structures
tags: [data-structures, heaps, priority-queue, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

A **heap** is a tree-based structure satisfying the heap property: in a min-heap, every parent ≤ its children; in a max-heap, every parent ≥ its children. **Priority queue** is the abstract type; a binary heap is the standard implementation. Heaps give O(1) find-min/max and O(log n) push/pop — the optimal tradeoff for problems that need "quickly give me the smallest/largest element, then update."

## In-depth description

A binary heap is almost always implemented as an **array** using index arithmetic, not explicit pointers:

- Parent of index `i`: `(i - 1) // 2`
- Left child of `i`: `2*i + 1`
- Right child of `i`: `2*i + 2`

This keeps memory compact and cache-friendly. The heap is a *complete* binary tree (filled left-to-right at each level), which is exactly what this array layout represents.

Two fundamental operations maintain the invariant:

- **Heapify-up (sift-up)** — after push, bubble the new element up until the heap property holds.
- **Heapify-down (sift-down)** — after pop of the root, move the last element to the root and sink it down.

**Building a heap from an unsorted array is O(n)**, not O(n log n), via bottom-up heapify. This is a common interview gotcha.

Standard library specifics:

- **Python** `heapq` — min-heap over a list. For max-heap, negate values or store tuples `(-priority, item)`.
- **Java** `PriorityQueue` — min-heap by default; pass a comparator for max-heap.
- **C++** `std::priority_queue` — *max*-heap by default.

**Top-K pattern** — to find the K largest elements in a stream, maintain a min-heap of size K. Each new element costs O(log K); total O(n log K) for n elements. Dramatically better than sorting (O(n log n)) when K is small.

## Time complexity

| Operation | Time |
| --- | --- |
| Find min / max | O(1) |
| Insert (push) | O(log n) |
| Extract min / max | O(log n) |
| Heapify an existing array | O(n) |
| Delete arbitrary element | O(log n) (if index known) |
| Space | O(n) |

## Common uses in DSA

1. **Top-K / Kth largest** — Kth Largest Element in an Array, Top K Frequent Elements, K Closest Points to Origin.
2. **K-way merge** — Merge K Sorted Lists, Find K Pairs with Smallest Sums, Kth Smallest Element in a Sorted Matrix.
3. **Dijkstra's shortest path** — priority queue of `(distance, node)`; always expand the closest unvisited node.
4. **Interval / scheduling problems** — Meeting Rooms II (min-heap of end times), Reorganize String, Task Scheduler.
5. **Running median on a stream** — two heaps: max-heap over the lower half, min-heap over the upper half; median is at the top of one (or the average of both tops).

**Canonical LeetCode problems:** #23 Merge K Sorted Lists, #295 Find Median from Data Stream, #347 Top K Frequent Elements, #355 Design Twitter, #621 Task Scheduler, #703 Kth Largest Element in a Stream, #973 K Closest Points to Origin.

## Python example

```python
import heapq

# Min-heap basics (Python's default)
h = []
heapq.heappush(h, 3)
heapq.heappush(h, 1)
heapq.heappush(h, 2)
heapq.heappop(h)       # 1
heapq.heappop(h)       # 2

# Max-heap via negation
h = []
for x in [3, 1, 2]:
    heapq.heappush(h, -x)
-heapq.heappop(h)      # 3

# Build a heap from an existing list in O(n)
nums = [5, 3, 8, 1, 9, 2]
heapq.heapify(nums)    # nums is now a valid min-heap, in place

# Top-K largest elements: O(n log k) via size-k min-heap
def top_k_largest(nums, k):
    heap = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap      # unsorted; smallest of top-k at heap[0]

# Or simply:
heapq.nlargest(3, nums)   # [9, 8, 5]

# K closest points to origin
def k_closest(points, k):
    return heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)

# Running median with two heaps
class MedianFinder:
    def __init__(self):
        self.lo = []  # max-heap (negated)
        self.hi = []  # min-heap
    def add(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))
    def median(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2
```

## LeetCode problems

**NeetCode 150 — Arrays & Hashing:**
- [347. Top K Frequent Elements](../../leetcode-150/arrays-and-hashing/347-top-k-frequent-elements/) — size-k min-heap approach

**NeetCode 150 — Sliding Window:**
- [239. Sliding Window Maximum](../../leetcode-150/sliding-window/239-sliding-window-maximum/) — lazy-deletion max-heap alternative

**NeetCode 150 — Linked List:**
- [23. Merge k Sorted Lists](../../leetcode-150/linked-list/023-merge-k-sorted-lists/) — min-heap of k heads

*More coming soon — the Heap/Priority Queue category itself (K Closest Points, Find Median from Data Stream) plus Dijkstra problems in Graphs.*

## References

- [Heap (data structure) — Wikipedia](https://en.wikipedia.org/wiki/Heap_(data_structure))
- [Python heapq docs](https://docs.python.org/3/library/heapq.html)
- [Dijkstra's algorithm with a heap — cp-algorithms](https://cp-algorithms.com/graph/dijkstra.html)
- [CLRS Chapter 6: Heapsort](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)
