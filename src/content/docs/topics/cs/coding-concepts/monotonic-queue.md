---
title: Monotonic Queue
description: "Deque tactics for maintaining a window minimum or maximum as the window slides."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

A monotonic queue is a deque that keeps window candidates ordered by value. It supports adding on the right, removing expired indices from the left, and reading the current min or max at the front.

The invariant is that the deque contains only candidates that could still become the best value for the current or future window. Worse values behind a new better value are removed because they expire no later and are never needed.

Store indices, not just values. Indices let you remove items that fall out of the sliding window and handle duplicate values correctly.

## Value

The value is combining sliding window with constant-time extrema. You avoid sorting or rescanning each window.

### Direct complexity example

- **Brute force:** Compute each window maximum by scanning all `k` items: $O(nk)$ time.
- **With this tactic:** Maintain a monotonic deque where each index enters and leaves once: $O(n)$ time.
- **Space:** Space is $O(k)$ because the deque only stores candidates from the current window.

## Challenges this solves

- sliding window maximum
- sliding window minimum
- shortest subarray with constraints
- DP transition over a moving range

## When to use it

Use this tactic when these conditions are true:

- the problem asks for min or max inside every window
- window endpoints only move forward
- old items expire by index
- a worse newer or older candidate can be proven useless

## When not to use it

Reach for a different tactic when these warning signs appear:

- the window is not contiguous
- you need median or arbitrary order statistics rather than min or max
- updates can occur in the middle of the window
- a heap with lazy deletion is simpler for the constraints

## Terminology clues

These prompt words often point toward this concept:

- window maximum
- window minimum
- deque
- monotonic queue
- expire
- range max
- sliding
- front

## Problems that use it

- [76. Minimum Window Substring](../../coding-problems/sliding-window/076-minimum-window-substring/)
- [239. Sliding Window Maximum](../../coding-problems/sliding-window/239-sliding-window-maximum/)
- [424. Longest Repeating Character Replacement](../../coding-problems/sliding-window/424-longest-repeating-character-replacement/)

## Related concepts

- [Sliding window](../sliding-window/)
- [Monotonic stack](../monotonic-stack/)
- [Heap and priority queue](../heap-and-priority-queue/)
