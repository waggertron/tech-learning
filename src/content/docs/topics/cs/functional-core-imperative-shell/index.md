---
title: Functional Core, Imperative Shell
description: Gary Bernhardt's architecture pattern from Destroy All Software, push pure logic into a functional core, isolate side effects in a thin imperative shell, and watch the tests get fast and the state diagrams get simple.
category: cs
tags: [architecture, functional-programming, testing, design-patterns]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## The idea in one paragraph

Split your program into two layers:

- A **functional core**, pure functions over plain values. No I/O, no clocks, no network, no mutable singletons. Given the same inputs, always returns the same output. Encapsulates all the decisions the program makes.
- An **imperative shell**, the thin outer layer that talks to the world. Reads stdin, writes stdout, queries the database, fetches the network, gets the current time. Calls into the core with those values, receives new values back, and writes them to the world.

The core has no dependencies and all the logic. The shell has all the dependencies and almost no logic, mostly straight-line calls with very few conditionals. You end up with *many fast unit tests* on the core and *few integration tests* on the shell, and the two sets barely overlap.

The pattern comes from Gary Bernhardt's [Destroy All Software](https://www.destroyallsoftware.com/), specifically the [Boundaries](https://www.destroyallsoftware.com/talks/boundaries) talk from SCNA 2012 and the [Functional Core, Imperative Shell screencast](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell). It doesn't require a functional language; it works in Python, TypeScript, Ruby, and Go as well as Haskell.

## The shape of it

```
┌───────────────────────────────────────────────────────┐
│              Imperative Shell (thin)                  │
│   stdin  → parse → values                             │
│                            ↓                          │
│                    ┌───────────────┐                  │
│                    │  Functional   │                  │
│   DB read → values │     Core      │ values → DB write│
│                    │ (pure, total) │                  │
│                    └───────────────┘                  │
│                            ↓                          │
│                          values → render → stdout     │
└───────────────────────────────────────────────────────┘
```

Shell handles: "what do we have?" and "what do we do with the answer?"
Core handles: "given these values, what's the answer?"

All the conditionals, state machines, and business rules live in the core. The shell is mostly `read → call → write`.

## A concrete example

Consider a CLI that takes a list of tweets and a "read up to" cursor, and produces a rendered timeline showing only unread tweets.

### The naïve version (everything tangled)

```python
import sqlite3
import sys
from datetime import datetime, timezone

def render_timeline(user_id: int):
    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()
    cursor.execute("SELECT last_read_at FROM users WHERE id = ?", (user_id,))
    last_read_at = cursor.fetchone()[0]

    cursor.execute(
        "SELECT id, author, body, created_at FROM tweets "
        "WHERE created_at > ? ORDER BY created_at DESC",
        (last_read_at,),
    )
    for tweet_id, author, body, created_at in cursor.fetchall():
        age = datetime.now(timezone.utc), datetime.fromisoformat(created_at)
        prefix = "•" if age.total_seconds() < 300 else " "
        sys.stdout.write(f"{prefix} @{author}: {body}\n")

    cursor.execute(
        "UPDATE users SET last_read_at = ? WHERE id = ?",
        (datetime.now(timezone.utc).isoformat(), user_id),
    )
    conn.commit()
```

Everything touches everything. Testing it means a test database, a frozen clock, a captured stdout, and tolerance for flakiness.

### The functional core, imperative shell version

**Core**, pure functions over plain values:

```python
# timeline/core.py
from dataclasses import dataclass
from datetime import datetime, timedelta

@dataclass(frozen=True)
class Tweet:
    id: int
    author: str
    body: str
    created_at: datetime

@dataclass(frozen=True)
class RenderedLine:
    text: str

def unread_tweets(tweets: list[Tweet], last_read_at: datetime) -> list[Tweet]:
    return [t for t in tweets if t.created_at > last_read_at]

def render(tweets: list[Tweet], now: datetime) -> list[RenderedLine]:
    lines = []
    for t in tweets:
        is_fresh = (now, t.created_at) < timedelta(minutes=5)
        prefix = "•" if is_fresh else " "
        lines.append(RenderedLine(f"{prefix} @{t.author}: {t.body}"))
    return lines

def advance_cursor(
    last_read_at: datetime, tweets: list[Tweet]
) -> datetime:
    return max([last_read_at] + [t.created_at for t in tweets])
```

