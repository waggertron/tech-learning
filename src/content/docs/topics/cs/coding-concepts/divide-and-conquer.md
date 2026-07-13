---
title: Divide and Conquer
description: "Split-solve-combine tactics for reducing a problem into independent smaller pieces."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Divide and conquer splits a problem into smaller independent pieces, solves each piece, then combines the results.

The invariant is independence after the split. Once the input is divided, each subproblem can be solved without knowing the internal work of the others, and the combine step restores the full answer.

Choose the split around the operation that makes progress: middle index, root element, pivot, or interval boundary. Then make the combine step explicit before optimizing.

## Value

The value is reducing a large problem into predictable smaller problems. Balanced splits often create logarithmic depth, and independent subproblems are easier to reason about.

### Direct complexity example

- **Brute force:** Solve each range by scanning or recomputing subranges repeatedly: often $O(n^2)$ time.
- **With this tactic:** Split into balanced pieces and combine linearly or constantly: common costs include $O(n \log n)$ or $O(\log n)$ depending on combine work.
- **Space:** Space is recursion depth plus any merge buffer. Balanced recursion uses $O(\log n)$ stack, while merge-style algorithms can need $O(n)$ buffer space.

## Challenges this solves

- binary search
- merge sort reasoning
- construct tree from traversals
- fast power
- interval DP intuition
- maximum subarray variants

## When to use it

Use this tactic when these conditions are true:

- the problem can be split into independent ranges or subtrees
- the combine step is simpler than solving directly
- balanced division is possible
- a recursive structure is visible

## When not to use it

Reach for a different tactic when these warning signs appear:

- subproblems overlap heavily and DP is needed
- the split is unbalanced every time
- the combine step is as hard as the original
- a single scan maintains enough state

## Terminology clues

These prompt words often point toward this concept:

- divide
- split
- combine
- recursive halves
- subarray range
- left and right
- merge
- power

## Problems that use it

- [4. Median of Two Sorted Arrays](../../coding-problems/binary-search/004-median-of-two-sorted-arrays/)
- [50. Pow(x, n)](../../coding-problems/math-and-geometry/050-pow-x-n/)
- [105. Construct Binary Tree from Preorder and Inorder Traversal](../../coding-problems/trees/105-construct-binary-tree-from-preorder-and-inorder-traversal/)
- [215. Kth Largest Element in an Array](../../coding-problems/heap-priority-queue/215-kth-largest-element-in-an-array/)
- [312. Burst Balloons](../../coding-problems/2d-dynamic-programming/312-burst-balloons/)
- [454. 4Sum II](../../coding-problems/arrays-and-hashing/454-4sum-ii/)

## Related concepts

- [Binary search](../binary-search/)
- [Recursion](../recursion/)
- [Dynamic programming](../dynamic-programming/)
- [Top K](../top-k/)
