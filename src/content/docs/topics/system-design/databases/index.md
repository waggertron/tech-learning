---
title: Databases at Scale
description: "SQL vs NoSQL trade-offs, read replicas, sharding strategies, replication models, and how to reason about which database fits which access pattern."
parent: system-design
tags: [system-design, databases, sql, nosql, sharding]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

Databases are almost always the bottleneck in a growing system. Understanding how they scale, and when they stop scaling, is the foundation of system design.

## SQL vs NoSQL

The choice is not "old vs new" or "better vs worse." It is a trade-off between structure and flexibility, between relational integrity and horizontal scalability.

### SQL (relational)

- Data lives in tables with a fixed schema. Relationships enforced by foreign keys.
- ACID transactions: atomicity, consistency, isolation, durability. Multiple rows or tables can be updated in a single all-or-nothing operation.
- Powerful querying: JOINs, aggregations, window functions, subqueries.
- Vertical scaling is straightforward. Horizontal scaling (sharding) is possible but adds significant complexity.

**Best for**: financial systems, e-commerce orders, anything requiring multi-row transactions or complex queries across related data.

### NoSQL

NoSQL is not one thing. There are five distinct models:

| Model | Examples | Best for |
| --- | --- | --- |
| Document | MongoDB, Firestore | JSON-like objects with varying shapes; user profiles, product catalogs |
| Key-value | Redis, DynamoDB | Fast single-key lookups; sessions, caches, feature flags |
| Wide-column | Cassandra, HBase | Time-series, write-heavy, append-mostly; IoT, logs, metrics |
| Graph | Neo4j, Amazon Neptune | Relationships as first-class data; social graphs, recommendation engines |
| Time-series | InfluxDB, TimescaleDB | Ordered numeric measurements; monitoring, telemetry |

NoSQL databases often sacrifice:
- Multi-item transactions (eventual consistency instead of ACID)
- Flexible querying (must query by a predetermined key or index pattern)

In return, they offer:
- Horizontal scaling with less complexity
- Higher write throughput (Cassandra, HBase)
- Schema flexibility (MongoDB)
- Specialized performance characteristics (Redis for sub-millisecond reads)

## Read replicas

A **read replica** is a copy of the primary database that receives a continuous stream of changes and can serve read queries. The primary handles writes; replicas handle reads.

```
Writer sends here:
  [ Primary DB ] <------ all WRITE queries
       |
       | replication (async)
       |
  [ Replica 1 ]  <------ read queries
  [ Replica 2 ]  <------ read queries
  [ Replica 3 ]  <------ read queries
```

Read replicas are the first scaling move for read-heavy systems. They are operationally simple (one primary, N replicas), and most cloud databases support them out of the box (Amazon RDS, Google Cloud SQL, PostgreSQL streaming replication).

**Replication lag**: replicas are updated asynchronously. There is a lag (typically milliseconds to seconds) between a write to the primary and the write appearing on all replicas. Applications must tolerate reading slightly stale data from replicas, or route reads that need the latest data to the primary.

## Sharding

Sharding splits data across multiple database nodes, each called a **shard**. Unlike read replicas, where all nodes have all the data, each shard holds a subset. This allows write throughput to scale with the number of shards.

```
[ Shard A ]          [ Shard B ]          [ Shard C ]
users 1-10M          users 10M-20M        users 20M-30M
```

### Sharding strategies

**Range sharding**: assign rows to shards based on a range of the shard key (e.g. user ID 1-10M on shard A). Simple to reason about. Prone to **hotspots** if recent data is more active (all new users land on the newest shard).

**Hash sharding**: hash the shard key and assign based on the hash value. Distributes load evenly. Does not support range queries efficiently (to find all users in a city, you must query all shards).

**Directory sharding**: a lookup table maps each key to its shard. Maximum flexibility. The lookup table itself becomes a bottleneck and single point of failure.

```python
# Hash sharding example
def get_shard(user_id: int, num_shards: int) -> int:
    return hash(str(user_id)) % num_shards

user_id = 42
shard = get_shard(user_id, 4)
print(f"User {user_id} lives on shard {shard}")
```