Three pure functions. No database, no clock, no stdout. Every input is a value; every output is a value. Tests are one-liners:

```python
def test_unread_skips_already_read():
    t1 = Tweet(1, "alice", "old",  datetime(2026, 4, 1))
    t2 = Tweet(2, "bob",   "new",  datetime(2026, 4, 5))
    result = unread_tweets([t1, t2], last_read_at=datetime(2026, 4, 3))
    assert result == [t2]
```

**Shell**, the I/O wrapper:

```python
# timeline/shell.py
import sqlite3, sys
from datetime import datetime, timezone
from . import core

def render_timeline(user_id: int) -> None:
    conn = sqlite3.connect("app.db")
    cur = conn.cursor()
    cur.execute("SELECT last_read_at FROM users WHERE id = ?", (user_id,))
    last_read_at = datetime.fromisoformat(cur.fetchone()[0])

    cur.execute(
        "SELECT id, author, body, created_at FROM tweets "
        "WHERE created_at > ? ORDER BY created_at DESC",
        (last_read_at.isoformat(),),
    )
    tweets = [
        core.Tweet(i, a, b, datetime.fromisoformat(c))
        for i, a, b, c in cur.fetchall()
    ]

    now = datetime.now(timezone.utc)
    unread = core.unread_tweets(tweets, last_read_at)
    for line in core.render(unread, now):
        sys.stdout.write(line.text + "\n")

    new_cursor = core.advance_cursor(last_read_at, unread)
    cur.execute(
        "UPDATE users SET last_read_at = ? WHERE id = ?",
        (new_cursor.isoformat(), user_id),
    )
    conn.commit()
```

Almost no conditionals. Almost no logic. It reads, calls the core, writes. Testing the shell is a single integration test that exercises a real database and a captured stdout, you don't need to cover edge cases here because *they're all covered in the core*.

## The tradeoffs flip

Bernhardt's observation is that this pattern inverts the usual testing-pyramid economics:

| | Naïve OO | Functional Core + Shell |
| --- | --- | --- |
| Fast unit tests | Few (lots of mocks required) | Many |
| Test doubles / mocks | Everywhere | Rarely needed |
| Integration tests | Many (to cover logic) | Few (logic is tested in core) |
| Conditionals in I/O code | Many | Very few |
| Reasoning about program state over time | Hard | Easy |

You don't end up with fewer tests; you end up with the tests concentrated in the layer where they're cheap and fast, and sparse where they're slow and brittle.

## What stays in the core

