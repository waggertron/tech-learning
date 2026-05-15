---
title: "The Ellipsis (...) in Python"
description: "What the Ellipsis literal is, its four roles as placeholder body, type hint argument, NumPy slice, and stub marker, and when to prefer it over pass."
parent: python
tags: [python, syntax, type-hints, abc]
status: draft
created: 2026-05-15
updated: 2026-05-15
---

`...` is the **Ellipsis literal** in Python. It evaluates to the built-in singleton `Ellipsis`, an instance of `types.EllipsisType`. It has no behavior of its own. Its meaning comes from what the surrounding context expects.

## Why it exists

Python requires at least one statement in any function, method, or class body. `pass` handles that, but it was designed to mean "intentionally empty." `...` carries a softer signal: "something belongs here, just not yet." That distinction matters most in abstract base classes and stub files, where bodies are structurally required but semantically absent.

## Use 1: Placeholder body

In any body where Python's grammar demands at least one statement, `...` satisfies the parser:

```python
from abc import ABC, abstractmethod

class DataService(ABC):
    @abstractmethod
    def fetch_data(self, key: str) -> str: ...
```

This is identical at runtime to the multi-line form:

```python
    @abstractmethod
    def fetch_data(self, key: str) -> str:
        ...
```

The one-liner reads like a type signature, which is why it's common in abstract methods and stub files. `...` and `pass` are interchangeable in a body, but convention differs:

| Use `pass` when | Use `...` when |
|---|---|
| A block is intentionally empty forever | A body is a placeholder for real logic |
| A bare `except` you want quiet | An abstract method or protocol body |
| A loop with no body | A type stub file (`.pyi`) |

## Use 2: Type hints

`...` appears in two standard generic types.

**`Callable[..., ReturnType]`** means "any argument signature":

```python
from typing import Callable

def apply(fn: Callable[..., int], value: str) -> int:
    return fn(value)
```

**`Tuple[ElementType, ...]`** means "a tuple of any length, all the same type":

```python
from typing import Tuple

def sum_all(values: Tuple[int, ...]) -> int:
    return sum(values)
```

These are the only two places the standard library uses `...` as a type-hint argument.

## Use 3: NumPy array slicing

NumPy treats `...` as "insert `:` for every remaining dimension." For a 4-D array shaped `(batch, channel, height, width)`:

```python
import numpy as np

arr = np.zeros((2, 3, 64, 64))
arr[..., 0]      # shape (2, 3, 64): last dim, index 0
arr[0, ...]      # shape (3, 64, 64): first batch item
arr[0, ..., 0]  # shape (3, 64): first batch, last dim index 0
```

Without `...` you would write `arr[:, :, :, 0]` for the first case. The benefit grows with array rank.

## Use 4: Stub files

Type stub files (`.pyi`) describe a module's public API without executable code. Every function body in a stub is `...`:

```python
# my_module.pyi
def connect(host: str, port: int = ...) -> None: ...
def disconnect() -> None: ...
```

The `port: int = ...` pattern marks "has a default value, type unknown." This is the one place `...` appears as a default value rather than a body.

## Common gotchas

**`...` is truthy:**

```python
bool(...)  # True
```

Using it as a sentinel in a conditional won't behave like `None`.

**It is a singleton:**

```python
... is ...       # True
Ellipsis is ...  # True
type(...)        # <class 'ellipsis'>
```

**`...` works in expression context; `pass` does not:**

```python
placeholder = ...   # fine
placeholder = pass  # SyntaxError
```

This means `...` can be assigned, returned, or stored in a data structure. `pass` cannot.

## References

- [Python docs: Ellipsis](https://docs.python.org/3/library/constants.html#Ellipsis)
- [PEP 484: Type hints](https://peps.python.org/pep-0484/)
- [PEP 561: Distributing and Packaging Type Information](https://peps.python.org/pep-0561/)
- [NumPy: Dimensional indexing tools](https://numpy.org/doc/stable/user/basics.indexing.html#dimensional-indexing-tools)

## Related topics

- [Python, category overview](../)
- [Design Patterns](../../cs/design-patterns/), which uses abstract base classes throughout the creational and behavioral sections
- [Testing](../../testing/), where typed test suites surface stub files and `Callable` annotations
