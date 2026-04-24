---
title: Integration tests
description: Tests that exercise a real slice of the system — real database, real message broker, real HTTP — to verify components work together. Slower and fewer than unit tests, and the tier where your architecture either holds up or falls apart.
parent: testing
tags: [integration-tests, testing, databases, docker]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What an integration test is

**An integration test exercises multiple components wired together with real infrastructure** — a real Postgres, a real Redis, a real HTTP server. It verifies that the seams actually work: that your ORM queries map to the SQL you expect, that your serialization round-trips, that your migration is applied before the test runs.

Distinguishing from nearby tiers:

- **Unit test** — no I/O. Pure logic.
- **Component test** — one slice with real immediate collaborators, I/O stubbed.
- **Integration test** — real I/O, real dependencies, usually spun up in Docker or test containers.
- **E2E test** — full system, real browser, real user flow.

## What you need integration tests for

Classes of bugs unit tests miss:

- **ORM queries that pass on SQLite but fail on Postgres** (`DISTINCT ON`, array columns, window functions).
- **Migrations that work alone but break in order** (dropping a column another migration depends on).
- **Transaction scope** — a test that mocks `transaction.atomic` passes; the real code deadlocks.
- **Message serialization** — a Celery task's arguments change shape between queue and worker.
- **Connection-pool exhaustion** under concurrency.
- **Index vs no-index performance** regressions.
- **Network timeouts** that only surface against a real service.

## Testcontainers — the modern default

