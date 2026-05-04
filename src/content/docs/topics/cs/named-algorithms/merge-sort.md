---
title: "Merge sort"
description: "Divide-and-conquer sorting in guaranteed O(n log n) time: split the array in half recursively until trivially sorted, then merge the sorted halves back in linear time."
parent: named-algorithms
tags: [algorithms, sorting, divide-and-conquer, recursion, interviews]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it does

Merge sort sorts an array in O(n log n) time, guaranteed. Not average-case. Not amortized. Every input, every time.

That guarantee is one reason merge sort shows up whenever you cannot afford a worst-case blowup: external sorting on disk, sorting linked lists, and any multi-key sort that needs to preserve the relative order of equal elements (stability).

It also sits at the theoretical floor for comparison-based sorting. Any algorithm that sorts by comparing elements must make at least O(n log n) comparisons in the worst case. Merge sort hits that bound exactly, which makes it the baseline every other comparison sort is measured against.

The algorithm was first described by John von Neumann in 1945 in notes on the EDVAC, one of the earliest stored-program computers. It is one of the oldest named algorithms still in everyday use.

## The core idea, in one sentence

> Merging two already-sorted arrays into one takes O(n) time; applying that operation recursively via divide-and-conquer produces a full sort in O(n log n) total work.

That is the whole algorithm. Split until trivial (a single element is already sorted). Merge on the way back up.

## The recursive implementation

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)
```

Three lines of real logic:
- **Base case:** an array of 0 or 1 elements is already sorted, return it.
- **Divide:** split at the midpoint into `left` and `right` halves.
- **Conquer:** sort each half recursively, then merge the results.

The call stack unwinds from the bottom up. By the time any `merge` call executes, both inputs are already sorted, which is exactly the precondition `merge` requires.

## The merge helper

```python
def merge(left, right):
    result = []
    i = j = 0

    # Two-pointer comparison loop
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:   # <= keeps equal elements in original order (stability)
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Append any remaining elements from whichever half is not exhausted
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

The two-pointer loop is the engine. `i` walks `left`, `j` walks `right`. At each step, pick the smaller front element and advance that pointer. When one half runs out, the other is already sorted, so you can append the tail wholesale.

The `<=` in the comparison (not `<`) is what makes merge sort stable. When `left[i] == right[j]`, the element from the left half goes first, preserving its earlier position. If you flip to `<`, you break stability.

## The bottom-up iterative version

The recursive version allocates O(log n) stack frames. For very large inputs (tens of millions of elements) that can overflow the default recursion limit. The bottom-up version eliminates the call stack entirely by iterating over merge widths.

```python
def merge_sort_iterative(arr):
    n = len(arr)
    arr = arr[:]            # work on a copy
    width = 1

    while width < n:
        for i in range(0, n, 2 * width):
            left_start  = i
            mid         = min(i + width, n)
            right_end   = min(i + 2 * width, n)

            merged = merge(arr[left_start:mid], arr[mid:right_end])
            arr[left_start:right_end] = merged

        width *= 2

    return arr
```

How it works:
- Round 1 (`width=1`): merge adjacent pairs of single elements into sorted pairs.
- Round 2 (`width=2`): merge adjacent sorted pairs into sorted groups of 4.
- Round 3 (`width=4`): merge groups of 4 into groups of 8.
- Continue doubling until `width >= n`.

This is cache-friendly because each round accesses memory in sequential strides. It also avoids Python's default recursion limit of 1000, which kicks in long before n=1000 for deeply nested trees. Use the iterative form whenever n is large or stack depth is constrained.

## Walk through: 8-element array

Input: `[5, 2, 8, 1, 9, 3, 7, 4]`

**Split phase** (top-down):

```
[5, 2, 8, 1, 9, 3, 7, 4]
         /            \
   [5, 2, 8, 1]    [9, 3, 7, 4]
     /      \        /      \
  [5, 2]  [8, 1]  [9, 3]  [7, 4]
   / \     / \     / \     / \
  [5][2]  [8][1]  [9][3]  [7][4]
```

Every leaf is a single element: trivially sorted.

**Merge phase** (bottom-up on the way back):

