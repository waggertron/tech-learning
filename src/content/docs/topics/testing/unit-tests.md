---
title: Unit tests
description: Small, fast tests that exercise a single unit of behavior with its collaborators stubbed or real. What "unit" actually means, the over-mocking trap, how to name them, how to keep the suite fast, and where unit tests stop being enough.
parent: testing
tags: [unit-tests, testing, pytest, jest]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What a unit is (and isn't)

**A unit test exercises the smallest piece of behavior you care about.** For most codebases that's a function or a method. For some, it's a small collaboration of objects with one I/O boundary stubbed.

The dogmatic "one class, in total isolation, everything mocked" definition has mostly lost. The modern consensus — Martin Fowler's "sociable" unit tests — is that a unit test can include several objects cooperating, as long as no real I/O happens and the test runs in milliseconds.

Rule of thumb: **if it needs a network, a disk, or a real clock, it's not a unit test.**

## What unit tests should do

- **Run in milliseconds.** A 10,000-test suite should finish in under 30 seconds. Every slow test becomes a disincentive to run the suite.
- **Exercise one behavior per test.** One assertion, one outcome, one failure mode.
- **Use real collaborators when cheap.** A plain `datetime.date` doesn't need to be mocked; a `requests.Session` does.
- **Fail with a clear message.** On failure, the message should name the expected and actual values in business terms.

## Naming tests

The name is a sentence about behavior:

- `test_visit_in_scheduled_state_can_be_assigned` — good
- `test_visit_assign` — vague
- `test_assign_method_returns_visit_object_with_correct_clinician_id` — too mechanical

Conventions worth adopting:

- **Given/When/Then** in the name: `test_given_scheduled_visit_when_assigned_then_status_is_assigned`.
- **Arrange / Act / Assert** in the body: three visual blocks, separated by blank lines.

## Example — a rate limiter unit test

```python
# rate_limiter.py
from collections import defaultdict, deque

class RateLimiter:
    def __init__(self, max_per_minute, clock):
        self.max = max_per_minute
        self.clock = clock
        self.hits = defaultdict(deque)

    def allow(self, key):
        now = self.clock()
        bucket = self.hits[key]
        while bucket and bucket[0] < now - 60:
            bucket.popleft()
        if len(bucket) >= self.max:
            return False
        bucket.append(now)
        return True
```

```python
# test_rate_limiter.py
import pytest
from rate_limiter import RateLimiter

class FakeClock:
    def __init__(self, t=0.0):
        self.t = t
    def __call__(self):
        return self.t
    def advance(self, seconds):
        self.t += seconds

def test_first_hit_is_allowed():
    limiter = RateLimiter(max_per_minute=3, clock=FakeClock())
    assert limiter.allow("u1") is True

def test_burst_above_limit_is_blocked():
    limiter = RateLimiter(max_per_minute=3, clock=FakeClock())
    for _ in range(3):
        limiter.allow("u1")
    assert limiter.allow("u1") is False

def test_hits_expire_after_sixty_seconds():
    clock = FakeClock()
    limiter = RateLimiter(max_per_minute=2, clock=clock)
    limiter.allow("u1")
    limiter.allow("u1")
    assert limiter.allow("u1") is False    # blocked now
    clock.advance(61)
    assert limiter.allow("u1") is True     # bucket expired

def test_different_keys_are_independent():
    limiter = RateLimiter(max_per_minute=1, clock=FakeClock())
    limiter.allow("u1")
    assert limiter.allow("u2") is True
```

A few things to notice:

- **The clock is injected.** No `time.time()` inside the code means no `freeze_time` hack in tests.
- **`FakeClock` is a tiny hand-rolled stub,** not a mock library call. Half your mocking needs can be solved with 10 lines of plain code.
- **Each test is one behavior.** Four tests for four distinct behaviors.
- **No setup/teardown.** Each test constructs what it needs.

## The over-mocking trap

The worst unit tests don't test logic — they test that code was called. Example:

```python
def test_assign_sends_notification():
    mock_notifier = Mock()
    service = VisitService(notifier=mock_notifier)
    service.assign(visit_id=42, clinician_id=17)
    mock_notifier.send.assert_called_once_with(
        type="assignment",
        visit_id=42,
        clinician_id=17,
    )
```

This test passes for any implementation that calls `notifier.send(...)` with those arguments. It doesn't check that the visit was actually assigned. It doesn't check anything about the domain outcome. If you refactor to use a queue instead of a notifier, the test breaks without the behavior changing.

Better:

```python
def test_assign_records_assignment_and_schedules_notification():
    notifier = FakeNotifier()
    service = VisitService(notifier=notifier, visits_repo=in_memory_repo())
    service.assign(visit_id=42, clinician_id=17)
    visit = service.get(42)
    assert visit.clinician_id == 17
    assert visit.status == "assigned"
    assert notifier.pending == [("assignment", 42, 17)]
```

Test the outcome, not the mechanism. Mock at boundaries (HTTP, DB, clock) — not at every object seam.

## When to use a real thing, when to stub

| Dependency | Default |
| --- | --- |
| Pure function, small | Real |
| Plain data class / dataclass | Real |
| Internal domain service | Real |
| Database | Fake / in-memory |
| Clock | Fake |
| Random | Seeded / fake |
| External HTTP | Fake or `responses`/`pytest-httpserver` |
| Message queue | In-memory fake |
| Email / SMS | Fake, asserting on sent items |
| Filesystem | `tmp_path` (pytest), real filesystem but isolated |

A rough test: would the real dependency slow the test down by > 10ms, or require a network? Stub it. Otherwise use the real thing.

## Parametrized tests

DRY for similar cases:

```python
import pytest

@pytest.mark.parametrize("input_status,action,expected", [
    ("scheduled", "assign",      "assigned"),
    ("assigned",  "en_route",    "en_route"),
    ("en_route",  "check_in",    "on_site"),
    ("on_site",   "complete",    "completed"),
])
def test_legal_transitions(input_status, action, expected):
    visit = Visit(status=input_status)
    result = transition(visit, action)
    assert result.status == expected
```

Each row is its own test; failures name the specific row.

## Fixtures

Pytest fixtures compose; Jest has `beforeEach`. Use them for construction, not for hiding complexity. A fixture that sets up 40 rows of state is a test smell — the test should be readable on its own.

```python
@pytest.fixture
def visit():
    return Visit(
        id=42,
        status="scheduled",
        patient_id=1,
        tenant_id=1,
    )

def test_assign_sets_status(visit):
    assigned = assign(visit, clinician_id=17)
    assert assigned.status == "assigned"
```

## Coverage — a flawed metric worth watching

Line coverage tells you which lines ran. Not whether they were *tested*. You can hit 95% coverage with assertions that barely check anything.

Useful heuristics:

- **< 60% coverage** — you're missing obvious tests.
- **60–85% coverage** — normal. The uncovered parts are usually error paths and glue.
- **> 95% coverage forced** — the last 5% is usually ceremony. Lowering the bar to pragmatic creates saner tests.

Branch coverage is stricter than line coverage and catches more. Pair with mutation testing ([mutmut](https://github.com/boxed/mutmut), [PIT](https://pitest.org/)) to find tests that pass on broken code.

## Test data

Three patterns:

- **Object Mother / Factory.** Functions that produce test instances with sensible defaults, overridable per test. Fits the Chicago TDD style.
- **Faker / Mimesis.** Libraries that generate fake but plausible data. Good for bulk.
- **Fixture files.** JSON / YAML snapshots for complex structures. Harder to maintain when schemas evolve.

```python
# Factory helper
def make_visit(**overrides):
    defaults = dict(
        id=1,
        tenant_id=1,
        patient_id=1,
        status="scheduled",
        required_skill="RN",
        window_start=datetime(2026, 4, 24, 9, 0),
        window_end=datetime(2026, 4, 24, 11, 0),
    )
    return Visit(**{**defaults, **overrides})

def test_a_visit_knows_its_skill():
    assert make_visit(required_skill="LVN").required_skill == "LVN"
```

## Where unit tests stop helping

- **Whole-flow bugs.** "When a user clicks X, the system does Y" — rarely a single unit.
- **Integration issues.** Your code is correct; it talks to a wrong API. Unit tests won't see it.
- **Concurrency bugs.** Race conditions need [integration tests](../integration-tests/) or chaos-style tools.
- **Visual regressions.** A button is misaligned; no unit test catches that.
- **Performance.** A test that passes at n=10 may be O(n²). Load tests, not unit tests.

## Languages and frameworks

| Language | Default |
| --- | --- |
| Python | [pytest](https://docs.pytest.org/) (far ahead of unittest) |
| TypeScript / JavaScript | [Vitest](https://vitest.dev/) (fast) or [Jest](https://jestjs.io/) (mature) |
| Go | Built-in `testing`, plus [Testify](https://github.com/stretchr/testify) |
| Java | [JUnit 5](https://junit.org/junit5/) |
| Rust | Built-in `cargo test` |
| Ruby | [RSpec](https://rspec.info/) or Minitest |

All share the same shape: tests live next to or mirror the source, runner finds them by naming convention, assertions are first-class.

## References

- [Martin Fowler — UnitTest](https://martinfowler.com/bliki/UnitTest.html) — classical vs sociable
- [Kent Beck — Test Desiderata](https://kentbeck.github.io/TestDesiderata/) — what a test should do
- [James Shore — Testing Without Mocks](https://www.jamesshore.com/v2/blog/2018/testing-without-mocks) — the argument against over-mocking
- [pytest documentation](https://docs.pytest.org/)
- [Vitest documentation](https://vitest.dev/)

## Related topics

- [TDD](../tdd/) — produces unit tests as a byproduct
- [Component tests](../component-tests/) — the next tier up
- [Integration tests](../integration-tests/) — where real I/O starts
- [Fuzz tests](../fuzz-tests/) — property-based generalization of unit tests
