---
title: Data structure complexity cheat sheet, operations and big-O for the structures you actually use
description: "Time and space complexity for arrays, linked lists, hashmaps, trees, heaps, tries, graphs, union-find, and the rest. With the gotchas and worst cases that get glossed over in tables, plus a Python-specific reference for the operations that look fast but aren't."
date: 2026-04-27
tags: [data-structures, algorithms, complexity, interview-prep, reference]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-27-data-structure-complexity-cheat-sheet/
---

## Why this post exists

Every coding interview prep guide has a complexity table. Most of them lie by omission. They print the average case, skip the worst case, ignore the auxiliary space the sort actually uses, and treat `list.pop(0)` like it's free.

This post is the version I wish I'd memorized. Each table tells you the **operation, the time, the space, and the gotcha**. The gotcha is the part that bites in interviews and on real workloads.

For the algorithm side (sorts, searches, graph algos, DP), see [Big-O for algorithms](#algorithms-cheat-sheet) below.

## How to read these tables

- **Time** is the operation cost in terms of `n`, the size of the structure, unless noted otherwise.
- **Space** is the structure's storage cost (or auxiliary cost for an algorithm).
- **Worst case** is the column that matters in interviews. "Average" is what you'd quote for hash structures with a decent hash function; mention the worst case if asked.
- "Amortized O(1)" means the operation is occasionally expensive (e.g., a doubling realloc), but spread over many operations it's constant on average. Treat it as O(1) unless you're doing something like real-time scheduling.

---

## Linear structures

| Structure | Access by index | Search by value | Insert | Delete | Space | Notes |
|---|---|---|---|---|---|---|
| Static array | O(1) | O(n) | O(n) | O(n) | O(n) | Fixed size; insert/delete shifts elements |
| Dynamic array (Python `list`, C++ `vector`) | O(1) | O(n) | O(1) amortized at end, O(n) middle | O(n) | O(n) | Doubling growth; reallocation is O(n) but rare |
| Singly linked list | O(n) | O(n) | O(1) at head, O(n) at index | O(1) given node, O(n) by value | O(n) | No random access; each node has overhead |
| Doubly linked list | O(n) | O(n) | O(1) given node | O(1) given node | O(n) | Used in LRU caches; can iterate both directions |
| Stack | n/a | O(n) | O(1) push | O(1) pop | O(n) | LIFO; built on array or linked list |
| Queue (deque) | n/a | O(n) | O(1) enqueue | O(1) dequeue | O(n) | FIFO; Python `collections.deque` is doubly linked |
| Circular buffer | O(1) | O(n) | O(1) | O(1) | O(n) | Fixed-size queue; oldest evicted on overflow |

**Gotchas:**

- Dynamic arrays are O(1) **at the end** and O(n) **in the middle**. `list.pop()` is fast; `list.pop(0)` shifts every other element. Use `collections.deque` if you need O(1) at both ends.
- Linked lists are O(1) to insert *given a node reference*. Finding that node is O(n). LeetCode problems usually hand you the node, hiding the search cost.
- Stack and queue costs assume an underlying structure that supports O(1) at the relevant end. A queue built on `list.pop(0)` is secretly O(n) per dequeue.

---

## Hash-based structures

| Structure | Search | Insert | Delete | Space | Worst case |
|---|---|---|---|---|---|
| Hash map / dict | O(1) avg | O(1) avg | O(1) avg | O(n) | O(n) on a collision storm |
| Hash set | O(1) avg | O(1) avg | O(1) avg | O(n) | O(n) worst |
| Counter / multiset (Python `Counter`) | O(1) avg | O(1) avg | O(1) avg | O(distinct) | Same as hash map |

**Gotchas:**

- The O(1) amortized claim depends on a good hash function. With adversarial keys (or `__hash__` you wrote yourself badly), every key collides and everything degrades to O(n).
- Resizing the table is O(n) and happens when load factor crosses a threshold. Most of the time it's invisible; occasionally an insert is unexpectedly slow.
- `dict` ordering in Python 3.7+ is insertion order. Don't rely on this for hash semantics, but it's reliable for iteration.
- Two hash maps used together can blow space without you noticing. A `set` of `(a, b)` tuples for n × m pairs is O(n · m) space.

---

## Trees

| Structure | Access | Search | Insert | Delete | Space | Notes |
|---|---|---|---|---|---|---|
| Binary search tree (unbalanced) | O(n) worst | O(n) worst | O(n) worst | O(n) worst | O(n) | Degenerates to a linked list on sorted input |
| BST balanced (AVL, red-black) | O(log n) | O(log n) | O(log n) | O(log n) | O(n) | Self-balancing on every insert/delete |
| B-tree | O(log n) | O(log n) | O(log n) | O(log n) | O(n) | Disk-friendly; large fanout reduces tree height |
| Trie | O(L) | O(L) | O(L) | O(L) | O(N · alphabet) | L = key length; great for prefix queries |
| Segment tree | n/a | O(log n) | O(log n) point update | O(log n) | O(4n) | Range queries (sum, min, max) on an array |
| Fenwick tree (BIT) | n/a | O(log n) prefix | O(log n) point update | n/a | O(n) | Smaller and faster constants than segment tree |
| Binary heap | O(1) peek root | O(n) general search | O(log n) push | O(log n) pop top | O(n) | Top-K, priority queue, scheduler |

**Gotchas:**

- "Binary search tree" by itself usually means *unbalanced*. The O(log n) bound only applies to **balanced** BSTs (AVL, red-black, treap, ...). On adversarial sorted input, an unbalanced BST is O(n).
- Tries trade space for time. A trie of all English words wastes a lot of nodes; a compressed trie (radix tree) saves space.
- Heaps are O(1) to peek but O(n) to **search by value**. They're fast at the extremes (top), slow in the middle. Don't reach for a heap to find an arbitrary element.
- Building a heap from a list is O(n) using `heapify`, not O(n log n). The reverse-level-order sift-down does the trick. Push-by-push is O(n log n).

---

## Graph representations

| Representation | Space | Edge lookup `(u, v)` | Iterate neighbors of `u` | Notes |
|---|---|---|---|---|
| Adjacency list | O(V + E) | O(degree(u)) | O(degree(u)) | Best for sparse graphs |
| Adjacency matrix | O(V²) | O(1) | O(V) | Best for dense graphs or frequent edge queries |
| Edge list | O(E) | O(E) | O(E) | Used by Kruskal's MST (sorts edges) |

**Choose by density:**

- Sparse (E ≪ V²): adjacency list. Most real graphs.
- Dense (E ≈ V²): adjacency matrix. Floyd-Warshall, image processing.
- Edge-centric algorithms: edge list. Kruskal's, weighted edge sorts.

---

## Specialized structures

| Structure | Operation | Time | Space | Notes |
|---|---|---|---|---|
| Union-Find / DSU | union, find | O(α(n)) ≈ O(1) | O(n) | With path compression + union by rank; α is inverse Ackermann |
| LRU cache | get, put | O(1) | O(capacity) | Hashmap + doubly linked list |
| Bloom filter | add, contains | O(k) | O(m) bits | k hash functions; allows false positives, no false negatives |
| Skip list | search, insert, delete | O(log n) avg | O(n) | Probabilistic balanced BST alternative |
| Suffix array | construction | O(n log n) | O(n) | Substring queries, longest common substring |
| Suffix tree | construction | O(n) | O(n) | More memory than suffix array; faster queries |

**Gotchas:**

- Union-Find without path compression and union by rank is O(log n), not O(α(n)). Both optimizations matter.
- Bloom filters trade certainty for space. They tell you **definitely not in the set** or **probably in the set**. False positives are by design.
- An LRU implemented with `OrderedDict.move_to_end` in Python gets you O(1) for free without writing the doubly linked list yourself.

---

## Python-specific quick reference

The operations that look fast but aren't, and the ones that look slow but aren't.

| Operation | Cost | Notes |
|---|---|---|
| `list.append(x)` | O(1) amortized | Doubling realloc occasionally |
| `list.pop()` | O(1) | From end |
| `list.pop(0)` | **O(n)** | Shifts everything left; use `deque` |
| `list.insert(0, x)` | **O(n)** | Same shift; use `deque.appendleft` |
| `x in list` | O(n) | Linear scan |
| `dict[k]` / `dict[k] = v` | O(1) avg | Hash collision is O(n) worst |
| `k in dict` / `k in set` | O(1) avg | Same caveat |
| `set & set`, `set \| set` | O(min) for `&`, O(sum) for `\|` | Returns a new set |
| `sorted(list)` | O(n log n) | Returns new list; Timsort |
| `list.sort()` | O(n log n) | In-place; same algorithm |
| `heapq.heappush` / `heappop` | O(log n) | Min-heap on a list |
| `heapq.heapify(list)` | **O(n)** | Faster than n pushes |
| `heapq.nlargest(k, iterable)` | O(n log k) | Internal size-k heap |
| `collections.deque.append` / `appendleft` | O(1) | Doubly linked list |
| `collections.deque.popleft` / `pop` | O(1) | |
| `string1 + string2` | O(n + m) | Use `''.join(parts)` for many concats |
| `''.join(list_of_strings)` | O(total length) | Preferred for many concats |
| `bisect.insort(list, x)` | O(n) | Binary search to find spot, but insert is O(n) |
| `bisect.bisect_left(list, x)` | O(log n) | Just the search; doesn't mutate |
| `array.array(...)` | O(1) per op | Compact typed array; smaller than `list` |

**The pattern that bites:** building a list with `result.insert(0, x)` in a loop. n inserts at index 0 = O(n²). Either build it backwards and reverse at the end (`list.append` then `list.reverse`), or use `deque.appendleft`.

---

## Algorithms cheat sheet

For completeness, the algorithm side of the table.

### Sorting

| Algorithm | Best | Average | Worst | Space | Stable? | Notes |
|---|---|---|---|---|---|---|
| Insertion sort | O(n) | O(n²) | O(n²) | O(1) | yes | Good for tiny inputs |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | yes | Predictable; external sort friendly |
| Quicksort | O(n log n) | O(n log n) | O(n²) | O(log n) | no | Fast in practice; pick random pivot |
| Heapsort | O(n log n) | O(n log n) | O(n log n) | O(1) | no | In-place, no pathological worst case |
| Timsort (Python `sort`) | O(n) | O(n log n) | O(n log n) | O(n) | yes | Hybrid; runs detected for nearly-sorted data |
| Counting sort | O(n + k) | O(n + k) | O(n + k) | O(n + k) | yes | k = value range; only small ranges |
| Radix sort | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) | O(n + k) | yes | d = digit count |

