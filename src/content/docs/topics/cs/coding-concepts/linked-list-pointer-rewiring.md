---
title: Linked List Pointer Rewiring
description: "Node-link tactics for changing list structure without losing the rest of the chain."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Linked-list pointer rewiring changes node links without array indexing. The tactic is to keep stable handles to the nodes before, inside, and after the region being changed.

The invariant is that no live part of the chain is lost. Before overwriting a `next` pointer, store the node you still need to reach.

Dummy nodes reduce edge cases because the head becomes an ordinary node after `dummy`. For reversal, swapping, and deletion, name the predecessor and successor before modifying links.

## Value

The value is doing structural edits in place. Arrays require shifting elements, but linked lists can splice nodes by changing references.

### Direct complexity example

- **Brute force:** Copy list values into an array, transform them, then rebuild links: $O(n)$ time and $O(n)$ space.
- **With this tactic:** Rewire nodes directly in one pass: $O(n)$ time and $O(1)$ extra space.
- **Space:** Some problems still need a map for random pointers or cache lookup, which raises space to $O(n)$.

## Challenges this solves

- reverse linked list
- swap nodes in pairs
- reverse nodes in k group
- remove nth from end
- reorder list
- LRU cache lists

## When to use it

Use this tactic when these conditions are true:

- the input is a linked list
- the task changes node order or removes nodes
- node identity matters more than values
- the desired solution asks for constant extra space

## When not to use it

Reach for a different tactic when these warning signs appear:

- random access by index is needed repeatedly
- the list is immutable
- copying values is allowed and much simpler for the constraints
- extra cross-links require a hash map

## Terminology clues

These prompt words often point toward this concept:

- linked list
- reverse
- swap nodes
- remove node
- reorder
- dummy node
- next pointer
- in-place

## Problems that use it

- [2. Add Two Numbers](../../coding-problems/linked-list/002-add-two-numbers/)
- [19. Remove Nth Node From End of List](../../coding-problems/linked-list/019-remove-nth-node-from-end-of-list/)
- [21. Merge Two Sorted Lists](../../coding-problems/linked-list/021-merge-two-sorted-lists/)
- [24. Swap Nodes in Pairs](../../coding-problems/linked-list/024-swap-nodes-in-pairs/)
- [25. Reverse Nodes in k-Group](../../coding-problems/linked-list/025-reverse-nodes-in-k-group/)
- [138. Copy List with Random Pointer](../../coding-problems/linked-list/138-copy-list-with-random-pointer/)
- [143. Reorder List](../../coding-problems/linked-list/143-reorder-list/)
- [146. LRU Cache](../../coding-problems/linked-list/146-lru-cache/)
- [160. Intersection of Two Linked Lists](../../coding-problems/linked-list/160-intersection-of-two-linked-lists/)
- [206. Reverse Linked List](../../coding-problems/linked-list/206-reverse-linked-list/)
- [876. Middle of the Linked List](../../coding-problems/linked-list/876-middle-of-linked-list/)

## Related concepts

- [Fast and slow pointers](../fast-and-slow-pointers/)
- [Cycle detection](../cycle-detection/)
- [Recursion](../recursion/)
