---
title: "Express.js, a 10-part series"
description: "A progression from project setup and routing through production-grade deployment. Ten focused parts, each with runnable code and the gotchas you hit in real projects."
category: web
tags: [express, nodejs, javascript, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Who this series is for

- **New to Express** → start at Part 1 and work through in order.
- **Have shipped a Node app but not with Express** → Parts 1 and 2 get you oriented in an hour.
- **Already using Express, want to level up** → jump to Parts 5–10 for auth, database, validation, and production concerns.
- **Preparing for a backend interview** → Parts 4, 5, 6, and 10 cover REST design, auth, persistence, and deployment topics that come up.

Each part is standalone enough to read on its own, but later parts assume you understand the primitives introduced earlier.

## The parts

1. [Part 1, Setup and routing](./part-01-setup-and-routing/) *(beginner)*
2. [Part 2, Middleware](./part-02-middleware/) *(beginner)*
3. [Part 3, Request and response](./part-03-request-response/) *(beginner)*
4. [Part 4, REST API design](./part-04-rest-api-design/) *(beginner → intermediate)*
5. [Part 5, Authentication](./part-05-authentication/) *(intermediate)*
6. [Part 6, Database integration](./part-06-database/) *(intermediate)*
7. [Part 7, Validation and error handling](./part-07-validation-and-errors/) *(intermediate)*
8. [Part 8, File uploads](./part-08-file-uploads/) *(intermediate)*
9. [Part 9, Testing](./part-09-testing/) *(intermediate → advanced)*
10. [Part 10, Production](./part-10-production/) *(advanced)*

## Versions this series targets

- Express 4.x / 5.x (examples run on both; differences noted inline)
- Node 22 LTS
- TypeScript 5 (type annotations shown where they add clarity, plain JS otherwise)
- PostgreSQL 15+ for database examples

Express 5 removed several deprecated APIs from Express 4 and added native async error propagation. Where behavior differs, the text flags it.

## How I'd actually learn Express today

The approach that works well for most engineers ramping on Node backends:

1. Build a basic CRUD API through Parts 1–4.
2. Add auth (Part 5) and a real database (Part 6).
3. Layer in validation and error handling (Part 7) before the code grows.
4. Read Parts 9 and 10 before you ship, not after.

## References that apply to every part

- [Express documentation](https://expressjs.com/en/4x/api.html), the 4.x API reference is comprehensive; 5.x docs are at expressjs.com/en/5x/api.html
- [Node.js documentation](https://nodejs.org/en/docs/), required background for understanding the runtime Express runs on
- [Express source on GitHub](https://github.com/expressjs/express), small and readable; worth browsing when middleware behavior surprises you
- [npm registry](https://www.npmjs.com/), for any package mentioned in this series
