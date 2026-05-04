---
title: "NestJS, a 10-part series"
description: "A progression from project setup and the core modules/controllers/providers triangle through production deployment, testing, and microservices. Ten focused parts, each with working TypeScript and the gotchas you hit in real projects."
category: web
tags: [nestjs, typescript, nodejs, web, backend, api]
status: draft
created: 2026-05-04
updated: 2026-05-04
---

## Who this series is for

- **Express users who want structure** - you've shipped REST APIs but find yourself re-inventing dependency injection, middleware ordering, and project layout on every project.
- **Angular developers moving to the backend** - NestJS borrows Angular's decorator-based DI model deliberately; the mental model transfers well.
- **Engineers preparing for Node.js backend interviews** - Parts 2 (DI), 5 (auth), and 9 (microservices) cover the topics that come up most.

Each part is self-contained enough to read on its own, but later parts assume the primitives introduced in earlier ones.

## The parts

1. [Part 1: Architecture and setup](./part-01-architecture-and-setup/) *(beginner)*
2. [Part 2: Dependency injection](./part-02-dependency-injection/) *(beginner)*
3. [Part 3: REST controllers](./part-03-rest-controllers/) *(beginner)*
4. [Part 4: Database with TypeORM](./part-04-database-typeorm/) *(beginner to intermediate)*
5. [Part 5: Auth and guards](./part-05-auth-and-guards/) *(intermediate)*
6. [Part 6: Validation and pipes](./part-06-validation-and-pipes/) *(intermediate)*
7. [Part 7: Interceptors and filters](./part-07-interceptors-and-filters/) *(intermediate)*
8. [Part 8: WebSockets](./part-08-websockets/) *(advanced)*
9. [Part 9: Microservices](./part-09-microservices/) *(advanced)*
10. [Part 10: Testing and production](./part-10-testing-and-production/) *(expert)*

## Versions this series targets

- NestJS 11
- TypeScript 5.x
- Node.js 22 LTS
- TypeORM 0.3.x
- Jest 29

NestJS 11 introduced standalone application improvements and tighter ESM support. Where behavior differs from NestJS 9/10-era articles you'll find on the web, this series flags it inline.

## How I'd actually learn NestJS today

1. Build a toy CRUD API through Parts 1-4.
2. Add JWT auth (Part 5) and request validation (Part 6).
3. Read Parts 7 and 8 when you need real-time features or want to understand the request pipeline deeply.
4. Read Parts 9 and 10 before you split services or deploy, not after.

## References that apply to every part

- [NestJS documentation](https://docs.nestjs.com/) - comprehensive and well-maintained; the single best reference
- [NestJS GitHub](https://github.com/nestjs/nest) - source is readable; decorator internals are worth a look
- [Awesome NestJS](https://github.com/nestjs/awesome-nestjs) - curated packages and community resources
- [TypeScript documentation](https://www.typescriptlang.org/docs/) - NestJS leans heavily on decorators and generics; knowing both helps
