---
title: Test-Driven Development (TDD)
description: Red → green → refactor. Kent Beck's 1999 discipline, the three rules of TDD, when it works, when it doesn't, and why the argument "but I don't have time" misreads what TDD actually costs.
parent: testing
tags: [tdd, testing, discipline, practices]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## The one-sentence definition

**TDD is writing a failing test first, writing just enough code to make it pass, and then refactoring.**

Three steps, in order, enforced by convention. Named and popularized by Kent Beck in *Test-Driven Development: By Example* (1999), though the practice predates the name.

## The three rules (Uncle Bob's formulation)

1. Don't write any production code until you've written a failing test.
2. Don't write more of a test than is sufficient to fail.
3. Don't write more production code than is sufficient to pass the currently failing test.

You'll never follow them literally. The point is direction, not dogma. When you drift from them, you know what you gave up.

## The cycle, red, green, refactor

```
┌─────────┐       ┌──────────┐       ┌────────────┐
│   RED   │──────►│  GREEN   │──────►│  REFACTOR  │
│ write a │       │ make it  │       │  clean it  │
│ failing │       │ pass     │       │  up        │
│ test    │       │          │       │            │
└─────────┘       └──────────┘       └────────────┘
     ▲                                      │
     └──────────────────────────────────────┘
```

### Red, write a failing test

It must fail for the right reason, usually "the thing I'm trying to make doesn't exist yet" or "this specific behavior doesn't happen yet." Not "syntax error."

```python
def test_split_tip_evenly():
    bill = Bill(subtotal=100, tip_percent=20)
    assert bill.per_person(4) == 30.00   # fails: Bill doesn't exist
```

### Green, smallest code that passes

Resist the urge to write "the right implementation." Write the simplest thing that could possibly make the test pass. Even if it's `return 30.00`. That ugly "fake it" implementation is *supposed* to offend you, the next test will reveal its limits.

```python
class Bill:
    def __init__(self, subtotal, tip_percent):
        self.subtotal = subtotal
        self.tip_percent = tip_percent

    def per_person(self, n):
        return 30.00   # intentionally dumb
```

Write another test:

```python
def test_split_tip_five_ways():
    bill = Bill(subtotal=100, tip_percent=20)
    assert bill.per_person(5) == 24.00
```

Now the hard-coded 30 doesn't work. Time for a real implementation.

### Refactor, improve the shape

With tests passing, clean up. Names, duplication, accidental complexity. The tests are the net: they catch regressions while you change how.

## Why it's worth doing

### You get a test suite for free

The suite isn't an afterthought. By the time the feature exists, the tests already exist. The "we'll add tests later" trap never triggers.

### You design interfaces before implementations

The first test is also the first client of your code. If `bill.per_person(4)` feels awkward to call, the API is awkward before anyone else has to live with it.

### Dead code dies early

TDD tends to produce tight code because you only write what passes a test. Speculative branches, "just in case" arguments, and half-considered abstractions rarely survive.

### Bugs surface closer to their cause

A failing test one minute after you wrote the code is easy to fix. A regression two weeks later is an investigation.

## When it hurts

- **Exploratory work.** When you don't know the shape of the solution yet, TDD forces premature commitment. Spike, learn, throw the spike away, *then* TDD the real thing.
- **UI-heavy code.** Testing visual correctness via TDD is awkward. Component tests (see [Component tests](../component-tests/)) help, but the feedback loop is slower than pure logic TDD.
- **Legacy code without seams.** You can't TDD changes inside a 5000-line function with no test harness. You have to first introduce tests via the [Working Effectively with Legacy Code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/) "characterization test" approach, *then* TDD from there.
- **Prototypes.** If the code might not survive the week, TDD is overhead. Just write the code and delete it later.

## Two schools, Chicago vs London

TDD isn't monolithic. Two distinct styles:

### Chicago (state-based, "classical")

- Test the output / state of the code.
- Build up from the bottom, small objects first, wire together later.
- Mock sparingly, mostly for external dependencies.
- Championed by Kent Beck, Martin Fowler.

### London (behavior-based, "mockist")

- Test interactions and collaborations.
- Start from the top, stub everything, fill in dependencies bottom-up later.
- Mock everything that isn't the system under test.
- Championed by Steve Freeman, Nat Pryce, Growing Object-Oriented Software.

Most real-world practice is a blend, leaning Chicago for logic and London for wiring. The distinction matters when teams argue about mocks (see [Unit tests](../unit-tests/)).

## Common misconceptions

### "TDD slows me down"

