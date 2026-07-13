---
title: Two Pointers
description: "5 problems that define the two-pointer pattern, walking from both ends, maintaining an invariant between indices, and collapsing O(n²) into O(n)."
parent: coding-problems
tags: [leetcode, neetcode-150, two-pointers]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Index movement with a proof

"Two pointers" is a family of array/string algorithms where two indices move through the input together, maintaining an invariant that lets you prune or conclude without re-scanning. The pattern most often works on **sorted** data or on **palindrome-shaped** symmetry; it converts many $O(n²)$ brute forces into $O(n)$.

Three pointer movements cover almost all problems:

- **Converging**: one pointer from each end, move the one whose value fails an invariant inward.
- **Same-direction**: both pointers advance left-to-right; "slow" marks a write position, "fast" marks a read position. Often overlaps with sliding window.
- **Trailing**: a second pointer lags behind the first by a fixed offset (Remove Nth From End of a linked list).

Two pointers is not "use two variables." It is a pruning argument. When you move one pointer, you are claiming that every skipped pair or state cannot improve the answer. Sorted order, symmetry, or a monotonic boundary is what makes that claim true.

## How to choose the movement

| Prompt shape | Movement | Why it works |
| --- | --- | --- |
| Palindrome or mirror comparison | Converging ends | Only paired characters matter. |
| Sorted array, find pair with target sum | Converging ends | Too small means move left up. Too large means move right down. |
| 3Sum or n-sum | Fixed anchor plus converging ends | Sorting removes duplicates and lets each inner search be linear. |
| Max area between two walls | Converging ends, move shorter wall | The shorter wall limits area, so keeping it cannot help. |
| Trapping rain water | Converging ends with running maxima | The lower side determines the safe water level to finalize. |
| In-place compaction or compression | Same-direction read/write pointers | One pointer reads all input. The other writes the kept form. |

## Problems

1. [125. Valid Palindrome (Easy)](./125-valid-palindrome/)
2. [167. Two Sum II, Input Array Is Sorted (Medium)](./167-two-sum-ii/)
3. [15. 3Sum (Medium)](./015-3sum/)
4. [11. Container With Most Water (Medium)](./011-container-with-most-water/)
5. [42. Trapping Rain Water (Hard)](./042-trapping-rain-water/)

## Bonus problems

- [189. Rotate Array (Medium)](./189-rotate-array/)
- [443. String Compression (Medium)](./443-string-compression/)

## Key patterns unlocked here

- **Symmetric check with converging pointers**: Valid Palindrome.
- **Sorted-array complement search**: Two Sum II. The pattern that generalizes to 3Sum and 4Sum.
- **Sort + fixed anchor + two pointers**: 3Sum; the bread and butter of n-sum problems.
- **Greedy movement on the shorter side**: Container With Most Water; the "why two pointers work" proof case.
- **Bidirectional max tracking**: Trapping Rain Water (classic two-pointer alternative to prefix/suffix-max arrays).

## Common mistakes

- Using two pointers before sorting when the proof depends on sorted order.
- Moving both pointers after finding a match without skipping duplicates in 3Sum-style problems.
- Moving the taller wall in Container With Most Water. The shorter wall is the limiting factor.
- Confusing sliding window with two pointers. Sliding window maintains a contiguous valid range. Two pointers often compare endpoints or maintain read/write positions.
- Forgetting that pointer movement is the proof. If you cannot explain what was ruled out, the solution is probably accidental.

## How the problems fit together

[Valid Palindrome](./125-valid-palindrome/) is the clean symmetry case. [Two Sum II](./167-two-sum-ii/) is the clean sorted-order case. [3Sum](./015-3sum/) combines sorting, duplicate skipping, a fixed anchor, and an inner two-pointer search.

[Container With Most Water](./011-container-with-most-water/) is the best proof exercise in the group because every move discards many possible pairs. [Trapping Rain Water](./042-trapping-rain-water/) is the advanced endpoint problem: each side carries the best boundary seen so far.

The bonus problems show the same idea in mutation tasks. [Rotate Array](./189-rotate-array/) uses reversal boundaries. [String Compression](./443-string-compression/) uses read/write pointers so the output fits back into the input array.

## Related concepts

- [Two pointers](../../coding-concepts/two-pointers/), the base index-movement pattern.
- [Sliding window](../../coding-concepts/sliding-window/), the contiguous-range neighbor.
- [Sorting as preprocessing](../../coding-concepts/sorting-as-preprocessing/), the reason n-sum problems become searchable.
- [Array scans](../../coding-concepts/array-scans/), the one-pass habit behind read/write pointers.
