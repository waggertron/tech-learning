---
title: Data Structures
description: The top ten data structures that show up in coding interviews, intro, representation, time complexity, and five common uses for each.
category: cs
tags: [data-structures, algorithms, interviews, cs-fundamentals]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Overview

A data structure is a way of organizing data so the operations you need on it are efficient. In coding interviews (Blind 75, NeetCode 150, Cracking the Coding Interview, LeetCode company tags), a small set of structures covers roughly 90% of problems. This topic is a reference for that set: what each structure is, how it's typically implemented, the time complexity of its core operations, and the canonical problems it solves.

## The top ten

1. [Arrays](./arrays/)
2. [Strings](./strings/)
3. [Hash Tables](./hash-tables/)
4. [Linked Lists](./linked-lists/)
5. [Stacks](./stacks/)
6. [Queues](./queues/)
7. [Binary Trees & BSTs](./binary-trees/)
8. [Heaps / Priority Queues](./heaps/)
9. [Graphs](./graphs/)
10. [Tries](./tries/)

## How each subtopic is organized

Every subtopic follows a consistent structure so they're easy to scan:

- **Intro**, what it is and why it exists
- **In-depth description**, how it's typically implemented and the key invariants
- **Time complexity**, average- and worst-case for the main operations
- **Common uses in DSA**, five interview-relevant problem patterns it unlocks

## Picking the right structure

A rough decision flow:

- Need O(1) lookup by value? → **Hash Table**
- Need order preserved and random access? → **Array**
- Need FIFO (breadth, levels, streams)? → **Queue**
- Need LIFO (nesting, backtracking, matching)? → **Stack**
- Need top-K or always-min/max? → **Heap**
- Need ordered map / in-order iteration? → **Binary Search Tree**
- Need hierarchical data or "explore from a node"? → **Tree** or **Graph**
- Need fast prefix queries? → **Trie**
- Need O(1) insert/delete at a known node? → **Linked List** (usually as part of a composite like LRU)

## References

- *Cracking the Coding Interview*, Gayle Laakmann McDowell
- *Elements of Programming Interviews*, Aziz, Lee, Prakash
- *Introduction to Algorithms* (CLRS), Cormen, Leiserson, Rivest, Stein
- [NeetCode 150 Roadmap](https://neetcode.io/roadmap)
- [Blind 75 list](https://www.teamblind.com/post/New-Year-Gift---Curated-List-of-Top-75-LeetCode-Questions-to-Save-Your-Time-OaM1orEU)
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
