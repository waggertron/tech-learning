---
title: Monotonic Queue
description: "Deque tactics for maintaining a window minimum or maximum as the window slides."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

A monotonic queue stores candidate indices in value order. Expired indices leave the front, and dominated values leave the back.

## Value

The value is constant-time window extrema after amortized updates. It is the sliding-window partner to monotonic stack.

## Challenges this solves

- sliding window maximum
- window minimum
- bounded range constraints
- deque-based DP optimization

## When to use it

Use it when each window needs a min or max and the window moves one step at a time.

## When not to use it

Do not use it when windows are arbitrary and not processed in order. A heap or segment tree may fit better.

## Terminology clues

- sliding window maximum
- window minimum
- deque
- monotonic
- maximum in each window

## Problems that use it

- [239. Sliding Window Maximum](../coding-problems/sliding-window/239-sliding-window-maximum/)
- [76. Minimum Window Substring](../coding-problems/sliding-window/076-minimum-window-substring/)
- [424. Longest Repeating Character Replacement](../coding-problems/sliding-window/424-longest-repeating-character-replacement/)

## Related concepts

- [Sliding window](./sliding-window/)
- [Monotonic stack](./monotonic-stack/)
- [Heap and priority queue](./heap-and-priority-queue/)
