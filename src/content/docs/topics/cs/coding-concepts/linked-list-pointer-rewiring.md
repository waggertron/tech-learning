---
title: Linked List Pointer Rewiring
description: "Node-link tactics for changing list structure without losing the rest of the chain."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

Pointer rewiring stores the next node before changing links, uses dummy nodes when head changes are possible, and moves one local connection at a time.

## Value

The value is control over mutation. Linked-list problems are usually about preserving access while changing direction or order.

## Challenges this solves

- reverse a list
- merge lists
- remove nth node
- swap pairs
- reverse in groups
- reorder nodes

## When to use it

Use it when the answer is the same nodes in a new link order.

## When not to use it

Do not convert to arrays if the prompt is testing pointer manipulation or requires $O(1)$ extra space.

## Terminology clues

- linked list
- reverse
- reorder
- swap nodes
- remove nth
- in-place links

## Problems that use it

- [206. Reverse Linked List](../coding-problems/linked-list/206-reverse-linked-list/)
- [143. Reorder List](../coding-problems/linked-list/143-reorder-list/)
- [24. Swap Nodes in Pairs](../coding-problems/linked-list/024-swap-nodes-in-pairs/)
- [25. Reverse Nodes in k-Group](../coding-problems/linked-list/025-reverse-nodes-in-k-group/)

## Related concepts

- [Fast and slow pointers](./fast-and-slow-pointers/)
- [Cycle detection](./cycle-detection/)
- [Recursion](./recursion/)
