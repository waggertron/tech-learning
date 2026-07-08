---
title: "Modern React 30: Routing and nested layouts"
description: "Routing and nested layouts as the structure that makes URL state match UI state."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-routing-nested-layouts/
series:
  slug: modern-react-development
  order: 30
---

This is part 30 of the [Modern React development series](../series/modern-react-development/).

Routing connects the URL to the UI. Nested layouts make the route tree visible in the screen structure, so shared shells stay mounted while child route content changes.

## Concept

A route maps a URL pattern to UI and often to data. A nested layout is parent route UI that wraps child routes, usually with an outlet or `children` slot where the child route renders.

## Terms

- **Route**: A mapping from URL state to UI and route behavior.
- **Nested layout**: A parent route wrapper shared by child routes.
- **Outlet**: The placeholder where a matched child route renders.
- **URL state**: Application state represented in the path or query string.

## Mental model

Think of routing as a file cabinet. The cabinet frame stays put, drawers open for sections, and documents change inside the drawer without rebuilding the whole cabinet.

## How it is used

Use nested layouts for dashboards, account settings, project areas, admin screens, tabbed route sections, documentation, and any place where navigation chrome should persist while content changes.

## How to use it

1. Design URLs around resources and user tasks.
2. Place shared navigation and shell UI in parent layouts.
3. Render child route content through an outlet or framework `children` slot.
4. Keep route params and query values validated at the route boundary.
5. Use loading and error boundaries at route levels that match user-visible sections.

## Example: Generic account layout

```tsx
import type { ReactNode } from "react";

type AccountLayoutProps = {
  children: ReactNode;
};

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <section className="account-layout">
      <nav aria-label="Account settings">
        <a href="/account/profile">Profile</a>
        <a href="/account/security">Security</a>
      </nav>
      <main>{children}</main>
    </section>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-routing-nested-layouts-1-generic-account-layout" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-routing-nested-layouts-1-generic-account-layout.tsx" role="region" aria-label="Output view: Generic account layout">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><section class="account-layout"><nav aria-label="Account settings"><a href="/account/profile">Profile</a><a href="/account/security">Security</a></nav><main><p>Profile settings</p></main></section></div>
  </div>
</div>

Frameworks differ in how they provide child route content, but the layout model is the same.

## Example: Route config sketch

```tsx
import { AccountLayout } from "./AccountLayout";
import { ProfilePage } from "./ProfilePage";
import { SecurityPage } from "./SecurityPage";

const routes = [
  {
    path: "/account",
    element: <AccountLayout />,
    children: [
      { path: "profile", element: <ProfilePage /> },
      { path: "security", element: <SecurityPage /> },
    ],
  },
];
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-routing-nested-layouts-2-route-config-sketch" data-render-mode="result" data-interaction-mode="runner" data-runner-entry="2026-07-07-react-routing-nested-layouts-2-route-config-sketch" role="region" aria-label="Output view: Route config sketch">
  <div class="react-example-output__header">Runtime result</div>
  <div class="react-example-output__body">
    <div class="react-example-output__runner" data-react-example-runner="2026-07-07-react-routing-nested-layouts-2-route-config-sketch">
  <button type="button" class="react-example-output__run-button">Run example</button>
  <div class="react-example-output__runner-output" aria-live="polite">
    <pre class="react-example-output__runner-pre">const routes = [
  {
    path: &quot;/account&quot;,
    element: &lt;AccountLayout /&gt;,
    children: [
      { path: &quot;profile&quot;, element: &lt;ProfilePage /&gt; },
      { path: &quot;security&quot;, element: &lt;SecurityPage /&gt; },
    ],
  },
];</pre>
  </div>
</div>
  </div>
</div>

The route shape mirrors the UI shape: account shell first, child page second.

## Details to watch

- **URL durability**: A routed state can be refreshed, shared, bookmarked, and opened in a new tab.
- **Layout state**: State in a parent layout can persist while child routes change.
- **Params**: Path and search params are strings at the browser boundary. Parse them before using typed assumptions.
- **Data ownership**: Prefer route data APIs when the data belongs to navigation rather than one small component.

## Series navigation

- Previous: [Part 29: ESLint, TypeScript, formatting, and CI gates](../2026-07-07-react-eslint-typescript-formatting-ci/)
- Next: [Part 31: Data fetching with a cache](../2026-07-07-react-data-fetching-with-cache/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Build a React App from Scratch, routing](https://react.dev/learn/build-a-react-app-from-scratch)
- [Next.js layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [React Router docs](https://reactrouter.com/)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