### Searching and graph algorithms

| Algorithm | Time | Space | Notes |
|---|---|---|---|
| Linear scan | O(n) | O(1) | Default for unsorted |
| Binary search | O(log n) | O(1) | Sorted only |
| BFS | O(V + E) | O(V) | Shortest path on unweighted |
| DFS | O(V + E) | O(V) | Recursion or explicit stack |
| Dijkstra (with min-heap) | O((V + E) log V) | O(V) | Non-negative weights |
| Bellman-Ford | O(V · E) | O(V) | Handles negatives, detects negative cycles |
| Floyd-Warshall | O(V³) | O(V²) | All-pairs shortest paths |
| Topological sort (Kahn / DFS) | O(V + E) | O(V) | DAG only |
| Kruskal MST | O(E log E) | O(V) | Sort edges + Union-Find |
| Prim MST | O((V+E) log V) | O(V) | Heap-based |
| Quickselect (kth element) | O(n) avg, O(n²) worst | O(1) | Random pivot makes worst case unlikely |

### Dynamic programming

| Pattern | Time | Space (full) | Space (rolled) |
|---|---|---|---|
| 1D DP, fixed lookback | O(n) | O(n) | O(1) |
| 2D DP, grid | O(m · n) | O(m · n) | O(min(m, n)) |
| 0/1 knapsack | O(n · W) | O(n · W) | O(W) |
| Unbounded knapsack | O(n · W) | O(W) | O(W) |
| LCS, edit distance | O(m · n) | O(m · n) | O(min(m, n)) |
| Subset sum | O(n · S) | O(n · S) | O(S) |
| Matrix chain multiplication | O(n³) | O(n²) | n/a |

