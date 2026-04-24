---
title: "208. Implement Trie (Prefix Tree)"
description: Implement a trie supporting insert, search, and startsWith in O(L).
parent: tries
tags: [leetcode, neetcode-150, tries, design, medium]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Problem

Implement a trie with the following methods:

- `insert(word)`
- `search(word)`, true iff the exact word has been inserted.
- `startsWith(prefix)`, true iff some inserted word starts with `prefix`.

**Example**
```
Trie trie = new Trie();
trie.insert("apple");
trie.search("apple");    // true
trie.search("app");      // false
trie.startsWith("app");  // true
trie.insert("app");
trie.search("app");      // true
```

LeetCode 208 · [Link](https://leetcode.com/problems/implement-trie-prefix-tree/) · *Medium*

## Approach 1: Brute force, hash set of words, linear prefix check

`insert` adds the word to a set; `startsWith` scans the set.

```python
class Trie:
    def __init__(self):
        self.words = set()

    def insert(self, word):
        self.words.add(word)

    def search(self, word):
        return word in self.words

    def startsWith(self, prefix):
        return any(w.startswith(prefix) for w in self.words)
```

**Complexity**
- `insert`, `search`: O(1) average.
- `startsWith`: **O(W · L)** where W = total words, L = prefix length.

Fails when there are many words, the whole point of a trie is to make `startsWith` independent of W.

## Approach 2: Trie with hash-map children (canonical)

Each node has a `dict` of children and a boolean "is end of word."

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end

    def startsWith(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node
```

**Complexity**
- `insert`, `search`, `startsWith`: **O(L)** each.
- Space: O(total characters inserted).

Works for arbitrary alphabets.

## Approach 3: Array of 26 children (tighter for lowercase-only)

Replace the `dict` with a fixed 26-element array.

```python
class TrieNode:
    __slots__ = ("children", "is_end")
    def __init__(self):
        self.children = [None] * 26
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            i = ord(ch), ord('a')
            if node.children[i] is None:
                node.children[i] = TrieNode()
            node = node.children[i]
        node.is_end = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end

    def startsWith(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for ch in s:
            i = ord(ch), ord('a')
            if node.children[i] is None:
                return None
            node = node.children[i]
        return node
```

**Complexity**
- Same O(L) operations.
- Space: O(26 · nodes). Can exceed the hash-map approach if the trie is sparse.

Slightly faster constant factors; restricted to lowercase. Use when the problem guarantees a fixed small alphabet.

## Summary

| Approach | insert | search | startsWith | Space |
| --- | --- | --- | --- | --- |
| Hash set of words | O(1) | O(1) | **O(W · L)** | O(total chars) |
| **Trie with hash children** | O(L) | O(L) | **O(L)** | O(total chars) |
| Trie with 26-array children | O(L) | O(L) | **O(L)** | O(26 · nodes) |

The hash-children trie is the canonical interview implementation and the building block for problems 211 and 212.

## Related data structures

- [Tries](../../../data-structures/tries/), prefix tree implementation
