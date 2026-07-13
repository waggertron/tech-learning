---
title: Web Development
description: "Framework guides, browser and server concepts, API design, deployment concerns, and the tradeoffs that decide which web stack fits a project."
---

Web development sits at the seam between browsers, servers, networks, databases, and people clicking buttons faster than the system was designed for. Framework syntax is the visible part. The durable skill is understanding where state lives, how requests move, how trust boundaries are enforced, and what changes when local code becomes a deployed service.

The pages here are organized around practical stacks. Each series starts with the framework's mental model, then moves toward the parts that usually decide whether a project survives production: routing, data access, validation, authentication, testing, performance, deployment, observability, and failure handling.

## Topics

- [Django, a 10-part series](./django/): Python's batteries-included web framework, from `startproject` through models, templates, Django REST Framework, authentication, caching, async work, security, observability, and production deployment.
- [Express.js, a 10-part series](./express/): Node's minimal HTTP framework, from `npm init` through routing, middleware, validation, persistence, authentication, clustering, [rate limiting](../system-design/rate-limiting/), and [Docker](../ops/docker/) deployment.
- [NestJS, a 10-part series](./nestjs/): an opinionated TypeScript server framework built around modules, controllers, providers, dependency injection, pipes, guards, interceptors, microservices, WebSockets, testing, and production packaging.
- [React, a 10-part series](./react/): component-first UI development, from Vite setup and JSX through state, effects, routing, data loading, forms, performance, testing, accessibility, and deployment.

## Choosing a path

Start with the shape of the system, not the popularity of the framework.

- **Choose Django** when the product is data-heavy, admin-heavy, or better served by an integrated backend that includes ORM, migrations, auth, forms, templates, and a mature admin out of the box.
- **Choose Express** when the service is small, the team wants direct control over every layer, or the app mainly needs a thin HTTP surface around a few routes and integrations.
- **Choose NestJS** when the codebase is large enough that conventions matter. Its dependency injection and module boundaries pay off when many teams or many features share one TypeScript backend.
- **Choose React** when the hard part is client-side interaction: stateful screens, nested UI, optimistic updates, component reuse, and browser behavior.

Those choices can compose. A product may use Django for the core admin and API, React for the customer-facing UI, and a small Express service for a webhook adapter. The useful question is where each boundary sits and who owns the state on either side.

## What to learn across every stack

The framework changes, but the failure modes rhyme:

- **Routing and request shape**: URLs, HTTP methods, route parameters, status codes, redirects, and error responses form the public contract.
- **State ownership**: browser state, server sessions, database rows, cache entries, and background jobs all have different lifetimes.
- **Authentication and authorization**: login proves identity. Authorization decides what that identity can touch. Mixing those ideas creates security bugs.
- **Validation**: validate at the edge for clear errors, then enforce invariants again near persistence so bad data cannot sneak in through another path.
- **Performance**: the first production bottleneck is often not the framework. It is usually N+1 queries, unbounded payloads, missing indexes, oversized bundles, or cache rules that lie.
- **Testing**: unit, component, integration, and end-to-end tests catch different failures. A web app needs more than one tier.
- **Deployment and operations**: logs, health checks, configuration, migrations, secret handling, rollback behavior, and resource limits decide whether a deploy is boring.

## Related topics

- [Testing](../testing/), the test tiers that keep web changes safe.
- [Operations](../ops/), containers, Kubernetes, Terraform, GitOps, and deployment workflows.
- [Rate limiting](../system-design/rate-limiting/), abuse control and fairness limits for public APIs.
- [Secrets, keys, and tokens](../ops/secrets-keys-tokens/), credential handling for deployed systems.
