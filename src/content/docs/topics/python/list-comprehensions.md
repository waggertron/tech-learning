---
title: List Comprehensions in Python
description: "Python's compact syntax for building lists, dicts, and sets from iterables: the four forms, when to use them, and where they become a liability."
parent: python
tags: [python, syntax, functional, performance]
status: draft
created: 2026-05-15
updated: 2026-05-15
---

A list comprehension is a one-expression way to build a list from an iterable. Python evaluates it entirely before returning the result, and it runs faster than an equivalent `for` loop because the iteration happens in C under the hood.

## Basic form

```python
squares = [x ** 2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

The grammar is `[expression for variable in iterable]`. The expression runs once per item. The result is always a `list`.

## With a filter

Add an `if` clause after the iterable to skip items:

```python
evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

The `if` tests each item before the expression runs. Items that fail the test are dropped entirely.

This is different from a conditional expression (ternary) inside the expression, which picks between two values instead of filtering:

```python
labels = ["even" if x % 2 == 0 else "odd" for x in range(6)]
# ["even", "odd", "even", "odd", "even", "odd"]
```

## Nested loops

Multiple `for` clauses read left to right, matching how you would write nested loops:

```python
pairs = [(x, y) for x in [1, 2, 3] for y in [1, 2, 3] if x != y]
# [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]
```

The equivalent loops:

```python
pairs = []
for x in [1, 2, 3]:
    for y in [1, 2, 3]:
        if x != y:
            pairs.append((x, y))
```

Beyond two loops, the comprehension form usually becomes harder to read than explicit loops.

## Dict and set comprehensions

The same syntax works with curly braces:

```python
# Dict comprehension
word_lengths = {word: len(word) for word in ["apple", "fig", "mango"]}
# {"apple": 5, "fig": 3, "mango": 5}

# Set comprehension
unique_lengths = {len(word) for word in ["apple", "fig", "mango"]}
# {3, 5}
```

A dict comprehension produces a `dict`; a set comprehension produces a `set`. Neither is ordered in the way a list is.

## Generator expressions

Swap the brackets for parentheses and you get a **generator expression** instead of a list:

```python
total = sum(x ** 2 for x in range(1000))
```

A generator yields items one at a time rather than building the entire sequence in memory. Use it when:

- You only need to iterate once.
- The iterable is large.
- You are passing the result directly to a function that accepts an iterable (`sum`, `max`, `any`, `all`).

Use a list comprehension when you need to index into the result, iterate multiple times, or pass a `list` specifically.

## When not to use a comprehension

A comprehension that spans more than two or three clauses, or whose expression requires a function call with side effects, should be a plain loop. The comprehension form implies "this is a transformation." When the loop body is doing real work, the loop form makes that visible.

```python
# Fine: pure transformation
cleaned = [s.strip().lower() for s in raw_strings]

# Reach for a loop: side effects, complex logic
results = []
for item in items:
    value = expensive_operation(item)
    if value is not None:
        log(value)
        results.append(value)
```

## Common gotchas

**Variable scope in Python 3.** Comprehension variables are scoped to the comprehension. They do not leak into the enclosing function.

```python
x = 10
squares = [x ** 2 for x in range(5)]
print(x)  # 10 -- the outer x is unchanged
```

This is different from Python 2, where `x` would have been overwritten.

**Modifying a list while iterating.** Comprehensions build a new list; they do not modify the source. Never mutate a list inside its own comprehension.

**Large results.** A comprehension over a million items materializes a million-element list. If you only need the items one at a time, use a generator expression instead.

## References

- [Python docs: List comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)
- [Python docs: Generator expressions](https://docs.python.org/3/reference/expressions.html#generator-expressions)
- [PEP 202: List comprehensions](https://peps.python.org/pep-0202/)
- [PEP 274: Dict comprehensions](https://peps.python.org/pep-0274/)

## Related topics

- [Python, category overview](../)
- [The Ellipsis (`...`)](./ellipsis/), another compact Python expression with a specific role
- [Async in Python](./async/), generator-based intuition helps with understanding coroutines
