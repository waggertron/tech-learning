---
title: Django tenant scoping, the guardrails and the bypasses
description: "Scope selected Django ORM reads and writes to a verified tenant context, test missing-context failures, and identify raw SQL, relation, bulk, and administrative bypasses."
date: 2026-04-24
tags: [django, multi-tenant, security, patterns]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-multi-tenant-django-fails-closed/
series:
  slug: home-health-routing-system
  order: 3
---

A missing `tenant_id` condition can expose another customer's records. A scoped default manager makes that omission harder in ordinary ORM calls. It does not establish database-enforced isolation or protect every Django operation.

The boundary matters more than the convenience: missing context raises, supported writes validate ownership, and bypasses stay explicit. Authorization still decides which tenant the authenticated actor may use.

## The failure mode

Suppose tenant A and tenant B each have a patient and a visit. An endpoint calls `Visit.objects.all()` without adding a tenant condition. A scoped manager can attach that condition automatically. The endpoint then sees A's visits while A's verified tenant context is active.

That guarantee applies to this manager's constructed queryset. It does not imply that a raw query, relation join, custom admin, bulk operation, or previously constructed queryset has the same boundary.

## Establish context after authentication

Use a `ContextVar` to carry the selected tenant through one operation, and restore its previous token on exit:

```python
from contextlib import contextmanager
from contextvars import ContextVar

_current_tenant = ContextVar("current_tenant", default=None)

class TenantNotSetError(RuntimeError):
    pass

def tenant_id():
    value = _current_tenant.get()
    if value is None:
        raise TenantNotSetError("A verified tenant context is required")
    return value

@contextmanager
def tenant_scope(value):
    if value is None:
        raise TenantNotSetError("Cannot establish an empty tenant context")
    token = _current_tenant.set(value)
    try:
        yield
    finally:
        _current_tenant.reset(token)
```

The caller resolves membership from authenticated server-side identity before entering `tenant_scope`. A request parameter, token payload decoded without verification, or model-generated argument is not proof of membership.

Middleware placement depends on the authentication stack. Django middleware cannot assume that Django REST Framework has already populated `request.auth`. Wrap the operation after the actual authentication and membership checks. Background jobs need their own verified tenant selection because no HTTP middleware runs there.

Resetting the exact token also preserves an outer scope when a nested operation raises. Setting the variable to `None` unconditionally would erase that outer scope.

## Scope the default manager

```python
from django.db import models

class TenantScopedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(tenant_id=tenant_id())
```

`Visit.objects.filter(status="scheduled")` now contains both the tenant condition and the requested status condition. Constructing the queryset without context raises instead of silently returning no rows.

The context value is captured when the queryset is constructed. A queryset created for A does not become a B queryset when evaluated later inside B's scope. Keep querysets and model instances within their request or job ownership boundary.

## Guard writes separately

A read filter alone is not a write contract. Instance saves need to validate the active tenant, assign it for new rows, reject another tenant's primary key, and validate tenant-owned foreign keys.

The companion's `Visit.prepare_tenant_write()` checks that the selected patient's tenant matches the visit tenant. Its base implementation checks an existing primary key through an explicitly unscoped manager before saving. This closes the simple “construct A's object with B's primary key” overwrite path in the specimen.

A synchronous check followed by a write is not a database constraint. Concurrency, malicious raw writes, database users, and other services need additional controls. A cross-tenant foreign key is still structurally valid to the database unless the schema or database policy prevents it.

Bulk APIs require a separate decision. Django's `update()`, `bulk_create()`, and `bulk_update()` do not run an instance's ordinary `save()` override. The specimen therefore uses this supported subset:

| Operation | Specimen policy |
| --- | --- |
| scoped read | default manager adds the active tenant |
| instance save/delete | validate active and stored ownership |
| `update(name=...)` or `update(status=...)` | allow only non-ownership fields on scoped rows |
| `bulk_create()` | validate and assign tenant for every object first |
| bulk tenant/relation-field change | reject |
| conflict-handling bulk insert | reject |
| `bulk_update()` | reject rather than imply its instances are guarded |

