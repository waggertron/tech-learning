---
title: "Floyd's tortoise and hare"
description: "Cycle detection and cycle-start finding in O(n) time and O(1) space using two pointers at different speeds, plus the phase-2 math that locates exactly where the cycle begins."
parent: named-algorithms
tags: [algorithms, linked-list, two-pointers, cycle-detection, interviews]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## What it does

Given a linked list (or any structure you can model as a sequence of pointer hops), determine whether the sequence eventually loops back on itself, and if so, find the exact node where the cycle begins.

Named after Robert W. Floyd, who described the algorithm in unpublished work around 1967. It appears in Knuth's *The Art of Computer Programming* (1969) and is the canonical answer to [LeetCode 141 (Linked List Cycle)](../leetcode-150/linked-list/141-linked-list-cycle/) and 142 (Linked List Cycle II).

The algorithm runs two passes:

- **Phase 1:** detect whether a cycle exists (tortoise and hare meet inside the cycle, or hare falls off the end)
- **Phase 2:** find the exact node where the cycle begins (reset one pointer to head, step both at speed 1)

Both passes are O(n) time, O(1) space. No visited-set needed.

## Core idea, in one sentence

> If two runners lap a circular track at different speeds, the faster one must eventually catch the slower one from behind.

That is the whole algorithm. The non-obvious part is phase 2: once they've met, a single reset and a synchronized walk brings both pointers to the cycle entrance simultaneously. The math for why that works is below.

## Phase 1: detect a cycle

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next          # 1 step
        fast = fast.next.next     # 2 steps
        if slow is fast:
            return True
    return False
```

Two pointers start at `head`. Each iteration, `slow` advances one node and `fast` advances two. If there is no cycle, `fast` (or `fast.next`) hits `None` and the loop exits cleanly. If there is a cycle, `fast` laps `slow` inside the cycle and they meet at the same node.

Why do they always meet (and not "skip over" each other)? Because the gap between them decreases by exactly 1 each iteration: if `fast` is `k` nodes behind `slow` in the cycle, after one step it is `k-1` nodes behind. At `k=0` they are at the same node. Gap shrinks monotonically to zero, so they must land on the same node.

## Phase 2: find the cycle entrance

```python
def detect_cycle(head):
    slow = fast = head

    # Phase 1: find meeting point inside cycle
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            break
    else:
        # fast hit None, no cycle
        return None

    # Phase 2: find cycle entrance
    slow = head            # reset slow to head
    while slow is not fast:
        slow = slow.next   # both move at speed 1 now
        fast = fast.next
    return slow            # the cycle entrance node
```

After phase 1 finds the meeting point, reset `slow` to `head` (leave `fast` at the meeting point). Step both one node at a time. They will meet exactly at the node where the cycle begins. The math below proves why.

## The math: why phase 2 works

Label the list geometry with three values:

```
F  = number of nodes from head to the cycle entrance (the "tail length")
C  = total length of the cycle
a  = number of nodes from the cycle entrance to the meeting point,
     measured in the forward direction around the cycle
     (so 0 <= a < C)
```

ASCII picture:

```
head
  |
  v
  0 -> 1 -> 2 -> ... -> [entrance] -> ... -> [meeting pt] -> ...
                         ^                                       |
                         |_______________________________________|
                                    (cycle length C)
```

At the meeting point (end of phase 1):

- `slow` has traveled exactly `F + a` steps (entered the cycle, went `a` steps in).
- `fast` has traveled exactly `F + a + nC` steps for some integer `n >= 1` (entered the cycle, went around it `n` full times, plus `a` more steps to land on the same node as `slow`).

Because `fast` moves twice as fast as `slow`:

```
2 * (F + a) = F + a + nC
    F + a   = nC
    F       = nC - a
```

Now interpret `F = nC - a`:

- `slow` starts at `head` and needs `F` more steps to reach the entrance.
- `fast` is at the meeting point, which is `a` steps past the entrance inside the cycle. It needs `nC - a` more steps to return to the entrance (going `C - a` steps to complete the current lap, then `(n-1)C` more full laps, total `nC - a`).

But `F = nC - a`, so both pointers need the same number of steps to reach the entrance. Step them in sync at speed 1 and they arrive together. The node where they meet is the cycle entrance.

For the simplest case `n = 1`:

```
F = C - a
```

Meaning: the distance from `head` to the entrance equals the distance from the meeting point to the entrance (going forward around the remaining arc of the cycle). Visually satisfying: the meeting point is the "mirror" of the entrance across the cycle, and walking them both toward the entrance covers equal ground.

## Concrete walk-through

Build this list: `1 -> 2 -> 3 -> 4 -> 5 -> 6 -> (back to 3)`.

```
head
  |
  1 -> 2 -> 3 -> 4 -> 5 -> 6
            ^               |
            |_______________|
