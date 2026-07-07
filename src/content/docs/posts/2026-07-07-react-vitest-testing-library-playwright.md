---
title: "Modern React 28: Vitest, Testing Library, and Playwright"
description: "Choosing between Vitest, Testing Library, and Playwright for different React failure modes."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-vitest-testing-library-playwright/
series:
  slug: modern-react-development
  order: 28
---

This is part 28 of the [Modern React development series](../series/modern-react-development/).

React testing works best as a stack, not one tool stretched across every kind of feedback. Vitest runs fast unit and component tests, Testing Library gives user-centered DOM helpers, and Playwright checks browser flows end to end.

## Concept

Each test tool owns a different distance from the code. Vitest is the runner for fast JavaScript tests. Testing Library renders and queries React components through the DOM. Playwright drives a real browser against the built app.

## Terms

- **Test runner**: The tool that discovers tests, runs them, and reports results.
- **Component test**: A test that renders one component or small component group.
- **E2E**: End-to-end, a test that exercises a user flow through the app in a browser.
- **Assertion**: A check that expected behavior happened.

## Mental model

Think of tests as camera distances. Vitest is a close-up, Testing Library is a room view, and Playwright is a walkthrough of the building.

## How it is used

Use Vitest for reducers, utilities, Hooks, and component tests. Use Testing Library when assertions should follow visible UI behavior. Use Playwright for login flows, routing, integrations, browser APIs, and confidence that the deployed shape works.

## How to use it

1. Put pure logic tests close to the code and run them with Vitest.
2. Render React components with Testing Library when the test needs DOM behavior.
3. Mock network boundaries in component tests so failures stay focused.
4. Use Playwright for user journeys that require a real browser and full app wiring.
5. Keep E2E tests fewer and higher value because they cost more to run and debug.

## Example: Vitest reducer test

```tsx
import { expect, test } from "vitest";
import { wizardReducer } from "./wizardReducer";

test("moves to confirm after profile is saved", () => {
  const state = {
    step: "profile",
    email: "reader@example.test",
    displayName: "",
  };

  expect(
    wizardReducer(state, { type: "profileSaved", displayName: "Weylin" }),
  ).toEqual({
    step: "confirm",
    email: "reader@example.test",
    displayName: "Weylin",
  });
});
```

A reducer is pure JavaScript, so it gets a fast test without rendering React.

## Example: Playwright route flow

```tsx
import { expect, test } from "@playwright/test";

test("search filters products", async ({ page }) => {
  await page.goto("/products");
  await page.getByLabel("Search products").fill("boots");

  await expect(page.getByRole("heading", { name: /boots/i })).toBeVisible();
  await expect(page.getByText("Trail sandals")).toBeHidden();
});
```

The browser test checks routing, rendering, and user input together.

## Details to watch

- **Speed**: Keep the fastest test that gives the needed confidence.
- **Queries**: Testing Library and Playwright both reward accessible labels and roles.
- **Flake**: E2E tests need stable fixtures, predictable auth, and clear waiting rules.
- **Overlap**: Do not repeat the same assertion at every layer unless the risk justifies it.

## Series navigation

- Previous: [Part 27: Storybook and component workbenches](../2026-07-07-react-storybook-component-workbenches/)
- Next: [Part 29: ESLint, TypeScript, formatting, and CI gates](../2026-07-07-react-eslint-typescript-formatting-ci/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Vitest guide](https://vitest.dev/guide/)
- [React Testing Library introduction](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright installation](https://playwright.dev/docs/intro)
- [act](https://react.dev/reference/react/act)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
