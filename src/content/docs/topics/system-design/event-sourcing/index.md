---
title: Event Sourcing and CQRS
description: "Event sourcing stores state as a sequence of immutable events rather than a current snapshot; CQRS separates the read and write models. Together they enable audit logs, time travel, and independent scaling of reads and writes."
parent: system-design
tags: [system-design, event-sourcing, cqrs, distributed-systems]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

Most databases store the current state of data. Event sourcing instead stores the sequence of events that produced the current state. The current state is derived by replaying those events. This is how accounting has worked for centuries: a ledger records every transaction, and the account balance is computed by summing them -- not stored directly.

## Event sourcing

In a traditional CRUD system, updating a user's email replaces the old value:

```sql
UPDATE users SET email = 'new@example.com' WHERE id = 42;
-- The previous email is gone. No audit trail.
```

In an event-sourced system, the update is recorded as an event:

```python
# Event stored immutably
event = {
    "event_id": "evt_abc123",
    "aggregate_id": "user_42",
    "event_type": "EmailChanged",
    "data": {
        "old_email": "old@example.com",
        "new_email": "new@example.com"
    },
    "timestamp": "2026-05-06T14:23:00Z",
    "version": 7  # this user's 7th event
}
event_store.append(event)
```

The current state is rebuilt by replaying all events for that aggregate:

```python
def get_user(user_id: str) -> dict:
    events = event_store.get_events(aggregate_id=f"user_{user_id}", from_version=0)
    user = {}
    for event in events:
        user = apply_event(user, event)
    return user

def apply_event(state: dict, event: dict) -> dict:
    if event["event_type"] == "UserCreated":
        return {"id": event["data"]["id"], "email": event["data"]["email"]}
    elif event["event_type"] == "EmailChanged":
        return {**state, "email": event["data"]["new_email"]}
    elif event["event_type"] == "UserDeactivated":
        return {**state, "active": False}
    return state
```

## The event store

The event store is an append-only log of events. Events are never modified or deleted.

```python
# Simplified event store schema (PostgreSQL)
CREATE TABLE events (
    event_id      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    aggregate_id  VARCHAR(255) NOT NULL,
    event_type    VARCHAR(100) NOT NULL,
    data          JSONB NOT NULL,
    metadata      JSONB,
    version       INT NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (aggregate_id, version)  -- optimistic concurrency control
);

CREATE INDEX ON events (aggregate_id, version);
```

The unique constraint on `(aggregate_id, version)` prevents two concurrent writes from both claiming the same version number. This is **optimistic concurrency control**: if two processes both read version 6 and try to write version 7, the second INSERT fails. The second process must reload the events and retry.

## Snapshots

Replaying 10,000 events to get the current state of a frequently-updated aggregate is expensive. **Snapshots** periodically capture the current state so replay starts from the snapshot, not from the beginning:

```python
# Every 100 events, store a snapshot
SNAPSHOT_INTERVAL = 100

def get_user_efficient(user_id: str) -> dict:
    snapshot = snapshot_store.get_latest(f"user_{user_id}")
    from_version = snapshot["version"] if snapshot else 0
    state = snapshot["state"] if snapshot else {}

    # Replay only events after the snapshot
    events = event_store.get_events(f"user_{user_id}", from_version=from_version)
    for event in events:
        state = apply_event(state, event)
        if event["version"] % SNAPSHOT_INTERVAL == 0:
            snapshot_store.save(f"user_{user_id}", state, event["version"])

    return state
```

Snapshots trade storage for replay performance. Most event-sourced systems with high event volume use them.

## Benefits of event sourcing

**Complete audit log**: every change is recorded with who made it and when. No separate audit table needed -- the event log is the audit log.

**Time travel**: replay events up to a specific point in time to see the state of any aggregate at any moment in history.

```python
def get_user_at(user_id: str, as_of: datetime) -> dict:
    events = event_store.get_events(
        f"user_{user_id}",
        from_version=0,
        max_timestamp=as_of
    )
    return reduce(apply_event, events, {})
```

**Event replay for new features**: if you build a new feature (e.g. "user activity heatmap"), you can replay all historical events through a new projection to backfill data, even for events that happened before the feature existed.

**Debugging**: when a bug is found, replay the exact sequence of events that led to the incorrect state. The events are the "recording" of what happened.

## CQRS: Command Query Responsibility Segregation

CQRS separates the write model (commands that change state) from the read model (queries that return state).