- Business rules.
- Parsing and validation of values.
- Transformations.
- State transitions (given *this* state and *this* event, what's the new state?).
- Anything with an interesting conditional.

## What stays in the shell

- File I/O, network calls, database queries.
- Reading the clock (`datetime.now`), reading environment variables.
- Writing to stdout/stderr.
- Spinning up processes, acquiring locks.
- Anything that depends on the current moment or external state.

The clock deserves a note: `datetime.now()` in the core is the single most common violation. Pass `now` in as a value. The core becomes deterministic; tests don't need a frozen-clock library.

## Why it's not just "separation of concerns"

"Separation of concerns" is vague. This pattern is specific:

- **Direction of dependency.** Core knows nothing about the shell. Shell depends on core. Inversion of control by simple layering, no DI container required.
- **Values at the boundary.** The core takes plain data in and returns plain data out. No injected services, no callbacks, no interfaces to mock. Bernhardt's [Boundaries](https://www.destroyallsoftware.com/talks/boundaries) talk argues that *simple values*, strings, numbers, records, lists, are the right inter-component interface, not objects with behavior.
- **Core is total where possible.** Every input produces a defined output. No exceptions for flow control. If something can fail, return a value that represents failure.

The practical effect: the core can be tested without test doubles, and the shell can be integration-tested with realistic dependencies. You don't need both strategies in either layer.

## Where it gets hard

- **Incremental computation.** If the core needs to fetch data *partway through* a decision (e.g. "expand this tree lazily"), the clean split blurs. Options: precompute aggressively in the shell and pass everything to the core; or introduce an explicit *plan* value, the core returns "I need X" and the shell fetches X and re-invokes the core. The latter is a simplified version of the Free Monad / effect-system approach from strict functional languages.
- **Streaming / long-running processes.** A server that holds state over time. You can keep the core pure by making it a state-transition function (`(state, event) -> (state, outputs)`) and having the shell own the loop and the current state. The [Elm architecture](https://guide.elm-lang.org/architecture/) and Redux are examples.
- **Performance-critical paths.** Allocating a fresh record for every transition is usually fine but can hurt in hot loops. When it matters, profile first; mutate locally inside a function if needed, the function is still referentially transparent from the outside.
- **Object-heavy frameworks.** Some frameworks (older Django ORM, ActiveRecord) push stateful, database-bound objects deep into application code. Following this pattern means *not* using those objects in the core, convert to plain records at the boundary.

## Adjacent ideas

- **[Hexagonal Architecture / Ports and Adapters](https://alistair.cockburn.us/hexagonal-architecture/)** (Alistair Cockburn), same instinct: isolate the domain from I/O. Hexagonal puts the emphasis on pluggable *adapters* for each external system; FC/IS puts the emphasis on *values at the boundary*. Compatible, often combined.
- **[Onion Architecture](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)** (Jeffrey Palermo), concentric layers, domain at the center, I/O at the edge. Same shape.
- **[Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)** (Robert Martin), the most opinionated and OO-heavy of the three; has a similar spine.
- **Elm Architecture / Redux**, functional core as `(state, msg) -> state`, imperative shell as the runtime loop.

All point the same direction. FC/IS is the version that best survives in a language without algebraic effects or enforced purity, its rules are conventions, not compiler-enforced, but they're specific enough to follow.

## Gotchas

- **Snuck-in dependencies.** The core *looks* pure but imports `requests` deep inside a helper. The test that would fail doesn't, because the helper rarely runs. A pre-commit lint rule, "no `requests`, `datetime.now`, `open`, or database imports in `core/**`", is a cheap enforcement.
- **Hidden globals.** Python module-level caches, singleton loggers, thread-local contexts. These sneak into the core and suddenly tests interact.
- **Over-wrapping.** Don't write a ceremonial `Result` wrapper around every pure function if the language has exceptions and the call sites are all immediate. Keep the core simple.
- **Too-big core functions.** "Pure" doesn't mean "one giant function." Compose small pure pieces. The shell should call one or two entry points; *inside* the core, factor freely.
- **Shell growth.** If the shell starts sprouting conditionals, you've leaked logic out of the core. Push it back in, usually by passing more values through.

## A quick self-check

You can tell a codebase has adopted the pattern when:

- The test directory for the core has zero mocking libraries imported.
- Grepping the core for `datetime.now`, `open(`, `requests.`, `conn.execute`, `os.environ` returns nothing.
- The shell is mostly 5–20 line functions that look like `read → call core → write`.
- You can run the core tests in under a second without a database.

If any of those fail, there's a leak somewhere.

## References

- [Functional Core, Imperative Shell, Destroy All Software screencast](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell), Gary Bernhardt's original explanation, with a Twitter-client example
- [Boundaries, SCNA 2012 talk](https://www.destroyallsoftware.com/talks/boundaries), the broader argument: simple values as component boundaries, FC/IS as a consequence
- [Hexagonal Architecture, Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/), the ports-and-adapters cousin
- [Onion Architecture, Jeffrey Palermo](https://jeffreypalermo.com/2008/07/the-onion-architecture-part-1/)
- [Clean Architecture, Robert Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Functional Programming Patterns: Functional Core, Imperative Shell](http://www.javiercasas.com/articles/functional-programming-patterns-functional-core-imperative-shell/), a practical write-up with examples
- [`kbilsted/Functional-core-imperative-shell`](https://github.com/kbilsted/Functional-core-imperative-shell), community-maintained notes and patterns
- [`eykd/nonobvious`](https://github.com/eykd/nonobvious), Python library encoding the pattern
- [The Elm Architecture](https://guide.elm-lang.org/architecture/), FC/IS compiled into a language
