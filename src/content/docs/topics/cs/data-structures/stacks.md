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

A stack is a **LIFO** (last-in, first-out) collection. You push elements onto the top and pop them off the top; both operations are O(1). Stacks are the natural fit for any problem involving **nesting**, **backtracking**, or needing to process elements in **reverse order** relative to insertion. They also underlie recursion itself — the call stack is a stack.

## In-depth description

Implementation is straightforward: a dynamic array (Python `list`, Java `ArrayDeque`, C++ `std::stack` over `std::deque`) or a linked list with a head pointer. Both give O(1) push/pop/peek with different memory tradeoffs.

The most powerful and interview-relevant pattern is the **monotonic stack** — a stack that maintains its elements in sorted (monotonic) order by popping elements that violate the order on each push. This turns many "find the next greater/smaller element" problems from O(n²) into O(n), because each element is pushed and popped at most once. Classic applications: Next Greater Element, Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water (one of several approaches).

Other frequent stack patterns:

- **Parentheses / delimiter matching** — push on open, pop and compare on close.
- **Iterative DFS** — replace the system recursion stack with an explicit stack to avoid stack-overflow on deep trees/graphs.
- **Expression evaluation** — Reverse Polish Notation, Shunting-yard, Basic Calculator — stacks handle the operand/operator precedence.
- **Undo history and backtracking** — push decisions, pop to revert.

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

1. **Balanced brackets / parsing** — Valid Parentheses, Decode String, Remove All Adjacent Duplicates In String, Simplify Path.
2. **Monotonic stack** — Next Greater Element I/II, Daily Temperatures, Largest Rectangle in Histogram, Trapping Rain Water, Sum of Subarray Minimums.
3. **Iterative DFS / traversal without recursion** — Binary Tree Inorder/Preorder/Postorder Traversal (iterative), DFS on graph with an explicit stack.
4. **Expression evaluation and calculators** — Evaluate Reverse Polish Notation, Basic Calculator I/II/III, Min Stack.
5. **Undo history / backtracking state** — classical undo buffers, browser history, game-state rewind, maze solvers.

**Canonical LeetCode problems:** #20 Valid Parentheses, #84 Largest Rectangle in Histogram, #150 Evaluate Reverse Polish Notation, #224 Basic Calculator, #739 Daily Temperatures, #853 Car Fleet, #1249 Minimum Remove to Make Valid Parentheses.

## Python example

```python
# Python list as a stack — O(1) append/pop from the end
stack = []
stack.append(1)
stack.append(2)
stack.pop()     # 2
stack[-1]       # 1  (peek)

# Valid Parentheses — push opens, pop/match on close
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

# Monotonic decreasing stack — Daily Temperatures (#739)
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

# Iterative inorder traversal of a binary tree — no recursion
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

# Min Stack — O(1) min alongside push/pop (stack of (value, running_min))
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

**NeetCode 150 — Two Pointers:**
- [42. Trapping Rain Water](../../leetcode-150/two-pointers/042-trapping-rain-water/) — monotonic-stack alternative approach

**NeetCode 150 — Stack:**
- [20. Valid Parentheses](../../leetcode-150/stack/020-valid-parentheses/)
- [155. Min Stack](../../leetcode-150/stack/155-min-stack/)
- [150. Evaluate Reverse Polish Notation](../../leetcode-150/stack/150-evaluate-reverse-polish-notation/)
- [22. Generate Parentheses](../../leetcode-150/stack/022-generate-parentheses/) — recursion stack / backtracking
- [739. Daily Temperatures](../../leetcode-150/stack/739-daily-temperatures/) — monotonic decreasing stack
- [853. Car Fleet](../../leetcode-150/stack/853-car-fleet/)
- [84. Largest Rectangle in Histogram](../../leetcode-150/stack/084-largest-rectangle-in-histogram/) — monotonic increasing stack

**NeetCode 150 — Trees:**
- [230. Kth Smallest Element in a BST](../../leetcode-150/trees/230-kth-smallest-element-in-a-bst/) — iterative inorder with explicit stack
- [297. Serialize and Deserialize Binary Tree](../../leetcode-150/trees/297-serialize-and-deserialize-binary-tree/) — DFS variants use the recursion stack

*More coming soon — iterative DFS in Graphs.*

## References

- [Stack — Wikipedia](https://en.wikipedia.org/wiki/Stack_(abstract_data_type))
- [Monotonic stack pattern — LeetCode discuss](https://leetcode.com/tag/monotonic-stack/)
- [Shunting-yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm)
- [Iterative tree traversal patterns](https://leetcode.com/tag/stack/)
