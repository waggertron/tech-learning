---
title: Redis
description: "Redis data structures and internal encodings, memory model, key expiry and eviction policies, RDB and AOF persistence, replication, Sentinel vs Cluster topology, and when Redis fits better than Memcached or Kafka Streams."
parent: caching
tags: [system-design, redis, caching, storage]
status: draft
created: 2026-05-21
updated: 2026-05-21
---

Redis is an in-memory data structure server. Everything lives in RAM. Operations are O(1) or O(log n). Latency is sub-millisecond. The interesting engineering is in how it manages memory, persists data, and stays fast under load.

## Data structures

Redis exposes eight data structures. Each one has an internal encoding that changes automatically as the collection grows. Small collections use compact encodings that save memory; large ones promote to full data structures for speed.

### String

Binary-safe blob, up to 512 MB.

Internal encodings:
- `int`: for integer values; stored directly as a long, no pointer overhead.
- `embstr`: strings up to 44 bytes; object and buffer allocated in one contiguous malloc call.
- `raw`: anything larger; separate allocations.

Use: cache values, session tokens, counters (`INCR`/`DECR` are atomic).

```
SET visits:home 0
INCR visits:home      # returns 1
INCRBY visits:home 5  # returns 6
```

### List

Ordered sequence, index-based access from either end.

Internal encodings:
- `listpack`: compact flat array for small lists.
- `quicklist`: linked list of listpack nodes, each compressed with LZF.

Use: queues (`LPUSH` / `RPOP`), recent activity feeds, job queues.

### Hash

Field-value pairs stored under one key.

Internal encodings:
- `listpack`: flat array for small hashes.
- `dict`: hash table once the hash grows past the listpack threshold.

Use: object fields, partial updates without serializing the whole object.

```
HSET user:42 name "alice" age 31
HGET user:42 name   # "alice"
HGETALL user:42
```

### Set

Unordered collection of unique strings.

Internal encodings:
- `intset`: sorted integer array for sets of all-integer members below a size limit.
- `dict`: hash table for larger or mixed-type sets.

Use: tag membership, deduplication, set operations (`SUNION`, `SINTER`, `SDIFF`).

### Sorted Set (ZSet)

Each member has a float score. Members are ordered by score.

Internal encodings:
- `listpack`: flat array for small sets.
- `skiplist + dict`: skiplist for ordered range queries, dict for O(1) score lookup by member.

Use: leaderboards, priority queues, range queries by score or rank.

```
ZADD leaderboard 1050.5 "alice"
ZADD leaderboard 980.0  "bob"
ZRANGE leaderboard 0 -1 WITHSCORES REV  # descending rank
```

### Stream

Append-only log of field-value entries with auto-generated IDs (`timestamp-sequence`).

Use: event log, real-time feeds, lightweight message bus for low-throughput workloads. Consumer groups allow multiple workers to read from the same stream without duplicate processing.

```
XADD events * action "click" page "home"
XRANGE events - +   # read all entries
```

### HyperLogLog

Probabilistic cardinality estimator. Standard error ~0.81%. Memory cost: at most 12 KB regardless of input size.

Use: unique visitor counts where exact precision is not required.

```
PFADD visitors:2026-05-21 "user:1" "user:2" "user:3"
PFCOUNT visitors:2026-05-21  # approximate unique count
```

### Bitmap

Bit array layered on top of a String. Each bit is addressed by offset.

Use: feature flags per user, daily activity tracking (bit N = day N), presence tracking at large scale.

```
SETBIT activity:user:42 150 1   # user was active on day 150
GETBIT activity:user:42 150     # returns 1
BITCOUNT activity:user:42       # total active days
```

## Memory model

All data lives in RAM. Redis uses jemalloc for memory allocation.

Every key-value pair is represented internally as an `robj` (Redis object). The encoding stored in that object is chosen automatically to minimize memory:

```
OBJECT ENCODING mykey    # shows current encoding: int, embstr, raw, listpack, ...
MEMORY USAGE mykey       # bytes used by one key (including overhead)
INFO memory              # aggregate stats: used_memory, mem_fragmentation_ratio, etc.
```

