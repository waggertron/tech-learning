---
title: End-to-end tests (E2E)
description: Real browser, real backend, real user journey. The tier of last resort, slow, flaky, expensive to maintain, but the only tests that catch bugs spanning the whole system. What they're for, how to keep them sane, and why they stay at the top of the pyramid.
parent: testing
tags: [e2e-tests, playwright, cypress, testing]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What an E2E test is

**An E2E test drives a real browser through a real user flow against a real backend.** Click login, see the dashboard, click a button, see the state change. The test doesn't know or care how the system is implemented; it simulates a user.

Unlike [component tests](../component-tests/), which stub the network, E2E tests hit a full stack, deployed, running, with a real database. They're the highest-fidelity tests you can write, and also the slowest and most brittle.

## Why E2E tests exist despite the cost

- **End-to-end coverage.** They confirm the interaction between frontend, API, database, auth, and cache actually works in composition.
- **Critical journeys.** "Log in," "Create an account," "Complete checkout," "Submit a claim." If these break, the product is broken. E2E tests protect them.
- **Deploy confidence.** Smoke tests answer "is it up?" E2E tests answer "does a user's workflow still work?"
- **Cross-browser issues.** Real browsers, run across Chrome/Firefox/WebKit.

They are necessary. They are not a replacement for the lower tiers.

## The modern default, Playwright