Short-term, it does, 10–20% slower in the first week. After that, the regression rate drops, the refactor confidence rises, and the net effect is positive in almost every team study.

The slowness people notice is real but misattributed. It's the cost of thinking about the problem before typing. TDD forces that thinking; skipping TDD defers it.

### "TDD makes me 100% covered"

It makes you tightly covered on the paths you exercised. It doesn't guarantee branch coverage or edge-case coverage. Combine with property-based testing (see [Fuzz tests](../fuzz-tests/)) for edges.

### "TDD replaces other tests"

TDD is mostly a unit-test discipline. You still need integration, E2E, and smoke tests, TDD just gives you strong unit coverage as a byproduct.

### "TDD means writing tests first, always"

In practice, mature TDD practitioners sometimes write code first for a few minutes, see the shape, then rewrite starting with tests. The discipline isn't a legal requirement; it's a habit that pays off on net.

## Common mistakes

- **Testing implementation details.** If you test `getName()` calls `this.firstName + " " + this.lastName`, you've coupled the test to the current shape. Test what the method returns, not what it does inside.
- **Over-mocking.** A test that mocks everything except the function under test is brittle. Mock at boundaries (HTTP, DB, clock), not at every seam.
- **Skipping the refactor step.** Red-green-forget. The suite is a safety net; use it to clean up, not just to sign off.
- **Huge leaps in the green step.** "I'll just implement the whole thing." Then the test passes without incremental verification, and you've lost the discipline.
- **Writing a test for code that already exists.** Sometimes necessary (characterization tests), but know that you've lost the design-as-you-test benefit.
- **Ignoring test speed.** A TDD cycle of 30 seconds per test-run loop isn't TDD; it's a watch-paint-dry meditation. Tune your suite to <3s per unit test run.

## A worked example

Building a rate limiter. Start:

```python
# Red
def test_rate_limiter_allows_first_request():
    limiter = RateLimiter(max_per_minute=10)
    assert limiter.allow("user-1") is True

# Green
class RateLimiter:
    def __init__(self, max_per_minute):
        self.max = max_per_minute

    def allow(self, key):
        return True   # fake it
```

Next test:

```python
# Red
def test_rate_limiter_blocks_after_limit():
    limiter = RateLimiter(max_per_minute=3)
    for _ in range(3):
        assert limiter.allow("user-1") is True
    assert limiter.allow("user-1") is False

# Green, real implementation now
import time
from collections import defaultdict, deque

class RateLimiter:
    def __init__(self, max_per_minute):
        self.max = max_per_minute
        self.hits = defaultdict(deque)

    def allow(self, key):
        now = time.time()
        bucket = self.hits[key]
        while bucket and bucket[0] < now, 60:
            bucket.popleft()
        if len(bucket) >= self.max:
            return False
        bucket.append(now)
        return True
```

Next test: "it should forget hits older than a minute." Can't test that without injecting the clock, forcing a refactor to make time injectable. And so on.

The tests drove the design. The real implementation emerged from the pressure of the tests, not from a design meeting.

## When TDD pays off most

- Pure business logic with many edge cases.
- Parsers, serializers, calculators, state machines.
- Libraries (the tests become the documentation).
- Refactoring existing code safely.
- Multi-person teams where "I didn't know that worked like this" is a common bug class.

## When to skip it

- One-off scripts.
- CSS / visual design work.
- Hot prototypes with a known short lifetime.
- Spikes to understand a library you've never used.

## References

- [Kent Beck, *Test-Driven Development: By Example*](https://www.oreilly.com/library/view/test-driven-development/0321146530/), the original
- [Robert Martin, *The Three Rules of TDD*](https://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd)
- [Steve Freeman, Nat Pryce, *Growing Object-Oriented Software, Guided by Tests*](https://www.oreilly.com/library/view/growing-object-oriented-software/9780321574442/), the London school
- [Michael Feathers, *Working Effectively with Legacy Code*](https://www.oreilly.com/library/view/working-effectively-with/0131177052/), how to introduce tests where none exist
- [Kent Beck, *Test Desiderata*](https://kentbeck.github.io/TestDesiderata/), short essay on what makes a test good
- [James Shore, The Art of Agile Development, Ch. on TDD](https://www.jamesshore.com/v2/books/aoad2)

## Related topics

- [Unit tests](../unit-tests/), the test type TDD produces most of
- [Component tests](../component-tests/), applying TDD at the UI tier
- [Integration tests](../integration-tests/), tests that don't fit TDD's fast-feedback loop, but still need writing
