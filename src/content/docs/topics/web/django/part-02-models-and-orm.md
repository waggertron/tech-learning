---
title: "Part 2: Models, migrations, and the ORM"
description: Define models as Python classes, let Django generate migrations, and query the database through the ORM. Relationships, Meta options, and the signals that will bite you later.
parent: django
tags: [django, orm, models, migrations, beginner]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## A model is a Python class

```python
# blog/models.py
from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]
        indexes = [models.Index(fields=["email"])]

    def __str__(self):
        return self.name


class Post(models.Model):
    author = models.ForeignKey(
        Author, on_delete=models.CASCADE, related_name="posts"
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    body = models.TextField()
    published_at = models.DateTimeField(null=True, blank=True)
    tags = models.ManyToManyField("Tag", blank=True, related_name="posts")

    class Meta:
        ordering = ["-published_at"]

    def __str__(self):
        return self.title


class Tag(models.Model):
    name = models.CharField(max_length=40, unique=True)

    def __str__(self):
        return self.name
```

Some vocabulary:

- **Field types** are `CharField`, `IntegerField`, `DateTimeField`, `ForeignKey`, `ManyToManyField`, etc. Each maps to a SQL column type.
- **`null`** is about the database (`NULL` vs `NOT NULL`). **`blank`** is about forms (can the user leave this field empty). These are independent.
- **`on_delete`** is mandatory on `ForeignKey`, behavior when the target is deleted: `CASCADE`, `PROTECT`, `SET_NULL`, `SET_DEFAULT`, `RESTRICT`, `DO_NOTHING`.
- **`related_name`** controls the reverse accessor: `author.posts.all()` instead of the default `author.post_set.all()`. Always set it explicitly.

## Migrations

Django compares your model classes to the last-known schema state (recorded in migration files under `blog/migrations/`) and generates SQL to close the gap.

```bash
python manage.py makemigrations         # generate new migration files
python manage.py migrate                # apply them
python manage.py sqlmigrate blog 0001   # peek at the SQL without running it
```

**Check your migrations into git.** They're part of the schema history and must be reproducible in production.

## The ORM, CRUD basics

```python
# Create
alice = Author.objects.create(name="Alice", email="alice@example.com")

# Read (filter vs. get)
Post.objects.filter(published_at__isnull=False)      # QuerySet (lazy)
Post.objects.get(slug="hello-world")                  # single object; raises DoesNotExist or MultipleObjectsReturned

# Update, row by row
post = Post.objects.get(pk=1)
post.title = "Updated"
post.save()

# Update, in one query (the right way for batch changes)
Post.objects.filter(author=alice).update(published_at=now())

# Delete
Post.objects.filter(published_at__isnull=True).delete()
```

### QuerySets are lazy

Nothing hits the database until you iterate, slice with a step, call `len()`/`list()`, or call `get()`/`first()`/`exists()`.

```python
qs = Post.objects.filter(author=alice)   # no SQL
qs = qs.filter(published_at__isnull=False)  # still no SQL, chained
count = qs.count()                        # SQL: SELECT COUNT(*) ...
for p in qs: ...                          # SQL: SELECT ... (and cached)
```

### Lookups

Anything after `__` is a field lookup:

```python
Post.objects.filter(title__icontains="django")
Post.objects.filter(published_at__year=2026, published_at__month=4)
Post.objects.filter(author__email__endswith="@example.com")   # join into Author
Post.objects.filter(tags__name__in=["python", "web"])          # join into Tag
```

## Relationships

**Forward**: `post.author`, the Author.
**Reverse**: `author.posts.all()`, all Posts by this Author.

```python
alice.posts.count()
alice.posts.filter(published_at__isnull=False).count()
```

ManyToMany:

```python
post = Post.objects.get(pk=1)
python_tag = Tag.objects.get_or_create(name="python")[0]
post.tags.add(python_tag)
post.tags.remove(python_tag)
post.tags.set([tag1, tag2])   # replace entire set
```

OneToOne is for literal 1:1 extensions (e.g., `Profile` attached to `User`). If you think you want 1:1, 95% of the time you actually want 1:many with `unique=True` on a field.

## Meta options worth knowing early

```python
class Meta:
    ordering = ["-created_at"]                              # default sort order
    indexes = [
        models.Index(fields=["email"]),
        models.Index(fields=["-created_at"]),                # descending index
    ]
    constraints = [
        models.UniqueConstraint(fields=["author", "slug"], name="unique_author_slug"),
        models.CheckConstraint(check=models.Q(price__gte=0), name="price_nonneg"),
    ]
    verbose_name = "blog post"
    verbose_name_plural = "blog posts"
    db_table = "blog_post"                                   # explicit table name
```

**`UniqueConstraint`** is strictly better than `unique_together` (deprecated in spirit; `UniqueConstraint` supports partial / conditional uniqueness via `condition=`).

## The Django shell (your ORM playground)

```bash
python manage.py shell      # or shell_plus if you install django-extensions
```

Dump queries:

```python
from django.db import connection
print(connection.queries[-3:])     # last 3 SQL queries in this session
```

## Gotchas

- **`get()` raises `DoesNotExist`**, always wrap in `try/except` or use `filter(...).first()`.
- **`save()` triggers `pre_save`/`post_save` signals**, but `update()` does not, this is a common footgun when you expect side effects.
- **`auto_now_add=True` only fires on `create()`**; `auto_now=True` fires on every `save()`.
- **Integer vs BigInteger primary keys**, Django 3.2+ defaults to `BigAutoField`. Old projects may still be on `AutoField`; mixing `ForeignKey(on_delete=...)` across types breaks.
- **Migrations with data migrations**, when you need to both change schema AND transform data, write a `RunPython` migration. Keep data migrations idempotent.
- **Squashing migrations**, over time you'll accumulate hundreds of migrations per app. `python manage.py squashmigrations blog 0001 0150` consolidates them; squash once per release cycle, not continuously.

## What's next

Part 3 wires models to URLs and templates so you can actually see your data in a browser.

## References

- [Models, Django docs](https://docs.djangoproject.com/en/5.2/topics/db/models/)
- [Making queries, Django docs](https://docs.djangoproject.com/en/5.2/topics/db/queries/)
- [Migrations, Django docs](https://docs.djangoproject.com/en/5.2/topics/migrations/)
- [Model Meta options](https://docs.djangoproject.com/en/5.2/ref/models/options/)
