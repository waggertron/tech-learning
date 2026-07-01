---
title: Recursion
description: "Self-similar problem-solving tactics for trees, divide-and-conquer, and search branches."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

Recursion solves a problem by calling the same logic on smaller or simpler inputs. The call stack stores the unfinished work.

The invariant is problem shrinkage. Every recursive call must move toward a base case, and the result of each call must match the meaning promised by the function signature.

Write the contract first: what does this function return for this node, index, or range? Then write base cases and combine child answers or recursive branch answers.

## Value

The value is matching self-similar structures directly. Trees, divide-and-conquer ranges, and backtracking branches often become clearer when the code mirrors the structure.

### Direct complexity example

- **Brute force:** Manually manage a stack or duplicate logic for nested subproblems: often same asymptotic time, but more bookkeeping.
- **With this tactic:** Use recursion to express each subproblem once. Time depends on the recursion tree, such as $O(n)$ for a tree traversal or $O(2^n)$ for binary choices.
- **Space:** Space is recursion depth: $O(h)$ for a tree of height `h`, $O(\log n)$ for balanced divide-and-conquer, or $O(n)$ for a skewed chain.

## Challenges this solves

- tree traversal
- DFS
- divide and conquer
- backtracking
- recursive DP
- linked-list reversal

## When to use it

Use this tactic when these conditions are true:

- the structure is naturally nested or self-similar
- a subproblem has the same shape as the original
- the combine step is local
- the recursion depth is safe for the language

## When not to use it

Reach for a different tactic when these warning signs appear:

- the depth can exceed stack limits
- a simple loop expresses the state more clearly
- subproblems repeat and need memoization
- the base case is unclear and recursion risks nontermination

## Terminology clues

These prompt words often point toward this concept:

- recursive
- subtree
- base case
- call stack
- divide
- nested
- self-similar
- DFS

## Problems that use it

- [24. Swap Nodes in Pairs](../coding-problems/linked-list/024-swap-nodes-in-pairs/)
- [78. Subsets](../coding-problems/backtracking/078-subsets/)
- [100. Same Tree](../coding-problems/trees/100-same-tree/)
- [104. Maximum Depth of Binary Tree](../coding-problems/trees/104-maximum-depth-of-binary-tree/)
- [206. Reverse Linked List](../coding-problems/linked-list/206-reverse-linked-list/)
- [226. Invert Binary Tree](../coding-problems/trees/226-invert-binary-tree/)
- [394. Decode String](../coding-problems/stack/394-decode-string/)

## Related concepts

- [Tree traversal](./tree-traversal/)
- [DFS](./dfs/)
- [Backtracking](./backtracking/)
- [Divide and conquer](./divide-and-conquer/)
