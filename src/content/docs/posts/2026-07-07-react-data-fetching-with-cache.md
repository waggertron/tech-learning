---
title: "Modern React 31: Data fetching with a cache"
description: "Data fetching with a client cache instead of one-off effects per component."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-data-fetching-with-cache/
series:
  slug: modern-react-development
  order: 31
---

This is part 31 of the [Modern React development series](../series/modern-react-development/).

Server data is not the same as local UI state. It has loading states, errors, freshness rules, retries, deduplication, and invalidation. A data cache gives those concerns a shared owner.

## Concept

A client data cache stores server responses by query keys and coordinates fetching, refetching, pending state, errors, and sharing across components. React docs point apps toward framework data APIs or purpose-built fetching libraries instead of one-off Effects for every request.

## Terms

- **Server state**: Data owned by a server or external source, not by one React component.
- **Query key**: A stable identifier for one cached read.
- **Cache**: A store that can reuse data and coordinate refresh behavior.
- **Stale data**: Cached data that can be shown but may need a background refresh.

## Mental model

Think of the cache as a library desk. Components ask for a book by catalog key. The desk either hands over the copy it has, fetches a fresh copy, or tells the component the request failed.

## How it is used

Use a cache for backend data used by multiple components, paginated lists, detail pages, search results, dashboards, and data that needs refetching after mutations or window focus.

## How to use it

1. Name each read with a stable query key.
2. Put the fetch function at the query boundary, not inside unrelated render code.
3. Render loading, error, empty, and success states explicitly.
4. Use router loaders or server fetching when route navigation should own the request.
5. Invalidate or update affected queries after mutations.

## Example: TanStack Query read

```tsx
import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "./projects";

type Project = { id: string; name: string };

export function ProjectName({ projectId }: { projectId: string }) {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId),
  });

  if (query.isPending) return <p>Loading project...</p>;
  if (query.isError) return <p>Project could not load.</p>;

  return <h1>{query.data.name}</h1>;
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-data-fetching-with-cache-1-tanstack-query-read" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-data-fetching-with-cache-1-tanstack-query-read.tsx" role="region" aria-label="Output view: TanStack Query read">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><p>Loading project...</p></div>
  </div>
</div>

The query key names the cached read. The component renders each state of the request.

## Example: Query client provider

```tsx
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-data-fetching-with-cache-2-query-client-provider" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-data-fetching-with-cache-2-query-client-provider.tsx" role="region" aria-label="Output view: Query client provider">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><p>Cached data area</p></div>
  </div>
</div>

A cache provider gives components access to the same query client instead of each component owning isolated fetch logic.

## Details to watch

- **Effects**: Manual fetch Effects are useful for some integrations, but they do not provide cache behavior by themselves.
- **Key design**: Keys should include every input that changes which data is fetched.
- **Freshness**: A cache can show previous data while fetching new data. That is different from local state ownership.
- **Framework data**: Framework loaders and Server Components can fetch before client components render, which avoids client waterfalls.

## Series navigation

- Previous: [Part 30: Routing and nested layouts](../2026-07-07-react-routing-nested-layouts/)
- Next: [Part 32: Mutations and cache invalidation](../2026-07-07-react-mutations-cache-invalidation/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Build a React App from Scratch, data fetching](https://react.dev/learn/build-a-react-app-from-scratch)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [TanStack Query React overview](https://tanstack.com/query/latest/docs/framework/react/overview)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
