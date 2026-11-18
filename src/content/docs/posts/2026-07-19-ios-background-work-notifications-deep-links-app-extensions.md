---
title: "Background work: checkpoint, expire, and resume"
description: "Design recoverable work across scheduling, expiration, cancellation, notifications, and extension boundaries."
date: 2026-07-19
tags: [ios, swift, background-tasks, notifications, app-extensions]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-background-work-notifications-deep-links-app-extensions/
---

A background opportunity may end before the work does. The useful guarantee is that the app can identify the last durable checkpoint and continue without duplicating an external effect.

## Persist intent before scheduling

Consider uploading three note attachments. Save a job record containing a stable job ID, note ID, immutable attachment references, and acknowledged item IDs. Scheduling is a request for execution time, not proof that uploading has begun.

```text
pending -> scheduled -> running -> completed
   ^                       |
   |                       +-> expired -> checkpointed
   |                                         |
   +-----------------------------------------+

running -> cancel requested -> cancelled
```

“Completed” means the required effects have been acknowledged and that acknowledgement has been persisted. A progress spinner or an in-memory counter is not a durable checkpoint.

## Work through one interruption

The first run uploads attachment A and records its acknowledgement. While uploading B, the task expires. The handler cancels outstanding local work, persists the recoverable state, and reports completion to the system according to the selected API's contract.

A later run loads the job. It skips A, reconciles whether B was accepted, and proceeds to C. If the server accepted B before the acknowledgement was saved, a stable idempotency key or reconciliation query prevents a duplicate upload. Cancellation alone cannot undo an already accepted remote effect.

Distinguish user cancellation from expiration. Expiration usually retains pending intent for another opportunity. User cancellation may suppress rescheduling and remove temporary input after no active work owns it. Define this policy in state transitions rather than infer it from a missing task handle.

## Select the system mechanism

Use Apple's [background strategy guide](https://developer.apple.com/documentation/backgroundtasks/choosing-background-strategies-for-your-app) to match the kind of work to the system API. Deferred refresh, longer processing, transferring files, and finishing a bounded foreground operation have different scheduling and lifetime contracts. No choice turns arbitrary app code into an unrestricted permanent process.

A push notification can indicate changed data. The application still needs reconciliation, duplicate handling, and an authorization check. A notification or deep link contains an intent to inspect a destination, not authority to access it. Resolve the current account and note identity when the app handles the route.

Extensions run with separate lifetimes and configuration. Exchange a durable representation through the documented shared boundary; do not assume an in-memory singleton is shared with the app.

## Test the application policy first

Use a fake scheduler and transport to replay these sequences:

| Sequence | Required outcome |
| --- | --- |
| schedule, then no execution opportunity | job remains pending and visible |
| A acknowledged, expiration during B | A is not uploaded again |
| B accepted, acknowledgement lost | reconciliation identifies the same effect |
| user cancels before next run | no automatic reschedule |
| duplicate notification | one coherent refresh operation |
| route targets a deleted note | recoverable missing destination |

These cases test state and persistence policy. Separate device checks establish actual scheduling opportunities, notification delivery, background transfers, and extension interaction. The browser Swift runner cannot establish those behaviors.

## References

- [Choosing background strategies](https://developer.apple.com/documentation/backgroundtasks/choosing-background-strategies-for-your-app) compares execution mechanisms.
- [Extending background execution time](https://developer.apple.com/documentation/uikit/extending-your-app-s-background-execution-time) describes a bounded execution extension.
- [User Notifications](https://developer.apple.com/documentation/usernotifications) describes notification delivery and responses.

## Related topics

- [Concurrency and cancellation](../2026-07-19-ios-concurrency-architecture-isolation-cancellation-lifecycle/)
- [Production readiness](../2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage/)

[Series reading guide](../series/zero-to-ios-hero/)
