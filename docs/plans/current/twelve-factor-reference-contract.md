# Twelve-Factor reference application contract

Status: active

Contract version: 1.0.0

Created: 2026-09-08

Consumers:

- `waggertron/twelve-factor-typescript`
- `waggertron/twelve-factor-python`
- `waggertron/twelve-factor-go`

## Purpose

The three reference repositories implement one order service through different language ecosystems. This contract fixes the observable behavior that must remain equivalent. Language-specific frameworks may change implementation details, but they may not silently change payloads, lifecycle states, health semantics, process boundaries, or validation rules.

Each repository keeps a copy of this contract at `docs/application-contract.md`. A release must identify the contract version it implements.

## Process types

```text
HTTP client -> web -> PostgreSQL
                    |
                    v
                  Redis -> worker -> PostgreSQL

release operator -> admin migrate -> PostgreSQL
```

- `web` serves the HTTP and health contracts, persists accepted orders, and enqueues versioned jobs.
- `worker` consumes versioned jobs with bounded concurrency and applies an idempotent completion effect.
- `admin migrate` runs a bounded schema migration from the same artifact and configuration modules as `web` and `worker`.

No process installs dependencies, compiles source, or mutates its application artifact at startup.

## HTTP contract

All JSON responses use `Content-Type: application/json`. Unknown request fields are rejected. Validation failures use the error envelope and do not echo credentials, connection strings, or raw internal exceptions.

### `GET /health/live`

This endpoint reports whether the HTTP process is alive. It does not query PostgreSQL or Redis.

Status `200`:

```json
{"status":"live"}
```

### `GET /health/ready`

Readiness becomes true only after the process has connected to required backing services. It becomes false before shutdown stops accepting work.

Status `200`:

```json
{"status":"ready"}
```

Status `503`:

```json
{"status":"not_ready"}
```

### `POST /v1/orders`

Required header:

```text
Idempotency-Key: order-submit-001
```

Request body:

```json
{
  "customerId": "customer-001",
  "amountCents": 2599
}
```

Constraints:

- `Idempotency-Key` is 8 to 64 ASCII letters, digits, or hyphens.
- `customerId` is 3 to 64 ASCII letters, digits, or hyphens.
- `amountCents` is an integer from 1 through 10000000.

The first valid request returns status `202`. Repeating the same key and body returns status `200` and the existing order. Reusing the same key with a different body returns status `409`.

Success body:

```json
{
  "id": "00000000-0000-4000-8000-000000000001",
  "customerId": "customer-001",
  "amountCents": 2599,
  "status": "accepted"
}
```

### `GET /v1/orders/{orderId}`

A valid existing UUID returns status `200` and the order representation. A valid unknown UUID returns status `404`. An invalid path value returns status `400`.

### Error envelope

```json
{
  "error": {
    "code": "invalid_request",
    "message": "request did not satisfy the order contract"
  }
}
```

Allowed public error codes are `invalid_request`, `idempotency_conflict`, `not_found`, `not_ready`, and `internal_error`.

## Job payload contract

Queue name: `orders.v1`

Job name: `complete-order`

Payload:

```json
{
  "schemaVersion": 1,
  "orderId": "00000000-0000-4000-8000-000000000001",
  "idempotencyKey": "order-submit-001",
  "attemptedAt": "2026-09-08T07:00:00Z"
}
```

The worker rejects unknown schema versions and malformed identifiers. Retry configuration is finite. A failed attempt must leave enough structured evidence to correlate the job, order, release, trace, and attempt count.

## Order lifecycle and idempotency

Allowed states:

```text
accepted -> processing -> completed
                      \-> failed -> processing
```

The terminal business effect is `completed_at` becoming non-null. It may happen at most once for an order.

The web process inserts the order and a queue-intent record in one PostgreSQL transaction. A unique constraint on `idempotency_key` prevents two orders for one submission key. A dispatcher or transactionally safe enqueue path publishes the intent to Redis. The worker claims an order with a conditional database update, performs the example effect, and records completion in a transaction. Redelivery after completion is a successful no-op and emits `order.already_completed`.

