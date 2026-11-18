# Django tenancy boundary specimen

This small SQLite app exercises a guarded Django default manager and selected write paths. It also tests the deliberate bypasses, so a passing run does not imply database-enforced tenant isolation.

Reproduction baseline: Python 3.14.6 and Django 5.2.8. Use an isolated environment with that pinned dependency. The package is listed for reproduction and was not added to the site's dependencies. Refresh Django security patches before adopting this example in a deployed application.

```bash
python3 -m venv /tmp/django-tenancy-venv
/tmp/django-tenancy-venv/bin/python -m pip install -r companion/django-tenancy/requirements.txt
/tmp/django-tenancy-venv/bin/python -m unittest discover -s companion/django-tenancy/tests
```

If Django is already installed in the active environment, the focused command is:

```bash
python3 -m unittest discover -s companion/django-tenancy/tests
```

The test module configures an in-memory SQLite database and creates/drops its own tables. It never reads an application database or account.

Supported operations: scoped reads, instance saves/deletes, ownership-preserving updates, validated bulk inserts, and explicitly scoped background jobs. `bulk_update`, tenant-field bulk changes, relation-field bulk changes, and conflict-handling bulk inserts are rejected. The base manager is intentionally unfiltered, as Django expects for related-object access. `all_objects`, raw queries, direct cursors, and joins across corrupt cross-tenant relations remain explicit bypasses.

A tenant scope captures its value when a queryset is constructed. Do not share querysets or tenant-scoped model instances across request/job boundaries. The example does not cover async middleware integration, transaction isolation, race-free relational invariants, database row-level security, administrative authentication, or arbitrary ORM operations.

The context manager restores the exact previous ContextVar token even after nested scopes and exceptions. Authentication must resolve verified tenant membership before entering it. The specimen does not parse tokens or infer a tenant from untrusted input.

## Evidence

On 2026-11-17, the contract command passed all nine tests using Python 3.14.6, Django 5.2.8, asgiref 3.13.0, sqlparse 0.6.1, and an in-memory SQLite database. Django was installed only in an isolated temporary virtual environment. No site dependency or application database was changed.

This evidence covers the supported ORM paths and intentional bypasses described above. It does not establish isolation on another database, Django version, middleware stack, or production database role.