### Backtracking

| Output type | Time | Space | Example |
|---|---|---|---|
| All subsets (2^n) | O(2^n · n) | O(n) recursion | LeetCode 78 |
| All permutations (n!) | O(n! · n) | O(n) recursion | LeetCode 46 |
| All k-combinations | O(C(n,k) · k) | O(k) | LeetCode 77 |

---

## The 1-second sanity check

Modern hardware does roughly 10⁸ simple operations per second. Use this table to sanity-check whether your algorithm fits.

| Input size n | Acceptable complexity (1 sec budget) |
|---|---|
| n ≤ 10 | O(n!) or O(2^n) |
| n ≤ 20 | O(2^n) |
| n ≤ 100 | O(n^4) |
| n ≤ 1,000 | O(n^3) |
| n ≤ 10,000 | O(n^2) |
| n ≤ 100,000 | O(n log n) or O(n √n) |
| n ≤ 1,000,000 | O(n) or O(n log n) |
| n ≤ 10⁹ | O(log n) or O(1) |

If your back-of-envelope op count goes past 10⁸, your algorithm needs work, not your CPU. The table tells you what complexity class you have to hit before you start coding.

---

## Common mistakes when quoting complexity

1. **Forgetting the log factor in heap top-K.** Pushing n items into a size-k heap is O(n log k), not O(n). The log shows up because every push/pop on a k-element heap costs O(log k).
2. **Saying O(1) space for a sort.** In-place sorts still use O(log n) auxiliary for recursion, and Timsort uses O(n) for its merge buffers. "O(1) extra" is true for heapsort, not for `list.sort()`.
3. **Saying O(n) for `list.pop(0)`** is correct, but people *use* `pop(0)` thinking it's O(1). Use `deque`.
4. **Conflating "time to build" with "time to query."** A trie is O(L) per query *after* building. Building costs O(total characters across all keys).
5. **Forgetting graph algorithms scale with edges, not nodes.** A dense graph of V nodes has V² edges. Dijkstra on a dense graph is O(V² log V), not O(V log V).
6. **Treating `2^h ≈ n` as the general answer for tree problems.** It only holds for *perfect* binary trees. The general answer is "O(n) -- you visit each node once."

