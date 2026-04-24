---
title: Smoke tests
description: The minimum-viable "is the system alive?" checks. Run after every deploy, run during an incident, run as a canary between full test suites. Small surface, huge leverage.
parent: testing
tags: [smoke-tests, testing, deployment, incidents]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What a smoke test is

**A smoke test is a small, fast check that confirms the system is running at all.** Named after the electronics test, turn it on, does smoke come out? If yes, dig deeper.

Smoke tests are **not** designed to find bugs. They're designed to answer one question: *can I move forward?* Deploy succeeded, smoke tests confirm the server is reachable. Incident declared, smoke tests confirm which endpoints still work.

Three defining properties:

- **Fast**, under 60 seconds total, ideally under 15.
- **Narrow**, a handful of endpoints / flows, not dozens.
- **Reliable**, if a smoke test fails, something is really wrong. Low false-positive rate is sacred.

## What to smoke-test

The basics every web service should have:

- **Health endpoint returns 200.** `GET /healthz` or `GET /health` without authentication.
- **Readiness endpoint returns 200.** If different from liveness, confirms dependencies are reachable.
- **Login works.** One known test account, hit login, get a token.
- **Core read path works.** One authenticated read of a well-known resource.
- **Core write path works.** Ideally, creating a disposable test resource succeeds (and gets cleaned up).
- **Version endpoint reflects what was deployed.** `GET /version` returns the expected git SHA or version tag.

That's six tests. Under a minute. Good enough to catch ~90% of broken deploys.

## Example, a bash smoke test

```bash
#!/bin/bash
# smoke-test.sh, exits non-zero if anything fails

set -euo pipefail

API="${API:-http://localhost:8000}"
EMAIL="${EMAIL:-smoke@example.com}"
PASSWORD="${PASSWORD:-demo1234}"

fail() { echo "FAIL: $*"; exit 1; }

echo "1/6, GET /healthz"
code=$(curl -s -o /dev/null -w '%{http_code}' "$API/healthz")
[[ "$code" == "200" ]] || fail "healthz returned $code"

echo "2/6, GET /readyz"
code=$(curl -s -o /dev/null -w '%{http_code}' "$API/readyz")
[[ "$code" == "200" ]] || fail "readyz returned $code"

echo "3/6, GET /version"
version=$(curl -s "$API/version" | jq -r .sha)
[[ -n "$version" && "$version" != "null" ]] || fail "version missing"
echo "   version: $version"

echo "4/6, POST /auth/login"
token=$(curl -sf -X POST "$API/api/v1/auth/login/" \
  -H 'Content-Type: application/json' \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | jq -r .access)
[[ -n "$token" && "$token" != "null" ]] || fail "login failed"

echo "5/6, GET /api/v1/patients/ with token"
code=$(curl -s -o /dev/null -w '%{http_code}' \
  -H "Authorization: Bearer $token" \
  "$API/api/v1/patients/")
[[ "$code" == "200" ]] || fail "patients list returned $code"

echo "6/6, POST /api/v1/patients/ then DELETE"
pid=$(curl -sf -X POST "$API/api/v1/patients/" \
  -H "Authorization: Bearer $token" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Smoke Test","phone":"555-0001"}' | jq -r .id)
[[ -n "$pid" ]] || fail "create patient failed"
curl -sf -X DELETE -H "Authorization: Bearer $token" "$API/api/v1/patients/$pid" > /dev/null

echo "SMOKE OK"
```

Six checks, done in 10 seconds against a local environment. Embed it in the repo; run after every `docker compose up`, after every deploy.

## When to run them

- **After every deploy.** Blocker, if smoke fails, roll back.
- **As a canary in CI.** Before the heavy integration / E2E suite runs, smoke first. A broken build fails in 15 seconds, not 15 minutes.
- **On-call triage.** "I just got paged; is the API actually up?", run smoke.
- **After an infra change.** DNS cutover, cert renewal, load balancer reconfiguration. Smoke confirms nothing user-visible broke.
- **Hourly in prod** as a synthetic canary. Catches outages before customers notice.

