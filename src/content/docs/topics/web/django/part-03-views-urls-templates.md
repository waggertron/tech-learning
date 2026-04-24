---
title: "Part 3 — Views, URLs, and templates"
description: Function-based vs class-based views, URL routing with `path()`/`re_path()`/`include()`, the Django template language, and how to render data cleanly.
parent: django
tags: [django, views, urls, templates, beginner]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Two flavors of view

Django accepts any callable `(request, *args, **kwargs) -> HttpResponse`.

**Function-based views** (FBVs) — the simpler form:

```python
from django.http import HttpResponseNotFound
from django.shortcuts import get_object_or_404, render
from .models import Post

def post_list(request):
    posts = Post.objects.filter(published_at__isnull=False)
    return render(request, "blog/post_list.html", {"posts": posts})

def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    return render(request, "blog/post_detail.html", {"post": post})
```

**Class-based views** (CBVs) — composable via mixins, concise for CRUD:

```python
from django.views.generic import DetailView, ListView
from .models import Post

class PostListView(ListView):
    model = Post
    template_name = "blog/post_list.html"
    context_object_name = "posts"
    paginate_by = 10

    def get_queryset(self):
        return Post.objects.filter(published_at__isnull=False)

class PostDetailView(DetailView):
    model = Post
    template_name = "blog/post_detail.html"
    slug_field = "slug"
    slug_url_kwarg = "slug"
```

**When to pick which:** FBVs are clearer for one-offs; CBVs shine when you have standard CRUD (`ListView`, `CreateView`, `UpdateView`, `DeleteView`). Many teams settle on FBVs + helpers because the CBV inheritance tree gets confusing fast.

## URL routing

**`mysite/urls.py`** (project root):

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("blog/", include("blog.urls")),
]
```

**`blog/urls.py`** (app):

```python
from django.urls import path, re_path
from . import views

app_name = "blog"

urlpatterns = [
    path("",                         views.PostListView.as_view(),   name="list"),
    path("<slug:slug>/",             views.PostDetailView.as_view(), name="detail"),
    path("archive/<int:year>/",      views.archive_by_year,          name="archive"),

    # re_path when you need a regex
    re_path(r"^legacy/(?P<id>\d+)/$", views.legacy_redirect, name="legacy"),
]
```

**Path converters** — built in: `str` (default), `int`, `slug`, `uuid`, `path`. You can write custom ones for business types like ISBN.

**Reversing URLs**

```python
from django.urls import reverse

url = reverse("blog:detail", kwargs={"slug": "hello-world"})
# /blog/hello-world/
```

In templates:

```django
<a href="{% url 'blog:detail' slug=post.slug %}">{{ post.title }}</a>
```

**Why namespaces (`app_name`) matter** — two apps can both name a URL `"detail"`. Without namespacing, `reverse("detail")` is ambiguous.

## The template language

Django's template language is intentionally weak — no arbitrary Python, to keep logic in views.

```django
{# blog/templates/blog/post_list.html #}
{% extends "base.html" %}

{% block title %}Latest posts{% endblock %}

{% block content %}
  <h1>Latest posts</h1>
  {% if posts %}
    <ul>
    {% for post in posts %}
      <li>
        <a href="{% url 'blog:detail' slug=post.slug %}">{{ post.title }}</a>
        <small>{{ post.published_at|date:"Y-m-d" }}</small>
        {% if post.tags.all %}
          ({{ post.tags.all|join:", " }})
        {% endif %}
      </li>
    {% empty %}
      <li>No posts yet.</li>
    {% endfor %}
    </ul>
  {% endif %}
{% endblock %}
```

### The two syntaxes

- **`{{ variable }}`** — output an expression, with optional filters: `{{ value|default:"n/a"|upper }}`.
- **`{% tag %}`** — control flow and logic: `{% if %}`, `{% for %}`, `{% url %}`, `{% block %}`, `{% extends %}`, `{% include %}`.

### Template inheritance

Base template (`templates/base.html`):

```django
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}Default{% endblock %}</title>
  {% load static %}
  <link rel="stylesheet" href="{% static 'css/main.css' %}">
</head>
<body>
  <header>{% include "partials/header.html" %}</header>
  <main>{% block content %}{% endblock %}</main>
</body>
</html>
```

Any child template can `{% extends "base.html" %}` and override blocks. `{% include %}` is reused components.

## Static files

```python
# settings.py
STATIC_URL = "static/"
STATICFILES_DIRS = [BASE_DIR / "static"]     # where you put files in dev
STATIC_ROOT = BASE_DIR / "staticfiles"       # where collectstatic dumps them for prod
```

In development, `runserver` serves static files automatically. In production, you run `python manage.py collectstatic` and a proper server (or WhiteNoise) serves the `STATIC_ROOT` directory. Cover in Part 10.

## Context processors

A context processor is a function that adds variables to **every** template's context.

```python
# blog/context_processors.py
def site_name(request):
    return {"SITE_NAME": "My Blog"}
```

Register in `settings.TEMPLATES[0]["OPTIONS"]["context_processors"]`. Useful for site-wide variables (current user, feature flags, menu items) but don't overuse — every template renders the same processor, so keep them cheap.

## Gotchas

- **`render()` vs `HttpResponse`** — `render()` auto-wires the request context (needed for CSRF, auth). Using bare `HttpResponse` on HTML breaks forms.
- **Empty templates** — `{% block content %}{% endblock %}` in base without default content is fine; `{% block content %}{% endblock content %}` (named) helps debugging.
- **Template `DEBUG`** — set `"debug": True` in `TEMPLATES[0]["OPTIONS"]` to get usable error pages during development.
- **Silent failures** — by default, if `{{ post.author.name }}` fails somewhere in the chain, Django returns empty string. Set `string_if_invalid` in `TEMPLATES` to a sentinel in dev to catch these.
- **Class-based view learning curve** — the [CCBV (Classy Class-Based Views)](https://ccbv.co.uk/) site shows the full inheritance chain for every generic view; bookmark it before writing CBVs.

## What's next

Part 4 adds forms, so users can submit data, not just read it.

## References

- [Writing views — Django docs](https://docs.djangoproject.com/en/5.2/topics/http/views/)
- [Class-based views — Django docs](https://docs.djangoproject.com/en/5.2/topics/class-based-views/)
- [URL dispatcher — Django docs](https://docs.djangoproject.com/en/5.2/topics/http/urls/)
- [The Django template language](https://docs.djangoproject.com/en/5.2/ref/templates/language/)
- [Classy Class-Based Views (CCBV)](https://ccbv.co.uk/) — inheritance tree reference
