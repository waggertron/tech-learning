---
title: "Part 10: Production: deployment, security, observability"
description: The checklist that separates a toy Django app from a production one, settings hardening, ASGI/WSGI servers, static files, zero-downtime migrations, logging, Sentry, and the security headers you forget until someone else tells you to add them.
parent: django
tags: [django, production, deployment, security, observability, expert]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## The production checklist

Django ships a built-in one:

```bash
python manage.py check --deploy
```

This flags missing security settings, debug mode left on, weak signing keys, and more. Run it in CI and fail the build on warnings you haven't explicitly waived.

## Settings hygiene

Split `settings.py` by environment. Common patterns:

```
mysite/settings/
    __init__.py
    base.py          # everything shared
    development.py   # DEBUG, local DB, toolbar
    production.py    # from base import *; overrides
    testing.py
```

Select with `DJANGO_SETTINGS_MODULE=mysite.settings.production`.

### Must-set in production

```python
DEBUG = False
ALLOWED_HOSTS = ["example.com", "www.example.com"]
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]      # never in source
CSRF_TRUSTED_ORIGINS = ["https://example.com", "https://www.example.com"]
```

### Security headers

```python
SECURE_SSL_REDIRECT = True                        # redirect all HTTP → HTTPS
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")  # if behind a proxy
SECURE_HSTS_SECONDS = 31_536_000                  # 1 year; start smaller, ramp up
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
```

HSTS is sticky: once you set `SECURE_HSTS_SECONDS`, browsers remember. Start with `300` (5 minutes) and ramp up over days. Don't set it to a year on a site that hasn't yet fully committed to HTTPS.

### Content Security Policy

Not built into Django core; use [`django-csp`](https://django-csp.readthedocs.io/). Worth the effort, a real CSP blocks most XSS classes before they run.

## Secrets

Never commit:

- `SECRET_KEY`
- DB credentials
- Third-party API tokens

Read from environment (or a secrets manager). A clean pattern using `django-environ`:

```python
# settings/base.py
import environ
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")   # local dev only

SECRET_KEY = env("DJANGO_SECRET_KEY")
DATABASES = {"default": env.db("DATABASE_URL")}
```

In production, inject via your platform (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault, or plain env vars from the orchestrator).

## WSGI vs ASGI

- **WSGI** (`gunicorn`, `uWSGI`), the traditional choice. Sync only. Fast, battle-tested.
- **ASGI** (`uvicorn`, `daphne`, `hypercorn`), required for async views, Channels, HTTP/2, WebSockets.
- **Hybrid**, `gunicorn -k uvicorn.workers.UvicornWorker` runs uvicorn under gunicorn for supervision + async support.

Typical production command:

```bash
gunicorn mysite.asgi:application \
  -k uvicorn.workers.UvicornWorker \
  -w 4 \
  --bind 0.0.0.0:8000 \
  --access-logfile, \
  --error-logfile -
```

Workers rule of thumb: `(2 × CPU cores) + 1`. Long-lived connections (WebSockets, SSE) need a separate ASGI-only process on Daphne or uvicorn directly.

## Static and media files

Two different things:

- **Static files**, your CSS, JS, images. Collected once during deploy.
- **Media files**, user uploads. Stored somewhere writable that survives restarts.

### Static, WhiteNoise is the easy path

```bash
pip install whitenoise
```

```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",    # right after SecurityMiddleware
    # ...
]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```

WhiteNoise serves static files directly from your Django process. Simple, adequate for modest traffic, includes compression and cache-busting via content hashes. Behind a CDN it scales fine.

### Media, use object storage

Local disk on a single server breaks as soon as you add a second instance. Use S3 (or GCS, Azure Blob, Cloudflare R2):

```bash
pip install django-storages[boto3]
```

```python
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {"bucket_name": "mysite-media", "location": "media"},
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
```

Django 5+ uses the `STORAGES` dict; older code used `DEFAULT_FILE_STORAGE` / `STATICFILES_STORAGE`.

## Database in production

- **Postgres.** SQLite is fine for tiny projects but you'll outgrow it.
- **Managed service**, RDS, Cloud SQL, Supabase. Taking backups, patching, and replication off your plate is worth the premium.
- **Connection pooling**, `CONN_MAX_AGE=60` minimum; PgBouncer at scale (Part 8).
- **Replicas**, Django supports database routers, but the simpler route is: all reads and writes to the primary, until you have a real reason.

## Running migrations in production

The simple flow, "apply migrations before starting the web server", works for most apps. Some deploy systems need more care.

### Zero-downtime migration patterns

- **Expand then contract.**
  1. Add the new column as **nullable** with no default. Deploy. (Old and new code both work.)
  2. Backfill in batches via a management command or Celery task.
  3. Make non-null (via default or after backfill). Deploy.
  4. Eventually remove the old column.

- **Backward-compatible changes during deploys.** Never rename a column in one deploy, you'll have old and new code running simultaneously. Add new → dual-write → cut over → remove old.

- **Long-running DDL on big tables.** Postgres `ALTER TABLE ADD COLUMN DEFAULT x` rewrites the whole table on old versions. Postgres 11+ can do it instantly for non-volatile defaults. Know your Postgres version.

- **`SeparateDatabaseAndState`** for when schema must change without Django's model state changing (or vice versa).

## Logging

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "()": "pythonjsonlogger.json.JsonFormatter",
            "format": "%(asctime)s %(name)s %(levelname)s %(message)s",
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "json",
        }
    },
    "root": {"handlers": ["console"], "level": "INFO"},
    "loggers": {
        "django.request": {"level": "WARNING", "propagate": True},
        "django.db.backends": {"level": "WARNING", "propagate": True},
    },
}
```

Log as JSON to stdout and let your platform (Cloud Logging, Datadog, Loki) aggregate. Structured logs are queryable.

## Error tracking, Sentry

```bash
pip install sentry-sdk[django]
```

```python
import sentry_sdk
sentry_sdk.init(
    dsn=env("SENTRY_DSN"),
    send_default_pii=False,
    traces_sample_rate=0.1,   # 10% of requests for performance
    environment=env("ENVIRONMENT", default="production"),
)
```

Not optional at any real-world scale. The first time an exception silently 500s in production without Sentry, you'll wish you'd installed it.

## Metrics and tracing

- **[`django-prometheus`](https://github.com/korfuri/django-prometheus)**, request count, latency histogram, DB query count per view.
- **OpenTelemetry**, distributed tracing; useful when a request touches multiple services.
- **APM**, Datadog, New Relic, Sentry Performance, one of these usually covers metrics + traces + logs in a single product.

## Health checks

```python
# health/views.py
from django.db import connection
from django.http import JsonResponse