```

Values: F = 2 (nodes 1 and 2 before the entrance at node 3), C = 4 (cycle: 3,4,5,6).

**Phase 1 trace** (both start at node 1):

| Step | slow | fast |
| ---- | ---- | ---- |
| 0    | 1    | 1    |
| 1    | 2    | 3    |
| 2    | 3    | 5    |
| 3    | 4    | 3    |
| 4    | 5    | 5    |

Meeting point: node 5. So `a = 2` (nodes 3 and 4 separate the entrance from the meeting point).

Check: `F = nC - a` -> `2 = 1*4 - 2 = 2`. Confirmed.

**Phase 2 trace** (slow reset to node 1, fast stays at node 5):

| Step | slow | fast |
| ---- | ---- | ---- |
| 0    | 1    | 5    |
| 1    | 2    | 6    |
| 2    | 3    | 3    |

They meet at node 3, which is the cycle entrance. Correct.

## Complexity

| Metric | Cost |
| ------ | ---- |
| Time (phase 1) | O(F + C) = O(n) |
| Time (phase 2) | O(F) = O(n) |
| Space | O(1), two pointer variables |

Phase 1 takes at most `F + C` steps: `F` steps to enter the cycle, then at most `C` more before `fast` laps `slow`. Phase 2 takes exactly `F` steps. Total is O(n).

## Why not just use a hash set?

The hash-set approach stores every visited node and checks each new node against the set:

```python
def has_cycle_hashset(head):
    seen = set()
    node = head
    while node:
        if id(node) in seen:
            return True
        seen.add(id(node))
        node = node.next
    return False
```

This is O(n) time but also O(n) space: in the worst case you store every node before hitting the duplicate. Floyd's algorithm solves the same problem in O(1) space. The hash-set approach is simpler to explain and perfectly fine for code that already tracks nodes for other reasons, but whenever the interviewer says "can you do it in constant space?", Floyd's is the answer.

The O(1) constraint also matters for very large lists where heap pressure is a real concern, and for embedded or memory-constrained environments where allocating a variable-size set isn't acceptable.

## Application 1: find the duplicate number ([LeetCode 287](../leetcode-150/linked-list/287-find-the-duplicate-number/))

The problem: given an array `nums` of `n+1` integers where each value is in `[1, n]`, find the one duplicate. You must not modify the array and must use O(1) extra space.

The trick: treat the array as an implicit linked list where `nums[i]` is the "next" pointer from index `i`. Because every value is in `[1, n]` and indices are in `[0, n]`, following `nums[i]` always lands on a valid index. Because there are `n+1` slots but only `n` distinct valid values, the duplicate creates a cycle (two indices point to the same next index).

```python
def find_duplicate(nums):
    # Phase 1: detect cycle
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break

    # Phase 2: find entrance (= the duplicate value)
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow
```

Here "pointer" means array index and "following a pointer" means `nums[index]`. The duplicate number is exactly the cycle entrance because it is the index that two different positions point to. Same phase-2 math applies.

Example: `nums = [1, 3, 4, 2, 2]`.

```
Index: 0  1  2  3  4
Value: 1  3  4  2  2

Following: 0 -> nums[0]=1 -> nums[1]=3 -> nums[3]=2 -> nums[2]=4 -> nums[4]=2 -> nums[2]=4 -> ...
                                                         ^                              |
                                                         |______________________________|
