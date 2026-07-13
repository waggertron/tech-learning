---
title: Top K
description: "Selection tactics for finding the largest, smallest, or most frequent K items without fully ordering everything."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Top K keeps only the best `k` items under a ranking. The ranking can be value, distance, frequency, timestamp, or any comparable score.

The invariant is the threshold item. In a min-heap of the largest `k` values, the heap root is the smallest kept value. Any new value no better than that root can be ignored.

There are three common approaches: sort everything, keep a bounded heap, or use quickselect when order inside the top group is irrelevant. Pick from constraints and whether the data is streaming.

## Value

The value is avoiding full ordering when only a prefix of the order matters. For large `n` and small `k`, the saving is substantial.

### Direct complexity example

- **Brute force:** Sort all `n` items to take the best `k`: $O(n \log n)$ time.
- **With this tactic:** Use a bounded heap: $O(n \log k)$ time and $O(k)$ space. Quickselect can average $O(n)$ time with $O(1)$ extra space when mutation is allowed.
- **Space:** If the answer requires sorted top-K output, add $O(k \log k)$ time to order the final group.

## Challenges this solves

- kth largest
- k closest points
- top frequent elements
- streaming leaderboard
- smallest k pairs

## When to use it

Use this tactic when these conditions are true:

- the prompt names K
- only the best K items are needed
- K is much smaller than n
- data arrives as a stream or full sorting is wasteful

## When not to use it

Reach for a different tactic when these warning signs appear:

- the entire sorted order is required
- K is close to n and sorting is simpler
- the ranking is not comparable or changes globally
- exact top-K is unnecessary and approximate sketches are allowed in a system setting

## Terminology clues

These prompt words often point toward this concept:

- top K
- kth largest
- k closest
- most frequent
- smallest K
- stream
- rank
- priority

## Problems that use it

- [215. Kth Largest Element in an Array](../../coding-problems/heap-priority-queue/215-kth-largest-element-in-an-array/)
- [347. Top K Frequent Elements](../../coding-problems/arrays-and-hashing/347-top-k-frequent-elements/)
- [703. Kth Largest Element in a Stream](../../coding-problems/heap-priority-queue/703-kth-largest-element-in-a-stream/)
- [973. K Closest Points to Origin](../../coding-problems/heap-priority-queue/973-k-closest-points-to-origin/)

## Related concepts

- [Heap and priority queue](../heap-and-priority-queue/)
- [Hash map counting](../hash-map-counting/)
- [Divide and conquer](../divide-and-conquer/)
