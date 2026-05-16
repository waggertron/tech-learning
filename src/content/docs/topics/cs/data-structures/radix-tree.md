---
title: Radix Tree
description: "A compressed trie that collapses single-child chains into one labeled edge, cutting memory use and preserving O(k) lookup: how the compression works, where radix trees appear in production, and a Python implementation."
parent: data-structures
tags: [data-structures, trie, radix-tree, prefix-tree]
status: draft
created: 2026-05-15
updated: 2026-05-15
---

## What a radix tree is

A radix tree is a compressed trie. In a standard trie, each node holds exactly one character, so a word like "apple" needs five nodes chained together with no branching. A radix tree collapses any such unbranched chain into a single edge labeled with the whole substring. "apple" becomes one edge rather than five nodes. The result stores the same information in fewer nodes and makes cache behavior more predictable.

The compression is lossless. Every string the standard trie could match, the radix tree can also match. Every prefix query that worked before still works. The only difference is the implementation cost: insert, search, and delete must handle the case where a new key shares only part of an existing edge label, requiring a split at the divergence point.

## Why it matters

A standard trie for a routing table with 500,000 IPv4 prefixes would require millions of nodes. Linux's kernel networking uses a radix tree variant (the LPC-trie / fib_trie) specifically because IP lookups are on the critical path for every packet and node count directly affects cache pressure. URL routers in web frameworks (Express, Chi, httprouter, Gin) use radix trees for the same reason: matching routes is per-request work, and a flat hash map can't handle path parameters and wildcards.

The compression ratio depends on the key set. Sparse key sets with long shared prefixes (IP addresses, file paths, URLs) benefit most. Dense key sets where most nodes branch frequently gain little.

## Structure

Standard trie for {"apple", "app", "apt"}:

```
root
 └─ a
     └─ p
         ├─ p
         │   ├─ (end)       ← "app"
         │   └─ l
         │       └─ e (end) ← "apple"
         └─ t (end)         ← "apt"
```

Radix tree for the same set:

```
root
 └─ "ap"
      ├─ "p" (end)          ← "app"
      │    └─ "le" (end)    ← "apple"
      └─ "t" (end)          ← "apt"
```

Three things to notice:
- "ap" is shared across all three words and stored once.
- "p" branches into "p" (which ends "app" and leads to "le") and "t".
- The leaf nodes for "app" and "apple" share the "p" prefix.

## Key operations

**Search** follows edge labels character by character. If the current position in the search key matches the edge label exactly, descend. If the edge label is longer than what remains, or a mismatch occurs, the key is not present.

**Insert** walks until it finds a mismatch. When a new key diverges from an existing edge midway through, that edge splits into a shared prefix plus two diverging children. Example: inserting "application" into a tree that has edge "apple" creates a shared prefix "appl" with children "e" and "ication".

**Delete** removes the terminal flag. If a node becomes a leaf with no terminal flag, it can be merged upward with its parent to restore compactness.

## Time complexity

| Operation | Time | Notes |
| --- | --- | --- |
| Search | $O(k)$ | k = key length; proportional to key, not dict size |
| Insert | $O(k)$ | At most one split per operation |
| Delete | $O(k)$ | Plus possible upward merge |
| Prefix scan returning m results | $O(k + m)$ | Walk prefix once, then enumerate |
| Space | $O(n × k)$ | n keys, average length k; better than trie for sparse alphabets |

## Python implementation

This implementation uses a dict of `(edge_label, RadixNode)` children. Each node carries an `is_end` flag. The `_find_split` helper locates where a new key diverges from an existing edge.

