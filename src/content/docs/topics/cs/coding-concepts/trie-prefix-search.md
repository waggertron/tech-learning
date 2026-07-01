---
title: Trie Prefix Search
description: "Prefix-tree tactics for sharing common string prefixes and pruning word search branches."
parent: coding-concepts
tags: [coding-concepts, algorithms, interviews]
status: draft
created: 2026-06-30
updated: 2026-07-01
---

## Tactic

A trie stores strings by shared prefixes. Each edge is a character and each node represents the prefix formed by the path from the root.

The invariant is prefix state. After consuming a prefix, the current trie node contains exactly the continuations that remain possible.

Tries shine when many words share prefixes or when search branches can be cut as soon as the prefix is absent. Word search with a dictionary is the classic case: the board DFS stops when the current prefix is not in the trie.

## Value

The value is replacing repeated string comparisons with character-by-character navigation through shared structure.

### Direct complexity example

- **Brute force:** For each query prefix, scan every word or compare many strings: $O(WL)$ time per query for `W` words of length `L`.
- **With this tactic:** Traverse the prefix in the trie: $O(p)$ time for prefix length `p` after building the trie.
- **Space:** Space is $O(\text{total characters})$ across inserted words, often with a constant factor for child maps or arrays.

## Challenges this solves

- implement trie
- word dictionary with wildcard search
- word search II
- autocomplete
- prefix grouping

## When to use it

Use this tactic when these conditions are true:

- many prefix queries are expected
- the input is a dictionary of strings
- search can stop early when a prefix is missing
- wildcards or board paths branch from a prefix

## When not to use it

Reach for a different tactic when these warning signs appear:

- there are only a few strings and direct comparison is simpler
- queries are full exact matches and a hash set is enough
- memory is tight and the alphabet is large
- suffix or substring queries are required instead of prefixes

## Terminology clues

These prompt words often point toward this concept:

- prefix
- dictionary
- autocomplete
- starts with
- word search
- wildcard
- trie
- shared prefix

## Problems that use it

- [208. Implement Trie (Prefix Tree)](../coding-problems/tries/208-implement-trie/)
- [211. Design Add and Search Words Data Structure](../coding-problems/tries/211-design-add-and-search-words-data-structure/)
- [212. Word Search II](../coding-problems/tries/212-word-search-ii/)

## Related concepts

- [Backtracking](./backtracking/)
- [DFS](./dfs/)
- [Hash map counting](./hash-map-counting/)
