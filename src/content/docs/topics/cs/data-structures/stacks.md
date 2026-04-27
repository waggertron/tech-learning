---
title: Stacks
description: LIFO (last-in, first-out) structure. Push and pop from the same end, all O(1). The natural fit for nesting, backtracking, and reverse-order problems.
parent: data-structures
tags: [data-structures, stacks, interviews]
status: draft
created: 2026-04-23
updated: 2026-04-23
---

## Intro

A stack is a **LIFO** (last-in, first-out) collection. You push elements onto the top and pop them off the top; both operations are O(1). Stacks are the natural fit for any problem involving **nesting**, **backtracking**, or needing to process elements in **reverse order** relative to insertion. They also underlie recursion itself, the call stack is a stack.

## In-depth description

Implementation is straightforward: a dynamic array (Python `list`, Java `ArrayDeque`, C++ `std::stack` over `std::deque`) or a linked list with a head pointer. Both give O(1) push/pop/peek with different memory tradeoffs.

The most powerful and interview-relevant pattern is the **monotonic stack**, a stack that maintains its elements in sorted (monotonic) order by popping elements that violate the order on each push. This turns many "find the next greater/smaller element" problems from O(n²) into O(n), because each element is pushed and popped at most once. Classic applications: Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water (one of several approaches).

Other frequent stack patterns:

- **Parentheses / delimiter matching**, push on open, pop and compare on close.
- **Iterative DFS**, replace the system recursion stack with an explicit stack to avoid stack-overflow on deep trees/graphs.
- **Expression evaluation**, Reverse Polish Notation, Shunting-yard, Basic Calculator, stacks handle the operand/operator precedence.
- **Undo history and backtracking**, push decisions, pop to revert.

A stack is also the memory model for function calls (the call stack): every recursion problem can be rewritten with an explicit stack, and sometimes must be (for very deep recursion in languages without tail-call elimination).

## Time complexity

| Operation | Average | Worst |
| --- | --- | --- |
| Push | O(1) amortized | O(n) (resize) |
| Pop | O(1) | O(1) |
| Peek / top | O(1) | O(1) |
| Search by value | O(n) | O(n) |
| Space | O(n) | O(n) |

## Common uses in DSA

1. **Balanced brackets / parsing**, Valid Parentheses, Decode String, Remove All Adjacent Duplicates In String, Simplify Path.
2. **Monotonic stack**, Next Greater Element I/II, Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water, Sum of Subarray Minimums.
3. **Iterative DFS / traversal without recursion**, Binary Tree Inorder/Preorder/Postorder Traversal (iterative), DFS on graph with an explicit stack.
4. **Expression evaluation and calculators**, Evaluate Reverse Polish Notation, Basic Calculator I/II/III, Min Stack.
5. **Undo history / backtracking state**, classical undo buffers, browser history, game-state rewind, maze solvers.

**Canonical LeetCode problems:** #20 Valid Parentheses, #84 Largest Rectangle in Histogram, #150 Evaluate Reverse Polish Notation, #224 Basic Calculator, #739 Daily Temperatures, #853 Car Fleet, #1249 Minimum Remove to Make Valid Parentheses.

## What clues you in

The fastest mental test: while scanning the input one item at a time, do I sometimes need to *go back and finish business with the most recent unfinished thing*? If yes, reach for a stack.

If the answer to "which earlier element matters here?" is **the most recent one**, the data structure is a stack. If the answer is **the oldest one**, it's a queue.

## Signal and what it sounds like

Patterns in problem statements that map to a stack (or a monotonic stack):

| Signal | What it sounds like |
| --- | --- |
| **Nested / matched pairs** | "valid parentheses," "balance the brackets," "is this expression well-formed" |
| **Reverse-order processing** | "most recent X that…," "previous greater element," "undo the last action" |
| **Push when X, pop when Y** | RPN evaluation, function-call traces, HTML/XML tag closers |
| **Top-only with order memory** | "next greater element," "daily temperatures," "min stack" |
| **Iterative replacement of recursion** | flatten DFS, tree traversal without the call stack |

When two or three of these signals appear together, the answer is almost always a stack.

## Linguistic clues

Train your eye to spot these phrases. Each one fires the stack reflex:

1. **"Matching"** — pairs, opens/closes, brackets/tags. Inherently nested.
2. **"Most recent"** — "next greater," "previous smaller," "the most recent X that hasn't been Y." Closest-prior-unresolved → monotonic stack.
3. **"Until"** — "pop until the top is X," "process previous Y until something Z." That `while top satisfies condition: pop` shape is the giveaway (Daily Temperatures, Largest Rectangle in Histogram).
4. **Reverse-order traversal you can't actually do** — "process the input in reverse but you only get it forward," postfix → infix conversion, RPN. Push everything, then unwind.
5. **Undo / cancel / backtrack** — anything that needs to remember the *last* state to roll back to. Min Stack, browser-history-back, text-editor undo. Equal-and-opposite pushes/pops.
6. **Nested anything** — function calls, scopes, regions, balanced expressions, indentation levels, tag trees. Nested = LIFO almost by definition.

## Counter clues

Distinguishing stack from its closest neighbors:

