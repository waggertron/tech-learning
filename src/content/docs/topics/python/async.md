---
title: Async in Python
description: "Python's async/await model: how coroutines, the event loop, tasks, and asyncio.gather work, and where async helps versus where it does not."
parent: python
tags: [python, async, concurrency, asyncio, performance]
status: draft
created: 2026-05-15
updated: 2026-05-15
---

Python's `async`/`await` syntax adds cooperative concurrency to the language. A single thread runs many coroutines by switching between them at `await` points, which makes it well-suited to I/O-heavy work and poorly suited to CPU-heavy work.

## The problem async solves

A regular Python function blocks while waiting. If you fetch data from an API, the thread sits idle until the response arrives. With async, the event loop hands control to another coroutine while the I/O is in flight, then resumes yours when the response is ready.

This is different from threads, which interleave work at the OS level, and from multiprocessing, which uses separate processes to work around the GIL.

## Coroutines

A coroutine is a function defined with `async def`. Calling it does not run it; it returns a coroutine object.

```python
async def greet(name: str) -> str:
    return f"Hello, {name}"
```

To run it, you must either `await` it from another coroutine or hand it to `asyncio.run`:

```python
import asyncio

result = asyncio.run(greet("world"))
print(result)  # Hello, world
```

`asyncio.run` creates an event loop, runs the coroutine to completion, and closes the loop.

## The `await` keyword

`await` suspends the current coroutine and hands control back to the event loop until the awaited thing is done. You can only use `await` inside an `async def` function.

```python
import asyncio
import httpx

async def fetch(url: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.text
```

When the `client.get` call is in flight, the event loop is free to run other coroutines. When the response arrives, this coroutine resumes.

## Running multiple coroutines concurrently

`await`ing coroutines sequentially runs them one after another. To run them concurrently, wrap them in tasks or use `asyncio.gather`:

```python
import asyncio

async def slow(n: int) -> int:
    await asyncio.sleep(n)
    return n

async def main():
    # Sequential: takes 3 seconds total
    a = await slow(1)
    b = await slow(2)

    # Concurrent: takes 2 seconds total (the max)
    a, b = await asyncio.gather(slow(1), slow(2))
```

`asyncio.gather` takes any number of coroutines, schedules them all as tasks, and returns their results in the same order.

## Tasks

A `Task` wraps a coroutine so the event loop can schedule it independently. Create one with `asyncio.create_task`:

```python
async def main():
    task_a = asyncio.create_task(slow(1))
    task_b = asyncio.create_task(slow(2))

    # Both are already running; await just collects the results
    a = await task_a
    b = await task_b
```

`create_task` schedules the coroutine immediately. `gather` does the same thing but is more concise when you have several to run together.

## Async context managers and iterators

Libraries that do I/O provide async variants of context managers and iterators. The syntax mirrors the sync forms:

```python
# Async context manager
async with httpx.AsyncClient() as client:
    ...

# Async iterator
async for chunk in response.aiter_bytes():
    ...
```

Define your own with `__aenter__`/`__aexit__` and `__aiter__`/`__anext__`, or use `@asynccontextmanager` from `contextlib`.

## The event loop

The event loop is the scheduler. It maintains a queue of ready coroutines and drives them forward one `await` at a time. A single event loop runs in a single thread, which means:

- No GIL contention between coroutines (they don't run in parallel).
- A CPU-bound coroutine blocks the entire loop until it yields.
- Blocking calls (file I/O, `time.sleep`, pure-Python number crunching) stall everything.

For blocking calls you can't avoid, `asyncio.to_thread` runs them in a thread pool without blocking the loop:

```python
result = await asyncio.to_thread(blocking_function, arg)
```

## When async helps and when it doesn't

| Async wins | Async doesn't help |
|---|---|
| Many concurrent network requests | CPU-bound computation |
| WebSocket servers with many connections | Single sequential I/O calls |
| Streaming responses | Simple scripts with no concurrency |
| High-connection-count HTTP servers | Work that needs true parallelism |

For CPU-bound parallelism, use `multiprocessing` or `concurrent.futures.ProcessPoolExecutor`. For a small number of blocking I/O calls where threads are acceptable, `concurrent.futures.ThreadPoolExecutor` is simpler than async.

## Common gotchas

**Forgetting `await`.** Calling a coroutine without `await` returns the coroutine object and does nothing. Python 3.11+ emits a `RuntimeWarning` for this, but it still silently produces wrong behavior.

```python
result = greet("world")   # coroutine object, not a string
result = await greet("world")  # correct
```

**Mixing blocking calls into async code.** `time.sleep` inside an `async def` blocks the event loop for every coroutine, not just the one calling it. Use `await asyncio.sleep` instead.

**Running `asyncio.run` from inside a running loop.** Jupyter notebooks run their own event loop. Calling `asyncio.run` there raises a `RuntimeError`. Use `await` directly, or install `nest_asyncio`.

**Shared mutable state.** Coroutines in the same event loop are not truly parallel, but they can interleave at any `await` point. A coroutine can read stale state if another coroutine modified it between two awaits.

## References

- [Python docs: asyncio](https://docs.python.org/3/library/asyncio.html)
- [Python docs: Coroutines and tasks](https://docs.python.org/3/library/asyncio-task.html)
- [PEP 492: Coroutines with async and await syntax](https://peps.python.org/pep-0492/)
- [PEP 3156: Asynchronous I/O support rebooted](https://peps.python.org/pep-3156/)

## Related topics

- [Python, category overview](../)
- [List Comprehensions](./list-comprehensions/), coroutine intuition builds on the same generator mental model
- [Testing](../../testing/), async code needs async-aware test runners like pytest-asyncio
- [Message Queues](../../system-design/message-queues/), a common destination for async producers and consumers
