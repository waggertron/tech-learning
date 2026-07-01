---
title: Divide and Conquer
description: "Split-solve-combine tactics for reducing a problem into independent smaller pieces."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Divide and conquer splits input, solves each part, and combines the results. Binary search, merge sort, quickselect, and many tree algorithms use this shape.

## Value

The value is logarithmic or balanced structure. The split often reduces depth or isolates independent work.

## Challenges this solves

- binary search partitions
- merge sort
- quickselect
- tree reconstruction
- median from sorted arrays

## When to use it

Use it when the input can be split into independent regions or when a midpoint decision removes a region.

## When not to use it

Do not use it if subproblems overlap heavily. That is usually dynamic programming.

## Terminology clues

- split
- partition
- merge
- median
- divide
- left and right halves

## Problems that use it

- [4. Median of Two Sorted Arrays](../coding-problems/binary-search/004-median-of-two-sorted-arrays/)
- [105. Construct Binary Tree from Preorder and Inorder Traversal](../coding-problems/trees/105-construct-binary-tree-from-preorder-and-inorder-traversal/)
- [215. Kth Largest Element in an Array](../coding-problems/heap-priority-queue/215-kth-largest-element-in-an-array/)

## Related concepts

- [Binary search](./binary-search/)
- [Recursion](./recursion/)
- [Dynamic programming](./dynamic-programming/)
- [Top K](./top-k/)
