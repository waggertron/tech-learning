---
title: "Part 8 — Caching, performance, and the N+1 problem"
description: How to find the slow queries, fix them with `select_related`/`prefetch_related`, add per-view and fragment caching, pick a cache backend, and profile a Django app in production.
parent: django
tags: [django, performance, caching, n-plus-1, redis, advanced]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Rule #1 — measure first

Nearly every "Django is slow" report is actually one of:

1. **N+1 queries** (most common)
2. **Missing database index** on a filtered or ordered column
3. **Huge serialized payload** with no pagination
4. **Blocking I/O on an external API** inside a request

Don't guess. Install the debug toolbar in development:

```bash
pip install django-debug-toolbar
```

```python
# settings.py (dev only)
if DEBUG:
    INSTALLED_APPS += ["debug_toolbar"]
    MIDDLEWARE += ["debug_toolbar.middleware.DebugToolbarMiddleware"]
    INTERNAL_IPS = ["127.0.0.1"]
```

The SQL panel shows every query per page, with the explain plan on demand. The common failure mode reveals itself instantly: "127 queries, all selecting one author."

## The N+1 problem

**Symptom:** 1 query for a list, then 1 query per item in the list for a related object.

```python
# View
posts = Post.objects.all()

# Template
{% for post in posts %}
  {{ post.author.name }}   {# ← triggers one SQL query per post #}
{% endfor %}
```

**Fix:** pre-load the related data with `select_related` (FK/O2O) or `prefetch_related` (M2M, reverse FK). Covered in Part 7.

```python
posts = Post.objects.select_related("author").prefetch_related("tags")
```

**Detection without the toolbar:**

```python
from django.db import connection
from django.test.utils import CaptureQueriesContext

with CaptureQueriesContext(connection) as ctx:
    view(request)

assert len(ctx.captured_queries) < 10, f"Too many queries: {len(ctx.captured_queries)}"
```

Make these assertions in tests to catch regressions.

## Indexing

PostgreSQL's `EXPLAIN ANALYZE` is the right tool. In Django:

```python
print(Post.objects.filter(published_at__gt="2025-01-01").explain(analyze=True))
```

Common missing-index patterns:

- Filtering on a column without an index: `filter(created_at__gt=...)`.
- Ordering without an index: `order_by("-created_at")` with large tables.
- LIKE queries with leading wildcards: `icontains="foo"` can't use a btree index; consider a trigram index (`pg_trgm`) or full-text search.

Adding indexes in Django:

```python
class Meta:
    indexes = [
        models.Index(fields=["-created_at"]),
        models.Index(fields=["author", "-published_at"]),   # composite
        models.Index(
            fields=["slug"], name="slug_published_idx",
            condition=models.Q(published_at__isnull=False),   # partial
        ),
    ]
```

Generate a migration and `migrate`.

## Caching — the framework

`CACHES` in settings configures backends. A typical prod setup:

```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "KEY_PREFIX": "myapp",
        "TIMEOUT": 300,           # default 5 minutes
    }
}
```

### Low-level cache API — your best tool

```python
from django.core.cache import cache

def get_top_posts():
    result = cache.get("top_posts")
    if result is None:
        result = list(
            Post.objects.filter(published_at__isnull=False)
                .order_by("-view_count")[:10]
                .values("id", "title", "slug")
        )
        cache.set("top_posts", result, timeout=600)
    return result
```

Pattern variants:

```python
cache.get_or_set("top_posts", compute_top_posts, timeout=600)
cache.incr("post:42:views")
cache.many({"a": 1, "b": 2}, timeout=60)
```

### Invalidation

Cache invalidation is hard because you have two sources of truth. Strategies:

- **TTL** — accept staleness up to the timeout. Simplest, works for most things.
- **Manual delete** — `cache.delete("top_posts")` in the write path.
- **Versioned keys** — include a version in the key; bump the version on write.
- **Signal-driven** — `post_save` on a model deletes affected cache entries.

### Per-view caching

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # 15 minutes
def post_list(request):
    ...
```

Caches the **full response**, keyed by URL + `Vary` headers. Great for public pages; doesn't work when the response depends on `request.user`.

### Template fragment caching

```django
{% load cache %}

