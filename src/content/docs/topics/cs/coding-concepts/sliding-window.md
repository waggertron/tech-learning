---
title: Sliding Window
description: "Contiguous-range tactics for maintaining a valid subarray or substring while endpoints move forward."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-30
---

## Tactic

Sliding window keeps a contiguous range valid while the endpoints move forward. The right endpoint usually expands the window, and the left endpoint removes old items until the invariant is restored.

The invariant is the exact condition that makes the current window useful: no duplicate characters, sum at most a target, count deficits satisfied, or at most `k` replacements. The window can only be linear when both endpoints move in one direction.

Write the code around three questions: what enters when `right` moves, when is the window invalid, and what leaves when `left` moves. If the condition can become valid again only by moving backward, this is not a sliding window problem.

## Value

The value is avoiding repeated work over overlapping contiguous ranges. Adjacent windows share almost all of their contents, so the algorithm updates counts, sums, or a deque instead of rebuilding each range from scratch.

### Direct complexity example

- **Brute force:** Evaluate every substring or subarray and recompute its state: $O(n^2)$ time, often $O(k)$ space for each check.
- **With this tactic:** Move each endpoint forward at most `n` times: $O(n)$ time with $O(k)$ space for counts, or $O(1)$ space for a simple sum.
- **Space:** The space is the state needed to describe the window, such as a hash map of characters, a frequency array, or a monotonic deque for window extrema.

## Challenges this solves

- longest valid substring
- minimum covering substring
- fixed-size window aggregate
- at most k distinct values
- streaming range maximum with a monotonic queue

## When to use it

Use this tactic when these conditions are true:

- the answer is a contiguous subarray or substring
- adding on the right and removing on the left can maintain the condition
- the validity condition changes locally when one item enters or leaves
- the prompt asks for longest, shortest, or count of contiguous ranges

## When not to use it

Reach for a different tactic when these warning signs appear:

- the chosen elements do not need to be contiguous
- the condition is not monotonic under shrinking or expanding
- an item outside the range can change the score without entering the range
- the problem is really subsequence DP

## Terminology clues

These prompt words often point toward this concept:

- substring
- subarray
- contiguous
- window
- at most k
- longest without
- minimum window
- fixed length

## Problems that use it

- [3. Longest Substring Without Repeating Characters](../../coding-problems/sliding-window/003-longest-substring-without-repeating-characters/)
- [76. Minimum Window Substring](../../coding-problems/sliding-window/076-minimum-window-substring/)
- [209. Minimum Size Subarray Sum](../../coding-problems/sliding-window/209-minimum-size-subarray-sum/)
- [239. Sliding Window Maximum](../../coding-problems/sliding-window/239-sliding-window-maximum/)
- [424. Longest Repeating Character Replacement](../../coding-problems/sliding-window/424-longest-repeating-character-replacement/)
- [567. Permutation in String](../../coding-problems/sliding-window/567-permutation-in-string/)

## Related concepts

- [Two pointers](../two-pointers/)
- [Prefix sums](../prefix-sums/)
- [Monotonic queue](../monotonic-queue/)
