# Reliable user deletion: PostgreSQL specimen

This is the executable database boundary for the account-deletion walkthrough. It proves durable scheduling, a cancellation cutoff, leased step ownership, and atomic local finalization. It does not call Stripe, S3, a CRM, or SQS.

## Run

Install PostgreSQL 18 binaries and Python 3, then run from the repository root:

```bash
./companion/user-deletion-workflows/run-tests.sh
```

No Python packages, container images, credentials, or cloud accounts are required. The script creates a private temporary directory, initializes an isolated PostgreSQL cluster, disables TCP listening, and uses a trust-authenticated Unix socket inside the mode-0700 directory. It does not connect to an existing database. Tests refuse to truncate tables unless the specimen's dedicated cluster marker is present.

The trap stops the cluster before deleting its directory. Failed runs print relevant initialization/server diagnostics. If shutdown cannot be confirmed, the script retains the directory and reports its path instead of deleting data beneath a possibly running server.

Verified on 2026-11-19 with PostgreSQL 18.4 (Homebrew), Python's standard library, and fifteen passing tests. The three-second suite performs real overlapping transactions and observes `pg_stat_activity` lock waits. It does not use sleeps to assume an interleaving occurred.

## Files

- `schema.sql`: Tables and trusted-service functions.
- `tests/test_workflow.py`: Integration and concurrency cases against the real server.
- `run-tests.sh`: Disposable cluster lifecycle and test entry point.

## Contract

| Function | Observable result |
| --- | --- |
| `schedule_deletion(user_id, requested_at)` | Returns one active job ID without resetting a repeated request's deadline; creates four steps |
| `cancel_deletion(job_id)` | Returns true only for the `scheduled` to `cancelled` transition |
| `begin_deletion(job_id)` | Returns true only for a due `scheduled` job; commits `executing` and `writes_enabled = false` together |
| `claim_step(step_id, token, lease)` | Returns the claimed row, or no row; a new claim uses a fresh token and an unexpired lease |
| `complete_step(step_id, token)` | Completes an owned external step; cannot finalize `local_db` |
| `retry_step(step_id, token, retry_at, error_code)` | Releases owned work back to `pending` at the persisted retry deadline |
| `pause_step(step_id, token, error_code)` | Releases owned work into `needs_attention` |
| `finalize_deletion(local_step_id, token)` | Deletes the local user and completes job/step in the same transaction, after all external steps complete |
| `enqueue_due_steps(batch_limit, redispatch_interval)` | Creates bounded durable dispatch intent for due work without an unpublished or sufficiently recent dispatch |

The product assumption is exactly 720 elapsed hours, not thirty calendar days in a local time zone. `requested_at` is a trusted application timestamp, not an arbitrary deadline supplied by an end user. Cancelling an overdue job is still permitted until execution wins the transition. Cancellation after `executing` is rejected.

Operations that need multiple rows acquire locks in the order **user, job, step**. Cancellation only locks the job and never then waits for the user row. Claims only lock the step; their job-state read does not acquire a job row lock. Workers must commit database transactions before making provider calls.

A lease is checked using `clock_timestamp()` after acquiring the step lock. This matters when a statement began before expiry but waited on an unchanged locked row. Completion, retry, pause, and local finalization reject ownership that expired during that wait. Claiming starts a fresh lease after the wait. Each claim requires a new random UUID token; the stable external operation identity is the step ID, not the changing lease token.

Dispatch defaults are a batch of 100 and a one-minute quiet interval. The allowed batch range is 1-1,000. Published dispatch rows do not permanently suppress unfinished work. A later reconciliation may create another dispatch after the interval. The partial unique index prevents two unpublished dispatch rows for the same step. This is dispatch intent only: it does not supply a leased publisher, implement SQS acknowledgement, or prove queue delivery.

## What the tests establish

- A repeated or concurrently repeated request reuses the same job and deadline.
- Future jobs cannot start; cancellation and execution serialize on the job state.
- Both cancellation-first and execution-first races have explicit outcomes.
- Execution waits for the user row before locking the job, avoiding an inverted lock order.
- Two overlapping claims produce one current owner.
- Expired claims can be recovered; stale completion/retry/pause tokens cannot advance state.
- Claims waiting on locks receive fresh lease time, while mutations waiting past expiry are rejected.
- Retry deadlines, pause states, and unfinished prerequisites prevent premature work.
- Local finalization rolls back or commits user deletion and durable progress together.
- Workflow metadata survives user deletion without a foreign key to the removed row.
- Redispatch is bounded, has a quiet interval, and does not starve other eligible steps behind unpublished entries.

## Boundaries

The functions are `SECURITY INVOKER` and assume a trusted workflow service. They are not an authorization API. Restrict table/function privileges and authorize the requester before calling them. This small schema does not provide a tenant model or end-user permissions.

`writes_enabled` models the application's freeze decision. Real writers must enforce that decision, including late uploads, webhook handlers, and jobs that could recreate remote data. The Boolean alone does not stop another service from writing.

A successful database completion records a trusted worker's report. It does not verify remote erasure. Provider adapters still need stable resource identity, account context, repeat-safe operations, and reconciliation of ambiguous effects. A stale database token cannot fence a late HTTP call.

The specimen omits provider identifiers and personal-data context. A real protected cleanup context, workflow/dispatch retention, manual recovery from `needs_attention`, provider rate limiting, lease renewal, and operational monitoring need explicit implementations. Retaining an opaque user ID is not a claim of anonymization or regulatory compliance. No throughput, crash-durability, replication, failover, or production-ready service claim is made.
