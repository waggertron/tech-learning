---
title: Django, a 10-part series
description: A progression from absolute beginner (project setup, MVT) through expert (production deployment, observability, zero-downtime migrations). Ten focused parts, each with runnable code and the gotchas you hit in real projects.
category: web
tags: [django, python, web, backend]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Who this series is for

- **New to Django** → start at Part 1 and work through in order.
- **Have shipped a Django app but don't feel expert** → jump to Parts 7–10.
- **Preparing for a senior backend interview** → Parts 7, 8, and 10 cover the ORM, caching/N+1, and production concerns that get asked.

Each part is standalone enough to read on its own, but later parts assume you understand the primitives introduced earlier.

## The parts

1. [Part 1, Project setup and the MVT pattern](./part-01-setup-and-mvt/) *(beginner)*
2. [Part 2, Models, migrations, and the ORM](./part-02-models-and-orm/) *(beginner)*
3. [Part 3, Views, URLs, and templates](./part-03-views-urls-templates/) *(beginner)*
4. [Part 4, Forms and user input](./part-04-forms-and-user-input/) *(beginner → intermediate)*
5. [Part 5, Authentication and authorization](./part-05-authentication/) *(intermediate)*
6. [Part 6, Django REST Framework basics](./part-06-drf-basics/) *(intermediate)*
7. [Part 7, Advanced ORM: QuerySets, Q/F, prefetching, aggregation](./part-07-advanced-orm/) *(intermediate → advanced)*
8. [Part 8, Caching, performance, and the N+1 problem](./part-08-caching-and-performance/) *(advanced)*
9. [Part 9, Async Django, Channels, and Celery](./part-09-async-and-background-tasks/) *(advanced)*
10. [Part 10, Production: deployment, security, observability](./part-10-production/) *(expert)*

## Versions this series targets

- Django 5.x (LTS 5.2)
- Python 3.11+
- PostgreSQL 15+ for production examples (SQLite fine for local dev)
- Django REST Framework 3.15+
- Celery 5+, Redis 7+

Django 5 introduced several changes from Django 3/4 era articles you'll find on the web, async ORM methods, `GeneratedField`, simplified form rendering. Where something changed, I'll flag it inline.

## How I'd actually learn Django today

Paraphrasing what works well for most engineers I've seen ramp up:

1. Build a toy CRUD app through Parts 1–4.
2. Add auth (Part 5) and expose it as an API (Part 6).
3. Skim Part 7 and return when you hit a slow query.
4. Read Parts 8–10 *before* you deploy, not after.

## References that apply to every part

- [Django documentation](https://docs.djangoproject.com/en/5.2/), the single best resource; consult the version matching your install
- [Django source on GitHub](https://github.com/django/django), the source is surprisingly readable; don't be afraid to click through
- [Awesome Django](https://github.com/wsvincent/awesome-django), curated packages and tutorials
- [Django Forum](https://forum.djangoproject.com/), for questions beyond Stack Overflow