The example effect is deliberately local: update the order's status and completion timestamp. No payment, email, analytics, or cloud API is required.

## Database contract

PostgreSQL owns durable order and enqueue-intent state. The minimum schema is:

```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY,
  idempotency_key text NOT NULL UNIQUE,
  customer_id text NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents BETWEEN 1 AND 10000000),
  status text NOT NULL CHECK (status IN ('accepted', 'processing', 'completed', 'failed')),
  created_at timestamptz NOT NULL,
  completed_at timestamptz
);

CREATE TABLE order_jobs (
  order_id uuid PRIMARY KEY REFERENCES orders(id),
  schema_version integer NOT NULL CHECK (schema_version = 1),
  published_at timestamptz
);
```

Migration `001` creates this schema. Every implementation must make migration `001` repeat-safe or report that it is already applied without changing the schema.

## Configuration contract

All processes validate configuration before advertising readiness. Error messages name invalid fields but never include their values.

| Name | Required | Default | Contract |
| --- | --- | --- | --- |
| `APP_HOST` | No | `0.0.0.0` | Listener address for `web` |
| `PORT` | No | Repository-specific | Integer from 1024 through 65535 |
| `DATABASE_URL` | Yes | None | PostgreSQL URL supplied by local Compose or the caller |
| `REDIS_URL` | Yes for web and worker | None | Redis URL supplied by local Compose or the caller |
| `RELEASE_ID` | Yes | None | 1 to 64 letters, digits, dots, underscores, or hyphens |
| `WORKER_CONCURRENCY` | No | `4` | Integer from 1 through 32 |
| `SHUTDOWN_GRACE_MS` | No | `10000` | Integer from 1000 through 60000 |
| `TELEMETRY_MODE` | No | `console` | `console`, `memory`, or `disabled` |

Sample configuration uses only local endpoints and placeholders such as `YOUR_VALUE_HERE`. It never contains realistic credential-shaped strings.

## Telemetry contract

Every process writes newline-delimited JSON events to standard output. Application code does not rotate or route files. Each event contains:

- `timestamp` as an RFC 3339 UTC string.
- `level` as `info`, `warn`, or `error`.
- `event` as a stable dotted name.
- `service` as `twelve-factor-orders`.
- `processType` as `web`, `worker`, or `admin`.
- `releaseId` from validated configuration.
- `traceId` when a trace is active.

Order events also contain `orderId`. Job events contain `jobId` and `attempt`. Error events contain a safe error category, not a connection string or raw secret value.

Local runs default to a console span exporter. Tests use an in-memory exporter or a strict fake that captures the same attributes. A hosted telemetry backend is optional and is never required for validation.

## Shutdown contract

On termination, `web` changes readiness to false before it stops accepting new orders, drains active requests within `SHUTDOWN_GRACE_MS`, closes backing-service clients, and exits.

The worker stops fetching new jobs, waits for active jobs within the same deadline, closes PostgreSQL and Redis clients, and exits. A hard kill may interrupt work, so database idempotency must make redelivery safe.

The shutdown failure test must observe `503` from readiness before the process exits and must prove that a new order is not accepted after drain begins.

## Admin command contract

Each artifact exposes:

```text
admin migrate --target 001
```

Only target `001` is valid in contract version 1.0.0. The command uses the normal configuration and PostgreSQL modules, records `admin.migration_started` and `admin.migration_finished`, enforces the configured deadline, and returns a nonzero status for an unsupported target or migration failure.

## Fixture contract

Valid fixtures are fixed and deterministic:

| Fixture | Idempotency key | Customer | Amount | Order ID |
| --- | --- | --- | --- | --- |
| `small_order` | `order-submit-001` | `customer-001` | `2599` | `00000000-0000-4000-8000-000000000001` |
| `boundary_order` | `order-submit-002` | `c-2` | `10000000` | `00000000-0000-4000-8000-000000000002` |

