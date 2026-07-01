---
title: Fast and Slow Pointers
description: "Pointer-speed tactics for cycle detection, middle finding, and linked-list distance constraints."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Fast and slow pointers compare two walkers that move at different rates through the same structure. The fast pointer usually advances two steps while the slow pointer advances one.

The invariant is distance. In an acyclic list, the fast pointer reaches the end first and the slow pointer reveals the midpoint or the node before a target distance. In a cycle, the faster pointer eventually laps the slower one inside the loop.

The implementation is mostly guard discipline. Check `fast` and `fast.next` before jumping two steps. For list removal problems, a dummy node and a fixed gap often make the boundary cases disappear.

## Value

The value is turning hidden length or repetition into a pointer relationship. You avoid storing visited nodes or counting the entire list first, which matters when the structure is linked and random access is unavailable.

### Direct complexity example

- **Brute force:** Store every visited node to detect a cycle or count length first for a second pass: $O(n)$ time and $O(n)$ space, or two passes with $O(1)$ space.
- **With this tactic:** Use pointer speed or a fixed gap: $O(n)$ time and $O(1)$ space.
- **Space:** The tactic saves memory more than time in many linked-list problems. The time stays linear because every pointer still walks through the structure a bounded number of times.

## Challenges this solves

- cycle detection
- middle of linked list
- nth node from end
- duplicate number as a functional graph
- periodic numeric processes

## When to use it

Use this tactic when these conditions are true:

- the structure has `next` links or a deterministic next-state function
- the problem asks for middle, cycle, meeting point, or distance from end
- a hash set would work but extra memory is avoidable
- you can advance one walker faster or start walkers with a fixed gap

## When not to use it

Reach for a different tactic when these warning signs appear:

- the next step is not deterministic
- nodes can branch to many neighbors and need a real graph traversal
- the list can mutate while pointers are walking
- the task requires all repeated states, not just the existence of a repeat

## Terminology clues

These prompt words often point toward this concept:

- cycle
- linked list
- middle node
- nth from end
- fast pointer
- slow pointer
- tortoise and hare
- duplicate number

## Problems that use it

- [19. Remove Nth Node From End of List](../coding-problems/linked-list/019-remove-nth-node-from-end-of-list/)
- [141. Linked List Cycle](../coding-problems/linked-list/141-linked-list-cycle/)
- [143. Reorder List](../coding-problems/linked-list/143-reorder-list/)
- [202. Happy Number](../coding-problems/math-and-geometry/202-happy-number/)
- [287. Find the Duplicate Number](../coding-problems/linked-list/287-find-the-duplicate-number/)
- [876. Middle of the Linked List](../coding-problems/linked-list/876-middle-of-linked-list/)

## Related concepts

- [Cycle detection](./cycle-detection/)
- [Linked list pointer rewiring](./linked-list-pointer-rewiring/)
- [Graph traversal](./graph-traversal/)
