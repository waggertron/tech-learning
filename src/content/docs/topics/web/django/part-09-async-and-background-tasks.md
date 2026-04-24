---
title: "Part 9 — Async Django, Channels, and Celery"
description: Async views and the async ORM, Channels for WebSockets, and Celery for background jobs. Three tools that handle the work that shouldn't block an HTTP request.
parent: django
tags: [django, async, channels, celery, websockets, advanced]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## The three problems

A Django app hits three ceilings as it grows:

1. **Slow external I/O in views** — a call to Stripe, OpenAI, Slack. Blocks the worker.
2. **Real-time features** — WebSockets, server-sent events, live dashboards. HTTP isn't the right protocol.
3. **Work that outlives the request** — sending email, running reports, processing uploads. Should happen *after* the user gets their response.

Answers: **async views**, **Channels**, **Celery**. Sometimes more than one.

## Async views

Since Django 4.1 (and mature by 5.x), any view can be `async def`:

```python
import asyncio
import httpx

async def dashboard(request):
    async with httpx.AsyncClient() as client:
        stripe_task   = client.get("https://api.stripe.com/...")
        analytics_task = client.get("https://api.example.com/...")
        stripe_resp, analytics_resp = await asyncio.gather(stripe_task, analytics_task)

    return render(request, "dashboard.html", {
        "stripe": stripe_resp.json(),
        "analytics": analytics_resp.json(),
    })
```

Requirements:

- **ASGI server** — `uvicorn`, `daphne`, or `hypercorn`. Gunicorn alone won't run async views (use `gunicorn -k uvicorn.workers.UvicornWorker`).
- **`ASGI_APPLICATION`** set in `settings.py`, not `WSGI_APPLICATION`.

### Async ORM

Django 4.1+ has async-prefixed methods:

```python
async def get_post(slug: str):
    return await Post.objects.aget(slug=slug)

async def list_recent():
    return [p async for p in Post.objects.filter(published_at__isnull=False).order_by("-published_at")[:10]]
```

Available: `acreate()`, `aget()`, `afirst()`, `alast()`, `acount()`, `aexists()`, `aupdate_or_create()`, `aget_or_create()`, `aupdate()`, `adelete()`, `asave()`.

**Gotcha**: mixing sync ORM in an async view raises `SynchronousOnlyOperation`. Wrap sync code with `sync_to_async`:

```python
from asgiref.sync import sync_to_async

async def handler(request):
    user = await sync_to_async(get_legacy_user)(request)
    ...
```

### When async actually helps

- **External HTTP calls** — concurrent with `asyncio.gather`.
- **WebSockets / SSE** — one worker, many long-lived connections.

### When it doesn't

- **CPU-bound work** — async doesn't parallelize Python code; you're still bound by the GIL.
- **Pure DB-heavy endpoints** — Django's DB driver isn't truly async yet (uses a thread pool under the hood). Often no measurable win over sync.

## Channels — WebSockets and beyond

