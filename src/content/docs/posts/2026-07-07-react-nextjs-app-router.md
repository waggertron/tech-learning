---
title: "Modern React 22: Next.js App Router"
description: "Next.js App Router as a React framework for routing, server rendering, data loading, and deployment."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-nextjs-app-router/
series:
  slug: modern-react-development
  order: 22
---

This is part 22 of the [Modern React development series](../series/modern-react-development/).

Next.js App Router is a React framework model built around file-system routes, layouts, Server Components, Suspense, Server Functions, and deployment conventions. It supplies answers that a bare React app would otherwise have to design.

## Concept

The App Router maps files and folders under `app` to routes, layouts, loading states, error boundaries, metadata, and server or client component boundaries. It uses modern React architecture features as part of the routing model.

## Terms

- **App Router**: Next.js's file-system router for the `app` directory.
- **Layout**: A shared UI wrapper that persists across child routes.
- **Page**: The route segment component that renders for a URL.
- **Route segment**: One folder level in the route tree.
- **Server Component**: A component rendered by the server-side React environment before browser interactivity.

## Mental model

Think of the `app` directory as the route tree made of files. A folder defines a segment, `layout` defines the frame around that segment, and `page` defines the content at the URL.

## How it is used

Use App Router for apps that benefit from nested layouts, server-rendered pages, Server Components, route-level loading UI, metadata, cache and revalidation tools, and server-side mutation boundaries.

## How to use it

1. Create route folders for URL segments.
2. Use `layout` files for shared shells and `page` files for route content.
3. Keep components as Server Components by default when they only render data and markup.
4. Add `"use client"` at interactive component entry points.
5. Use framework conventions for loading, error, not-found, metadata, data fetching, and mutations.

## Example: Route page with server data

```tsx
// app/products/[id]/page.tsx
import { AddToCartButton } from "./AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <main>
      <h1>{product.name}</h1>
      <p>$ {product.price}</p>
      <AddToCartButton productId={product.id} />
    </main>
  );
}
```

The route can fetch server data before passing a small ID to a client-side button.

## Example: Nested layout

```tsx
// app/account/layout.tsx
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav aria-label="Account">
        <a href="/account/profile">Profile</a>
        <a href="/account/billing">Billing</a>
      </nav>
      {children}
    </section>
  );
}
```

The layout wraps all child account routes, so shared navigation does not need to be repeated in every page.

## Details to watch

- **Server by default**: In App Router, components are server-rendered by default unless a client boundary is introduced.
- **File conventions**: Special files such as `layout`, `page`, `loading`, and `error` have route behavior.
- **Params shape**: Next.js version details can change around params and async conventions. Check current docs during implementation.
- **Boundary placement**: Moving `"use client"` high in the tree can pull more route code into the browser bundle.

## Series navigation

- Previous: [Part 21: Framework choice and project setup](../2026-07-07-react-framework-choice-project-setup/)
- Next: [Part 23: React Router v7](../2026-07-07-react-router-v7-framework/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Next.js App Router docs](https://nextjs.org/docs/app)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js Fetching Data](https://nextjs.org/docs/app/getting-started/fetching-data)
- [Server Components](https://react.dev/reference/rsc/server-components)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
