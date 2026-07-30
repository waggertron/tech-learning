---
title: Sliding Window
description: "9 problems that teach the sliding-window pattern, maintaining a dynamic contiguous range over an array or string to reduce O(n²) to O(n)."
parent: coding-problems
tags: [leetcode, neetcode-150, sliding-window]
status: draft
created: 2026-04-23
updated: 2026-07-30
---

## Contiguous range state

A sliding window is a pair of indices `[left, right]` that defines a contiguous range. At each step, you *expand* (move `right`) or *contract* (move `left`) to maintain an invariant, distinct characters, bounded frequency, sum ≤ target, etc. Each element enters and leaves the window at most once, so total work is $O(n)$ even though the window size varies.

There are two flavors:

- **Variable-size window**: common for "longest/shortest substring satisfying X." Expand `right`; when the invariant breaks, contract `left` until it holds again.
- **Fixed-size window**: common for "max/min over every window of size k." Slide `right` forward by one and `left` forward by one in lockstep.

Sliding window is a state-management pattern, not just two indices. The window needs enough state to answer "is the current range valid?" That state may be a set, a frequency map, a count of matched characters, a running sum, or a monotonic deque.

## How to choose the window state

| Prompt shape | Window state | Typical move |
| --- | --- | --- |
| Longest substring without repeats | Set or last-seen map | Shrink or jump `left` when a duplicate appears. |
| Longest range after at most k edits | Frequency counts plus the best repeated count | Shrink when edits needed exceed k. |
| Permutation or anagram in a string | Fixed-size frequency comparison | Add right char, remove left char, track matches. |
| Minimum substring covering required chars | Need/have counters | Expand until valid, shrink while still valid. |
| Maximum over every fixed window | Monotonic deque | Drop stale indices and weaker candidates. |
| Subarray sum with arbitrary signs | Prefix sum + hash map | A normal window fails because sums are not monotonic. |

The key test is whether moving `right` and `left` changes validity in a predictable direction. For positive numbers, a sum grows when `right` expands and shrinks when `left` contracts. With negative numbers, that monotonic behavior disappears, so prefix sums are usually safer.

## Problems

1. [121. Best Time to Buy and Sell Stock (Easy)](./121-best-time-to-buy-and-sell-stock/)
2. [3. Longest Substring Without Repeating Characters (Medium)](./003-longest-substring-without-repeating-characters/)
3. [424. Longest Repeating Character Replacement (Medium)](./424-longest-repeating-character-replacement/)
4. [567. Permutation in String (Medium)](./567-permutation-in-string/)
5. [76. Minimum Window Substring (Hard)](./076-minimum-window-substring/)
6. [239. Sliding Window Maximum (Hard)](./239-sliding-window-maximum/)

**Bonus problems (same pattern, outside NeetCode 150):**

- [28. Find the Index of the First Occurrence in a String (Easy)](./028-find-the-index-of-the-first-occurrence/) -- $O(n*m)$ sliding window over character windows.
- [209. Minimum Size Subarray Sum (Medium)](./209-minimum-size-subarray-sum/) -- $O(n)$ variable window over positive-integer sums.
- [560. Subarray Sum Equals K (Medium)](./560-subarray-sum-equals-k/) -- prefix sum + hash map; the window isn't contiguous in the traditional sense but uses the same "complement in a map" idea.

## Key patterns unlocked here

- **Running best + single pass**: Buy/Sell Stock; the "one-pass min-tracking" template.
- **Hash set / map as window state**: Longest Substring Without Repeating.
- **Window + frequency count with max-freq invariant**: Longest Repeating Character Replacement.
- **Anagram detection with matching counters**: Permutation in String.
- **Two-counter tracking (have vs. need)**: Minimum Window Substring.
- **Positive-sum shrink loop**: Minimum Size Subarray Sum.
- **Monotonic deque for window min/max**: Sliding Window Maximum.
- **Prefix sum + hash map for subarray sum problems**: Subarray Sum Equals K.

## Common mistakes

- Shrinking the window only once when it may need to shrink repeatedly.
- Updating the best answer before the invariant is valid.
- Treating every "subarray sum" prompt as sliding window. Negative numbers usually break the pattern.
- Recomputing window counts from scratch. The point is incremental state.
- Forgetting to remove stale indices from a monotonic deque.

## How the problems fit together

[Best Time to Buy and Sell Stock](./121-best-time-to-buy-and-sell-stock/) is the lightest version: a one-pass running minimum acts like a collapsed window. [Longest Substring Without Repeating Characters](./003-longest-substring-without-repeating-characters/) teaches variable-size validity. [Longest Repeating Character Replacement](./424-longest-repeating-character-replacement/) adds a less obvious invariant: window length minus max frequency is the edit count.

[Permutation in String](./567-permutation-in-string/) and [Minimum Window Substring](./076-minimum-window-substring/) are frequency-map problems. The first is fixed-size. The second is variable-size and asks for the smallest valid range. [Minimum Size Subarray Sum](./209-minimum-size-subarray-sum/) is the numeric version where positivity makes the shrink loop valid. [Sliding Window Maximum](./239-sliding-window-maximum/) shows why a window sometimes needs a second data structure. [Subarray Sum Equals K](./560-subarray-sum-equals-k/) is included as the contrast case: it solves a contiguous-range question, but with prefix sums rather than a traditional window.

## Related concepts

- [Sliding window](../../coding-concepts/sliding-window/), the core contiguous-range pattern.
- [Two pointers](../../coding-concepts/two-pointers/), the neighboring index-movement family.
- [Prefix sums](../../coding-concepts/prefix-sums/), the replacement when window sums stop being monotonic.
- [Monotonic queue](../../coding-concepts/monotonic-queue/), the data structure behind fixed-window maxima.
- [Hash map counting](../../coding-concepts/hash-map-counting/), frequency state for strings and arrays.