Rejecting unsupported operations is deliberate. Expanding the API means specifying the ownership rule and testing the new path, not merely adding another model method override.

## Related objects do not inherit every filter

Django uses a model's base manager for some related-object access. Its documentation explicitly warns against filtering away rows in that base manager. The specimen keeps `all_objects` as the unfiltered base manager and `objects` as the scoped default manager.

A join such as `Visit.objects.filter(patient__name="B patient")` scopes the visit queryset. It does not automatically add the patient manager's tenant filter. `select_related("patient")` also does not establish that the linked patient's tenant matches the visit tenant.

The contract suite deliberately creates an invalid cross-tenant relation through an explicit bypass and shows that a join can traverse it. This is a limitation test: a passing result demonstrates why manager filtering alone is insufficient.

## Raw SQL and administration are separate paths

`objects.raw()` ignores prior queryset filtering. A direct database cursor never enters the manager. An explicitly exposed `all_objects` manager can read across tenants by design.

Django admin normally starts from the model's default manager, so missing tenant context can make it fail. A custom admin queryset can bypass that manager. Admin authentication, tenant selection, object permissions, and privileged cross-tenant support tools therefore need an explicit policy. “It uses Django admin” proves none of those controls.

For stronger isolation, evaluate database-enforced tenant policies and schema constraints alongside application authorization. Those controls still need tests under the actual database roles and connection lifecycle. This SQLite specimen does not demonstrate PostgreSQL row-level security.

## Run the boundary specimen

The complete small app and tests are in `companion/django-tenancy/`. It uses its own in-memory SQLite database and no application credentials. The reproduction baseline is Python 3.14.6 and Django 5.2.8, recorded in its `requirements.txt`.

With that environment active, run from a repository checkout:

```bash
python3 -m unittest discover -s companion/django-tenancy/tests
```

The nine cases cover missing context, A/B reads and updates, cross-tenant writes, relation ownership, bulk policy, job scope, nested exception cleanup, raw/unscoped bypasses, join bypasses, and the admin default-manager boundary. Several concerns share a case.

All nine contract tests passed on 2026-11-17 with Python 3.14.6 and Django 5.2.8 against in-memory SQLite. The passing bypass cases demonstrate the limits of manager scoping. They do not establish isolation on another database, Django version, middleware stack, or production database role.

The specimen's baseline is for reproduction, not a claim about the latest Django security patch. Use a supported patched release and rerun the contracts before adopting the pattern.

## What the pattern earns

For the supported call paths, a scoped manager and validated writes make accidental tenant omissions visible and testable. They are useful application guardrails. The unfiltered base manager, joins, raw access, bulk behavior, and privileged tools explain why “every query is automatically safe” is too strong a claim.

## References

- [Django 5.2 managers and base managers](https://docs.djangoproject.com/en/5.2/topics/db/managers/#base-managers) explains default versus base managers and related-object access.
- [Django 5.2 QuerySet API](https://docs.djangoproject.com/en/5.2/ref/models/querysets/) documents `raw()`, `update()`, `bulk_create()`, and `bulk_update()` behavior, including paths that bypass `save()`.
- [Django raw SQL](https://docs.djangoproject.com/en/5.2/topics/db/sql/) distinguishes model raw queries from direct cursor access.

## Related topics

- [Django authentication](../../topics/web/django/part-05-authentication/), establish identity before selecting a tenant.
- [Django advanced ORM](../../topics/web/django/part-07-advanced-orm/), managers, joins, and query composition.
- [Django production](../../topics/web/django/part-10-production/), broader deployment and security boundaries.
- [Home-health routing system](../series/home-health-routing-system/), the project context for tenant-owned visits.
