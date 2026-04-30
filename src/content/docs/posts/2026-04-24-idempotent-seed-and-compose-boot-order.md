---
title: Idempotent seed + compose boot-order choreography
description: A one-shot db-init container that runs migrations and a deterministic seed before the API comes up. `docker compose up` gives you the same demo every time, from a cold machine.
date: 2026-04-24
tags: [docker, compose, seeding, demos, patterns]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-idempotent-seed-and-compose-boot-order/
---

## The goal

One command, `docker compose up`, should boot the whole stack into a known, demo-able state. Every time. From a cold machine. Without the operator typing a seed command, or remembering whether they seeded already.

## The shape

Four compose services and one explicit dependency relationship do the work:

```yaml
services:
  db-postgres:   # long-running
    # ...
  cache-redis:   # long-running
    # ...

  db-init:       # ONE-SHOT: migrate + seed, then exits 0
    build: ./apps/api
    command: >
      sh -c "python manage.py migrate --no-input &&
             python manage.py seed_demo --idempotent"
    depends_on:
      db-postgres:
        condition: service_healthy

  api-django:    # long-running; starts only after db-init has finished
    build: ./apps/api
    depends_on:
      db-init:
        condition: service_completed_successfully
      cache-redis:
        condition: service_healthy
```

Two unusual pieces:

- **`db-init` is a short-lived container.** It's built from the same image as the API, runs migrations and seed, and exits. It never holds a port.
- **`service_completed_successfully`** is what turns `db-init` into a proper boot dependency. The API, worker, and anything else that touches the DB refuse to start until `db-init` has exited `0`.

## Making the seed idempotent

`seed_demo` runs on every `docker compose up`. If it weren't idempotent, you'd get duplicate tenants, runaway patient counts, and "why is my demo different today" questions.

Two mechanics make it safe:

1. **A marker row.** The command writes a `seed_marker` row on first run. On subsequent runs, if the marker exists and matches the current seed version, the command exits early.
2. **Deterministic randomness.** `random.seed(42)` at the top of the command. Every tenant, clinician, patient, and visit comes out identical across runs.

```python
# seed/management/commands/seed_demo.py
SEED_VERSION = "2026-04-24"

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true",
                            help="Drop existing seed and recreate")
        parser.add_argument("--idempotent", action="store_true",
                            help="No-op if seed_marker matches current version")

    def handle(self, *args, **options):
        random.seed(42)

        existing = SeedMarker.objects.filter(version=SEED_VERSION).first()
        if existing and options["idempotent"] and not options["force"]:
            self.stdout.write("Seed up to date, skipping.")
            return
        if options["force"]:
            self._wipe_all_tenants()

        self._create_tenants_and_users()
        self._create_clinicians_and_patients()
        self._create_visits_and_history()

        SeedMarker.objects.update_or_create(
            defaults={"applied_at": timezone.now()},
            version=SEED_VERSION,
        )
```

## Knobs you get for free

- **`make up`**, normal boot. Reuses the existing seed.
- **`make reseed`**, sets a `FORCE=1` env var, compose re-runs `db-init` with `--force`, wipes and reseeds without tearing the stack down. Useful for iterating on seed data.
- **`make down`**, stops everything. Next `make up` is still a no-op on seeding because volumes persist.

The Makefile is a thin wrapper over compose, but it's the dev UX. One-letter commands beat 15-character compose incantations every time.

## What goes wrong if you skip any of this

- **No marker row**, every boot adds more data. The demo grows unbounded, every cold boot is slower, queries drift.
- **No `random.seed(42)`**, reviewers see a different "Jane Doe" on every boot. Screenshots go stale. Hard to reproduce bugs.
- **No `service_completed_successfully` dependency**, the API races the seed. It comes up, handles a request against an unmigrated schema, and crashes, or worse, returns partial data. Compose's default `depends_on` only waits for the container to *start*, not finish.
- **No `depends_on: condition: service_healthy` on the DB**, `db-init` races Postgres startup and fails 40% of the time on a cold laptop.

## Why it's satisfying to get right

A reviewer clones the repo, runs `docker compose up`, waits ~90 seconds, and lands on a login page with demo credentials printed right on it. That first-boot experience is the single highest-leverage UX decision in a portfolio project. Everything else, code quality, test coverage, architecture, is downstream of "did it run."

Repo: [`home-health-provider-skeleton`](https://github.com/waggertron/home-health-provider-skeleton), pattern lives in `docker-compose.yml` + `apps/api/seed/management/commands/seed_demo.py`.

## See also

- [Django Part 1, Setup and MVT](../../topics/web/django/part-01-setup-and-mvt/), settings, management commands
- [Django Part 10, Production](../../topics/web/django/part-10-production/), why seed scripts aren't backups
