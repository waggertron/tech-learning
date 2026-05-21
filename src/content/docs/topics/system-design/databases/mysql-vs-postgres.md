---
title: MySQL vs PostgreSQL
description: "InnoDB clustered indexes vs heap storage, MVCC via undo log vs dead tuples, WAL architecture, index types (GIN, GiST, BRIN), jsonb, extensions like PostGIS and pgvector, replication models, and when to pick each database."
parent: databases
tags: [system-design, databases, mysql, postgresql, storage-engines]
status: draft
created: 2026-05-21
updated: 2026-05-21
---

Both are relational databases. Both support ACID transactions. The differences live in storage engine architecture, MVCC implementation, index types, and extension ecosystems. Pick based on workload, not hype.

## Storage engines

### MySQL / InnoDB

InnoDB is the default and only serious storage engine in MySQL. Data lives in `.ibd` files (tablespace files, one per table by default).

The primary key is a **clustered index**: the B+tree leaf nodes contain the actual row data. Secondary indexes store the primary key as their row locator. A secondary index lookup therefore requires two B+tree traversals: secondary index to primary key, then primary key to the actual row.

```
InnoDB clustered index (primary key = row locator):

  Secondary index (email)          Clustered index (id)
  +--------------+--------+        +---------+--------------------+
  | email        | PK(id) |        | id      | full row data      |
  | alice@...    |   1    |  --->  |   1     | alice, alice@..., ..|
  | bob@...      |   5    |  --->  |   5     | bob, bob@..., ...  |
  +--------------+--------+        +---------+--------------------+
  two B+tree hops for every secondary index lookup
```

Covering indexes (where all needed columns are in the index itself) avoid the second hop.

### PostgreSQL / heap

PostgreSQL has one storage engine. Tables are heap files: 8 KB pages, rows stored in insertion order. Every index type (B-tree, GIN, GiST, BRIN, etc.) stores a tuple ID (page number + slot offset) as the row locator.

There is no clustered index by default. The `CLUSTER` command reorganizes a table's physical order around an index once, but the table does not stay sorted after subsequent writes.

```
PostgreSQL heap (tuple ID = row locator):

  B-tree index (email)             Heap file (pages of 8 KB)
  +--------------+---------+       +--------+--------------------+
  | email        | TID     |       | (1,1)  | alice, alice@..., ..|
  | alice@...    | (1,1)   |  ---> | (1,2)  | bob, bob@..., ...  |
  | bob@...      | (1,2)   |  ---> | (3,7)  | carol, carol@..., ..|
  +--------------+---------+       +--------+--------------------+
  one hop: TID -> page -> slot
```

All index types share this same heap-pointer model, which is why PostgreSQL can offer so many index types without redesigning the storage layer.

## MVCC implementation

This is the most significant mechanical difference between the two databases.

### MySQL / InnoDB undo log

InnoDB stores old row versions in a separate undo log (system tablespace, or a dedicated undo tablespace in MySQL 8). The current row version sits in the clustered index. When a transaction needs an older version, the database reconstructs it by applying undo log records backwards from the current version.

MVCC overhead is proportional to transaction length: a long-running transaction that started before many updates must traverse more undo records to reconstruct the version it can see. It does not bloat the table itself.

### PostgreSQL dead tuples

PostgreSQL stores old row versions in the heap itself as "dead tuples." An `UPDATE` writes a new tuple to the heap and marks the old tuple as expired (invisible to future transactions). Reads reconstruct visibility from the tuple's `xmin`/`xmax` transaction IDs.

Dead tuples accumulate until `VACUUM` reclaims them. `autovacuum` handles this automatically, but it requires tuning for write-heavy tables. Under-tuned autovacuum leads to table bloat and, eventually, transaction ID wraparound (a hard maintenance event at ~2 billion transactions).

The upside: reading old versions is cheap because the data is already in the heap. No undo log traversal.

```
PostgreSQL heap after UPDATE on row id=1:

  Page 1
  +---------------------------+
  | (1,1) id=1 xmax=500 [old] |  <-- dead tuple, VACUUM will reclaim
  | (1,2) id=1 xmin=500 [new] |  <-- live tuple
  +---------------------------+
```