### Sharding problems

**Cross-shard queries**: a query that joins users and orders becomes complex if users are on shard A and orders are on shard B. Most systems denormalize data (duplicate it) to avoid cross-shard joins.

**Resharding**: if you start with 4 shards and need 8, you must move half the data. Naive modulo hashing means almost all data moves. **Consistent hashing** solves this by minimizing the data moved when nodes are added or removed. See the [Consistent Hashing](../consistent-hashing/) page.

**Hot shards**: if one shard key (e.g. a celebrity user) generates far more traffic than others, that shard becomes a bottleneck. Mitigations include splitting the hot key (suffix random salt) or routing hot traffic to a dedicated cache.

## Replication models

### Single-leader (leader-follower)

One primary accepts writes. Replicas receive changes from the primary and can serve reads. This is the most common model.

**Failover**: when the primary fails, a replica is promoted to primary. Automatic failover (via orchestration tools like Patroni or RDS Multi-AZ) takes 30-60 seconds. Manual failover takes longer but is safer.

### Multi-leader

Multiple nodes accept writes. Changes propagate between leaders. Used for multi-datacenter setups where you want writes to land locally (low latency).

**Write conflicts**: if two leaders accept conflicting writes (same row updated differently), the conflict must be resolved. Common strategies: last-write-wins (by timestamp), merge, or application-level conflict resolution.

### Leaderless (quorum-based)

Any node accepts reads and writes. Writes are sent to multiple nodes simultaneously. A write is considered successful when W nodes acknowledge it. A read is considered valid when R nodes agree. The relationship W + R > N (total nodes) guarantees you will always read a value that reflects the latest write.

Cassandra and DynamoDB use this model. It offers very high availability but requires careful tuning of W, R, and N for the consistency/availability trade-off you want.

## Indexing for scale

Indexes speed up reads by maintaining a sorted data structure (usually a B-tree or LSM-tree) over one or more columns. Every write also updates all indexes on that table, which slows writes.

Rules of thumb:
- Index every foreign key (required for efficient JOIN).
- Index columns used in WHERE, ORDER BY, GROUP BY frequently.
- Composite indexes (col_a, col_b) satisfy queries on col_a alone or on (col_a, col_b) but not on col_b alone.
- Monitor slow query logs. Missing indexes are almost always the first performance problem.

**Too many indexes**: each index takes storage and slows writes. A table with 15 indexes will have very slow INSERTs. Audit and drop unused indexes.

## Connection pooling

Opening a database connection is expensive (TCP handshake, authentication, SSL). Applications that open a new connection per request create a thundering herd of connections under load.

A connection pool maintains a fixed set of open connections and lends them to incoming requests.

```python
# psycopg2 + connection pool
from psycopg2 import pool

connection_pool = pool.SimpleConnectionPool(
    minconn=5,
    maxconn=20,
    host="db-primary",
    database="mydb",
    user="app",
    password="secret",
)

def get_user(user_id):
    conn = connection_pool.getconn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        return cur.fetchone()
    finally:
        connection_pool.putconn(conn)
```

Most databases have a hard cap on simultaneous connections (PostgreSQL default: 100). PgBouncer and RDS Proxy sit between application servers and the database, multiplexing thousands of application-level connections into a smaller pool.

## References

- [Designing Data-Intensive Applications, Kleppmann, Chapters 5-6](https://dataintensive.net/)
- [PostgreSQL replication docs](https://www.postgresql.org/docs/current/high-availability.html)
- [Cassandra architecture overview](https://cassandra.apache.org/doc/latest/cassandra/architecture/overview.html)
- [AWS Aurora: scaling and replication](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html)

## Related topics

- [Scalability](../scalability/), the broader context for why databases need to scale
- [Caching](../caching/), reduce database read load before scaling the database itself
- [CAP Theorem](../cap-theorem/), the theoretical framework that explains replication trade-offs
- [Consistent Hashing](../consistent-hashing/), how to reshard with minimal data movement
- [Message Queues](../message-queues/), decouple writes from the database using a queue buffer
