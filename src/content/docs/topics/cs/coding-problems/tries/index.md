---
title: Trie problems
description: "3 problems on prefix trees, basic implementation, wildcard search, and combined trie + grid DFS for multi-word search."
parent: coding-problems
tags: [leetcode, neetcode-150, tries]
status: draft
created: 2026-04-23
updated: 2026-07-13
---

## Prefix trees

A trie stores a set of strings as a tree, where each edge is a character and a path from the root marks the characters of a stored word. Insertion and lookup are $O(L)$ where L is the word length, independent of how many words are stored. Tries are the right structure whenever you need to answer **prefix** questions cheaply.

Hash sets answer "is this exact word present?" A trie answers "which words share this prefix?" That distinction is the entire category. The data structure pays for extra memory so the search can stop as soon as a prefix is impossible.

## When the trie earns its space

Use a trie when many operations reuse the same string prefixes:

- autocomplete and `startsWith` queries
- wildcard search where `.` or `?` can stand for a character
- dictionary-backed DFS on a board or graph
- pruning impossible paths before they become full strings

Avoid a trie when every query is exact membership. A hash set is simpler and usually faster. Avoid it when the alphabet is huge and sparse unless you store children in a map rather than a fixed array.

## Problems

1. [208. Implement Trie (Prefix Tree) (Medium)](./208-implement-trie/)
2. [211. Design Add and Search Words Data Structure (Medium)](./211-design-add-and-search-words-data-structure/)
3. [212. Word Search II (Hard)](./212-word-search-ii/)

## Key patterns unlocked here

- **Canonical trie insert/search/startsWith**: 208.
- **Wildcard search via trie DFS**: 211 (backtrack on `.`).
- **Trie + grid DFS with trie-pruning**: 212 (the hard payoff).

## How the problems fit together

[Implement Trie](./208-implement-trie/) is the structural page. It teaches the node shape, child map, and terminal marker. The important detail is that the terminal marker belongs to the node after the final character, because a word can also be a prefix of a longer word.

[Design Add and Search Words](./211-design-add-and-search-words-data-structure/) adds wildcard branching. Normal characters choose one child. A wildcard tries every child and continues DFS. That turns lookup from a single path into a small backtracking problem.

[Word Search II](./212-word-search-ii/) is where the trie pays rent. Searching each word separately repeats the same board walks. A trie lets one DFS walk the board while tracking all dictionary prefixes at once. As soon as the current path is not a prefix, the branch dies.

## Common mistakes

- Forgetting `is_word`, which makes `app` and `apple` indistinguishable.
- Treating wildcard search like exact lookup. A wildcard means branch over children.
- Building full strings before checking prefixes in Word Search II. That loses the pruning advantage.
- Returning duplicate words from the board. Mark found words or collect into a set.

## Related concepts

- [Trie prefix search](../../coding-concepts/trie-prefix-search/), the reusable prefix-query pattern.
- [Backtracking](../../coding-concepts/backtracking/), wildcard and board search both branch and undo.
- [DFS](../../coding-concepts/dfs/), the traversal pattern behind trie search and grid walks.
- [Hash map counting](../../coding-concepts/hash-map-counting/), the exact-membership alternative when prefixes do not matter.
