---
title: Multi-tenant Django that fails closed
description: Row-level tenancy with a middleware and a TenantScopedManager — every query filtered automatically, every insert blocked if the tenant isn't set. No way to accidentally leak across tenants.
date: 2026-04-24
tags: [django, multi-tenant, security, patterns]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-multi-tenant-django-fails-closed/
---

## The failure mode

Multi-tenant B2B apps have one terrifying bug: a query without a `tenant_id` filter. It's usually a new endpoint, or a report, or a debug shell. Run it, and suddenly Tenant A sees Tenant B's rows. In production there is no second chance.

## The fix, in Django

Row-level tenancy with three cooperating pieces, all of which fail closed.

### 1. A middleware that reads the JWT and attaches the tenant

```python
# tenancy/middleware.py
class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # JWT-authenticated requests get a tenant claim; read it here.
        claim = getattr(request, "auth", None)
        request.tenant_id = claim.get("tenant") if claim else None
        _tenant_context.set(request.tenant_id)   # ContextVar
        try:
            return self.get_response(request)
        finally:
            _tenant_context.set(None)
```

The `ContextVar` makes the tenant ID visible deep in ORM code without passing it through every signature.

### 2. A manager that filters every query

```python
# tenancy/managers.py
class TenantScopedManager(models.Manager):
    def get_queryset(self):
        tid = _tenant_context.get()
        if tid is None:
            raise TenantNotSetError(
                "TenantScopedManager used with no tenant in context"
            )
        return super().get_queryset().filter(tenant_id=tid)
```

Every ORM read through `Model.objects.whatever()` gets filtered. A missing tenant doesn't return zero rows — it raises. Silent empties hide bugs; loud exceptions surface them.

### 3. A `save()` that blocks mismatched inserts

```python
# tenancy/models.py
class TenantScopedModel(models.Model):
    tenant = models.ForeignKey("tenancy.Tenant", on_delete=models.PROTECT)

    def save(self, *args, **kwargs):
        ctx_tenant = _tenant_context.get()
        if ctx_tenant is None:
            raise TenantNotSetError("Attempted save with no tenant context")
        if self.tenant_id not in (None, ctx_tenant):
            raise CrossTenantWriteError(
                f"Tenant mismatch: row={self.tenant_id}, ctx={ctx_tenant}"
            )
        if self.tenant_id is None:
            self.tenant_id = ctx_tenant
        super().save(*args, **kwargs)

    class Meta:
        abstract = True
```

Three defenses: read, write, and "not set at all." All raise by default.

## The gotchas

- **`Model.objects.all()` in a management command.** No middleware runs, no tenant is set, the manager raises. Fix: give management commands a helper that sets `_tenant_context` explicitly for the tenant they're operating on.
- **Related manager bypass.** `tenant_a_user.visits.all()` works fine; `Visit.objects.filter(user=tenant_a_user)` works through the manager. But `user.visits_set.all()` goes through a reverse accessor that uses the *default* manager. The project fix: make `TenantScopedManager` the default (`objects = TenantScopedManager()`), not an alternate. `Meta.base_manager_name = "objects"` if you're on older Django.
- **Raw SQL.** `Model.objects.raw(...)` and `connection.cursor()` bypass the manager. Lint rule + code review: no raw SQL in domain code. Exceptions go through an explicit helper that injects the tenant.
- **Admin.** Django admin has its own querysets. Either hide the admin in prod or override `get_queryset()` on each `ModelAdmin`.
- **`select_related` / `prefetch_related`.** Fine — they traverse FKs, each through its own manager, each filtered. As long as every model uses `TenantScopedManager`, the graph stays scoped.

## Why it's worth it

The default `tenant_id` filter is the most commonly forgotten `WHERE` clause in B2B SaaS. Making it automatic — and making its absence an exception, not a silent pass — turns a class of production incidents into a class of test failures. The tests catch it; the prod logs never have to.

I built this into a portfolio project ([`home-health-provider-skeleton`](https://github.com/waggertron/home-health-provider-skeleton)) and the middleware + manager + model base class is ~100 lines total. Cheap to add, very cheap to live with.

## See also

- [Django Part 5 — Authentication](../topics/web/django/part-05-authentication/) — custom user models and JWT
- [Django Part 7 — Advanced ORM](../topics/web/django/part-07-advanced-orm/) — managers, Q, and query composition
- [Django Part 10 — Production](../topics/web/django/part-10-production/) — security headers and deployment hardening