Small collections use compact encodings (listpack, intset) and promote to full data structures when they cross configured thresholds:

```
# redis.conf
hash-max-listpack-entries  128
hash-max-listpack-value     64
zset-max-listpack-entries  128
zset-max-listpack-value     64
set-max-intset-entries     512
```

Promotion is one-way. Once a collection promotes to dict or skiplist, it does not compress back down.

## Key expiry

```
EXPIRE key 300          # expire in 300 seconds
EXPIREAT key 1748000000 # expire at a Unix timestamp
TTL key                 # seconds remaining (-1 = no expiry, -2 = already gone)
```

Two mechanisms run in parallel:

- **Lazy expiry**: Redis checks the TTL when a key is accessed. If expired, it deletes the key and returns nil.
- **Active expiry**: a background task runs roughly 10 times per second, sampling a random subset of keys with TTLs and deleting any that have expired.

Expired keys are not freed the instant TTL hits zero. Memory reclamation is eventual. Under heavy expiry load, the active sweep may lag.

## Eviction policies

When `maxmemory` is set and Redis reaches it, an eviction policy determines what to remove on the next write:

| Policy | Evicts from | Algorithm |
| --- | --- | --- |
| `noeviction` | none | returns an error on write |
| `allkeys-lru` | all keys | least recently used |
| `volatile-lru` | keys with TTL | least recently used |
| `allkeys-lfu` | all keys | least frequently used |
| `volatile-lfu` | keys with TTL | least frequently used |
| `allkeys-random` | all keys | random |
| `volatile-random` | keys with TTL | random |
| `volatile-ttl` | keys with TTL | shortest TTL first |

LFU (added in Redis 4.0) outperforms LRU on workloads where access frequency is skewed: a key accessed 10,000 times should survive longer than one accessed once an hour. Most real caches follow a Zipf distribution, so LFU is the better default for general caching.

```
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lfu
```

## Persistence

Redis offers four persistence modes.

### No persistence

Pure cache. Fastest. Data is lost on restart. Use this when Redis is purely a read-through cache and the source of truth is elsewhere.

### RDB (Redis Database Backup)

Point-in-time snapshot. Redis forks the process; the child writes the full dataset to a `.rdb` file using copy-on-write memory pages. The parent continues serving requests.

Trigger manually:

```
BGSAVE
```

Or configure automatic snapshots in `redis.conf`:

```
save 900 1    # snapshot if at least 1 key changed in 900 seconds
save 300 10   # snapshot if at least 10 keys changed in 300 seconds
save 60 10000 # snapshot if at least 10000 keys changed in 60 seconds
```

Trade-off: fast restarts (load one file), but you lose all writes since the last snapshot.

### AOF (Append Only File)

Logs every write command. On restart, Redis replays the log to reconstruct the dataset.

Three fsync policies:

| Policy | Durability | Performance |
| --- | --- | --- |
| `appendfsync always` | every write | slowest |
| `appendfsync everysec` | at most 1 second of data | good balance |
| `appendfsync no` | OS decides (usually a few seconds) | fastest |

Over time the AOF grows large. AOF rewrite compacts it by removing superseded commands (e.g., a key that was set and then deleted disappears entirely from the rewritten log). Redis 7.0 introduced AOF with an embedded RDB preamble: the rewritten file starts with an RDB snapshot and appends only commands since that snapshot.

### RDB + AOF

Use both. RDB for fast restarts; AOF for durability between snapshots. This is the recommended production configuration when data loss is unacceptable.

## Replication

Redis replication is primary-replica and asynchronous.

```
           Primary
          /        \
    Replica-1    Replica-2
```

On connect, a replica sends `PSYNC`. If this is the first sync (or the replica has been gone too long), the primary sends a full RDB snapshot plus any buffered commands. After that, the primary streams new commands as they arrive.

**Partial resync**: if a replica briefly disconnects and reconnects within the replication backlog window, it sends its current offset and the primary sends only the missing commands. No full resync needed.

Replication is async: the primary does not wait for replicas to acknowledge writes. A primary crash can lose the most recent writes if they had not yet replicated.

## Sentinel vs Cluster

### Sentinel

Sentinel is a high-availability layer for a single primary + replica set.

