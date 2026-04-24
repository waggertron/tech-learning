---
title: Tries
description: 3 problems on prefix trees, basic implementation, wildcard search, and combined trie + grid DFS for multi-word search.
parent: leetcode-150
tags: [leetcode, neetcode-150, tries]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

A trie stores a set of strings as a tree, where each edge is a character and a path from the root marks the characters of a stored word. Insertion and lookup are O(L) where L is the word length, independent of how many words are stored. Tries are the right structure whenever you need to answer **prefix** questions cheaply.

## Problems

1. [208. Implement Trie (Prefix Tree)](./208-implement-trie/), *Medium*
2. [211. Design Add and Search Words Data Structure](./211-design-add-and-search-words-data-structure/), *Medium*
3. [212. Word Search II](./212-word-search-ii/), *Hard*

## Key patterns unlocked here

- **Canonical trie insert/search/startsWith**, 208.
- **Wildcard search via trie DFS**, 211 (backtrack on `.`).
- **Trie + grid DFS with trie-pruning**, 212 (the hard payoff).
