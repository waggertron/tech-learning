---
title: "Part 7: Advanced ORM: QuerySets, Q/F, prefetching, aggregation"
description: The tools that separate senior Django devs from beginners, `Q` and `F` expressions, `select_related` vs `prefetch_related`, annotations, subqueries with `OuterRef`, and when to drop down to raw SQL.
parent: django
tags: [django, orm, queryset, advanced]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Q objects, logical OR and complex filters

`.filter()` joins conditions with AND. For OR / NOT / grouping, use `Q`:

```python
from django.db.models import Q

# (published_at IS NOT NULL) OR (author = alice)
Post.objects.filter(
    Q(published_at__isnull=False) | Q(author=alice)
)

# (tag = python) AND NOT (author = alice)
Post.objects.filter(tags__name="python").exclude(author=alice)
# equivalent to
Post.objects.filter(Q(tags__name="python") & ~Q(author=alice))
```

`Q` objects compose, good for dynamic queries:

```python
def search_posts(query, author=None):
    filters = Q(title__icontains=query) | Q(body__icontains=query)
    if author:
        filters &= Q(author=author)
    return Post.objects.filter(filters)
```

## F expressions, reference fields in the database

`F` refers to a **column value, at the DB layer**. Avoids read-modify-write races.

```python
from django.db.models import F

# Atomic increment, safe under concurrency
Post.objects.filter(pk=post.pk).update(view_count=F("view_count") + 1)

# Compare two columns
Post.objects.filter(updated_at__gt=F("published_at"))

# Arithmetic
Post.objects.annotate(days_live=Now(), F("published_at"))
```

Without `F`, `post.view_count += 1; post.save()` is a classic race-condition bug: two concurrent requests both read 10, both save 11.

## select_related vs prefetch_related

Both prevent N+1 queries. They work differently.

### `select_related`, for ForeignKey / OneToOne (forward)

Does a SQL `JOIN` in one query.

```python
# Without, 1 query for posts, N queries for each post.author
for post in Post.objects.all():
    print(post.author.name)   # each access = 1 SQL query

# With, 1 query total
for post in Post.objects.select_related("author"):
    print(post.author.name)
```

Chain for deeper: `select_related("author__profile")`.

### `prefetch_related`, for M2M and reverse FK

Can't be done in a single JOIN cleanly; does a **second query** and stitches results in Python.

```python
# Without, 1 query for posts, N queries for each post.tags.all()
for post in Post.objects.all():
    print([t.name for t in post.tags.all()])

# With, 2 queries total
for post in Post.objects.prefetch_related("tags"):
    print([t.name for t in post.tags.all()])
```

### Which to use

| Relation | Use |
| --- | --- |
| Forward ForeignKey | `select_related` |
| OneToOneField | `select_related` |
| ManyToMany | `prefetch_related` |
| Reverse ForeignKey (author → posts) | `prefetch_related` |

### Customizing prefetches

```python
from django.db.models import Prefetch

# Only prefetch published posts on each author
Author.objects.prefetch_related(
    Prefetch("posts", queryset=Post.objects.filter(published_at__isnull=False))
)
```

## Annotations, compute per-row on the DB

```python
from django.db.models import Count, Sum, Avg, Max, Min

Author.objects.annotate(
    post_count=Count("posts"),
    latest_post=Max("posts__published_at"),
)
# Each Author instance now has .post_count and .latest_post
```

Annotations are added to the SELECT of the generated SQL, computed in the database, not in Python.

### Conditional aggregation

```python
from django.db.models import Count, Q

Author.objects.annotate(
    published_count=Count("posts", filter=Q(posts__published_at__isnull=False)),
    draft_count=Count("posts",     filter=Q(posts__published_at__isnull=True)),
)
```

## Aggregation, reduce the whole queryset

`annotate` adds a column; `aggregate` returns a single dict.

```python
from django.db.models import Avg
Post.objects.aggregate(avg_length=Avg("body_length"))
# {'avg_length': 1843.2}
```

## Subqueries with OuterRef

When you need a subquery per row, e.g., "each author's most recent post":

```python
from django.db.models import OuterRef, Subquery

latest = Post.objects.filter(author=OuterRef("pk")).order_by("-published_at")

Author.objects.annotate(
    latest_post_title=Subquery(latest.values("title")[:1])
)
```

Subquery + `OuterRef` is one of the hardest ORM patterns to internalize but essential for anything beyond simple joins.

## Values, values_list, and only/defer

```python
Post.objects.values("id", "title")                # list of dicts
Post.objects.values_list("id", "title")            # list of tuples
Post.objects.values_list("id", flat=True)          # list of ids only

Post.objects.only("id", "title")                   # defer all other fields; accessing them triggers extra SQL
Post.objects.defer("body")                         # opposite, skip body
```

`only()` / `defer()` only help when a rarely-used field is huge; for most cases, `values()` is the clearer tool.

## Dropping down: raw SQL

When the ORM becomes a fight, write SQL:

```python
# Raw on a model (results mapped to model instances)
Post.objects.raw(
    "SELECT * FROM blog_post WHERE to_tsvector(body) @@ to_tsquery(%s)",
    [search],
)

# Pure SQL (no model mapping)
from django.db import connection
with connection.cursor() as cur:
    cur.execute("UPDATE blog_post SET view_count = view_count + 1 WHERE id = %s", [pid])
```

For full-text search on Postgres, Django has `django.contrib.postgres.search`, saves you from hand-writing `to_tsvector`.

## Django 5+ async ORM

All major QuerySet methods have async twins: `aget()`, `acreate()`, `afirst()`, `acount()`, etc.

```python
async def get_post(slug):
    return await Post.objects.aget(slug=slug)
```

Not every method is async yet (notably, iteration uses `async for`). When in doubt, check the [async docs](https://docs.djangoproject.com/en/5.2/topics/async/).

## GeneratedField (Django 5.0+)

```python
class Post(models.Model):
    body = models.TextField()
    word_count = models.GeneratedField(
        expression=Length("body"),
        output_field=models.IntegerField(),
        db_persist=True,
    )
```

Computed on insert/update at the database level, queryable directly.

## Gotchas

- **`update()` bypasses signals and `save()` logic.** Any `post_save` handlers, `auto_now=True`, custom `save()`, all skipped. Use when you need performance and no side effects.
- **`annotate` + `filter` join multiplication.** Annotating through a relation then filtering produces duplicate rows. Use subqueries or `Count(..., distinct=True)`.
- **`.distinct()` vs `.distinct(*fields)`**, bare is SQL `DISTINCT *`; with field names is Postgres's `DISTINCT ON`. Different semantics.
- **`order_by("?")`**, random ordering, performs terribly on large tables. Fetch a count first, pick random offsets.
- **`iterator()`**, skips the QuerySet cache; essential for iterating millions of rows without OOM. Pair with `chunk_size`.
- **Lazy QuerySets get re-evaluated**, if you iterate twice, SQL runs twice. Cache with `list(qs)` if you'll reuse.

## What's next

Part 8 turns query knowledge into performance, finding and fixing N+1, adding caching layers, and profiling.

## References

- [Making queries, Django docs](https://docs.djangoproject.com/en/5.2/topics/db/queries/)
- [QuerySet API reference](https://docs.djangoproject.com/en/5.2/ref/models/querysets/)
- [Aggregation](https://docs.djangoproject.com/en/5.2/topics/db/aggregation/)
- [Database functions](https://docs.djangoproject.com/en/5.2/ref/models/database-functions/)
- [django-debug-toolbar](https://django-debug-toolbar.readthedocs.io/), essential for seeing the SQL your ORM produces