**Operational takeaway**: PostgreSQL tables with heavy UPDATE or DELETE traffic need autovacuum properly tuned. Table bloat is a real production concern that MySQL's undo log approach avoids.

## Write-Ahead Log (WAL)

### MySQL: two logs

MySQL maintains two separate logs:

- **InnoDB redo log**: handles crash recovery. Records physical page changes.
- **Binary log (binlog)**: handles replication and point-in-time recovery. Available in three formats: statement (replays SQL, smaller log, non-deterministic risk), row (logs actual row changes, deterministic, larger), and mixed.

The two logs are kept in sync via an internal two-phase commit. MySQL also uses a doublewrite buffer: writes are first staged to a 128-page sequential buffer, then written to the actual tablespace. This prevents torn pages on crash.

### PostgreSQL: one WAL

PostgreSQL uses a single WAL for both crash recovery and replication. WAL segments are 16 MB files stored in `pg_wal/`. An LSN (Log Sequence Number) tracks the current position. Streaming replication ships WAL segments (or individual WAL records) to standbys in real time.

The single-log design is simpler to reason about than MySQL's dual-log approach.

## Index types

Both databases support B-tree (default), hash indexes, and partial indexes (indexes with a `WHERE` clause).

### PostgreSQL-only index types

| Index type | Use case |
| --- | --- |
| GIN (Generalized Inverted Index) | Full-text search, `jsonb` keys and values, arrays |
| GiST (Generalized Search Tree) | Geometry, ranges, full-text search with ranking |
| BRIN (Block Range Index) | Naturally ordered data: timestamps, sequential IDs |
| SP-GiST | Partitioned trees: IP addresses, phone numbers |
| `pg_trgm` trigram | Fast `LIKE`/`ILIKE`/regex on text columns |

GIN indexes on `jsonb` columns make document-style queries fast without switching to a document database. BRIN indexes are extremely small (a few pages regardless of table size) for columns that correlate with physical order.

### MySQL-only index types

- **FULLTEXT**: dedicated full-text search index with `MATCH ... AGAINST` syntax.
- **Spatial (R-tree)**: geometry columns via the spatial extension.

PostgreSQL's index variety makes it significantly more flexible for non-standard query patterns.

## JSON support

### MySQL JSON column

MySQL's `JSON` column stores data in a binary representation (not plain text). Path expressions (`->` and `->>`) extract values. Indexing on JSON fields requires creating a generated (virtual) column and indexing that.

```sql
-- MySQL: generated column + index for JSON field
ALTER TABLE events ADD COLUMN event_type VARCHAR(50)
  GENERATED ALWAYS AS (data->>'$.type') STORED;
CREATE INDEX idx_event_type ON events(event_type);
```

### PostgreSQL json vs jsonb

PostgreSQL offers two JSON types:

- `json`: stored as text, re-parsed on every query.
- `jsonb`: stored in binary format, parsed on insert. Supports GIN indexing directly.

```sql
-- PostgreSQL: GIN index on jsonb column
CREATE INDEX idx_data_gin ON events USING GIN (data);

-- Query using jsonb containment operator
SELECT * FROM events WHERE data @> '{"type": "click"}';

-- Check if key exists
SELECT * FROM events WHERE data ? 'session_id';
```

`jsonb` operators (`@>`, `<@`, `?`, `?|`, `?&`) are more expressive than MySQL's path syntax and are backed by index support without generated columns.

## Extension ecosystem

PostgreSQL's extension system is a genuine differentiator.

| Extension | What it adds |
| --- | --- |
| `PostGIS` | Full geospatial database: points, polygons, spatial indexes, distance queries |
| `pgvector` | Vector similarity search for AI embeddings (L2, cosine, dot product) |
| `TimescaleDB` | Time-series: automatic partitioning by time, continuous aggregates |
| `pg_trgm` | Trigram similarity for fuzzy text search and fast `LIKE` |
| `uuid-ossp` | UUID generation functions |
| `pgcrypto` | Cryptographic functions: hashing, encryption |
| `hstore` | Key-value pairs in a single column (largely superseded by `jsonb`) |

