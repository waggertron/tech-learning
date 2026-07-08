---
title: "Modern React 16: Server Components and client boundaries"
description: "Server Components, client boundaries, and the split between data work and browser interactivity."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-server-components-client-boundaries/
series:
  slug: modern-react-development
  order: 16
---

This is part 16 of the [Modern React development series](../series/modern-react-development/).

React Server Components split a React tree across environments. Some components render on the server and never ship their implementation to the browser. Client Components mark the parts that need browser interactivity.

## Concept

A Server Component renders in a server environment before the client bundle runs. A Client Component is a component included in the browser bundle because it uses state, Effects, event handlers, browser APIs, or other client-only behavior.

## Terms

- **RSC**: React Server Components, the React architecture for rendering some components in a server environment.
- **Server Component**: A component rendered by the server-side React environment.
- **Client Component**: A component included in the browser bundle, usually marked by a framework with `"use client"`.
- **Client boundary**: The import boundary where a framework starts bundling code for the browser.

## Mental model

Think of the server tree as the kitchen and the client tree as the dining table. The kitchen can prepare data-heavy UI without sending its tools to the table. The table needs the interactive pieces the user touches.

## How it is used

Use Server Components for data reading, server-only dependencies, content rendering, and static shells. Use Client Components for inputs, event handlers, local state, browser APIs, subscriptions, and interactive widgets.

## How to use it

1. Start components on the server when using a framework that supports RSC.
2. Add `"use client"` only at files that need browser interactivity.
3. Pass serializable props from Server Components to Client Components.
4. Keep secrets, database clients, and private environment values on the server side.
5. Compose Client Components inside Server Components instead of making a whole route client-only.

## Example: Server page with a client filter

```tsx
// ReportsPage.tsx, Server Component
import { DateRangeSelector } from "./DateRangeSelector";
import { getRevenueReport } from "./reports";

export async function ReportsPage() {
  const report = await getRevenueReport();

  return (
    <main>
      <h1>Revenue report</h1>
      <p>Total revenue: $ {report.totalRevenue}</p>
      <DateRangeSelector initialRange={report.defaultRange} />
    </main>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-server-components-client-boundaries-1-server-page-with-a-client-filter" data-render-mode="react-server" role="region" aria-label="Output view: Server page with a client filter">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><main><h1>Revenue report</h1><p>Total revenue: $ 53,000</p><fieldset><legend>Date range</legend><button type="button" aria-pressed="false">7 days</button><button type="button" aria-pressed="true">30 days</button><button type="button" aria-pressed="false">90 days</button></fieldset></main></div>
  </div>
</div>

The page can read server data and render the stable report shell. The range selector can be a Client Component because it responds to browser interaction.

## Example: Client boundary for interactivity

```tsx
"use client";

import { useState } from "react";

type ReportRange = "7d" | "30d" | "90d";

export function DateRangeSelector({
  initialRange,
}: {
  initialRange: ReportRange;
}) {
  const [range, setRange] = useState<ReportRange>(initialRange);
  const options: { label: string; value: ReportRange }[] = [
    { label: "7 days", value: "7d" },
    { label: "30 days", value: "30d" },
    { label: "90 days", value: "90d" },
  ];

  return (
    <fieldset>
      <legend>Date range</legend>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={range === option.value}
          onClick={() => setRange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-server-components-client-boundaries-2-client-boundary-for-interactivity" data-render-mode="react-server" role="region" aria-label="Output view: Client boundary for interactivity">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><fieldset><legend>Date range</legend><button type="button" aria-pressed="false">7 days</button><button type="button" aria-pressed="true">30 days</button><button type="button" aria-pressed="false">90 days</button></fieldset></div>
  </div>
</div>

The directive belongs at the client entry file. Components imported by this file become part of that client bundle path.

## Details to watch

- **No server directive**: Server Components are not marked with `"use server"`. That directive marks Server Functions.
- **Serializable props**: Values crossing to Client Components need to be serializable by the framework.
- **Bundle size**: Moving a boundary high in the tree can pull more code into the browser bundle.
- **Framework support**: RSC requires framework or bundler integration. It is not a standalone client-only React feature.

## Series navigation

- Previous: [Part 15: Optimistic UI](../2026-07-07-react-optimistic-ui/)
- Next: [Part 17: Server Actions and mutation boundaries](../2026-07-07-react-server-actions-mutation-boundaries/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Server Components](https://react.dev/reference/rsc/server-components)
- [use client](https://react.dev/reference/rsc/use-client)
- [Server Functions](https://react.dev/reference/rsc/server-functions)
- [Creating a React App](https://react.dev/learn/creating-a-react-app)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