[Playwright](https://playwright.dev/) has quietly become the new default for web E2E testing. Written by Microsoft, ex-Puppeteer team. Key strengths:

- Single API across Chromium, Firefox, WebKit.
- Auto-waiting, no manual `sleep` / `waitForSelector` chains.
- Built-in test runner with parallelization.
- Great trace viewer for debugging failures.
- First-class TypeScript.

### Example, Playwright test

```ts
// tests/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('user lands on dashboard after successful login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('scheduler@westside.demo');
    await page.getByLabel('Password').fill('demo1234');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /Today/ })).toBeVisible();
  });

  test('invalid credentials show an error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('bad@example.com');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText(/Invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
```

- Queries by accessible role/label, same as Testing Library. Good E2E tests look like component tests from the outside.
- Assertions like `expect(page).toHaveURL(...)` and `expect(locator).toBeVisible()` auto-retry until they pass or time out, no manual waits.

## The alternatives

| Tool | Notes |
| --- | --- |
| [Playwright](https://playwright.dev/) | Current default. Multi-browser, parallel, great DX. |
| [Cypress](https://www.cypress.io/) | Dominant 2019–2022. Chromium-only historically (WebKit added later). Time-travel debugger, opinionated. |
| [WebdriverIO](https://webdriver.io/) | Classic WebDriver / Selenium-based. Still used for older stacks or cross-language. |
| [Selenium](https://www.selenium.dev/) | The oldest. Library, not a test runner. Used when you must drive Safari or IE-era browsers. |
| [Puppeteer](https://pptr.dev/) | Chrome-only. Lost ground to Playwright (same authors). |
| [TestCafe](https://testcafe.io/) | Niche; still maintained. |

For new projects in 2026, Playwright is the default. Cypress holds on in codebases that started with it.

## Page Object pattern, still relevant

Without structure, E2E tests become copy-paste monsters. The Page Object pattern abstracts UI details behind a class:

```ts
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }
}

// tests/login.spec.ts
test('login navigates to dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('scheduler@westside.demo', 'demo1234');
  await expect(page).toHaveURL('/dashboard');
});
```

When the login form HTML changes, you update one method. Tests stay readable.

Playwright's newer [component model](https://playwright.dev/docs/pom) makes this even lighter. Use it.

## Test data, the hardest part

Three strategies for getting the system into a known state:

### 1. Seeded fixture

The app boots with a known seed. Tests log in as seeded users and operate on seeded data. This is the pattern the [home-health skeleton project](https://github.com/waggertron/home-health-provider-skeleton) uses.

Pros: fast; deterministic; matches demo experience.
Cons: tests that mutate seeded data can pollute other tests.

### 2. API-driven setup

Before each test, call the API to create the test's preconditions:

```ts
test.beforeEach(async ({ request }) => {
  const token = await loginAsAdmin(request);
  await request.post('/api/v1/visits', { data: {...}, headers: auth(token) });
});
```

Pros: test-owned data; cleanup easy; no fixture pollution.
Cons: slower, every test does HTTP setup.

### 3. UI-driven setup

The test clicks through the UI to create preconditions.

Pros: exercises more of the app.
Cons: if the "create visit" UI is broken, 80% of tests fail for the same reason.

Most teams use a blend: seed a baseline world, then API-create per-test additions.

## Auth, skip it where you can

Logging in via the UI once per test is slow. Two patterns:

### Storage state

Log in once; save cookies / localStorage; reuse:

```ts
// playwright.config.ts
projects: [
  {
    name: 'setup',
    testMatch: /global\.setup\.ts/,
  },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], storageState: 'storage/scheduler.json' },
    dependencies: ['setup'],
  },
]

// global.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate as scheduler', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('scheduler@westside.demo');
  await page.getByLabel('Password').fill('demo1234');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.context().storageState({ path: 'storage/scheduler.json' });
});
```

Every test starts already logged in. Saves ~2s per test.

### Backdoor auth endpoint

A test-only API that returns a session token for any user:

```
POST /api/v1/test/impersonate { email }
→ { sessionToken }
```

Guarded by a `TEST_MODE` env var, never enabled in prod. Useful for multi-tenant tests that need to rapidly switch contexts.

## Keeping E2E tests fast

A 10-minute E2E suite blocks every PR. Ways to reduce:

- **Parallelize.** Playwright runs tests in parallel workers. Default 50%; tune up with disposable per-test data.
- **Shard.** Split the test suite across multiple CI machines.
- **Tag subsets.** Only the `@smoke` tag runs on every PR; `@e2e` runs on main / nightly.
- **Cheat on setup.** Use the storage-state or backdoor patterns above.
- **Skip what's already tested.** If a component test covers a bug, remove the E2E duplicate.
- **Run against a warm environment.** Boot infrastructure once per suite, not per test.

Target: under 5 minutes for the critical E2E suite; under 20 minutes for the full nightly.

## Flakiness, the tax you pay

E2E tests are flaky. Timing issues, animations, network blips, clock skew. Mitigation:

- **Auto-waiting assertions** (Playwright's defaults).
- **No manual `sleep`.** Always `expect(...).toBeVisible({ timeout: ... })`.
- **Disable animations** in test environments (`prefers-reduced-motion`).
- **Stable selectors**, accessible role/name, not `.btn-3.css-xyz-9`.
- **Retry twice max.** More than that hides real bugs.
- **Trace failed runs.** Playwright's trace viewer is gold; upload it as a CI artifact.

Accept that you'll never hit 0% flake rate. Target < 0.5%.

## Cross-browser and cross-device

Playwright makes this trivial:

```ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  { name: 'mobile',   use: { ...devices['iPhone 13'] } },
],
```

Four times the runtime; find the small number of browser-specific bugs. Usually worth it for the authentication, payment, and core-read flows; overkill for every test.

## CI integration

- **Record and upload traces** on failure, `trace: 'retain-on-failure'`.
- **Upload screenshots**, `screenshot: 'only-on-failure'`.
- **Video**, useful for hard-to-debug failures; heavy on storage.
- **Block the merge** on smoke subset; let full E2E warn-only until stable.
- **Report durations**, a test that gets 50% slower week over week is tomorrow's flake.

## Staging vs ephemeral environments

Two patterns for where E2E runs:

### Shared staging

Tests run against a long-lived environment. Simple, but tests contend for shared data and flake on cross-test pollution.

### Per-PR ephemeral environment

A PR-bot spins up a full stack per PR (via ArgoCD's `ApplicationSet` PullRequest generator, Vercel-like preview deploys, or just a Kubernetes namespace). Tests run against the PR's own copy.

Ephemeral is the gold standard; staging is the pragmatic default. Most teams evolve from shared staging → ephemeral over a year.

## Visual regression in E2E

Combine with [Chromatic](https://www.chromatic.com/), [Percy](https://percy.io/), or Playwright's built-in snapshot comparison. Catches "the logo is now misaligned" the way behavior tests can't.

Turn on only for stable UI, visual tests are more flake-prone than behavior tests. Budget for maintenance.

## Common mistakes

- **E2E as the primary test tier.** Slow, expensive, hard to debug. Push coverage down the pyramid.
- **No test-data strategy.** Tests pollute each other; failures cascade.
- **Testing implementation details.** Asserting on CSS classes. When you refactor, tests break even though the UX didn't change.
- **No trace upload on failure.** Flaky test that only repros in CI and you have no evidence. Always collect traces.
- **Every test logs in via UI.** 90% of your test time is login. Use storage state.
- **Assertions like `await page.waitForTimeout(2000)`.** Flake generator. Use proper waits.
- **Running full cross-browser for every PR.** Chromium on every PR; Firefox/WebKit nightly.

## The pragmatic E2E footprint

For a mid-sized product:

- **Smoke (1–5 tests)**, login + one critical path. Run on every PR and every deploy.
- **Critical path (10–30 tests)**, checkout, account creation, key workflows. Run on every PR.
- **Full regression (50–200 tests)**, run nightly on main.
- **Cross-browser**, smoke + critical path, run weekly or on release candidates.

Going above 200 E2E tests is usually a sign you should push coverage down to integration or component tests.

## References

- [Playwright documentation](https://playwright.dev/docs/intro)
- [Playwright, Test Generator](https://playwright.dev/docs/codegen-intro), record-and-replay test creation
- [Cypress documentation](https://docs.cypress.io/)
- [Martin Fowler, TestPyramid](https://martinfowler.com/bliki/TestPyramid.html), on why the base is wider
- [Kent C. Dodds, Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications), modern reshaping of the pyramid
- [Google testing blog, Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html), the skeptical case

## Related topics

- [Smoke tests](../smoke-tests/), the E2E subset that runs on every deploy
- [Component tests](../component-tests/), the tier below, where most UI coverage should live
- [Integration tests](../integration-tests/), where backend coverage should live
- [Unit tests](../unit-tests/), the base of the pyramid