```
Level 3 (merge pairs):
  merge([5],[2])  -> [2, 5]
  merge([8],[1])  -> [1, 8]
  merge([9],[3])  -> [3, 9]
  merge([7],[4])  -> [4, 7]

Level 2 (merge halves of 4):
  merge([2,5],[1,8])  -> [1, 2, 5, 8]
  merge([3,9],[4,7])  -> [3, 4, 7, 9]

Level 1 (merge the two halves):
  merge([1,2,5,8],[3,4,7,9])

  i=0,j=0: 1 vs 3  -> take 1   result=[1]
  i=1,j=0: 2 vs 3  -> take 2   result=[1,2]
  i=2,j=0: 5 vs 3  -> take 3   result=[1,2,3]
  i=2,j=1: 5 vs 4  -> take 4   result=[1,2,3,4]
  i=2,j=2: 5 vs 7  -> take 5   result=[1,2,3,4,5]
  i=3,j=2: 8 vs 7  -> take 7   result=[1,2,3,4,5,7]
  i=3,j=3: 8 vs 9  -> take 8   result=[1,2,3,4,5,7,8]
  j exhausted -> extend [9]     result=[1,2,3,4,5,7,8,9]
```

Output: `[1, 2, 3, 4, 5, 7, 8, 9]`

## Why it's O(n log n)

Two facts combine:

**Fact 1: there are log n levels of recursion.**
Each split cuts the array in half. You can halve n at most log2(n) times before reaching size 1. So the tree has height log n.

**Fact 2: each level does O(n) total merge work.**
At every level of the tree, the sub-arrays at that level partition the original array without overlap. Every element appears in exactly one sub-array per level. The merge at each node takes time proportional to the size of its output. Summing across all nodes at one level gives O(n) total comparisons.

Multiplying: log n levels x O(n) work per level = **O(n log n)** total.

```
Level 0:  1 merge of n       = n  comparisons
Level 1:  2 merges of n/2    = n  comparisons
Level 2:  4 merges of n/4    = n  comparisons
...
Level k:  2^k merges of n/2^k= n  comparisons
                                  (k goes from 0 to log n - 1)
Total:   n * log n comparisons
```

Unlike quicksort, there is no unlucky pivot that collapses this. The split is always exactly half. The guarantee is unconditional.

## Complexity

| Metric           | Cost                                                       |
| ---------------- | ---------------------------------------------------------- |
| Time (best)      | O(n log n)                                                 |
| Time (average)   | O(n log n)                                                 |
| Time (worst)     | O(n log n)                                                 |
| Space (aux array)| O(n) for the temporary arrays during merge                 |
| Space (call stack)| O(log n) stack frames for the recursive version           |

The O(n) auxiliary space is the main cost relative to in-place sorts. You cannot merge two halves of an array in place without either O(n) extra space or O(n log n) extra comparisons. Standard merge sort pays the O(n) space and keeps the algorithm simple.

## Stability

Merge sort is stable: if two elements compare as equal, the one that appeared earlier in the input will appear earlier in the output.

The mechanism is the `<=` in the merge loop. When `left[i] == right[j]`, we take from `left` first. Left elements came from the earlier half of the input, so their relative order is preserved.

**Why stability matters for multi-key sorting.** Suppose you have a list of transactions with a date and an amount, and you want them sorted first by date, then by amount within each date. The easy way: sort by amount first (stable), then sort by date (stable). Because the second sort is stable, equal-date entries remain in the order the first sort produced, which was amount order. You get the correct two-key ordering without writing a comparator that handles both keys at once. This is called a radix-sort-style cascade, and it only works if every pass is stable.

Quicksort (in standard form) is not stable, so this trick breaks with quicksort.

## Comparison to quicksort

Both are divide-and-conquer. Their performance profiles are different in ways that matter in practice.

| Property          | Merge sort                   | Quicksort                          |
| ----------------- | ---------------------------- | ---------------------------------- |
| Time (worst case) | O(n log n), always           | O(n^2) on bad pivot choices        |
| Time (average)    | O(n log n)                   | O(n log n)                         |
| Space             | O(n) auxiliary array         | O(log n) stack, in-place partition |
| Stable            | Yes                          | No (standard partition)            |
| Cache behavior    | Sequential access, decent    | Better cache locality in practice  |
| Preferred for     | Linked lists, external sort  | In-memory arrays (typical case)    |