```
 +----------+   +----------+   +----------+
 | Sentinel |   | Sentinel |   | Sentinel |
 +----------+   +----------+   +----------+
         \            |            /
          +------> Primary <------+
                     |
                  Replica
```

Sentinels monitor the primary. If the primary fails, sentinels elect a leader among themselves and promote a replica. Clients query Sentinel to discover the current primary address.

Good fit: HA for a dataset that fits on one node. Single keyspace, no sharding complexity.

### Cluster

Cluster shards data across 16,384 hash slots, spread across multiple nodes.

```
Node A: slots 0     - 5460
Node B: slots 5461  - 10922
Node C: slots 10923 - 16383
```

Each key maps to a slot via `CRC16(key) % 16384`. Each node also holds replicas for the slots it does not own (for failover).

Clients need cluster-aware routing. A request to the wrong node gets a `MOVED` redirect.

Multi-key commands (`MGET`, `MSET`, `SUNIONSTORE`) fail if keys hash to different slots. Force two keys onto the same slot using hash tags:

```
SET {user:42}:session  "..."   # slot = CRC16("user:42") % 16384
SET {user:42}:cart     "..."   # same slot
```

Good fit: datasets too large for one node, or workloads that need horizontal write scaling.

## Why Redis is fast

- **Single-threaded command execution**: no lock contention, no mutex overhead. One goroutine processes commands in order.
- **All data in RAM**: no disk I/O on the read path.
- **I/O multiplexing**: a single thread handles thousands of connections via `epoll` (Linux) or `kqueue` (macOS/BSD). The event loop processes ready events and dispatches commands.
- **Redis 6.0 threaded I/O**: reading from sockets and writing responses is now multithreaded. Command execution remains single-threaded. Network throughput scales across cores; command logic stays lock-free.

## Redis vs alternatives

| Comparison | Redis | Alternative |
| --- | --- | --- |
| vs Memcached | richer data structures, persistence, replication, Lua scripting | Memcached: simpler, multi-threaded, marginally higher raw throughput per core |
| vs relational DB | sub-millisecond latency, TTL, atomic counters | DB: durable by default, full query language, not RAM-bound |
| vs Kafka Streams | lower ops overhead, simpler consumer groups | Kafka: durable log retention, replay across consumer groups, multi-TB scale |

Use Redis for: hot-path reads, session state, rate limit counters, leaderboards, distributed locks, job queues.

Do not use Redis for: large binary blobs (> 100 KB per key), cold storage, data that must survive node failure with zero loss and no AOF.

## Common gotchas

**`KEYS *` in production**: scans the entire keyspace synchronously and blocks the event loop. On a database with millions of keys, this can stall the server for seconds. Use `SCAN` with a cursor instead:

```
SCAN 0 MATCH user:* COUNT 100
```

**Large values**: Redis is not a blob store. Values over 100 KB hurt throughput and increase serialization overhead. Store large payloads in object storage and cache only metadata or small representations.

**AOF rewrite fsync stall**: a large AOF rewrite can cause a brief fsync pause. Monitor `aof_rewrite_in_progress` and `aof_rewrite_scheduled` in `INFO persistence`.

**Cluster multi-key operations**: `MGET`, `MSET`, `SUNIONSTORE`, and similar commands fail if keys land on different slots. Use hash tags to co-locate related keys on the same slot, or break multi-key commands into single-key calls at the application layer.

**Memory fragmentation**: high fragmentation (ratio above 1.5 in `INFO memory`) wastes RAM. Redis 4.0+ supports active defragmentation (`activedefrag yes`).

## References

- [Redis documentation](https://redis.io/docs/)
- [Redis persistence](https://redis.io/docs/management/persistence/)
- [Redis data types](https://redis.io/docs/data-types/)
- Carlson, Josiah L. *Redis in Action*. Manning, 2013.

## Related topics

- [Caching](../): cache strategies, eviction policies, and cache invalidation that Redis implements
- [Databases at Scale](../../databases/): how database buffer pools compare to an explicit Redis cache layer
- [Kafka](../../message-queues/kafka/): when you need durable log replay and Redis Streams are not enough
