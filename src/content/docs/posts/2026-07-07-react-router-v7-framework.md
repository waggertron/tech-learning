---
title: "Modern React 23: React Router v7"
description: "React Router v7 as routing plus loaders, actions, nested layouts, and framework-style data flow."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-router-v7-framework/
series:
  slug: modern-react-development
  order: 23
---

This is part 23 of the [Modern React development series](../series/modern-react-development/).

React Router v7 can be used as a routing library or as a framework-style setup with routes, loaders, actions, and server rendering options. Its core model keeps URL state, route data, and UI nesting close together.

## Concept

React Router maps locations to route modules. A route module can define UI, data loading, mutations, and nested child routes, so navigation can fetch the data needed for the next screen before the component renders.

## Terms

- **Route module**: A file or route definition that owns a route's component and optional data APIs.
- **Loader**: A function that loads data for a route before rendering.
- **Action**: A function that handles route mutations, often from form submissions.
- **Nested route**: A child route rendered inside a parent route outlet.

## Mental model

Think of each route as a station. The router knows which station the URL points to, what data should be waiting there, and which parent stations stay on screen around it.

## How it is used

Use React Router for applications where routes, nested layouts, forms, and route data are central, especially when the app should be built on web platform primitives and can choose between library and framework modes.

## How to use it

1. Define routes around the URL structure users will understand.
2. Use nested routes for UI that shares a parent layout.
3. Load route data in loaders when the router should own the fetch timing.
4. Use actions for mutations tied to navigation or form submissions.
5. Keep route params and search params typed or validated at the route boundary.

## Example: Route with loader data

```tsx
export async function loader({ params }: { params: { projectId: string } }) {
  return getProject(params.projectId);
}

export default function ProjectRoute({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <main>
      <h1>{loaderData.name}</h1>
      <p>{loaderData.description}</p>
    </main>
  );
}
```

The route owns the data required to render the route screen.

## Example: Nested layout with an outlet

```tsx
import { Outlet } from "react-router";

export default function AccountLayout() {
  return (
    <section>
      <nav aria-label="Account">
        <a href="/account/profile">Profile</a>
        <a href="/account/security">Security</a>
      </nav>
      <Outlet />
    </section>
  );
}
```

The parent route renders the shared account shell while child routes fill the outlet.

## Details to watch

- **URL as state**: Route params and search params are shareable state. Treat them as part of the app contract.
- **Loader timing**: Loader-based data avoids every component inventing its own fetch Effect.
- **Actions**: Route actions fit mutations that naturally belong to a route or form.
- **Mode choice**: React Router can be used in different modes. Match the mode to the app's routing and data needs.

## Series navigation

- Previous: [Part 22: Next.js App Router](../2026-07-07-react-nextjs-app-router/)
- Next: [Part 24: TanStack Router and TanStack Start](../2026-07-07-react-tanstack-router-start/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [React Router framework installation](https://reactrouter.com/start/framework/installation)
- [React Router home](https://reactrouter.com/)
- [Creating a React App](https://react.dev/learn/creating-a-react-app)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
