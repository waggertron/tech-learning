---
title: "Modern React 19: Testing components by behavior"
description: "Component tests that assert user-visible behavior instead of implementation details."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-testing-components-by-behavior/
series:
  slug: modern-react-development
  order: 19
---

This is part 19 of the [Modern React development series](../series/modern-react-development/).

React component tests are most useful when they describe what a user can observe or do. The test should care that a save button disables while saving, not which internal state variable stores the pending flag.

## Concept

Behavior testing renders a component, interacts with it through the DOM, and asserts visible output or accessible state. React's `act` helper is the underlying model for waiting until updates caused by interactions have been applied.

## Terms

- **DOM**: Document Object Model, the browser-like tree a test can query.
- **act**: React's test helper for flushing updates before assertions.
- **Accessible query**: A query based on roles, labels, or text that mirrors how users and assistive tech find controls.
- **Implementation detail**: Internal state, private functions, or markup structure that can change while behavior stays the same.

## Mental model

Treat a component test like a short user session. Render the screen, perform an action, then check what changed from the user's point of view.

## How it is used

Use behavior tests for forms, buttons, validation messages, loading states, permissions, keyboard flows, and component contracts that should survive refactors.

## How to use it

1. Render the component with realistic props.
2. Find controls by role, label, or visible text.
3. Trigger user-like interactions.
4. Await async UI changes when the interaction schedules updates.
5. Assert visible text, accessible state, calls to public callbacks, or navigation effects.

## Example: Counter behavior

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

test("increments when clicked", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: /count: 0/i }));

  expect(screen.getByRole("button", { name: /count: 1/i })).toBeVisible();
});
```

The test finds the button like a user would and checks the behavior that matters.

## Example: Form validation message

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { ProfileForm } from "./ProfileForm";

test("shows a validation message for a short display name", async () => {
  const user = userEvent.setup();
  render(<ProfileForm />);

  await user.type(screen.getByLabelText(/display name/i), "A");
  await user.click(screen.getByRole("button", { name: /save/i }));

  expect(
    await screen.findByText(/at least two characters/i),
  ).toBeVisible();
});
```

`findByText` waits for async UI to settle before the assertion runs.

## Details to watch

- **React updates**: Testing helpers commonly wrap interactions in `act`, but async UI still needs awaited queries.
- **Accessible selectors**: Role and label queries double as accessibility pressure.
- **Mocking**: Mock network or framework boundaries, not React internals.
- **Brittleness**: Avoid asserting class names or component state unless that is the public contract.

## Series navigation

- Previous: [Part 18: TypeScript patterns for React](../2026-07-07-react-typescript-component-patterns/)
- Next: [Part 20: Performance and React Compiler](../2026-07-07-react-performance-and-compiler/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [act](https://react.dev/reference/react/act)
- [React Testing Library introduction](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library user-event](https://testing-library.com/docs/user-event/intro/)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