## Continuous smoke monitoring

Run smoke tests on a schedule against production:

- **[Checkly](https://www.checklyhq.com/)**, Playwright-based synthetic monitoring.
- **[Datadog Synthetic Monitoring](https://docs.datadoghq.com/synthetics/)**, same idea, Datadog-integrated.
- **[New Relic Synthetics](https://docs.newrelic.com/docs/synthetics/)**
- **[UptimeRobot / Statuscake](https://uptimerobot.com/)**, simpler HTTP-level uptime checks.
- **Cron + curl + alerting**, roll-your-own via a tiny always-on container hitting your endpoints.

The checks that matter:

- Login flow (tests auth path).
- Core user page load (tests frontend + API).
- A representative write operation (tests DB + workers).

Run every 1–5 minutes. Alert on two consecutive failures (reduces false positives from single-request blips).

## Smoke vs health checks

Related but distinct:

| | Health check | Smoke test |
| --- | --- | --- |
| Who calls | Load balancer / k8s | Humans / CI |
| Frequency | Every few seconds | After deploys, on demand |
| Depth | Is this process alive? Are its immediate deps reachable? | Does a real user flow work? |
| On failure | Route traffic away | Alert, block deploy |

Health checks are a subset of what smoke tests cover. Good systems have both.

## Playwright-based smoke tests

For UI-heavy products, a smoke test hits the browser too:

```ts
// smoke.spec.ts
import { test, expect } from '@playwright/test';

test('user can log in and see their dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'smoke@example.com');
  await page.fill('[name="password"]', 'demo1234');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
});
```

Shared with the E2E suite but tagged `@smoke` and run earlier. Playwright's [test tagging](https://playwright.dev/docs/test-annotations#tag-tests) makes this trivial.

## Common mistakes

- **Testing too much.** A "smoke test" that takes 5 minutes is an integration test. Trim ruthlessly.
- **Flaky smoke tests.** A flake rate above ~1% makes the test useless, nobody believes a failure. Fix or remove.
- **No cleanup.** Leaving smoke-test data behind pollutes prod. Use a disposable tenant or delete what you create.
- **Wrong granularity.** "GET /api/" that returns "Hello World" is too coarse. Hit something that actually requires the DB, cache, and auth.
- **Same as integration tests.** If smoke is a subset of integration, duplicate the files. Run `pytest -m smoke` for the quick pass and `pytest -m integration` for the full one.
- **Not run on deploy.** Every deploy needs a smoke test gate. Rolling back a bad deploy because customers complained is expensive; rolling back because smoke failed is cheap.

## A smoke test "honest success" checklist

A smoke test is actually working when:

- [ ] It runs in the CD pipeline after every deploy.
- [ ] It blocks the pipeline (or triggers rollback) on failure.
- [ ] It runs in production on a schedule, alerting on failure.
- [ ] It exercises at least one full write path.
- [ ] It finishes in under 60 seconds.
- [ ] It has a false-positive rate under 1%.
- [ ] It cleans up any data it creates.
- [ ] It has been deliberately failed at least once to confirm the alerting works.

If you can't check all of them, it's not earning its keep.

## References

- [Martin Fowler, TestCoverage](https://martinfowler.com/bliki/TestCoverage.html), contextualizes smoke as a subset
- [Checkly](https://www.checklyhq.com/), synthetic monitoring product
- [Datadog Synthetics](https://docs.datadoghq.com/synthetics/)
- [Playwright test annotations](https://playwright.dev/docs/test-annotations#tag-tests), for tagging a smoke subset
- [Google SRE book, Chapter on release engineering](https://sre.google/sre-book/release-engineering/), smoke as part of release validation

## Related topics

- [E2E tests](../e2e-tests/), smoke tests at the UI tier are a subset of these
- [Integration tests](../integration-tests/), smoke tests often reuse the same infrastructure
- [Unit tests](../unit-tests/), the opposite end of the speed/coverage spectrum