```python
from __future__ import annotations


class RadixNode:
    def __init__(self) -> None:
        self.children: dict[str, tuple[str, RadixNode]] = {}
        self.is_end: bool = False


class RadixTree:
    def __init__(self) -> None:
        self.root = RadixNode()

    def insert(self, key: str) -> None:
        self._insert(self.root, key)

    def _insert(self, node: RadixNode, key: str) -> None:
        if not key:
            node.is_end = True
            return

        first = key[0]
        if first not in node.children:
            # No matching edge: create a leaf.
            child = RadixNode()
            child.is_end = True
            node.children[first] = (key, child)
            return

        edge_label, child = node.children[first]
        common = _common_prefix(edge_label, key)
        clen = len(common)

        if clen == len(edge_label):
            # Edge fully consumed; recurse into child.
            self._insert(child, key[clen:])
        else:
            # Split the edge at the divergence point.
            old_suffix = edge_label[clen:]
            new_suffix = key[clen:]

            split = RadixNode()
            # Re-attach the old child under the remainder of its old label.
            split.children[old_suffix[0]] = (old_suffix, child)

            if new_suffix:
                new_leaf = RadixNode()
                new_leaf.is_end = True
                split.children[new_suffix[0]] = (new_suffix, new_leaf)
            else:
                split.is_end = True  # new key ends exactly at the split

            node.children[first] = (common, split)

    def search(self, key: str) -> bool:
        node = self._walk(key)
        return node is not None and node.is_end

    def starts_with(self, prefix: str) -> bool:
        return self._walk(prefix) is not None

    def _walk(self, key: str) -> RadixNode | None:
        node = self.root
        while key:
            first = key[0]
            if first not in node.children:
                return None
            edge_label, child = node.children[first]
            if not key.startswith(edge_label):
                return None
            key = key[len(edge_label):]
            node = child
        return node


def _common_prefix(a: str, b: str) -> str:
    i = 0
    while i < len(a) and i < len(b) and a[i] == b[i]:
        i += 1
    return a[:i]


# --- demo ---
tree = RadixTree()
for word in ["apple", "app", "apply", "apt", "bat"]:
    tree.insert(word)

print(tree.search("app"))       # True
print(tree.search("appl"))      # False (not a full word)
print(tree.starts_with("appl")) # True
print(tree.search("bat"))       # True
print(tree.search("ba"))        # False
print(tree.starts_with("b"))    # True
```

## Common uses in DSA and production

- **IP routing (longest-prefix match)**: IPv4/IPv6 prefixes share long common bit-string prefixes. The kernel's fib_trie and many hardware forwarding tables are radix trees over the binary representation of addresses.
- **URL / HTTP routing**: frameworks like Go's `httprouter`, `chi`, and `gin` use radix trees to match paths like `/users/:id/posts` without scanning every registered route.
- **Autocomplete and prefix search**: when the dictionary is large and the key alphabet is small (lowercase ASCII), a radix tree beats a hash set on memory and handles prefix queries natively.
- **File system path resolution**: some virtual file system implementations use a radix tree for the dentry cache (directory entry cache) to speed up path lookups.
- **Database indexes on string keys**: some column stores and LSM trees use radix trees as a second-level index for variable-length string keys.

## Tradeoffs vs standard trie

| Factor | Standard trie | Radix tree |
| --- | --- | --- |
| Node count | One per character | One per distinct prefix segment |
| Memory | High for sparse key sets | Lower; shares long common prefixes |
| Implementation complexity | Simple | Moderate (split/merge logic) |
| Cache behavior | Many pointer hops | Fewer hops, better locality |
| Fixed-alphabet speedup | Array children (26 slots) | Similar trick possible per segment |
| Delete | Simple flag clear | May require upward merge |

## Gotchas

- **Edge label storage**: each edge stores a slice of the original key string. If you're building a radix tree over mutable byte buffers (e.g. in C), storing a pointer and length into the original buffer is safe only if the buffer outlives the tree. Copy the label otherwise.
- **Split creates a non-terminal middle node**: after splitting "apple" into "appl" + ["e", "ication"], the "appl" node may not be a word. Callers that iterate nodes looking for `is_end` must not assume all internal nodes are words.
- **"Patricia trie" vs "radix tree"**: both terms appear in literature. Patricia (Practical Algorithm To Retrieve Information Coded in Alphanumeric) is the original 1968 name for a binary radix tree used in IP routing. "Radix tree" is the general term for any alphabet. In Linux kernel source, "radix tree" refers to an integer-keyed tree, not a string-keyed one.
- **Compressed does not mean balanced**: a radix tree provides no height guarantee. A single key "aaaa...a" of length n still creates a chain of n nodes (or one edge of length n in a true radix tree). For worst-case depth guarantees, B-trees or balanced BSTs are the right tool.
- **Concurrent access**: the split-and-reattach operations are not atomic. Building a thread-safe radix tree requires careful locking or lock-free CAS techniques (which is why the kernel's radix tree API evolved significantly with RCU).

## References

- [Radix tree, Wikipedia](https://en.wikipedia.org/wiki/Radix_tree)
- [PATRICIA Tries, Donald R. Morrison, 1968](https://dl.acm.org/doi/10.1145/321479.321481), the original paper
- [Linux kernel fib_trie source](https://elixir.bootlin.com/linux/latest/source/net/ipv4/fib_trie.c), a production radix tree for IPv4 routing
- [httprouter: the radix tree behind Go routing](https://github.com/julienschmidt/httprouter), well-documented source

## Related topics

- [Tries](./tries/), the uncompressed parent structure that radix trees optimize
- [Named Algorithms](../named-algorithms/), algorithms like KMP that also operate on string structure
- [Design Patterns](../design-patterns/), [Flyweight pattern](../design-patterns/flyweight/) addresses a similar memory-sharing problem at the object level