MySQL has plugins, but no comparable ecosystem. If the workload requires geospatial queries, vector search, or time-series aggregations, PostgreSQL is the practical choice.

## Replication

### MySQL binlog replication

MySQL replication is binlog-based. The primary writes to the binlog; replicas read and replay it. Three formats:

- **Statement**: replays the original SQL. Smaller log. Non-deterministic functions (`NOW()`, `UUID()`) can produce different results on replicas.
- **Row**: logs actual before/after row images. Deterministic. Larger log.
- **Mixed**: uses statement format by default, switches to row format when non-determinism is detected.

GTID (Global Transaction Identifier) assigns a unique ID to each transaction, which simplifies failover and replica promotion.

### PostgreSQL streaming replication

PostgreSQL uses WAL-based replication in two forms:

- **Physical (streaming replication)**: ships WAL records byte-for-byte to standbys. The standby is a binary-identical copy of the primary. Used for high availability and read replicas.
- **Logical replication** (PostgreSQL 10+): replicates row-level changes decoded from WAL. Allows replication between different PostgreSQL major versions, to a different schema, or to selective tables. More flexible than physical replication for specific use cases.

## When to pick each

| Factor | MySQL | PostgreSQL |
| --- | --- | --- |
| Read-heavy web app | Good | Good |
| Complex queries and JOINs | Adequate | Better (query planner is stronger) |
| JSON / semi-structured data | Limited (no GIN) | `jsonb` + GIN indexing |
| Full-text search | FULLTEXT index | GIN + `tsvector` or `pg_trgm` |
| Geospatial queries | Limited | PostGIS |
| Vector search (AI embeddings) | No | `pgvector` |
| Heavy UPDATE / DELETE workload | Good (undo log, no bloat) | Needs autovacuum tuning |
| Time-series | No native support | TimescaleDB extension |
| Managed cloud options | RDS, Aurora MySQL, PlanetScale | RDS, Aurora Postgres, Supabase, Neon |

## Common gotchas

**PostgreSQL autovacuum is not optional.** Disabling it or leaving it under-tuned leads to table bloat and eventually transaction ID wraparound. Wraparound requires emergency maintenance and takes the database offline. Monitor `age(relfrozenxid)` from `pg_class` to catch tables approaching the limit.

**MySQL `ONLY_FULL_GROUP_BY` breaks old queries.** Enabled by default since 5.7. Queries that select non-aggregated columns not in the `GROUP BY` clause are rejected. This breaks queries that worked on 5.6 and earlier.

**Default isolation levels differ.** PostgreSQL defaults to `READ COMMITTED`. MySQL/InnoDB defaults to `REPEATABLE READ`. The difference affects whether phantom reads are possible and how gap locks behave. Porting queries between databases without accounting for this is a common bug source.

**InnoDB secondary indexes always do two B+tree traversals.** For high-selectivity queries on secondary indexes this is rarely a bottleneck. For queries that read many columns from low-selectivity secondary index scans, covering indexes (include all needed columns in the index) eliminate the second hop.

**PostgreSQL `CLUSTER` does not stay clustered.** Running `CLUSTER` once physically reorders the table. Subsequent inserts, updates, and deletes do not maintain that order. If physical ordering matters (e.g. for BRIN index efficiency), use partitioning instead.

## References

- [MySQL InnoDB storage engine docs](https://dev.mysql.com/doc/refman/8.0/en/innodb-storage-engine.html)
- [PostgreSQL MVCC documentation](https://www.postgresql.org/docs/current/mvcc.html)
- [PostgreSQL storage file layout](https://www.postgresql.org/docs/current/storage-file-layout.html)
- [PostgreSQL index types overview](https://www.postgresql.org/docs/current/indexes-types.html)
- [pgvector extension](https://github.com/pgvector/pgvector)
- [PostGIS documentation](https://postgis.net/documentation/)

## Related topics

- [Databases at Scale](../), sharding, replication models, and connection pooling
- [Caching](../../caching/redis/), reduce database read load with Redis before scaling the database
- [Event Sourcing](../../event-sourcing/), an alternative storage pattern where events replace mutable rows
- [CAP Theorem](../../cap-theorem/), the theoretical framework behind replication trade-offs
