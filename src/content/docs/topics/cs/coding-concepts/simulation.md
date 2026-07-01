---
title: Simulation
description: "State-machine tactics for faithfully executing rules while keeping state small and explicit."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Simulation executes the rules of a process directly while keeping state explicit. The tactic is to model exactly what changes after each event or step.

The invariant is faithful state. At the top of each loop, the variables represent the real process after all previous events have been applied.

Good simulation code names the state and transitions clearly. If many branches appear, convert them into small helper functions or a table of directions, operations, or cases.

## Value

The value is correctness under detailed rules. Some problems have no hidden trick. They need careful state updates, boundary checks, and termination conditions.

### Direct complexity example

- **Brute force:** Recompute the whole world after every event: $O(tn)$ or worse for `t` events and state size `n`.
- **With this tactic:** Maintain only the changing state and update it per event: often $O(t)$ or $O(t \log n)$ depending on the needed data structure.
- **Space:** Space is the explicit state representation, often $O(1)$ for counters or $O(n)$ for boards, stacks, maps, or queues.

## Challenges this solves

- spiral matrix
- asteroid collision
- string multiplication
- plus one
- LRU operations
- game-like rule execution

## When to use it

Use this tactic when these conditions are true:

- the prompt gives concrete rules to execute
- edge cases are about state transitions
- the output is the final state after operations
- no stronger invariant simplifies the process

## When not to use it

Reach for a different tactic when these warning signs appear:

- the state space repeats and needs cycle detection
- the rules can be summarized by math or greedy logic
- recomputing after each event is too slow and needs a data structure
- the problem asks for an optimum rather than rule execution

## Terminology clues

These prompt words often point toward this concept:

- simulate
- process
- operations
- after each
- state
- rules
- collision
- move

## Problems that use it

- [2. Add Two Numbers](../coding-problems/linked-list/002-add-two-numbers/)
- [7. Reverse Integer](../coding-problems/bit-manipulation/007-reverse-integer/)
- [43. Multiply Strings](../coding-problems/math-and-geometry/043-multiply-strings/)
- [48. Rotate Image](../coding-problems/math-and-geometry/048-rotate-image/)
- [54. Spiral Matrix](../coding-problems/math-and-geometry/054-spiral-matrix/)
- [66. Plus One](../coding-problems/math-and-geometry/066-plus-one/)
- [71. Simplify Path](../coding-problems/stack/071-simplify-path/)
- [73. Set Matrix Zeroes](../coding-problems/math-and-geometry/073-set-matrix-zeroes/)
- [150. Evaluate Reverse Polish Notation](../coding-problems/stack/150-evaluate-reverse-polish-notation/)
- [155. Min Stack](../coding-problems/stack/155-min-stack/)
- [224. Basic Calculator](../coding-problems/stack/224-basic-calculator/)
- [271. Encode and Decode Strings](../coding-problems/arrays-and-hashing/271-encode-and-decode-strings/)
- [355. Design Twitter](../coding-problems/heap-priority-queue/355-design-twitter/)
- [735. Asteroid Collision](../coding-problems/stack/735-asteroid-collision/)
- [1046. Last Stone Weight](../coding-problems/heap-priority-queue/1046-last-stone-weight/)
- [1047. Remove All Adjacent Duplicates In String](../coding-problems/stack/1047-remove-all-adjacent-duplicates/)

## Related concepts

- [Stack parsing](./stack-parsing/)
- [Array scans](./array-scans/)
- [Math and number theory](./math-and-number-theory/)