In practice, well-implemented quicksort (with randomized pivots or median-of-three) is often faster than merge sort on random data because its in-place partition has better cache locality: it touches fewer distinct memory locations per comparison. Python's built-in `sorted()` and Java's `Arrays.sort()` for objects both use Timsort, a merge-sort variant that detects natural runs in the data and avoids splitting already-sorted subsequences.

If you need guaranteed O(n log n) with no worst-case risk (e.g., sorting user-supplied data where an adversary might send pathological inputs), merge sort is the safer bet. If you are sorting on disk (external sort) where reading two sequential halves is cheap and random access is expensive, merge sort's sequential access pattern is the right choice. If you are sorting a linked list, merge sort wins outright (see below).

## Where merge sort appears in real systems

**Timsort (Python, Java, Android, Swift).** Python's `sorted()` and Java's `Collections.sort()` both use Timsort, designed by Tim Peters in 2002. Timsort scans the input for natural runs (already-ascending or descending sequences) and uses insertion sort to build minimum-length runs, then merges them with a merge sort strategy. On nearly-sorted data it degrades to nearly O(n). On random data it matches merge sort's O(n log n). The stability guarantee is preserved throughout.

**External sort (databases, MapReduce).** When data does not fit in memory, you split it into chunks that do fit, sort each chunk (any in-memory algorithm), write the sorted chunks to disk, then k-way merge the chunks. The merge phase is merge sort operating on disk files instead of arrays. The merge step's sequential read pattern is critical: spinning disks and SSDs both deliver their highest throughput on sequential I/O. Random access (as in quicksort's partition) would cost an order of magnitude more per operation. Every major database (PostgreSQL, MySQL, SQLite) uses an external merge sort for ORDER BY on large result sets.

**Inversion distance in bioinformatics.** Counting inversions (covered below) measures edit distance between gene sequences. The O(n log n) merge-sort approach is standard in computational genomics tools.

## Merge sort on linked lists

For arrays, merge sort needs O(n) auxiliary space because you cannot efficiently access the midpoint of a half without copying it somewhere. For linked lists, the situation is different.

Finding the midpoint of a linked list takes O(n) time (fast/slow pointer), which does not change the asymptotic cost. More importantly, the merge step for linked lists requires zero auxiliary space: instead of copying elements into a result array, you re-link the `next` pointers of the existing nodes. No allocation.

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val  = val
        self.next = next

def sort_list(head):
    if not head or not head.next:
        return head

    # Find midpoint with slow/fast pointers
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    mid        = slow.next
    slow.next  = None          # split the list

    left  = sort_list(head)
    right = sort_list(mid)
    return merge_lists(left, right)

def merge_lists(l1, l2):
    dummy = ListNode(0)
    cur   = dummy
    while l1 and l2:
        if l1.val <= l2.val:
            cur.next = l1
            l1 = l1.next
        else:
            cur.next = l2
            l2 = l2.next
        cur = cur.next
    cur.next = l1 or l2
    return dummy.next
```

The merge re-links existing nodes: no `append`, no auxiliary list. This is why merge sort is the canonical algorithm for linked list sorting. LeetCode 148 (Sort List) is the standard exercise.

## Application: counting inversions

An inversion in an array is a pair of indices `(i, j)` with `i < j` but `arr[i] > arr[j]`. The inversion count measures how "unsorted" an array is: a sorted array has 0 inversions, a reverse-sorted array has n*(n-1)/2.

Counting inversions in O(n^2) is straightforward (check every pair). Doing it in O(n log n) is a merge sort application.

The key insight: during the merge step, when you take an element from the `right` half before exhausting the `left` half, every remaining element in `left` forms an inversion with that `right` element. Those are called cross-inversions because they cross the split boundary.

```python
def count_inversions(arr):
    if len(arr) <= 1:
        return arr, 0

    mid = len(arr) // 2
    left,  left_inv  = count_inversions(arr[:mid])
    right, right_inv = count_inversions(arr[mid:])

    merged = []
    inversions = left_inv + right_inv
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            # right[j] is smaller than all remaining left elements
            inversions += len(left) - i    # count cross-inversions
            merged.append(right[j])
            j += 1

    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged, inversions
```

Walk through `[3, 1, 2]`:

```
split: [3] and [1, 2]