```
Write side (Command):
  Client --> Command Handler --> Event Store
  (validates business rules, produces events)

Read side (Query):
  Client --> Query Handler --> Read Model (projected from events)
  (fast, denormalized, optimized for the specific query)
```

Without CQRS, the same model serves both reads and writes. This creates pressure: writes need normalized data to maintain consistency, while reads need denormalized data to be fast. CQRS resolves this tension by allowing each side to optimize independently.

**Projections**: a projection subscribes to the event stream and builds a read model optimized for a specific query.

```python
# A projection that builds a "users by email" lookup table
# Runs as a background process consuming from the event store

def project_user_by_email(event: dict):
    if event["event_type"] == "UserCreated":
        email_index.set(event["data"]["email"], event["aggregate_id"])

    elif event["event_type"] == "EmailChanged":
        email_index.delete(event["data"]["old_email"])
        email_index.set(event["data"]["new_email"], event["aggregate_id"])

    elif event["event_type"] == "UserDeactivated":
        email_index.set_inactive(event["aggregate_id"])

# Query side: uses the projected read model, not the event store
def find_user_by_email(email: str) -> str | None:
    return email_index.get(email)
```

A single event stream can feed many projections: a search index, an analytics aggregation, a read-optimized cache, a reporting database. Each projection is independent and can be rebuilt from scratch by replaying the full event history.

## Event sourcing with Kafka

Kafka's log is a natural event store: messages are immutable, ordered, retained for a configurable period, and replayable from any offset.

```
Write side:
  Command Handler --> [Kafka Topic: user-events]
                           |
          .----------------+-----------------.
          |                |                 |
  [Email Index        [Analytics       [Search Index
   Projector]          Projector]       Projector]
          |                |                 |
  [Redis email      [ClickHouse]       [Elasticsearch]
   lookup table]
```

The event store is the Kafka topic. Projections are Kafka consumers. This is exactly how event-driven microservices work in practice -- each service owns its events and other services project from them.

## When to use event sourcing

Event sourcing is not appropriate everywhere. It adds significant complexity and should be reserved for domains where the benefits justify the cost.

**Good fit**:
- Financial systems (audit is legally required; the ledger model is natural)
- Collaborative editing (every keystroke is an event; replay gives you version history)
- Order management (every status change matters for compliance and support)
- Systems where "what happened" is as important as "what is the current state"

**Poor fit**:
- User profile updates (the previous value of a profile picture is not interesting)
- Ephemeral data (shopping cart, rate limit counters)
- Simple CRUD apps where an audit log is not needed
- Teams unfamiliar with the pattern (high learning curve)

## Key takeaways

**The event store is the source of truth. The read model is a cache.** The read model can always be discarded and rebuilt from the event store. This makes schema migrations painless: change the projection logic and replay.

**Optimistic concurrency on the version number prevents lost writes.** The unique constraint on `(aggregate_id, version)` is the mechanism that prevents two concurrent writes from corrupting each other. This replaces database row-level locking for the write path.

**CQRS and event sourcing are independent but complementary.** You can use CQRS with a traditional database (separate read replica with a denormalized schema). You can use event sourcing without CQRS (only one read model, from the event store). They are frequently combined because event sourcing makes CQRS projections natural.

**Eventual consistency is the trade-off.** A write produces an event. The read projection updates asynchronously. There is a window (milliseconds to seconds) where the read model is stale. Design the system to tolerate this: return the command result to the client immediately (don't wait for the projection), and build UIs that handle eventual consistency gracefully.

**Kafka retention is not an event store.** Kafka's default 7-day retention means events older than a week are deleted. For a true event store, either increase Kafka retention to indefinite, or use a dedicated event store (EventStoreDB, PostgreSQL append-only table).

## References

- [Martin Fowler: Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Martin Fowler: CQRS](https://martinfowler.com/bliki/CQRS.html)
- [Greg Young: CQRS and Event Sourcing (talk)](https://www.youtube.com/watch?v=JHGkaShoyNs)
- [EventStoreDB documentation](https://developers.eventstore.com/)

## Related topics

- [Saga Pattern](../saga-pattern/), events as the coordination mechanism for distributed transactions
- [Message Queues](../message-queues/), Kafka as the event streaming backbone
- [Databases at Scale](../databases/), event store implementation on PostgreSQL or specialized stores
- [Microservices vs Monolith](../microservices/), event sourcing as the integration pattern between microservices
