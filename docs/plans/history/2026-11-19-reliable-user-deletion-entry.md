# Reliable user deletion entry

Date: 2026-11-19
Status: complete

## Scope

Create a standalone dated post from the supplied deletion-workflow document. Preserve its incremental reasoning while connecting to the existing callback-claim and monolith/outbox posts instead of duplicating their full explanations. Support concrete PostgreSQL claims with an isolated, runnable PostgreSQL 18 specimen. Do not claim live Stripe, S3, CRM, SQS, or Temporal integrations or regulatory erasure guarantees.

## Checklist

- [x] **R1**: Compare existing entries and verify provider/database contracts from primary sources.
  - Evidence: no existing account-deletion walkthrough. Existing claims/outbox posts are complementary; PostgreSQL 18, SQS deadline/retention, Stripe DELETE, S3 versions/partial failures, and Temporal Activity behavior reviewed.
- [x] **I1**: Implement the bounded deadline/job/step/lease/finalization SQL specimen without external services or new dependencies.
  - Evidence: Complete SQL schema/functions, native PostgreSQL isolated runner, and README supplied under companion/user-deletion-workflows. No provider calls or new dependencies.
- [x] **I2**: Exercise real PostgreSQL concurrency, cancellation, stale-token rejection, retries, early finalization, and atomic rollback in isolated tests.
  - Evidence: Fifteen actual PostgreSQL 18.4 tests passed. They observe lock waits, check both cancellation outcomes, verify fresh claims and rejected stale mutations after blocked lease expiry, and test finalization rollback/commit plus bounded redispatch.
- [x] **W1**: Write the post with explicit 720-hour grace-period semantics, cancellation cutoff, repeat-safe provider boundaries, durable redispatch, and evidence limits.
  - Evidence: New dated post preserves the source through-line and includes five literal definitions from the tested schema. It specifies 720 elapsed hours, cancellation until execution begins, provider-specific repeat safety, and exact untested boundaries.
- [x] **W2**: Add relevant discovery/backlinks and tags, then record the feature and specimen maintenance commands.
  - Evidence: Tags and blog discovery are automatic. Curated post/system-design discovery and reciprocal links from claims, monolith, queues, and saga pages were updated. Narrow saga wording now distinguishes compensation from irreversible forward recovery; feature tracker and companion README record maintenance/evidence.
- [x] **V1**: Review the article against the tested SQL, inspect rendered code/diagrams and tag archives, and run build, link, published-content, and focused example checks.
  - Evidence: Full npm run validate:pre-push passed, including build, published-content, example contracts, 1,566 rendered pages/internal links, unified tags (734 archives, 736 tagged pages, 3,330 memberships), and browser checks. Rendered article preserves all five SQL definitions, deadline semantics, and 15-test evidence. All thirteen linked external references returned HTTP 200.
- [x] **V2**: Resolve independent review findings and archive this plan once every item has evidence.
  - Evidence: Independent companion review approved with zero outstanding findings. Parent independently reran all fifteen PostgreSQL 18.4 tests. Stop-failure injection confirmed retained diagnostic files on uncertain shutdown. Completed plan archived; no second-stage commit or push requested.

## Boundaries

The durable job is the source of pending work; queue messages are disposable wake-ups. A lease token fences database progress, not remote effects. Only the scheduled-to-executing transition authorizes destructive work, and cancellation competes on that same job row. Local finalization checks required steps and commits its deletion/progress together.

Use local mock-first provider reasoning. The SQL specimen demonstrates database boundaries only. No new package installation, production deployment, cloud resource, commit, or push is part of this second-stage entry task unless separately requested.

## Review decisions

The review reproduced a stale-lease finalizer that waited on an unchanged locked row, then acted after expiry. The fixed helper acquires the row lock before sampling wall-clock time, and completion/retry/pause/finalization use it. Tests preserve the user when the blocked finalizer loses its lease. Multirow operations use a consistent user/job/step lock order. The runner preserves its workspace when shutdown cannot be confirmed. Independent review reports zero outstanding findings after fifteen passing tests.
