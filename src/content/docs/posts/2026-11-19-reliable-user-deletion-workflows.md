---
title: "Reliable user deletion: cron, queues, and durable workflows"
description: "Schedule account deletion with a durable deadline, serialize cancellation against execution, and recover provider steps using leases, repeat-safe effects, and reconciliation."
date: 2026-11-19
tags: [distributed-systems, postgresql, sql, queues, reliability, aws, sqs, idempotency, workflows, background-jobs]
canonical: https://waggertron.github.io/tech-learning/posts/2026-11-19-reliable-user-deletion-workflows/
---

A user asks to delete their account in thirty days. An indexed timestamp and a scheduled SQL delete can handle the first version. Then the account acquires a billing customer, stored files, and a CRM contact. The database delete becomes the last step of a workflow that can fail halfway through.

The hard case is not a provider returning an error. It is a provider completing its deletion just before our worker crashes without recording success. Another worker must continue without knowing whether the previous request took effect.

Start with the deadline, add durable progress when external effects appear, and add a broker only when delivery and scaling need it. The [PostgreSQL specimen](#run-the-database-specimen) exercises the database boundary. It does not call Stripe, S3, a CRM, or SQS.

## Define what the thirty-day promise means

Define the product contract explicitly:

| Question | Assumption for this example | Consequence |
| --- | --- | --- |
| Who can request deletion? | An authenticated account owner, after server-side authorization | A queued ID cannot grant permission |
| What does thirty days mean? | Exactly 720 elapsed hours after the accepted request | Persist one timezone-aware deadline |
| Until when can the user cancel? | Until execution atomically begins | Cancellation competes with the start transition |
| What happens at the deadline? | The workflow becomes eligible, not necessarily completed | Monitor overdue age and define an operational objective |
| What can recreate deleted data? | Application writes and integrations | Enforce a write/access fence before cleanup |

Calendar days in a named timezone can differ from 720 elapsed hours across daylight-saving transitions. Pick the product rule deliberately. PostgreSQL's [time functions](https://www.postgresql.org/docs/18/functions-datetime.html) document those distinctions and the transaction-start behavior of `now()`.

The service chooses the accepted request time; the caller cannot shorten the grace period by supplying a past timestamp. The specimen accepts an explicit timestamp for deterministic fixtures, not as an unauthenticated public API.

A duplicate request should find the same active deletion intent. It should not restart the grace period or create another active job. If a cancelled request is submitted again, that is a new intent with a newly accepted deadline.

## Begin with the smallest recoverable system

For database-only cleanup, store the deadline and query a bounded batch of overdue rows. A missed run does not lose the work: the next run still finds those rows.

```text
Persist deadline -> scheduled scan -> delete due rows in a transaction
       ^                  |
       +---- next scan ---+  if a process stops before committing
```

With several workers, use row locking or an atomic claim. PostgreSQL's `FOR UPDATE SKIP LOCKED` can distribute queue-like work without making every worker wait for the same row. Skipped rows still exist, so an empty batch does not prove the backlog is empty. Keep the selection and local deletion in a short transaction. Do not hold its locks during HTTP calls.

Cron asks which authoritative work is due. A queue delivers notifications that work may be ready. Neither choice replaces the durable record of unfinished work.

## External deletion needs independent progress

Suppose a worker deletes the billing customer and files, then the CRM times out. Rolling back PostgreSQL cannot recreate the provider resources. Replaying the whole function without tracking outcomes also hides which steps still need attention.

Use a job for the accepted intent and a step for each provider:

```text
User 1 ---- N Deletion jobs (at most one active)
                     |
                     +---- N Steps (one per service)

Job: scheduled -> executing -> completed
         |
         +-> cancelled

Step: pending -> running -> completed
         ^          |
         |          +-> needs_attention
         +-- retry -+
```

The specimen's job retains an opaque user ID without a foreign key that would disappear when the user row is deleted. A partial unique index prevents two active jobs for the same user. Each job has unique billing, files, CRM, and local-database steps.

Keep the external identifiers needed for cleanup in protected workflow context. Queue messages carry only opaque step IDs. The context needs its own retention and purge policy; preserving recovery information must not create an indefinite second copy of the user's profile. The specimen intentionally contains no real provider context or personal records.

Some operations can be compensated. Irreversible deletion usually requires **forward recovery**: keep making the remaining cleanup succeed or escalate a blocked step. It is not a promise to undo successful deletions. The [saga reference](../../topics/system-design/saga-pattern/) explains the related distinction between reversible work and a commitment boundary.

## Serialize cancellation and the start of execution

An earlier application check is not enough:

```text
Worker reads "not cancelled"
User cancels
Worker calls a provider
```

Define one winning state change on the job row. Cancellation changes `scheduled` to `cancelled`. Starting work changes `scheduled` to `executing`, but only after the deadline. Both transitions lock or conditionally update that same row. A zero-row result means the caller did not win and cannot proceed as though it did. The wrappers expose that outcome as `false`. The following definitions come directly from the companion schema.

```sql
CREATE FUNCTION cancel_deletion(p_job uuid) RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
  UPDATE deletion_jobs SET status = 'cancelled'
    WHERE id = p_job AND status = 'scheduled';
  RETURN FOUND;
END;
$$;

CREATE FUNCTION begin_deletion(p_job uuid) RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE v_user uuid;
BEGIN
  SELECT user_id INTO v_user FROM deletion_jobs WHERE id = p_job;
  IF NOT FOUND THEN RETURN false; END IF;
  PERFORM 1 FROM users WHERE id = v_user FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  UPDATE deletion_jobs SET status = 'executing'
    WHERE id = p_job AND status = 'scheduled' AND delete_after <= clock_timestamp();
  IF NOT FOUND THEN RETURN false; END IF;
  UPDATE users SET writes_enabled = false WHERE id = v_user;
  RETURN true;
END;
$$;
```

The complete `begin_deletion` function also changes the specimen user's write-enabled flag in the same database transaction. That flag demonstrates the state boundary; a real application must enforce it on every relevant mutation and access path. It does not independently revoke tokens, stop remote integrations, or block privileged SQL.

Cancellation is allowed while the job remains scheduled, even if it is already overdue. Once execution wins, cancellation is rejected. Commit the transition before any remote deletion call. PostgreSQL row locking serializes these competing updates; it does not make an external request part of the transaction.

## Lease one step, then leave the transaction

A worker receives a step ID and tries to claim it. Claiming checks the job state, due time, step state, and retry deadline. It records a new lease token, lease expiry, and attempt count in one short database operation.

```sql
CREATE FUNCTION claim_step(p_step uuid, p_token uuid, p_lease interval DEFAULT interval '2 minutes')
RETURNS SETOF deletion_steps LANGUAGE plpgsql AS $$
DECLARE v_now timestamptz;
BEGIN
  IF p_token IS NULL OR p_lease IS NULL OR p_lease <= interval '0 seconds' THEN
    RAISE EXCEPTION 'A token and positive lease are required';
  END IF;
  PERFORM 1 FROM deletion_steps WHERE id = p_step FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  v_now := clock_timestamp();
  RETURN QUERY
    UPDATE deletion_steps AS s
    SET status = 'running', attempts = s.attempts + 1,
        lease_token = p_token, lease_until = v_now + p_lease, error_code = NULL
    FROM deletion_jobs AS j
    WHERE s.id = p_step AND j.id = s.job_id
      AND j.status = 'executing' AND j.delete_after <= v_now
      AND ((s.status = 'pending' AND s.next_attempt_at <= v_now)
        OR (s.status = 'running' AND s.lease_until <= v_now))
      AND (s.service <> 'local_db' OR NOT EXISTS (
        SELECT 1 FROM deletion_steps AS prerequisite
        WHERE prerequisite.job_id = j.id AND prerequisite.service <> 'local_db'
          AND prerequisite.status <> 'completed'
      ))
    RETURNING s.*;
END;
$$;
```

Only a returned row authorizes that worker to attempt the step. When a lease expires, another worker may reclaim it with a new token. Use bounded HTTP timeouts and renew long leases only while ownership remains valid.

All progress mutations need the current token and an unexpired lease, including completion, retry, pause, and finalization:

```sql
CREATE FUNCTION lock_owned_step(p_step uuid, p_token uuid) RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE v_step deletion_steps;
BEGIN
  SELECT * INTO v_step FROM deletion_steps WHERE id = p_step FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  RETURN coalesce(v_step.status = 'running' AND v_step.lease_token = p_token
    AND v_step.lease_until > clock_timestamp(), false);
END;
$$;

CREATE FUNCTION complete_step(p_step uuid, p_token uuid) RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
  IF NOT lock_owned_step(p_step, p_token) THEN RETURN false; END IF;
  IF (SELECT service = 'local_db' FROM deletion_steps WHERE id = p_step) THEN RETURN false; END IF;
  UPDATE deletion_steps SET status = 'completed', completed_at = clock_timestamp(),
      lease_token = NULL, lease_until = NULL, error_code = NULL WHERE id = p_step;
  RETURN true;
END;
$$;
```

Acquire the row lock before sampling wall-clock lease expiry. A statement can wait on an unchanged locked row while its lease expires. A deadline check made before that wait can authorize stale work afterward. The helper above rechecks ownership after acquiring the lock; the tests exercise that interleaving.

The token fences **database progress**. It cannot stop a paused old process from resuming and calling a provider. A random UUID is an ownership token here, not a monotonically ordered value that an external service checks. Repeat-safe provider operations remain necessary.

This builds on [atomic callback claims and safe retries](../2026-11-09-atomic-callback-claims-and-safe-retries/). The additional problem is that a remote effect can survive even when the local result does not.

## Recover an ambiguous remote outcome

```text
Worker A                 Provider                  PostgreSQL
--------                 --------                  ----------
Delete resource -------> accepts deletion
<----------------------- success
process crashes                                    step still running
lease expires
Worker B reclaims                                  new token
Inspect desired state -> already deleted
Record completion --------------------------------> completed
```

A timeout has the same uncertainty: the request might have succeeded while the reply was lost. Reconciliation asks about the desired resource state rather than assuming a retry means the first call failed.

| Adapter | What counts as successful cleanup | Failure to avoid |
| --- | --- | --- |
| Stripe API v1 customer deletion | The intended customer in the correct account is marked deleted | Assuming a DELETE idempotency key deduplicates the effect |
| S3 versioned storage | Required versions and delete markers are removed, with no blocked remainder | Treating a current-object 404 as proof that stored versions are gone |
| CRM | The intended stable resource is absent according to that provider's contract | Treating every 404 or eventually consistent read as a definitive outcome |

For [Stripe API v1](https://docs.stripe.com/api/idempotent_requests), idempotency keys apply to POST. Adding a key to GET or DELETE has no effect. The stable step ID can still correlate attempts locally, but does not change that provider contract. [Deleting a customer](https://docs.stripe.com/api/customers/delete) cancels active subscriptions and leaves a retrievable deleted-customer representation. Verify the resource/account boundary before acting. Customer deletion is not evidence that every financial record has been erased.

For S3, a simple delete in a versioned bucket creates a delete marker. Older bytes can remain, and removing a marker while older versions survive can expose an earlier version again. Enumerate versions and markers, delete the intended version IDs, and inspect each result. [`DeleteObjects`](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteObjects.html) can return HTTP 200 while its body contains individual errors. [Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) can block permanent deletion; retain that as unresolved work rather than reporting success. Prevent new writes while reconciling the owned resources.

No database token can manufacture these provider guarantees. An adapter needs a precise definition of already complete, retryable uncertainty, and operator attention.

## Add a queue for distribution, not for the thirty-day clock

A PostgreSQL scheduler and worker pool can run this workflow at modest volume. Add SQS when independent worker scaling, burst absorption, or workload isolation justifies a broker.

```text
Authorized API -> PostgreSQL job + steps
                          |
                   due-work scheduler
                          |
                  transactional outbox
                          |
                   publisher -> SQS
                                  |
                              workers
                                  |
                     claim -> provider -> progress
                          ^
                          |
                   reconciliation scan
```

SQS cannot hold a thirty-day initial delay: [delay queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-delay-queues.html) allow at most fifteen minutes, and [message retention](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SetQueueAttributes.html) is at most fourteen days. Keep the long deadline in PostgreSQL and dispatch when work becomes due. A separate scheduler service is another implementation option, but still needs the durable intent and cancellation rule.

The [outbox pattern](../2026-10-26-monolith-to-microservices-one-boundary-at-a-time/#the-transactional-outbox-keep-the-necessary-coupling-local) addresses the gap between committing database state and sending a message. The state change and dispatch record commit together. A publisher sends outside that transaction and then records its result. A crash after sending but before recording publication produces a duplicate message, which workers must tolerate.

One lifetime `published_at` flag is insufficient. A failed provider call creates a future retry deadline, an abandoned lease needs another wake-up, and a DLQ message may eventually disappear. Arrange another durable dispatch or rescan eligible steps. Publication is not completion.

The SQL specimen demonstrates database recovery. It does not include an SQS client or an outbox publisher, so the broker path above is an integration design rather than a tested delivery claim.

## Retry by failure meaning

| Outcome | Durable response |
| --- | --- |
| Provider throttling | Respect a usable `Retry-After`, otherwise schedule bounded backoff with jitter |
| Temporary server failure | Persist a future retry time and release the lease conditionally |
| Timeout or lost response | Reconcile the remote outcome before repeating an unsafe effect |
| Permission/configuration failure | Pause visibly and alert an operator |
| Already absent | Complete only when absence satisfies the provider-specific contract |
| Invalid resource/context | Mark `needs_attention`, preserving a safe diagnostic code |

Store `next_attempt_at` instead of sleeping inside a worker while holding ownership. Bound attempts or elapsed retry time, cap concurrency per provider, and record the oldest overdue age. A permanently unavailable provider should produce visible unfinished work, not a falsely completed account.

An SQS consumer acknowledges a message only after the corresponding database outcome is durably handled. A duplicate for an already-completed step can be acknowledged. If another worker owns the lease or the retry is not due, acknowledgement is safe only when durable redispatch or reconciliation will recover the outstanding work.

SQS [visibility timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) reduces overlapping delivery; it is not an exclusive distributed lock. [Dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) are useful operational signals, but are not a permanent unfinished-work ledger.

## Finalize local deletion atomically

Do not delete the local row that holds cleanup identifiers before the external steps have what they need. Copy only required context into the protected job boundary, freeze creation paths, and complete or explicitly resolve each required provider step.

The local-database step uses the same lease discipline. Its finalizer locks the job, verifies the required external steps are complete, deletes the local user, and marks both step and job complete in the same transaction. It rejects early finalization. If the transaction aborts, neither deletion nor completion survives.

Remove temporary cleanup context according to policy. The specimen's surviving job/step rows are recovery metadata, not proof of anonymous data or a universal retention policy. Backups, downstream replicas, retained financial data, and provider-specific access restrictions need their own documented treatment.

## Reconcile work independently of message delivery

Periodically inspect authoritative state:

- Jobs that are overdue but still scheduled.
- Pending steps whose retry time has arrived.
- Running steps with expired leases.
- Steps paused for operator attention.
- Provider resources whose observed state disagrees with recorded progress.
- Completed jobs that still retain temporary cleanup context.

The two recovery distances differ. A database scan can find an expired lease without calling a provider. A provider-state audit can find a remote resource that was recreated after a local completion record. Both need bounded, authorized work and enough capacity to catch up.

A durable workflow engine can manage timers, retries, and orchestration history when custom coordination becomes expensive. It still does not make remote effects exactly once. A Temporal Activity can execute an effect and crash before reporting, so [Activities need idempotent behavior](https://docs.temporal.io/activity-definition#idempotency). Its history also retains Activity inputs/results; pass references to protected context rather than assuming moving a workflow into an engine solves deletion-data retention.

## Run the database specimen

The companion contains the complete PostgreSQL schema/functions and a Python standard-library test harness. It uses an isolated temporary PostgreSQL cluster and no cloud services.

From a checkout of the [site repository](https://github.com/waggertron/tech-learning), with PostgreSQL 18 server/client binaries and Python 3 on `PATH`:

```bash
./companion/user-deletion-workflows/run-tests.sh
```

The schema and functions live in `companion/user-deletion-workflows/schema.sql`. The script creates a private temporary cluster, uses a private Unix socket with no TCP listener, runs the tests, and stops the cluster before removing its files. It does not reuse a personal or production database. If shutdown cannot be confirmed, it preserves the workspace and reports its path instead of deleting a running server's data.

The PostgreSQL checks cover the elapsed deadline, duplicate active requests, competing cancellation/start transitions, competing claims, lease expiry and stale ownership, retry and pause behavior, early local finalization, rollback, and repeated dispatch intent. Concurrent tests observe actual database lock waits before releasing the other transaction; they do not infer a race from a sequential happy path.

The suite passed **15 tests on PostgreSQL 18.4** on November 19, 2026. Its summary includes:

```text
Ran 15 tests
OK
PostgreSQL evidence: 18.4 (Homebrew)
```

Provider success, queue acknowledgement, and a leased outbox publisher remain outside this executable specimen.

The tests establish the database ownership and recovery contract. They do not establish API authorization, production migrations, provider idempotency, queue delivery, throughput, cleanup of backups, or regulatory compliance. Verify those at their real integration boundaries before making a completion promise to a user.

## Choose the next layer from the failure

| Pressure | Smallest useful response |
| --- | --- |
| Delete overdue rows inside one database | Indexed deadline and bounded transactional cleanup |
| Continue several provider steps after a crash | Durable jobs/steps and repeat-safe adapters |
| Distribute bursts across independent workers | Queue plus durable dispatch and reconciliation |
| Broadcast a retained event to many consumers | Event log when replay and independent subscriptions are needed |
| Coordinate many dependencies, timers, and recovery paths | Consider a durable workflow engine |

The durable state should answer what is due, what definitely completed, who currently owns an attempt, and how another worker can recover. Those answers make cron, a broker, or an orchestration engine useful tools rather than substitutes for correctness.

## References

PostgreSQL 18 documents [queue-like row locking](https://www.postgresql.org/docs/18/sql-select.html#SQL-FOR-UPDATE-SHARE), [READ COMMITTED update behavior](https://www.postgresql.org/docs/18/transaction-iso.html#XACT-READ-COMMITTED), and [time semantics](https://www.postgresql.org/docs/18/functions-datetime.html). These are the contracts exercised by the database example.

The focused links beside the SQS, Stripe, S3, and Temporal discussions describe their integration boundaries. Provider behavior is documented, not exercised by the SQL test suite.

## Related topics

- [Atomic callback claims and safe retries](../2026-11-09-atomic-callback-claims-and-safe-retries/): Separate competing workers from retries of one operation.
- [Monolith to microservices](../2026-10-26-monolith-to-microservices-one-boundary-at-a-time/): Follow the outbox and external-effect failure gaps.
- [Message queues](../../topics/system-design/message-queues/): Compare delivery, retry, and backlog behavior.
- [Saga pattern](../../topics/system-design/saga-pattern/): Distinguish compensation from forward recovery.
- [Circuit breaker and resilience](../../topics/system-design/circuit-breaker/): Bound retries, waiting, and dependency failures.
