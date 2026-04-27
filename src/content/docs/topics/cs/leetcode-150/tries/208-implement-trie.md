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
        self.words.add(word)           # L1: O(L) hash + store

    def search(self, word):
        return word in self.words      # L2: O(L) hash lookup

    def startsWith(self, prefix):
        return any(w.startswith(prefix) for w in self.words)  # L3: O(W · L) scan
```

**Where the time goes, line by line**

*Variables: L = length of the word/prefix, W = total number of words stored.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (insert) | O(L) | 1 | O(L) per insert |
| L2 (search) | O(L) | 1 | O(L) per search |
| **L3 (startsWith scan)** | **O(L)** | **W** | **O(W · L) per startsWith** ← dominates |

`insert` and `search` are fast because set hashing is O(L) (must hash the string). `startsWith` is slow because it must check every stored word.

**Complexity**
- `insert`, `search`: O(L) average.
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
        for ch in word:                      # L1: iterate over L characters
            if ch not in node.children:
                node.children[ch] = TrieNode()  # L2: O(1) create node
            node = node.children[ch]         # L3: O(1) descend
        node.is_end = True                   # L4: O(1) mark end

    def search(self, word):
        node = self._walk(word)              # L5: O(L) walk
        return node is not None and node.is_end  # L6: O(1) check

    def startsWith(self, prefix):
        return self._walk(prefix) is not None  # L7: O(L) walk

    def _walk(self, s):
        node = self.root
        for ch in s:                         # L8: iterate over L characters
            if ch not in node.children:      # L9: O(1) dict lookup
                return None
            node = node.children[ch]         # L10: O(1) descend
        return node
```

**Where the time goes, line by line**

*Variables: L = length of the word/prefix.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| **L1-L4 (insert loop)** | **O(1) per char** | **L** | **O(L) per insert** ← dominates for insert |
| **L8-L10 (_walk loop)** | **O(1) per char** | **L** | **O(L) per search/startsWith** ← dominates for queries |
| L5/L6/L7 (search/startsWith) | O(L) + O(1) | 1 | O(L) |

Each method is dominated by the loop over the word/prefix characters. Hash-map child lookup (L9) is O(1) average.

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
        self.children = [None] * 26     # L1: O(26) = O(1) allocation per node
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:                  # L2: iterate over L characters
            i = ord(ch) - ord('a')      # L3: O(1) index computation
            if node.children[i] is None:
                node.children[i] = TrieNode()  # L4: O(1) create node
            node = node.children[i]     # L5: O(1) descend
        node.is_end = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end

    def startsWith(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for ch in s:                     # L6: iterate over L characters
            i = ord(ch) - ord('a')      # L7: O(1) index
            if node.children[i] is None:
                return None
            node = node.children[i]     # L8: O(1) descend
        return node
```

**Where the time goes, line by line**

*Variables: L = length of the word/prefix.*

| Line | Per-call cost | Times executed | Contribution |
| --- | --- | --- | --- |
| L1 (node init) | O(1) (26 slots) | per new node | O(1) per node |
| **L2-L5 (insert loop)** | **O(1) per char** | **L** | **O(L) per insert** ← dominates for insert |
| **L6-L8 (_walk loop)** | **O(1) per char** | **L** | **O(L) per query** ← dominates for queries |

The 26-slot array replaces dict lookup (L9 in Approach 2) with direct index access (L7). Both are O(1), but the array version has smaller constant factors and better cache behavior.

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

## Test cases

```python
# Quick smoke tests - paste into a REPL or save as test_208.py and run.
# Uses the canonical Approach 2 implementation (hash-map children).

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

def _run_tests():
    trie = Trie()
    trie.insert("apple")
    assert trie.search("apple") == True
    assert trie.search("app") == False      # not inserted, only prefix
    assert trie.startsWith("app") == True
    trie.insert("app")
    assert trie.search("app") == True
    assert trie.search("ap") == False       # only prefix, not word
    assert trie.startsWith("b") == False    # no words with prefix "b"
    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## Related data structures

- [Tries](../../../data-structures/tries/), prefix tree implementation