---

## Memorize the shapes, not the numbers

The high-leverage move is to recognize the **shape** of an algorithm and quote the standard complexity for that shape:

| Shape | Time | Space |
|---|---|---|
| Single pass over input | O(n) | O(1) |
| Sort then sweep | O(n log n) | O(n) output |
| Binary search | O(log n) | O(1) |
| BFS / DFS | O(V + E) | O(V) |
| 1D DP rolling | O(n) | O(1) |
| 2D DP table | O(m · n) | O(m · n) |
| Heap top-K | O(n log k) | O(k) |
| Backtracking subsets | O(2^n) | O(n) recursion |

If you can match a problem to one of these shapes, you can quote the complexity before reading the second half of the prompt.

---

## References

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms* (CLRS), 4th ed., MIT Press.
- Sedgewick & Wayne, *Algorithms*, 4th ed.
- [Python time complexity wiki](https://wiki.python.org/moin/TimeComplexity), the canonical reference for `list`, `dict`, `set`, `deque` operations.
- [Big-O cheat sheet](https://www.bigocheatsheet.com/), the visual reference most people pull up during interviews.
- [USACO Guide complexity reference](https://usaco.guide/general/time-comp), competitive-programming flavored.

## Related topics

- [Data structures](../topics/cs/data-structures/), the longer-form pages, one per structure.
- [LeetCode 150](../topics/cs/leetcode-150/), problems organized by pattern, with complexity in every solution.
- [Heaps and priority queues](../topics/cs/data-structures/heaps/), why `heapify` is O(n) and not O(n log n).
- [Stacks](../topics/cs/data-structures/stacks/), the LIFO discipline and where it shows up.