def readiness(request):
    try:
        with connection.cursor() as cur:
            cur.execute("SELECT 1")
        return JsonResponse({"status": "ok"})
    except Exception as e:
        return JsonResponse({"status": "fail", "error": str(e)}, status=503)

def liveness(request):
    return JsonResponse({"status": "alive"})
```

- **Liveness**, am I running? If no, restart me.
- **Readiness**, can I serve traffic? If no, take me out of the load balancer.

Both endpoints should skip expensive work. A readiness probe that does heavy DB work becomes a DoS on your own infrastructure.

## Backups

- DB, automated daily snapshots + continuous WAL archiving. Test restore at least quarterly.
- Media, object storage with versioning enabled.
- `dumpdata` / `loaddata`, fine for migrating a small project; not a backup strategy.

## A deploy-day checklist

Before shipping a new version:

- [ ] `python manage.py check --deploy` passes.
- [ ] Migrations reviewed, no destructive ALTERs on big tables.
- [ ] `collectstatic` ran in build.
- [ ] New env vars configured in the target environment.
- [ ] Sentry DSN is correct for the env.
- [ ] Feature flags for new user-facing changes (so you can disable without a rollback).
- [ ] Rollback plan. ("Redeploy the previous image" is a valid plan; "re-run the last N commits in reverse" is not.)

## Gotchas

- **`SECRET_KEY` rotation**, rotating breaks every active session and every signed URL. Have a migration plan (store old keys under `SECRET_KEY_FALLBACKS` for a grace period).
- **`ALLOWED_HOSTS` and load balancers**, if your LB sends `Host: internal-10.0.0.5`, that host must be allowed too, or liveness probes fail.
- **Time zones**, `USE_TZ = True` (default). Store UTC, convert on render. Mixing tz-aware and tz-naive datetimes is the single most common production bug I've seen.
- **Long-running workers after deploy**, Celery workers hold stale code until restarted. Your deploy script must restart them.
- **Database migrations in parallel deploys**, two web instances both running `migrate` race. Run migrations in a single pre-deploy step.
- **Manage commands on prod shells**, `python manage.py shell` on a production box is a loaded footgun. Use a read-only replica where possible.

## The end of the series

Ten parts, from `startproject` through production. Django rewards depth, the patterns in Parts 7–10 come up again whenever you scale an app, and the ORM from Part 2 is what you'll spend the most time refining. Keep reading the release notes; Django's async, `STORAGES`, `GeneratedField`, and other recent additions all came from the 4.x and 5.x lines.

## References

- [Deployment checklist, Django docs](https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/)
- [`manage.py check --deploy`](https://docs.djangoproject.com/en/5.2/ref/checks/#security)
- [Security in Django](https://docs.djangoproject.com/en/5.2/topics/security/)
- [WhiteNoise](https://whitenoise.readthedocs.io/)
- [django-storages](https://django-storages.readthedocs.io/)
- [Sentry for Django](https://docs.sentry.io/platforms/python/integrations/django/)
- [django-prometheus](https://github.com/korfuri/django-prometheus)
- [Django release notes](https://docs.djangoproject.com/en/5.2/releases/), read these when upgrading
