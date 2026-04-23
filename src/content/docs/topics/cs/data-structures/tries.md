---
title: Tries
description: Prefix trees — rooted trees where edges are characters and paths spell words. Optimized for prefix queries, autocomplete, and string-set operations.
parent: data-structures
tags: [data-structures, trie, prefix-tree, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

A **trie** (pronounced "try," from *retrieval*) is a rooted tree where each edge is labeled with a character and a path from the root to a marked node spells a word. It's optimized for prefix queries: "does any stored word start with `foo`?" in O(L) where L is the prefix length, independent of the dictionary's total size. Classic applications: autocomplete, spell check, IP routing, and word games on a grid.

## In-depth description

Each **trie node** typically stores:

- A container of children (array of 26 pointers for lowercase-only, or a hash map for arbitrary alphabets).
- An **is-end-of-word** flag that marks valid words (distinguishing, say, "car" from "cart" when both are in the dictionary).

**Insertion** walks down the tree from the root, creating new nodes as needed, and marks the final node as end-of-word. **Search** follows children; if any character isn't a child, the word isn't present. **Prefix search** is the same walk without the end-of-word check.

The crucial property: every operation on a string of length L is **O(L)**. It does *not* depend on the number of words stored. This makes tries competitive even against hash sets when you need prefix queries — hash sets give you O(L) membership but can't answer "starts-with" without scanning every key.

**Space is the tradeoff.** A naive trie uses `26 × |nodes|` pointers in the worst case. Mitigations:

- **Hash-map children** — only allocate children that exist.
- **Compressed trie (radix tree / Patricia trie)** — collapse chains of single-child nodes into one edge labeled with a substring. Used in IP routing (longest-prefix match) and some string indexes.
- **DAWG / suffix automaton** — merge suffixes to deduplicate nodes; relevant for large static dictionaries.

**Tries shine on grid word-search problems.** The naive approach of checking every dictionary word against every grid position is too slow. Instead, build a trie of the dictionary and do DFS on the grid, pruning whenever the current path is no longer a prefix in the trie. This is how Word Search II goes from timeouts to sub-second.

## Time complexity

| Operation | Time | Space |
| --- | --- | --- |
| Insert word of length L | O(L) | O(L) (worst case, new path) |
| Search word of length L | O(L) | O(1) |
| Prefix search (length L, k matches) | O(L + output) | O(1) + output |
| Delete | O(L) | — |
| Build from n words, total length T | O(T) | O(T) (naive), less with compression |

## Common uses in DSA

1. **Autocomplete / typeahead** — prefix query against a dictionary of candidates, often ranked by frequency.
2. **Spell check and approximate matching** — trie traversal combined with edit-distance DP for "within-k-edits" suggestions.
3. **Longest common prefix / word-replacement problems** — Longest Common Prefix, Replace Words, Longest Word in Dictionary.
4. **Word search on a grid** — Word Search II: build trie of dictionary, DFS the board, prune via trie.
5. **IP routing tables** — longest-prefix match for destination IPs, implemented as a binary/radix trie over the bits of the address.

**Canonical LeetCode problems:** #208 Implement Trie (Prefix Tree), #211 Design Add and Search Words Data Structure, #212 Word Search II, #648 Replace Words, #720 Longest Word in Dictionary.

## Python example

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

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node

# Usage
t = Trie()
for w in ["apple", "app", "apply", "apt"]:
    t.insert(w)

t.search("app")         # True
t.search("appl")        # False (not an end-of-word)
t.starts_with("appl")   # True
t.search("bat")         # False

# Word Search II sketch: trie + DFS on a grid
def find_words(board, words):
    trie = Trie()
    for w in words:
        trie.insert(w)

    rows, cols = len(board), len(board[0])
    found = set()

    def dfs(r, c, node, path):
        if not (0 <= r < rows and 0 <= c < cols):
            return
        ch = board[r][c]
        if ch == '#' or ch not in node.children:
            return
        next_node = node.children[ch]
        path += ch
        if next_node.is_end:
            found.add(path)
        board[r][c] = '#'      # mark visited
        for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            dfs(r + dr, c + dc, next_node, path)
        board[r][c] = ch        # restore

    for r in range(rows):
        for c in range(cols):
            dfs(r, c, trie.root, "")
    return list(found)
```

## LeetCode problems

**NeetCode 150 — Tries:**
- [208. Implement Trie (Prefix Tree)](../../leetcode-150/tries/208-implement-trie/)
- [211. Design Add and Search Words Data Structure](../../leetcode-150/tries/211-design-add-and-search-words-data-structure/) — trie + wildcard DFS
- [212. Word Search II](../../leetcode-150/tries/212-word-search-ii/) — trie + grid DFS

## References

- [Trie — Wikipedia](https://en.wikipedia.org/wiki/Trie)
- [Radix tree / Patricia trie — Wikipedia](https://en.wikipedia.org/wiki/Radix_tree)
- [Tries for string processing — cp-algorithms](https://cp-algorithms.com/string/aho_corasick.html)
- [Implement Trie — LeetCode 208](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [Word Search II — LeetCode 212 (trie + DFS)](https://leetcode.com/problems/word-search-ii/)