{% cache 300 sidebar request.user.id %}
  {# expensive sidebar rendering #}
{% endcache %}
```

Useful when most of the page is cacheable but a small slice is user-specific.

### Per-site caching (middleware)

```python
MIDDLEWARE = [
    "django.middleware.cache.UpdateCacheMiddleware",  # first
    # ... other middleware ...
    "django.middleware.cache.FetchFromCacheMiddleware",  # last
]
CACHE_MIDDLEWARE_SECONDS = 600
```

This caches **everything**, which is almost never what you want — authenticated requests get cached per-user and the memory footprint explodes. Use per-view instead.

## Database connection pooling

Django doesn't pool DB connections out of the box. Options:

- **[`CONN_MAX_AGE`](https://docs.djangoproject.com/en/5.2/ref/settings/#conn-max-age)** — persistent connections per worker. `CONN_MAX_AGE = 60` is a safe starting point; infinity (`None`) if your DB handles idle connections well.
- **PgBouncer** in front of Postgres — dedicated connection pooler, the production default for Django + Postgres at scale.
- **`CONN_HEALTH_CHECKS = True`** (Django 4.1+) — pings before reuse; prevents stale connections after DB restarts.

## Bulk operations

`save()` one at a time does one SQL round-trip per record — deadly for imports and migrations.

```python
# Instead of N INSERTs
Post.objects.bulk_create([Post(...) for _ in range(10_000)], batch_size=500)

# Instead of N UPDATEs
Post.objects.bulk_update(posts, fields=["title"], batch_size=500)

# Instead of N DELETEs
Post.objects.filter(created_at__lt=cutoff).delete()  # one DELETE, but triggers signals

# For massive deletes, consider raw SQL or _raw_delete for no signals
```

Caveats: `bulk_create` doesn't call `save()` or fire signals. Use only when you know the side-effects.

## Streaming responses for large payloads

Returning a 500-MB JSON list via `JsonResponse` buffers the whole thing in memory. Use streaming:

```python
from django.http import StreamingHttpResponse
import csv

def export_posts(request):
    def rows():
        yield ["id", "title", "author"]
        for post in Post.objects.iterator(chunk_size=500):
            yield [post.id, post.title, post.author.username]

    pseudo_buffer = type("Echo", (), {"write": lambda self, v: v})()
    writer = csv.writer(pseudo_buffer)
    response = StreamingHttpResponse(
        (writer.writerow(r) for r in rows()),
        content_type="text/csv",
    )
    response["Content-Disposition"] = 'attachment; filename="posts.csv"'
    return response
```

## Profiling in production

- **APM** — Sentry Performance, Datadog, New Relic. One of these is not optional at scale.
- **`django-silk`** — request profiler with SQL inspection, kept to a whitelist of users.
- **Structured logging** — log query count per request via a middleware that wraps the view and reports `len(connection.queries)`.

## Gotchas

- **Cache key explosion** — keying by user ID * something-else fills memory fast. Put sensitive keys on separate Redis databases so you can flush one without nuking everything.
- **"Stale while revalidate"** — Django's cache has no SWR out of the box; for that, look at `django-cachalot` or roll your own.
- **Denormalization** — sometimes the right fix is to add a column (`Author.post_count`) updated via signals, not to keep running `COUNT(*)`. Trade storage for query time.
- **Pagination count cost** — `count(*)` over a filtered table is slow on Postgres. Consider cursor pagination (where you paginate by a sortable key like `id` or timestamp) instead of page-number pagination.
- **Migrations on huge tables** — adding a non-null column with a default rewrites every row. Add as nullable first, backfill in batches, then switch to non-null.

## What's next

Part 9 covers async views, Channels (WebSockets), and Celery for background work.

## References

- [Cache framework — Django docs](https://docs.djangoproject.com/en/5.2/topics/cache/)
- [Database optimization](https://docs.djangoproject.com/en/5.2/topics/db/optimization/)
- [django-debug-toolbar](https://django-debug-toolbar.readthedocs.io/)
- [django-silk](https://github.com/jazzband/django-silk) — production profiler
- [PgBouncer](https://www.pgbouncer.org/) — Postgres connection pooler
- [High Performance Django](https://highperformancedjango.com/) — older but still-useful guide
