---
title: SpacetimeDB
description: "SpacetimeDB collapses the backend server and database into a single process: server logic ships as a WASM module, state lives in tables, clients subscribe to queries and receive live diffs with no polling."
parent: databases
tags: [system-design, databases, spacetimedb, wasm, realtime]
status: draft
created: 2026-05-21
updated: 2026-05-21
---

SpacetimeDB collapses the backend server and the database into a single process. Server logic ships as a WebAssembly (WASM) module that runs inside the database. There is no application server, no ORM, no REST API layer. State is tables. Logic is reducers. Clients subscribe to queries.

## Traditional architecture vs SpacetimeDB

The traditional web backend stacks several layers between the client and the data:

```
Traditional:

  Client
    |
    | HTTP / WebSocket
    v
  Application Server
    |
    | ORM / SQL
    v
  Database

SpacetimeDB:

  Client
    |
    | WebSocket (typed SDK)
    v
  SpacetimeDB
  +---------------------------+
  |  WASM Module (reducers)   |
  |  Tables (persistent data) |
  +---------------------------+
```

In the traditional model, logic and storage are separate processes. In SpacetimeDB, both live in one process. The client calls reducers (typed RPC) and subscribes to table queries. SpacetimeDB handles the rest.

## Core concepts

**Module**: a compiled WASM binary uploaded to SpacetimeDB. It contains reducer functions and table definitions. One module runs per database instance. Deploying a new module is how you update business logic.

**Tables**: persistent, indexed data storage defined inside the module. In the Rust SDK, a table is a struct annotated with `#[spacetimedb::table]`. The schema is derived at compile time.

```rust
use spacetimedb::spacetimedb;

#[spacetimedb(table)]
pub struct Entity {
    #[primarykey]
    #[autoinc]
    pub id: u64,
    pub owner: Identity,
    pub x: f32,
    pub y: f32,
}
```

**Reducers**: WASM functions that run inside the database as transactions. Each call is an ACID transaction. Reducers read and write tables. No changes are visible to clients until the reducer commits.

```rust
#[spacetimedb(reducer)]
pub fn move_entity(ctx: ReducerContext, entity_id: u64, x: f32, y: f32) {
    if let Some(mut entity) = Entity::filter_by_id(&entity_id) {
        if entity.owner == ctx.sender {
            entity.x = x;
            entity.y = y;
            entity.update();
        }
    }
}
```

**Subscriptions**: clients send SQL-like queries on connect. When rows matching a subscription change, SpacetimeDB pushes the diff (inserts, updates, deletes) to the client over WebSocket. No polling.

**Client SDK**: generated from the module schema. Clients get typed bindings in TypeScript, Rust, C#, or Python. Calling a reducer is a typed RPC, not a hand-rolled HTTP request.

## Storage mechanics

Tables are stored on disk with a Write-Ahead Log (WAL) for durability. Each row has a primary key, either auto-incremented or explicit. Index annotations control how rows are indexed:

- `#[primarykey]`: unique primary key.
- `#[autoinc]`: auto-increment the column on insert.
- `#[index(btree)]`: B-tree index for range queries.
- `#[unique]`: unique constraint enforced on insert/update.

SpacetimeDB caches hot tables in memory for read performance. Subscription queries use a SQL-like subset. Full SQL (window functions, complex aggregations, unrestricted multi-table joins) is not supported. The query language is intentionally limited to what can be evaluated incrementally as rows change.

## Transaction model

Every reducer call is a transaction. It either commits fully or rolls back. There are no partial writes.

SpacetimeDB uses a single-writer model per module instance: one reducer executes at a time. This serialized execution means no concurrent write conflicts, no deadlocks, and no isolation levels to configure. The correctness model is simple. The trade-off is write throughput: a single instance cannot parallelize writes.

Read-only queries from subscriptions do not block reducers. Subscription evaluations run against committed state.

## The subscription and push model

The flow on client connect:

1. Client sends one or more SQL subscription queries.
2. SpacetimeDB sends the initial matching row set (the "initial state" message).
3. After each committed reducer, SpacetimeDB evaluates which subscriptions are affected.
4. It pushes row diffs (inserts, updates, deletes) over WebSocket to affected clients.
5. The client SDK applies diffs to a local in-memory replica of the subscribed tables.

The result: the client always holds a consistent, live view of its subscribed data. There is no polling loop and no request-response for state reads. The client reads from its local replica; SpacetimeDB keeps it synchronized.

Example subscription from a TypeScript client:

