---
title: "Part 1: Project setup and the MVT pattern"
description: Install Django, start a project, run the dev server, and understand how a request flows through URLs → views → templates. The MVT pattern and where each piece lives.
parent: django
tags: [django, python, web, beginner]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Install

Use a fresh virtualenv. Always.

```bash
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install django
```

Verify:

```bash
django-admin --version   # 5.2.x
```

## Start a project

Django has two organizational units: the **project** (the top-level config) and **apps** (self-contained features). One project, many apps.

```bash
django-admin startproject mysite .
# The `.` matters, it puts files in the current dir rather than making an extra mysite/ wrapper.

python manage.py migrate   # creates the initial SQLite DB
python manage.py runserver # http://127.0.0.1:8000/
```

You should now see the Django green rocket.

## What just got generated

```
.
├── manage.py               # CLI entry point
├── mysite/
│   ├── __init__.py
│   ├── settings.py         # all config lives here
│   ├── urls.py             # root URL dispatcher
│   ├── asgi.py             # ASGI server entrypoint (async, WebSockets, HTTP/2)
│   └── wsgi.py             # WSGI server entrypoint (traditional)
└── db.sqlite3              # created on first migrate
```

Key knobs in `settings.py`:

- `DEBUG = True`, local only; leaks stack traces otherwise.
- `ALLOWED_HOSTS = []`, must include your domain in production.
- `INSTALLED_APPS`, the apps Django knows about.
- `MIDDLEWARE`, ordered list of request/response processors.
- `DATABASES`, SQLite by default; swap to Postgres for anything real.
- `SECRET_KEY`, signing key; never commit a production one.

## Create your first app

```bash
python manage.py startapp blog
```

Add `"blog"` to `INSTALLED_APPS` in `settings.py`.

## The MVT pattern

Django calls its architecture **MVT**, **Model, View, Template**. It's basically MVC with different names:

| Django term | What it is | Equivalent elsewhere |
| --- | --- | --- |
| **Model** | Python class mapping to a DB table | MVC Model |
| **View** | Function or class taking a request, returning a response | MVC **Controller** (note: not View!) |
| **Template** | HTML file with Django's template language | MVC View |

Confusion alert: Django's "view" is MVC's "controller." The thing called "view" in other frameworks is Django's "template."

## The request flow

```
HTTP request
    │
    ▼
WSGI/ASGI server (gunicorn, uvicorn)
    │
    ▼
MIDDLEWARE (security, sessions, CSRF, auth, ...)
    │
    ▼
URL dispatcher (mysite/urls.py → app/urls.py)
    │
    ▼
VIEW (function or class-based)
    │         ↕  reads/writes via MODELS (ORM)
    ▼
TEMPLATE (rendered with context)
    │
    ▼
HTTP response
```

## Your first URL → view → template

**`blog/views.py`**

```python
from django.http import HttpResponse
from django.shortcuts import render

def hello(request):
    return HttpResponse("Hello, Django.")

def homepage(request):
    return render(request, "blog/home.html", {"name": "World"})
```

**`blog/urls.py`** (new file)

```python
from django.urls import path
from . import views

app_name = "blog"   # namespace for reverse() lookups

urlpatterns = [
    path("hello/", views.hello, name="hello"),
    path("", views.homepage, name="home"),
]
```

**`mysite/urls.py`**

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("blog.urls")),
]
```

**`blog/templates/blog/home.html`** (the nested `blog/` is intentional, Django searches all template dirs, so namespacing prevents collisions)

```html
<!DOCTYPE html>
<html>
<head><title>Home</title></head>
<body>
    <h1>Hello, {{ name }}!</h1>
</body>
</html>
```

Restart `runserver` (it usually auto-reloads) and hit `http://127.0.0.1:8000/`, you should see "Hello, World!"

## Gotchas at this stage

- **`STATICFILES_DIRS` vs `STATIC_ROOT`**, `_DIRS` is where Django *looks* for static files in development; `_ROOT` is where `collectstatic` puts them in production. You'll want both eventually.
- **Template namespace**, always nest templates under an app-named folder (`blog/templates/blog/home.html`). Without this, two apps with `home.html` collide silently.
- **`app_name` in urls.py**, enables `{% url "blog:home" %}` in templates. Add it from day one; it's annoying to retrofit later.
- **Migrations before server**, `python manage.py migrate` before `runserver` the first time, or you'll see "no such table" errors.
- **Python 3.12+**, Django 5.2 supports Python 3.10–3.12; pick one and pin it in your project.

## What's next

Part 2 introduces models, migrations, and the ORM, the reason most people actually use Django.

## References

- [Django, Writing your first Django app (tutorial 1)](https://docs.djangoproject.com/en/5.2/intro/tutorial01/)
- [Django settings reference](https://docs.djangoproject.com/en/5.2/ref/settings/)
- [URL dispatcher](https://docs.djangoproject.com/en/5.2/topics/http/urls/)