- **vs. queue (BFS / FIFO)**: when you finish processing one item, do you go to the *most recent* unfinished thing (stack) or the *oldest* unfinished thing (queue)? "Shortest path in unweighted graph," "level-order traversal," "process in arrival order" → queue.
- **vs. two-pointer**: two-pointer needs a relationship between two ends with a monotonic shrink (sorted-array two-sum, palindrome check, container with most water). Brackets fundamentally can't use two-pointer because `"([)]"` looks symmetric to two-pointer but is invalid; a stack catches the LIFO violation immediately.
- **vs. heap / priority queue**: if the next thing to process is the *largest / smallest / most-extreme*, that's a heap (k-closest, top-k, scheduler with priorities). Stack only ever cares about the top — the most recently pushed.
- **vs. hash map / set**: if the question is "have I seen X before?" with no order requirement, that's a set. Stack imposes order, set doesn't.
- **vs. deque / monotonic deque**: when you need to drop from *both* ends (sliding-window maximum), a monotonic deque is the upgrade from a monotonic stack.

When two structures both seem to fit, ask: *do I ever need to access anything other than the top?* If yes, it's not a stack.

## Related problems

Curated kin where the recognition skill above is exercised. Each adds one twist on the basic pattern:

- **20. Valid Parentheses** — the canonical LIFO match. Push openers, pop on closers.
- **150. Evaluate Reverse Polish Notation** — push numbers, on operator pop two and combine.
- **155. Min Stack** — stack of `(value, running_min)` to keep `min()` at O(1).
- **739. Daily Temperatures** — monotonic decreasing stack of indices; pop while top is colder than current.
- **84. Largest Rectangle in Histogram** — monotonic increasing stack; on each pop, current bar is the right boundary, the new top is the left boundary.
- **22. Generate Parentheses** — recursion = implicit stack of partial strings; the call-stack *is* the data structure.
- **224 / 227 / 772. Basic Calculator** — operator/operand stacks with precedence, the parser-by-hand variant.
- **42. Trapping Rain Water** — monotonic stack alternative to two-pointer; for each popped bar, water is bounded by current and new top.

## Python example

```python
# Python list as a stack, O(1) append/pop from the end
stack = []
stack.append(1)
stack.append(2)
stack.pop()     # 2
stack[-1]       # 1  (peek)

# Valid Parentheses, push opens, pop/match on close
def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ch in s:
        if ch in '([{':
            stack.append(ch)
        else:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

# Monotonic decreasing stack, Daily Temperatures (#739)
def daily_temperatures(temps):
    n = len(temps)
    ans = [0] * n
    stack = []   # indices with no warmer day yet
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            ans[j] = i - j
        stack.append(i)
    return ans

# Iterative inorder traversal of a binary tree, no recursion
def inorder_iterative(root):
    result, stack = [], []
    node = root
    while node or stack:
        while node:
            stack.append(node)
            node = node.left
        node = stack.pop()
        result.append(node.val)
        node = node.right
    return result

# Evaluate Reverse Polish Notation (#150)
def eval_rpn(tokens):
    stack = []
    ops = {
        '+': lambda a, b: a + b,
        '-': lambda a, b: a - b,
        '*': lambda a, b: a * b,
        '/': lambda a, b: int(a / b),   # truncate toward zero
    }
    for tok in tokens:
        if tok in ops:
            b = stack.pop(); a = stack.pop()
            stack.append(ops[tok](a, b))
        else:
            stack.append(int(tok))
    return stack[0]

# Min Stack, O(1) min alongside push/pop (stack of (value, running_min))
class MinStack:
    def __init__(self):
        self.stack = []
    def push(self, x):
        cur_min = x if not self.stack else min(x, self.stack[-1][1])
        self.stack.append((x, cur_min))
    def pop(self):
        self.stack.pop()
    def top(self):
        return self.stack[-1][0]
    def get_min(self):
        return self.stack[-1][1]
```

## LeetCode problems

Stacks appear in 12 NeetCode 150 problems across 5 categories.

**Two Pointers:**
- [42. Trapping Rain Water](../../leetcode-150/two-pointers/042-trapping-rain-water/), monotonic-stack alternative

**Stack:**
- [20. Valid Parentheses](../../leetcode-150/stack/020-valid-parentheses/)
- [22. Generate Parentheses](../../leetcode-150/stack/022-generate-parentheses/), recursion stack
- [84. Largest Rectangle in Histogram](../../leetcode-150/stack/084-largest-rectangle-in-histogram/), monotonic increasing
- [150. Evaluate Reverse Polish Notation](../../leetcode-150/stack/150-evaluate-reverse-polish-notation/)
- [155. Min Stack](../../leetcode-150/stack/155-min-stack/)
- [739. Daily Temperatures](../../leetcode-150/stack/739-daily-temperatures/), monotonic decreasing
- [853. Car Fleet](../../leetcode-150/stack/853-car-fleet/)

**Trees:**
- [230. Kth Smallest Element in a BST](../../leetcode-150/trees/230-kth-smallest-element-in-a-bst/), iterative inorder
- [297. Serialize and Deserialize Binary Tree](../../leetcode-150/trees/297-serialize-and-deserialize-binary-tree/), DFS recursion stack

**Graphs:**
- [200. Number of Islands](../../leetcode-150/graphs/200-number-of-islands/), iterative DFS variant

**Greedy:**
- [678. Valid Parenthesis String](../../leetcode-150/greedy/678-valid-parenthesis-string/), two-stack alternative

## References

- [Stack, Wikipedia](https://en.wikipedia.org/wiki/Stack_(abstract_data_type))
- [Monotonic stack pattern, LeetCode discuss](https://leetcode.com/tag/monotonic-stack/)
- [Shunting-yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)
- [Iterative tree traversal patterns](https://leetcode.com/tag/stack/)