```typescript
conn.subscribe([
  "SELECT * FROM entity WHERE owner = ?",
]);

conn.db.entity.onInsert((ctx, entity) => {
  console.log("new entity:", entity.id);
});

conn.db.entity.onUpdate((ctx, oldEntity, newEntity) => {
  renderEntity(newEntity);
});
```

## Identity and auth

SpacetimeDB has a built-in identity primitive. Each client connection receives:

- **Identity**: a stable public-key-derived identifier for the client. Persists across reconnects if the client presents the same token.
- **Token**: a signed credential that proves ownership of an Identity.

Inside a reducer, `ctx.sender` gives the calling Identity. Row-level access control is expressed as guards in reducer code (check `ctx.sender == entity.owner` before mutating). There is no separate session management layer.

## What SpacetimeDB is designed for

SpacetimeDB's original use case is multiplayer games. BitCraft Online (Clockwork Labs' own MMORPG) is built on it. The model fits well when:

- Many clients need a consistent, live view of shared mutable state.
- Server logic maps naturally to short, transactional state mutations.
- You want the subscription model without building a custom WebSocket and diff layer yourself.
- Write throughput is moderate (thousands of reducer calls per second, not millions).

Real-time collaborative applications (shared whiteboards, live document editing, multiplayer tools) are another strong fit.

## Trade-offs and limitations

**Single-writer bottleneck**: one reducer runs at a time per instance. High write throughput workloads hit a ceiling. There is no mechanism to parallelize writes within one SpacetimeDB instance today.

**WASM sandbox**: reducers cannot make HTTP requests, open files, or call external services. Side effects (sending emails, calling payment APIs, pushing to a message queue) require a separate process that reads from or writes to SpacetimeDB from outside.

**SQL subset only**: complex analytics queries that work in PostgreSQL may not work. Aggregations and multi-table joins have restrictions. SpacetimeDB is not a reporting database.

**Logic-storage coupling**: business logic lives in the WASM module alongside the schema. A schema change or logic change requires a module redeploy. This is simpler operationally than coordinating an API deploy plus a DB migration, but it is a different kind of coupling.

**Maturity**: SpacetimeDB was open-sourced by Clockwork Labs in 2023. Production use exists, but the ecosystem is smaller than PostgreSQL or MySQL. Tooling, third-party integrations, and operational playbooks are still developing.

**Hosting**: self-host on your own infrastructure or use Clockwork Labs' managed cloud. There is no AWS RDS, Google Cloud SQL, or Supabase equivalent for SpacetimeDB yet.

## SpacetimeDB vs traditional architecture

| Concern | Traditional (API + DB) | SpacetimeDB |
| --- | --- | --- |
| Server logic location | Application server process | WASM module inside DB |
| Client updates | Polling or custom WebSocket layer | Built-in subscriptions |
| Consistency model | Varies (configurable isolation levels) | Serialized transactions per instance |
| Schema and logic changes | DB migration + API server deploy | Module redeploy |
| External integrations | In application server code | Separate sidecar process |
| Horizontal write scaling | Sharding, CQRS, read replicas | Not yet (single-writer per instance) |
| Ecosystem maturity | Large (Postgres, MySQL, etc.) | Early (open-sourced 2023) |

## When to use SpacetimeDB

Use it when:

- You are building a multiplayer game or real-time collaborative tool.
- Server logic maps to short, transactional state mutations (move player, update score, place object).
- You want live client state synchronization without building a custom diff and push layer.
- Write throughput is moderate and single-instance serialization is not a bottleneck.
- You want to eliminate the backend-as-separate-process model entirely.

## When not to use SpacetimeDB

Avoid it when:

- Write throughput is high (financial trading, IoT telemetry at scale, high-frequency event ingestion).
- You need complex analytics, reporting queries, or full SQL support.
- External integrations (payment processors, email providers, third-party APIs) are first-class parts of your transaction logic.
- You need a mature ecosystem with extensive tooling, managed hosting options, and proven operational runbooks.

## References

- [SpacetimeDB documentation](https://spacetimedb.com/docs)
- [SpacetimeDB GitHub repository](https://github.com/clockworklabs/SpacetimeDB)
- [SpacetimeDB documentation](https://spacetimedb.com/docs/)

## Related topics

- [Databases at Scale](../), the broader context of storage trade-offs this fits into
- [Message Queues](../../message-queues/), for side effects and external integrations that WASM reducers cannot do directly
- [Event Sourcing](../../event-sourcing/), an architectural pattern with conceptual overlap (log of state mutations)
- [MySQL vs PostgreSQL](../mysql-vs-postgres/), the traditional relational comparison SpacetimeDB sidesteps entirely
