---
title: Component tests
description: The middle tier — tests that exercise a UI component (or a small slice of server logic) with its immediate collaborators, usually rendering real DOM or hitting an in-memory DB. Between unit tests and E2E tests, and the tier that grows fastest.
parent: testing
tags: [component-tests, testing, react, vitest, testing-library]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What a component test is

**A component test exercises a single UI component (or a small server-side component like a DRF viewset) with its immediate collaborators real, but with the network, database, and heavyweight infrastructure replaced or scoped down.**

For frontend: render the component to a JSDOM (or real browser) DOM, simulate user events, assert on the visible output.

For backend: construct a viewset, a Flask blueprint, a Rails controller, a Django form — and exercise it end-to-end within the process, without a real HTTP server and with a stubbed DB driver or an in-memory equivalent.

The unifying idea: **test a meaningful chunk of behavior at the seam where it's worth integrating, but not so far out that real infrastructure comes into play.**

## Why they deserve their own tier

Unit tests were invented for languages that don't have GUIs. Once your codebase has a UI, the question "does this button correctly render the loading state?" isn't a unit test — it involves rendering, lifecycle, and state. You can do it in sub-50ms with a good test library; you don't need a real browser; but it's more than a single function.

Component tests fill that gap. On the backend, the same role is played by mid-level integration tests that stay in-process.

## Frontend component tests

Tooling in 2026:

- **[Vitest](https://vitest.dev/)** — fast Jest alternative, built on Vite. Default for new projects.
- **[Jest](https://jestjs.io/)** — the legacy default; still widely used.
- **[Testing Library](https://testing-library.com/)** — framework-agnostic helpers for querying the DOM the way a user would. `@testing-library/react`, `@testing-library/vue`, `@testing-library/svelte`, etc.
- **[Playwright component testing](https://playwright.dev/docs/test-components)** — real-browser component tests. Slower but more accurate; use for components heavy on layout / canvas / interaction.

### Example — React + Vitest + Testing Library

```tsx
// VisitCard.tsx
export function VisitCard({ visit, onAssign }: Props) {
  if (!visit.clinician) {
    return (
      <div className="card">
        <h3>{visit.patientName}</h3>
        <p>Unassigned</p>
        <button onClick={() => onAssign(visit.id)}>Assign</button>
      </div>
    );
  }
  return (
    <div className="card assigned">
      <h3>{visit.patientName}</h3>
      <p>Clinician: {visit.clinician.name}</p>
    </div>
  );
}
```

```tsx
// VisitCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VisitCard } from './VisitCard';

const unassignedVisit = { id: 1, patientName: 'Ada Lovelace', clinician: null };
const assignedVisit = { id: 2, patientName: 'Grace Hopper', clinician: { id: 7, name: 'Sarah RN' } };

describe('VisitCard', () => {
  it('shows Unassigned when no clinician', () => {
    render(<VisitCard visit={unassignedVisit} onAssign={vi.fn()} />);
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Assign' })).toBeEnabled();
  });

  it('calls onAssign with the visit id when the button is clicked', async () => {
    const onAssign = vi.fn();
    render(<VisitCard visit={unassignedVisit} onAssign={onAssign} />);
    await userEvent.click(screen.getByRole('button', { name: 'Assign' }));
    expect(onAssign).toHaveBeenCalledWith(1);
  });

  it('shows clinician name when assigned', () => {
    render(<VisitCard visit={assignedVisit} onAssign={vi.fn()} />);
    expect(screen.getByText(/Sarah RN/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Assign' })).not.toBeInTheDocument();
  });
});
```

Notice:

- Queries go through `screen.getBy*` — same queries a user could form ("find me the button labeled Assign").
- Simulated interactions use `userEvent`, which reflects real browser semantics (e.g. `click` dispatches `mousedown`, `mouseup`, `click`, and focus changes).
- Assertions describe user-visible behavior, not component internals.

### Testing Library's philosophy

> "The more your tests resemble the way your software is used, the more confidence they can give you." — Kent C. Dodds

This means:

- Query by accessible name (role + label), not by CSS selector or `data-testid`.
- Simulate user-level events (click, type), not component-level method calls.
- Assert on the rendered output, not the component state.

`getByTestId` exists as an escape hatch. It should be rare. If you need it constantly, the component isn't accessible — which is its own problem.

### Avoiding brittle snapshot tests

Snapshot tests capture a rendered component and assert it doesn't change. They're tempting — one line of test code per component. They're also a trap:

- Every UI tweak creates a cascade of "snapshot needs update" that reviewers can't evaluate.
- The snapshots encode incidental details (class names, spacing) that aren't behavior.
- Devs update them without reading them, which defeats the point.

Use snapshots rarely, for stable components (icons, fully-static content). Everywhere else, write explicit behavior assertions.

### Async state and MSW

Components that fetch have async state. Two approaches:

1. **Inject the fetch function** so tests can pass a stub.
2. **[Mock Service Worker (MSW)](https://mswjs.io/)** — intercepts real `fetch` / `XMLHttpRequest` calls at the network layer.

MSW is the modern default. It lets the component make real network calls; MSW serves scripted responses:

```ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/visits/:id', ({ params }) => {
    return HttpResponse.json({ id: Number(params.id), patientName: 'Ada', clinician: null });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('renders the fetched visit', async () => {
  render(<VisitPage visitId={1} />);
  expect(await screen.findByText('Ada')).toBeInTheDocument();
});
```

The component doesn't know it's being tested — fetch calls go out, MSW returns the scripted response. Works the same way in E2E tests.

## Backend component tests

The server-side analog: a test that exercises a route handler, a DRF viewset, a Flask view, or a controller, without a real HTTP server.

### Example — Django DRF test

```python
# test_visit_api.py
import pytest
from rest_framework.test import APIClient
from home_health.visits.models import Visit
from home_health.users.tests.factories import UserFactory

@pytest.mark.django_db
class TestVisitAssign:
    def setup_method(self):
        self.client = APIClient()
        self.user = UserFactory(role='scheduler')
        self.client.force_authenticate(user=self.user)

    def test_assign_scheduled_visit_returns_200(self):
        visit = Visit.objects.create(status='scheduled', tenant=self.user.tenant, patient_id=1)
        resp = self.client.post(f'/api/v1/visits/{visit.id}/assign/', {'clinician_id': 17})
        assert resp.status_code == 200
        visit.refresh_from_db()
        assert visit.status == 'assigned'

    def test_assign_completed_visit_returns_409(self):
        visit = Visit.objects.create(status='completed', tenant=self.user.tenant, patient_id=1)
        resp = self.client.post(f'/api/v1/visits/{visit.id}/assign/', {'clinician_id': 17})
        assert resp.status_code == 409
```

What's happening:

- The test uses the **full DRF request/response cycle** — serializers, permissions, middleware.
- It uses a **real database** (via `pytest-django`), but a test one, per-test transactional.
- No HTTP server is actually running — the request goes through `APIClient.post`, which bypasses the WSGI layer.

This tests enough to be useful (routing, serialization, auth, state-machine), without the slowness of a real HTTP server.

### When to write more integration than component

Backend component tests shade into [integration tests](../integration-tests/). The dividing line is usually **how many real services you touch**. A test using a real database but no network is a component test. A test that starts a real database, Redis, and a worker container is an integration test.

## Speed budget

- **Unit test** — < 10ms.
- **Component test** — < 50ms (frontend with JSDOM), < 200ms (backend with DB).
- **Integration test** — < 2s.
- **E2E test** — < 30s.

If component tests are hitting 1s, something's off — probably too much setup or rendering happening per test.

## Common mistakes

- **Testing with `data-testid` everywhere.** Treat it as a smell.
- **Too much setup per test.** If each test needs 40 lines of setup, your component takes too many props. Factor out a reusable render helper.
- **Testing library internals.** "Does React call `useEffect` here?" — no. Test the user-visible effect.
- **Mocking every hook.** You end up with a test that mocks `useQuery`, `useAuth`, `useTheme`, and asserts that the component renders "Loading…". It passes on a broken component. Let as many hooks run as possible.
- **Forgetting waitFor / findBy.** Async assertions that use `getBy` flake because the element hasn't rendered yet. Use `findBy*` for async cases.
- **Shared state between tests.** A module-level cache that leaks between tests. Clean up in `afterEach`; better, avoid the shared state.

## Cross-cutting concern — accessibility

Testing Library's query style doubles as an accessibility checker. If `getByRole('button', { name: 'Assign' })` can't find your button, screen readers can't either. Add [`jest-axe`](https://github.com/nickcolley/jest-axe) for automated a11y scans:

```ts
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

it('is accessible', async () => {
  const { container } = render(<VisitCard visit={unassignedVisit} onAssign={vi.fn()} />);
  expect(await axe(container)).toHaveNoViolations();
});
```

Catches contrast, missing labels, invalid ARIA roles — the common stuff.

## Visual regression

A component test catches "the button is labeled wrong." It doesn't catch "the button is now 2px off." For that:

- **[Chromatic](https://www.chromatic.com/)** — Storybook-based visual snapshots in the cloud.
- **[Percy](https://percy.io/)** — similar, BrowserStack-owned.
- **[Playwright screenshot comparison](https://playwright.dev/docs/test-snapshots)** — built into Playwright test runner.

Visual regression tests are flaky by nature (fonts render differently, animations, timing). Budget for that; enable only on a subset of critical UI.

## References

- [Testing Library docs](https://testing-library.com/docs/)
- [Kent C. Dodds — Static vs Unit vs Integration vs E2E](https://kentcdodds.com/blog/unit-vs-integration-vs-e2e-tests) — the "testing trophy"
- [Vitest](https://vitest.dev/)
- [Mock Service Worker](https://mswjs.io/)
- [pytest-django](https://pytest-django.readthedocs.io/)
- [jest-axe](https://github.com/nickcolley/jest-axe) — a11y in tests

## Related topics

- [Unit tests](../unit-tests/) — the tier below
- [Integration tests](../integration-tests/) — the tier above
- [E2E tests](../e2e-tests/) — real-browser variants
- [TDD](../tdd/) — component tests can be TDD'd, with a slower inner loop
