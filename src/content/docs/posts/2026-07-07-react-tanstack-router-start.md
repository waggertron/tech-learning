---
title: "Modern React 24: TanStack Router and TanStack Start"
description: "TanStack Router and TanStack Start for type-safe routes, search params, and full-stack React apps."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-tanstack-router-start/
series:
  slug: modern-react-development
  order: 24
---

This is part 24 of the [Modern React development series](../series/modern-react-development/).

TanStack Router focuses on type-safe routing for React. TanStack Start builds on that router to provide a full-stack framework path with server rendering and server functions.

## Concept

TanStack Router treats routes, params, search params, loaders, and navigation as typed application boundaries. TanStack Start adds framework capabilities around that routing core.

## Terms

- **TanStack Router**: A type-focused routing library for React applications.
- **TanStack Start**: A full-stack React framework built around TanStack Router.
- **Search params**: The query string values in a URL, often used for filters and view state.
- **Route loader**: A route-level data loading function tied to navigation.

## Mental model

Think of the router as a typed map. The URL is not just a string, it is a structured route with known params, known search values, and known loading behavior.

## How it is used

Use TanStack Router when route types, search param validation, loader integration, and route tree control are central to the app. Use TanStack Start when the app also wants framework-level server features around that router.

## How to use it

1. Model route paths and route params as part of the application API.
2. Validate search params at the route boundary.
3. Load data at the route level when navigation should own the fetch.
4. Use typed links so route changes get checked before runtime.
5. Choose TanStack Start when full-stack framework concerns belong with the router.

## Example: Typed route search

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { ProductResults } from "./ProductResults";

type Search = {
  query?: string;
  page?: number;
};

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    query: typeof search.query === "string" ? search.query : "",
    page: Number(search.page ?? 1),
  }),
  component: ProductsRoute,
});

function ProductsRoute() {
  const search = Route.useSearch();
  return <ProductResults query={search.query ?? ""} page={search.page ?? 1} />;
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-tanstack-router-start-1-typed-route-search" data-render-mode="result" role="region" aria-label="Output view: Typed route search">
  <div class="react-example-output__header">Runtime result</div>
  <div class="react-example-output__body">
    <p><strong>Typed route search.</strong> This example requires its framework runtime to render on the page: No exported React component found..</p>
  </div>
</div>

Search params become a typed boundary instead of loose string reads throughout the page.

## Example: Route loader idea

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { getProject } from "./projects";

export const Route = createFileRoute("/projects/$projectId")({
  loader: async ({ params }) => {
    return getProject(params.projectId);
  },
  component: ProjectRoute,
});

function ProjectRoute() {
  const project = Route.useLoaderData();
  return <h1>{project.name}</h1>;
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-tanstack-router-start-2-route-loader-idea" data-render-mode="result" role="region" aria-label="Output view: Route loader idea">
  <div class="react-example-output__header">Runtime result</div>
  <div class="react-example-output__body">
    <p><strong>Route loader idea.</strong> This example requires its framework runtime to render on the page: No exported React component found..</p>
  </div>
</div>

The route knows which data belongs with the URL and exposes that loaded data to the component.

## Details to watch

- **Type boundary**: Typed routes pay off when links, params, and search values change over time.
- **Search shape**: Query strings are strings at the browser boundary. Parse them before treating them as typed values.
- **Framework split**: Router and Start are related but not the same tool. Router handles routing. Start adds framework features.
- **Docs drift**: TanStack APIs move quickly. Check the current docs while implementing a production route tree.

## Series navigation

- Previous: [Part 23: React Router v7](../2026-07-07-react-router-v7-framework/)
- Next: [Part 25: Expo and React Native](../2026-07-07-react-expo-react-native/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [TanStack Router overview](https://tanstack.com/router/latest/docs/overview)
- [TanStack Router React docs](https://tanstack.com/router/latest/docs/framework/react/overview)
- [Creating a React App](https://react.dev/learn/creating-a-react-app)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
