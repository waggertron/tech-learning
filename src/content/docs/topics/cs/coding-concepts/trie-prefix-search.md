---
title: Trie Prefix Search
description: "Prefix-tree tactics for sharing common string prefixes and pruning word search branches."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-06-30
---

## Tactic

A trie stores characters along paths. Each node represents a prefix, so lookup, prefix checks, and wildcard branching operate character by character.

## Value

The value is prefix pruning. Many strings share work instead of being searched independently.

## Challenges this solves

- dictionary lookup
- starts-with queries
- wildcard word search
- multi-word grid search
- autocomplete-like matching

## When to use it

Use it when many words share prefixes or when the search needs to stop as soon as no word has the current prefix.

## When not to use it

Do not use a trie for a tiny dictionary where a set is simpler and just as clear.

## Terminology clues

- prefix
- dictionary
- startsWith
- wildcard
- word search
- autocomplete

## Problems that use it

- [208. Implement Trie](../coding-problems/tries/208-implement-trie/)
- [211. Design Add and Search Words Data Structure](../coding-problems/tries/211-design-add-and-search-words-data-structure/)
- [212. Word Search II](../coding-problems/tries/212-word-search-ii/)

## Related concepts

- [Backtracking](./backtracking/)
- [DFS](./dfs/)
- [Hash map counting](./hash-map-counting/)