Running a real dependency in CI used to mean "install Postgres on the CI runner." Now: spin up a container per test session with [Testcontainers](https://testcontainers.com/).

```python
# conftest.py
from testcontainers.postgres import PostgresContainer
import pytest

@pytest.fixture(scope="session")
def postgres_url():
    with PostgresContainer("postgres:16") as pg:
        yield pg.get_connection_url()
```

Testcontainers libraries exist for Python, Node, Go, Java, Rust. They manage container lifecycle per test session, expose connection URLs, and clean up afterward.

Alternatives:

- **Docker Compose** for tests — works, requires more orchestration in CI.
- **In-memory / lighter replacements** (`fakeredis`, `aiosqlite`) — good for fast loops; bad when you actually need the real service's semantics.

## Example — a repository test against real Postgres

```python
# test_visit_repository.py
import pytest
from home_health.visits.repository import VisitRepository
from home_health.visits.models import Visit

@pytest.mark.integration
@pytest.mark.django_db(transaction=True)
class TestVisitRepository:
    def test_find_overlapping_visits(self, postgres_url):
        repo = VisitRepository()
        v1 = Visit.objects.create(
            tenant_id=1,
            patient_id=1,
            window_start="2026-04-24T09:00Z",
            window_end="2026-04-24T10:00Z",
        )
        v2 = Visit.objects.create(
            tenant_id=1,
            patient_id=2,
            window_start="2026-04-24T09:30Z",
            window_end="2026-04-24T11:00Z",
        )
        overlapping = repo.find_overlapping(
            tenant_id=1,
            window_start="2026-04-24T09:00Z",
            window_end="2026-04-24T12:00Z",
        )
        assert {v1.id, v2.id} == {v.id for v in overlapping}
```

What this catches that a unit test can't:

- The overlap query (`OVERLAPS` in SQL, or `tstzrange && tstzrange`) actually returns the right rows in Postgres.
- Timezone conversions round-trip correctly.
- The index on `(tenant_id, window_start)` is actually used (check via `EXPLAIN`).

## Transactional isolation between tests

Most test frameworks wrap each test in a transaction and roll back at the end. For databases this is the fastest isolation strategy:

```python
# pytest-django default — each test in a transaction, rolled back
@pytest.mark.django_db
def test_creates_visit():
    visit = Visit.objects.create(patient_id=1, tenant_id=1)
    assert visit.id is not None
# transaction rolled back; visit never persisted
```

When the test needs to commit (e.g. a Celery task running in another process sees the data), use `transaction=True`:

```python
@pytest.mark.django_db(transaction=True)
def test_task_sees_committed_data():
    # uses TRUNCATE for cleanup instead of ROLLBACK
    ...
```

Slower but correct for multi-process scenarios.

## HTTP integration — real server, real network

For tests that verify the deployed HTTP surface, run a real server in-process:

```python
# pytest fixture — spin up Django's built-in test server
import pytest
from django.test import LiveServerTestCase

@pytest.fixture
def live_server():
    server = LiveServerTestCase()
    server.setUpClass()
    yield server.live_server_url
    server.tearDownClass()

def test_health_endpoint_returns_200(live_server):
    import httpx
    r = httpx.get(f"{live_server}/api/v1/health/")
    assert r.status_code == 200
```

Tests that cross real HTTP catch serialization mismatches, wrong content types, missing CORS headers, and middleware ordering bugs that component tests skip.

## Contract tests — a specialized integration test

When two services talk to each other, both sides implement the contract. Drift between them breaks integrations.

**Pact** ([pact-broker](https://docs.pact.io/pact_broker)) records consumer expectations and verifies provider compliance in CI:

```python
# consumer side — write what you expect
pact = Pact("consumer", "provider")
pact.given("visit 42 exists").upon_receiving("get visit 42").with_request(
    method="GET", path="/api/v1/visits/42/"
).will_respond_with(
    status=200,
    body={"id": 42, "status": "scheduled"},
)
```

The consumer generates a **contract file**. The provider runs its own test using that contract — if the provider fails the contract, CI fails.

Alternative: OpenAPI / GraphQL schemas as the contract, with schema-diff tooling in CI.

## Idempotence and parallel runs

Integration tests share resources. Two tests that both `CREATE TABLE audit_log` fight. Strategies:

- **Per-test-worker schemas** — each pytest-xdist worker gets its own schema or database.
- **Per-test namespaces** — use UUIDs in table names, keys, tenant IDs.
- **Serial markers** for tests that can't parallelize — pytest's `@pytest.mark.serial`.
- **Transaction-per-test** — already covered, the default when it works.

Fast integration test suites run in parallel. Flaky ones usually have shared state no one planned for.

## Time and randomness

Integration tests often exercise real time:

- A Celery task retries after 60 seconds.
- A cache key expires after an hour.
- A cron job runs at 2am.

Don't `sleep(60)` in tests. Inject the clock into domain code (see [Unit tests](../unit-tests/)), and in integration tests, use:

- **Time freezing** at the edge: `freezegun.freeze_time` for Python, `@sinonjs/fake-timers` for Node.
- **Deterministic retry delays** via test-mode config (`CELERY_TASK_ALWAYS_EAGER=True` for simple cases).

## Test data at scale

Unit tests get away with hand-crafted objects. Integration tests often need meaningful fixtures — 10 tenants, 100 patients, 1000 visits. Options:

- **Factory Boy / factory_bot** — Pythonic / Ruby factories with database persistence.
- **Fishery** — TypeScript equivalent.
- **SQL fixtures** — a `seed.sql` run before tests. Ugly but fast.
- **Snapshot the seed** — run the seed command once, take a PG dump, restore it per test session.

The bigger the fixture, the slower the setup. Integration tests should use the smallest fixture that reproduces the behavior — not a copy of production.

## CI considerations

- **Cache Docker images.** Testcontainers pulls Postgres every run if you don't cache.
- **Warm-up.** Some services (Elasticsearch, Kafka) take 20+ seconds to start. Share across tests in a session.
- **Retry flaky infra** at the CI level, not by adding `retry` to the test. Infra flakes are distinct from bug flakes.
- **Surface timings.** A test that takes 3 minutes should be visible to reviewers, not hidden in "all tests pass."

## What integration tests *don't* catch

- **UI bugs.** Integration tests exercise the HTTP / data layer, not the browser.
- **Behavior across multiple services at scale.** Consumer-driven contracts + E2E help.
- **Performance at load.** A test with 10 concurrent users may pass; 1000 may not.
- **Real-user timing issues.** Debounce / throttle / animation bugs hide below HTTP.

Integration tests are necessary but not sufficient.

## Common mistakes

- **Running against dev databases.** The test writes; the developer's data changes. Always use ephemeral databases.
- **Sharing a single long-lived database.** Tests drift, data accumulates, flakiness rises. Prefer per-test or per-session transactional isolation.
- **Skipping migrations in test setup.** Your test passes with hand-constructed schemas; prod schemas are different; integration test is worthless.
- **Assertions on exact timestamps.** `assert created_at == "2026-04-24T09:00:00Z"` races with the clock. Use tolerance windows or inject a fake clock.
- **Tests that depend on fixture ordering.** Rewriting tests to add a new one breaks three old ones. Each test should set up what it needs.

## References

- [Testcontainers](https://testcontainers.com/) — container lifecycle for tests
- [Pact](https://docs.pact.io/) — consumer-driven contracts
- [pytest-django](https://pytest-django.readthedocs.io/)
- [Django `LiveServerTestCase`](https://docs.djangoproject.com/en/5.2/topics/testing/tools/#liveservertestcase)
- [factory_boy](https://factoryboy.readthedocs.io/) / [factory-bot-rb](https://github.com/thoughtbot/factory_bot) — fixture factories
- [Martin Fowler — IntegrationTest](https://martinfowler.com/bliki/IntegrationTest.html) — on the overloaded term

## Related topics

- [Unit tests](../unit-tests/) — the tier below
- [Component tests](../component-tests/) — tier below with I/O stubbed
- [E2E tests](../e2e-tests/) — the tier above with a real browser
- [Smoke tests](../smoke-tests/) — the subset you run post-deploy