Valid fixture helpers may select only these values or other values proven to satisfy the documented ranges. They may not clamp, wrap, normalize, or repair their inputs.

Invalid fixtures are separate named cases:

| Fixture | Deliberate violation | Expected evidence |
| --- | --- | --- |
| `invalid_config_missing_database` | Omits `DATABASE_URL` | Startup fails without printing another config value |
| `invalid_http_zero_amount` | Sets `amountCents` to `0` | HTTP `400` with `invalid_request` |
| `invalid_job_schema` | Sets `schemaVersion` to `2` | Job fails with a safe schema error and no order mutation |
| `invalid_migration_target` | Uses target `999` | Admin command exits nonzero without applying SQL |
| `idempotency_conflict` | Reuses a key with a different amount | HTTP `409` with `idempotency_conflict` |

Tests assert the fixture objects themselves satisfy or violate exactly the intended contract before sending them to the application.

## External surfaces and credential-free local paths

| External surface | Production-shaped boundary | Required local path | Required verification |
| --- | --- | --- | --- |
| PostgreSQL | URL and SQL contract | PostgreSQL 18 in Docker Compose and Testcontainers | Migration, persistence, transaction, constraint, and retry tests |
| Redis-backed queue | URL and versioned job payload | Redis 8 in Docker Compose and Testcontainers | Enqueue, consume, redelivery, and bounded retry tests |
| Telemetry export | OpenTelemetry span exporter and JSON event stream | Console exporter for runs, in-memory exporter for tests | Attribute, correlation, and redaction tests |
| Container runtime | OCI image entry points | Local Docker build and Compose | One image runs web, worker, and admin commands without a rebuild |
| HTTP clients | Versioned localhost API | Language-native test client and loopback smoke test | Health, submit, duplicate, conflict, retrieval, and shutdown tests |

Unsupported mock operations fail visibly. No local or CI path requires a cloud account, hosted queue, hosted telemetry service, or production data.

## Common command outcomes

Command names differ only where the language ecosystem requires it. Each README exposes these outcomes:

| Outcome | TypeScript | Python | Go |
| --- | --- | --- | --- |
| Install locked dependencies | `npm ci` | `uv sync --frozen` | `go mod download` and `go mod verify` |
| Unit tests | `npm run test:unit` | `uv run pytest -m unit` | `go test ./... -short` |
| Integration tests | `npm run test:integration` | `uv run pytest -m integration` | `go test ./... -run Integration` |
| Full verification | `npm run verify` | `uv run poe verify` | `make verify` |
| Start local stack | `npm run local:up` | `uv run poe local-up` | `make local-up` |
| Stop and clean local stack | `npm run local:clean` | `uv run poe local-clean` | `make local-clean` |

The full verification command includes the deterministic Twelve-Factor harness check and does not invoke Codex or Claude.

## Local isolation and cleanup

Each repository uses fixed defaults that can be overridden without editing source:

| Repository | Compose project | Web | PostgreSQL | Redis |
| --- | --- | --- | --- | --- |
| TypeScript | `tf_typescript` | `3101` | `55431` | `56379` |
| Python | `tf_python` | `3102` | `55432` | `56380` |
| Go | `tf_go` | `3103` | `55433` | `56381` |

Automated tests use random host ports and unique Testcontainers resources. Manual Compose commands set the repository-specific project name. Cleanup names that exact project, removes its containers and volumes, and deletes only ignored repository-local output such as coverage, caches, compiled files, and `tmp/` evidence. It never prunes global Docker resources or deletes an unresolved path.

After cleanup, verification must show:

- No container or volume remains for the repository's Compose project.
- No web or worker process remains on the repository's default port.
- No generated, cache, database, or test-evidence file appears in `git status`.
- The source worktree remains unchanged.

## Compatibility rule

A breaking change to an endpoint, payload, state, config name, telemetry field, fixture, command outcome, or default port requires a new contract major version. Additive optional fields require a minor version. Editorial corrections that do not change behavior require a patch version.