[Channels](https://channels.readthedocs.io/) extends Django for WebSockets and long-lived protocols.

```bash
pip install channels channels_redis
```

```python
# settings.py
INSTALLED_APPS += ["daphne", "channels"]
ASGI_APPLICATION = "mysite.asgi.application"
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {"hosts": [("127.0.0.1", 6379)]},
    },
}
```

A minimal consumer:

```python
# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room = self.scope["url_route"]["kwargs"]["room"]
        await self.channel_layer.group_add(self.room, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        payload = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room,
            {"type": "chat.message", "message": payload["message"]},
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({"message": event["message"]}))
```

Routing (mirrors `urls.py`):

```python
# chat/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"^ws/chat/(?P<room>\w+)/$", consumers.ChatConsumer.as_asgi()),
]
```

```python
# mysite/asgi.py
import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from chat.routing import websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
})
```

Run with Daphne or uvicorn. The **channel layer** (here, Redis) is what lets multiple ASGI workers share state — without it, a WebSocket message to user 42 only reaches the worker that user 42 happened to connect to.

## Celery — background jobs

Async views don't replace Celery. `asyncio.gather` is good for "do these three things concurrently *during* this request"; Celery is for "queue this work, respond to the user immediately, run it later."

Setup:

```bash
pip install celery redis
```

```python
# mysite/celery.py
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
app = Celery("mysite")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
```

```python
# mysite/__init__.py
from .celery import app as celery_app
__all__ = ("celery_app",)
```

```python
# settings.py
CELERY_BROKER_URL = "redis://127.0.0.1:6379/0"
CELERY_RESULT_BACKEND = "redis://127.0.0.1:6379/0"
CELERY_TASK_ALWAYS_EAGER = False          # True in tests
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TIMEZONE = "UTC"
```

Define tasks in each app:

```python
# blog/tasks.py
from celery import shared_task
from django.core.mail import send_mail

@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_backoff_max=60,
    max_retries=5,
)
def notify_author(self, post_id: int):
    from .models import Post
    post = Post.objects.select_related("author").get(pk=post_id)
    send_mail(
        subject=f"Your post '{post.title}' was published",
        message="Congrats.",
        from_email="noreply@example.com",
        recipient_list=[post.author.email],
    )
```

Trigger from a view:

```python
def publish(request, slug):
    post = get_object_or_404(Post, slug=slug)
    post.published_at = timezone.now()
    post.save()
    notify_author.delay(post.id)   # returns immediately
    return redirect("blog:detail", slug=slug)
```

Run the worker:

```bash
celery -A mysite worker -l info
```

### Scheduled tasks (beat)

```python
# settings.py
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    "daily-digest": {
        "task": "blog.tasks.send_daily_digest",
        "schedule": crontab(hour=7, minute=0),
    },
}
```

Run the scheduler:

```bash
celery -A mysite beat -l info
```

### Pitfalls worth knowing

- **Pass IDs, not model instances.** Serializing an unsaved or complex model across the broker goes wrong quickly. Always pass a primary key and re-fetch inside the task.
- **Idempotency.** Tasks can be retried. A task that sends an email twice is a bug. Use an idempotency key or a "sent" flag.
- **Transactions.** Triggering `.delay()` inside a DB transaction means the task may start before the transaction commits and see the old state. Use `transaction.on_commit(lambda: task.delay(id))` or `django.db.transaction.on_commit`.
- **`TASK_ALWAYS_EAGER`** runs tasks synchronously — set in tests to avoid the broker dependency.
- **Monitoring.** Use [Flower](https://flower.readthedocs.io/) or a commercial APM to see queue length and failures. Silent backlog = silent outage.

## Celery vs alternatives

Celery is the 800-pound gorilla, but it's complex. Simpler options:

- **[`django-rq`](https://github.com/rq/django-rq)** — Redis Queue. Simpler, fewer moving parts.
- **[`django-q2`](https://github.com/django-q2/django-q2)** — lightweight, scheduling included.
- **[`huey`](https://huey.readthedocs.io/)** — small, no broker required (can use Redis or SQLite).
- **Postgres-backed** ([`pgq`](https://github.com/graphile/worker), [procrastinate](https://github.com/procrastinate-org/procrastinate)) — one fewer service to run; the DB becomes the queue.

For a modest app, `huey` or a Postgres-backed queue is usually the better starting point.

## Gotchas summary

- **Mixing sync and async under ASGI** — wrap sync code with `sync_to_async`; wrap async code called from sync with `async_to_sync`.
- **Gunicorn + async** — `gunicorn -k uvicorn.workers.UvicornWorker` or switch to `uvicorn` directly.
- **Channels without the channel layer** — works, but each worker is isolated. Production always needs Redis or a similar layer.
- **Celery import order** — tasks must be importable at worker startup. `autodiscover_tasks()` needs tasks in `<app>/tasks.py`.
- **`django_redis`** vs **Redis cache backend built into Django 4+** — the stdlib version is usually enough; `django-redis` only if you need its advanced features.

## What's next

Part 10 ships all this to production.

## References

- [Async support — Django docs](https://docs.djangoproject.com/en/5.2/topics/async/)
- [Django Channels](https://channels.readthedocs.io/)
- [Celery documentation](https://docs.celeryq.dev/)
- [Flower — Celery monitoring](https://flower.readthedocs.io/)
- [huey](https://huey.readthedocs.io/) — simpler task queue
- [procrastinate](https://procrastinate.readthedocs.io/) — Postgres-backed task queue