```

Cycle entrance is index 2, value `2`. That is the duplicate. Floyd's finds it with no sorting and no hash set.

## Application 2: middle of a linked list

A simpler use of the two-pointer idea (no phase 2 needed): when `fast` reaches the end, `slow` is at the middle.

```python
def middle_node(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

When `fast` exits the loop (hits `None` or a node with no `next`), `slow` has traveled half as far: the middle node.

For even-length lists this returns the second of the two middle nodes, which is what LeetCode 876 expects. If you need the first middle node, check `fast.next` and `fast.next.next` separately and stop one step earlier.

This same "slow at half-speed" idea underlies k-th-from-end problems (offset the pointers by `k` and then move together until `fast` hits the end).

## Counter-clues: when Floyd's does not apply

- **Plain arrays with no implicit graph.** Floyd's needs a "follow the pointer" step. A raw array of integers without the value-as-index trick has no edges to traverse.
- **You need the cycle length, not just the entrance.** Floyd's finds the entrance but doesn't directly tell you `C`. You can measure `C` by continuing from the meeting point until you return, but that's extra work the algorithm doesn't give you for free.
- **Multiple cycles.** Floyd's detects whether any cycle exists in the reachable sequence from a single start. It doesn't enumerate all cycles in an arbitrary graph. For that, use DFS with a color-marking scheme.
- **You need the full path to the entrance, not just the node.** Floyd's identifies the node, but not the route. If you need to reconstruct the path, a hash set (which logs the path) is easier.
- **The sequence is not deterministic.** Floyd's requires that following a pointer from a node always leads to the same next node. Non-deterministic or mutable next pointers break the phase-2 math.

## LeetCode exercises

| Problem | Link | What to practice |
| ------- | ---- | ---------------- |
| 141. Linked List Cycle | [../leetcode-150/linked-list/141-linked-list-cycle/](../leetcode-150/linked-list/141-linked-list-cycle/) | Phase 1 only |
| 142. Linked List Cycle II | Phase 2 + math | Find cycle entrance |
| 287. Find the Duplicate Number | [../leetcode-150/linked-list/287-find-the-duplicate-number/](../leetcode-150/linked-list/287-find-the-duplicate-number/) | Implicit linked list via array |

Start with 141 to get the detection loop clean, then move to 142 to cement the phase-2 reset. Do 287 last: it tests whether you can see the array-as-linked-list framing, which is the creative leap.

## Test cases

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False


def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            break
    else:
        return None
    slow = head
    while slow is not fast:
        slow = slow.next
        fast = fast.next
    return slow


def find_duplicate(nums):
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow


def _make_list(vals, cycle_pos=None):
    """Build a linked list; if cycle_pos is set, tail points back to that index."""
    if not vals:
        return None
    nodes = [ListNode(v) for v in vals]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if cycle_pos is not None:
        nodes[-1].next = nodes[cycle_pos]
    return nodes[0], nodes  # return nodes so caller can inspect entrance


def _run_tests():
    # has_cycle: no cycle
    head, _ = _make_list([1, 2, 3, 4, 5])
    assert has_cycle(head) is False

    # has_cycle: cycle at tail
    head, nodes = _make_list([1, 2, 3, 4, 5], cycle_pos=4)
    assert has_cycle(head) is True

    # has_cycle: cycle at head (single-node self-loop)
    node = ListNode(1)
    node.next = node
    assert has_cycle(node) is True

    # has_cycle: single node, no cycle
    assert has_cycle(ListNode(42)) is False

    # detect_cycle: entrance at index 2 (the "3" node)
    head, nodes = _make_list([1, 2, 3, 4, 5, 6], cycle_pos=2)
    entrance = detect_cycle(head)
    assert entrance is nodes[2]

    # detect_cycle: entrance at index 0 (full-loop)
    head, nodes = _make_list([1, 2, 3], cycle_pos=0)
    entrance = detect_cycle(head)
    assert entrance is nodes[0]

    # detect_cycle: no cycle returns None
    head, _ = _make_list([1, 2, 3])
    assert detect_cycle(head) is None

    # find_duplicate: basic cases
    assert find_duplicate([1, 3, 4, 2, 2]) == 2
    assert find_duplicate([3, 1, 3, 4, 2]) == 3
    assert find_duplicate([1, 1]) == 1
    assert find_duplicate([2, 2, 2, 2, 2]) == 2

    print("all tests pass")


if __name__ == "__main__":
    _run_tests()
```

## References

- Floyd, R. W. (unpublished, c. 1967). Cited in Knuth, D. E. (1969). *The Art of Computer Programming, Vol. 2: Seminumerical Algorithms.* Addison-Wesley. Section 3.1, Exercise 6. This is the original source.
- Brent, R. P. (1980). "An improved Monte Carlo factorization algorithm." *BIT Numerical Mathematics* 20(2): 176-184. Brent's variant finds the cycle length in fewer function evaluations; Floyd's variant is simpler to implement for entrance-finding.
- [LeetCode 141, Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)
- [LeetCode 142, Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/)
- [LeetCode 287, Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)

## Related topics

- [BFS](./bfs/), graph traversal that also detects structure reachable from a start node
- [DFS](./dfs/), finds back edges (and thus cycles) in arbitrary directed graphs with color marking
- [LeetCode 150, linked-list problems](../leetcode-150/linked-list/), the exercise set that uses Floyd's most often
- [Data structures](../data-structures/), for the linked-list mechanics Floyd's operates on
