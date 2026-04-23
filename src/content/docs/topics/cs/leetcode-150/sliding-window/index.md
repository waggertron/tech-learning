---
title: Sliding Window
description: 6 problems that teach the sliding-window pattern — maintaining a dynamic contiguous range over an array or string to reduce O(n²) to O(n).
parent: leetcode-150
tags: [leetcode, neetcode-150, sliding-window]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

A sliding window is a pair of indices `[left, right]` that defines a contiguous range. At each step, you *expand* (move `right`) or *contract* (move `left`) to maintain an invariant — distinct characters, bounded frequency, sum ≤ target, etc. Each element enters and leaves the window at most once, so total work is O(n) even though the window size varies.

There are two flavors:

- **Variable-size window** — common for "longest/shortest substring satisfying X." Expand `right`; when the invariant breaks, contract `left` until it holds again.
- **Fixed-size window** — common for "max/min over every window of size k." Slide `right` forward by one and `left` forward by one in lockstep.

## Problems

1. [121. Best Time to Buy and Sell Stock](./121-best-time-to-buy-and-sell-stock/) — *Easy*
2. [3. Longest Substring Without Repeating Characters](./003-longest-substring-without-repeating-characters/) — *Medium*
3. [424. Longest Repeating Character Replacement](./424-longest-repeating-character-replacement/) — *Medium*
4. [567. Permutation in String](./567-permutation-in-string/) — *Medium*
5. [76. Minimum Window Substring](./076-minimum-window-substring/) — *Hard*
6. [239. Sliding Window Maximum](./239-sliding-window-maximum/) — *Hard*

## Key patterns unlocked here

- **Running best + single pass** — Buy/Sell Stock; the "one-pass min-tracking" template.
- **Hash set / map as window state** — Longest Substring Without Repeating.
- **Window + frequency count with max-freq invariant** — Longest Repeating Character Replacement.
- **Anagram detection with matching counters** — Permutation in String.
- **Two-counter tracking (have vs. need)** — Minimum Window Substring.
- **Monotonic deque for window min/max** — Sliding Window Maximum.