sort [1, 2]:
  merge([1],[2]): 1 <= 2, take 1; take 2. 0 inversions.

merge([3], [1, 2]):
  i=0, j=0: 3 > 1 -> take 1, inversions += len([3]) - 0 = 1   (pair: 3>1)
  i=0, j=1: 3 > 2 -> take 2, inversions += len([3]) - 0 = 1   (pair: 3>2)
  extend [3]
  total cross-inversions: 2

Total: 0 + 0 + 2 = 2 inversions: (3,1) and (3,2). Correct.
```

The sorted output is a free byproduct. You pay the same O(n log n) cost as merge sort and get the inversion count along the way.

## LeetCode exercises

The merge step appears directly or in generalized form across several problems:

- [Merge Two Sorted Lists (021)](../leetcode-150/linked-list/021-merge-two-sorted-lists/) is the `merge_lists` function in isolation. If you can write that function from memory, the linked-list sort above follows immediately.
- [Merge k Sorted Lists (023)](../leetcode-150/linked-list/023-merge-k-sorted-lists/) generalizes the two-way merge to k inputs. The standard approach uses a min-heap to pick the smallest front element across all k lists in O(log k) per step, giving O(n log k) total. Alternatively, you can apply the two-way merge pairwise in log k rounds, which also gives O(n log k).
- LeetCode 148 (Sort List) is the full linked-list merge sort above.
- LeetCode 315 (Count of Smaller Numbers After Self) is a per-element inversion count, solved with the counting-inversions technique.

## Test cases

```python
def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    return merge(merge_sort(arr[:mid]), merge_sort(arr[mid:]))

def count_inversions(arr):
    if len(arr) <= 1:
        return arr, 0
    mid = len(arr) // 2
    left,  li = count_inversions(arr[:mid])
    right, ri = count_inversions(arr[mid:])
    merged = []
    inv = li + ri
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            inv += len(left) - i
            merged.append(right[j]); j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged, inv

def _run_tests():
    # basic sort
    assert merge_sort([5, 2, 8, 1, 9, 3, 7, 4]) == [1, 2, 3, 4, 5, 7, 8, 9]
    assert merge_sort([1]) == [1]
    assert merge_sort([2, 1]) == [1, 2]
    assert merge_sort([1, 2, 3]) == [1, 2, 3]       # already sorted
    assert merge_sort([3, 2, 1]) == [1, 2, 3]       # reverse sorted
    assert merge_sort([-3, 0, -1, 2]) == [-3, -1, 0, 2]

    # stability: equal elements preserve original order
    # tag each element with its original index
    tagged = [(v, i) for i, v in enumerate([3, 1, 3, 2, 1])]
    sorted_tagged = merge_sort(tagged)
    vals = [v for v, _ in sorted_tagged]
    idxs = [i for _, i in sorted_tagged]
    assert vals == [1, 1, 2, 3, 3]
    assert idxs[0] < idxs[1]    # first 1 came before second 1
    assert idxs[3] < idxs[4]    # first 3 came before second 3

    # inversion count
    _, inv = count_inversions([3, 1, 2])
    assert inv == 2
    _, inv = count_inversions([1, 2, 3])
    assert inv == 0
    _, inv = count_inversions([3, 2, 1])
    assert inv == 3              # (3,2), (3,1), (2,1)
    _, inv = count_inversions([1])
    assert inv == 0

    print("all tests pass")

if __name__ == "__main__":
    _run_tests()
```

## References

- von Neumann, J. (1945). First description of merge sort in notes on the EDVAC, credited as the origin of the algorithm.
- Knuth, D. E. (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley. Section 5.2.4 covers merge sorting in exhaustive detail.
- Cormen, T. H., Leiserson, C. E., Rivest, R. L., and Stein, C. (2022). *Introduction to Algorithms* (4th ed.). MIT Press. Chapter 2.3 introduces merge sort; Chapter 8 proves the O(n log n) comparison-sort lower bound.

## Related topics

- [Quickselect](./quickselect/), a partition-based algorithm from the same divide-and-conquer family, with O(n) average time for order statistics
- [Linked list problems (LeetCode 150)](../leetcode-150/linked-list/), where merge sort's pointer-relinking advantage is most visible
- [Data structures](../data-structures/), for the array and linked list structures merge sort operates on
