---
title: Python
description: "Python language features, idioms, and standard-library patterns: the things that don't fit neatly into the CS or web categories."
category: python
tags: [python]
status: draft
created: 2026-05-15
updated: 2026-07-13
---

Python rewards fluency in small details. A line that looks obvious can mean "create a generator," "schedule a coroutine but do not run it yet," "reuse an object," "build a new list eagerly," or "stand in for missing code." This section focuses on those language features and idioms: the pieces that sit below a framework and above raw computer science.

The goal is not to catalog every keyword. The useful target is judgment. Know what a construct means at runtime, what it costs, when it makes code clearer, and when it hides control flow or allocation.

## Topics

- [The Ellipsis (`...`)](./ellipsis/), the built-in singleton and its four roles: placeholder body, type hint argument, NumPy slice, and stub marker
- [List Comprehensions](./list-comprehensions/), the four forms (list, dict, set, generator), when to use each, and where they become a liability
- [Async in Python](./async/), coroutines, the event loop, tasks, and asyncio.gather, plus when async helps and when it doesn't

## How to use this section

Use these pages when Python itself is part of the problem. If the question is "which data structure solves this interview problem," start with [Computer Science](../cs/). If the question is "how do I build a Django app," start with [Django](../web/django/). If the question is "why did this Python program behave differently than I expected," this section is the right place.

Three recurring questions show up across the language:

- **What gets created?** A list comprehension creates a list immediately. A generator expression creates a lazy iterator. `...` creates the singleton `Ellipsis`. An `async def` call creates a coroutine object before anything inside the function runs.
- **When does work happen?** Normal function calls run now. Coroutines run when awaited or scheduled. Generators advance only when consumed. Comprehensions evaluate their clauses in a specific order.
- **What convention is the reader expecting?** `pass`, `...`, list comprehensions, generator expressions, and async helpers all carry social meaning in Python code, not just runtime behavior.

## How the topics connect

Language topics link outward to wherever the feature shows up in practice. List comprehensions and generators matter in data transformation and coding-problem solutions. Async matters in web handlers, background jobs, crawlers, and clients that wait on many network calls. Ellipsis appears in abstract methods, type stubs, scientific indexing, and placeholder bodies.

```
Python feature
  |
  +-- runtime meaning: allocation, laziness, scheduling, mutation
  +-- code-reading meaning: convention, intent, maintainability
  +-- application surface: web, testing, data work, coding problems
```

## What to watch for

- **Convenience can hide cost**: a one-line comprehension may allocate a full intermediate list. Use a generator when streaming behavior matters.
- **Async is concurrency, not speed by default**: it helps when tasks wait on I/O. It does not make CPU-bound Python loops faster.
- **Placeholders communicate intent**: `pass` says an empty body is intentional. `...` often says "shape exists, body omitted."
- **Idioms age into contracts**: readers expect Pythonic code to use the standard shape. Clever alternatives need to buy enough clarity or performance to justify themselves.

## Related topics

- [Computer Science](../cs/), data structures, algorithms, and problem-solving patterns.
- [Django](../web/django/), Python web development from project setup through production.
- [Testing](../testing/), where Python idioms show up in fixtures, stubs, and behavior-focused tests.
- [Coding problems](../cs/coding-problems/), algorithm practice where Python's collections and iteration model matter.
