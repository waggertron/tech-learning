---
title: Kafka
description: "How Kafka stores data as a distributed commit log: partition segments, log files, page cache, zero-copy I/O, replication, producer batching, and consumer offset management."
parent: message-queues
tags: [system-design, kafka, message-queues, storage]
status: draft
created: 2026-05-21
updated: 2026-05-21
---

Kafka is not a message queue. It is a distributed commit log. Producers append records to a topic. Those records land on disk and stay there. Consumers read at whatever pace they choose, from whatever point in the log they choose. The broker does not care whether a consumer has caught up.

This is the property that sets Kafka apart from RabbitMQ, SQS, and every traditional queue: messages are not deleted after consumption. The log is the source of truth.

## Architecture overview

**Broker**: a single Kafka server. A cluster is typically 3-9 brokers.

**Topic**: a named stream of records. Topics are split into partitions for parallelism.

**Partition**: an ordered, append-only sequence of records. Records within a partition are assigned monotonically increasing offsets starting at 0.

**Offset**: a 64-bit integer that identifies a record's position within a partition. Consumers track where they are by storing an offset.

**Consumer group**: a set of consumers that collectively read a topic. Each partition is assigned to exactly one member of the group at a time.

```
Producers                Topics (3 partitions)       Consumer Groups

[Producer A] ----+-----> Partition 0 [B0: 0..99] ---> [Group X: Consumer 1]
                 |
[Producer B] ----+-----> Partition 1 [B1: 0..99] ---> [Group X: Consumer 2]
                 |
[Producer C] -------->   Partition 2 [B2: 0..99] ---> [Group X: Consumer 3]
                                                 \
                                                  ---> [Group Y: Consumer 1]
                                                  ---> [Group Y: Consumer 2]
                                                  ---> [Group Y: Consumer 3]

Group X and Group Y each receive every record independently.
```

## Storage mechanics

This is where Kafka diverges most sharply from other brokers. Understanding the on-disk layout explains every performance characteristic.

### Partition directory structure

Each partition is a directory on the broker's disk. Inside that directory are segment files:

```
/kafka-data/topics/orders-0/
    00000000000000000000.log        <- records, segment starting at offset 0
    00000000000000000000.index      <- sparse offset -> byte position index
    00000000000000000000.timeindex  <- sparse offset -> timestamp index
    00000000000000512345.log        <- next segment, starts at offset 512345
    00000000000000512345.index
    00000000000000512345.timeindex
    leader-epoch-checkpoint
```

**`.log` file**: the actual records. Each entry has a fixed-size header (offset, timestamp, key length, value length) followed by the key and value bytes. Records are appended in arrival order. The file is never modified after writing.

**`.index` file**: a sparse index mapping offsets to byte positions in the `.log` file. Not every offset has an entry; the index skips entries to stay small. To find offset N, Kafka binary-searches the index for the largest entry at or below N, then scans forward in the `.log` file.

**`.timeindex` file**: maps timestamps to offsets. Used for time-based seeks (e.g., "give me records from the last hour").

### Segments

A partition is not a single file. It is a series of segment files. The segment at the end (the "active segment") accepts new records. Once a segment reaches a size threshold (`log.segment.bytes`, default 1 GB) or age threshold, it is closed. Closed segments are immutable.

Retention and compaction operate on whole segments, not individual records. Kafka can delete or compact a closed segment atomically.

### Record format inside a `.log` file

Each record batch in the `.log` file has a fixed structure:

```
Record Batch:
  baseOffset          (8 bytes)  <- offset of first record in batch
  batchLength         (4 bytes)  <- byte length of everything that follows
  partitionLeaderEpoch(4 bytes)
  magic               (1 byte)   <- format version (currently 2)
  crc                 (4 bytes)
  attributes          (2 bytes)  <- compression codec, timestamp type, transactional
  lastOffsetDelta     (4 bytes)
  baseTimestamp       (8 bytes)
  maxTimestamp        (8 bytes)
  producerId          (8 bytes)  <- for idempotent/transactional producers
  producerEpoch       (2 bytes)
  baseSequence        (4 bytes)
  records[]           (variable) <- one or more records

Each Record:
  length              (varint)
  attributes          (1 byte)
  timestampDelta      (varint)
  offsetDelta         (varint)
  keyLength           (varint)
  key                 (bytes)
  valueLen            (varint)
  value               (bytes)
  headers[]           (key-value pairs)
```

The batch-level header holds compression attributes. If compression is enabled, the `records[]` section is a compressed blob. The broker stores the compressed batch as-is; it does not decompress on write or on forwarding to consumers.

### Sequential writes

Kafka only appends. It never seeks backward to modify a record. On spinning disks, sequential writes saturate bandwidth (100-200 MB/s) while random writes saturate IOPS (100-200 ops/s). On SSDs, the gap is smaller but still meaningful for sustained throughput.

This is why Kafka achieves high throughput on commodity hardware with spinning disks.

### Page cache

Kafka does not manage its own memory buffer. It writes to the OS page cache. The OS decides when to flush pages to disk.

Consumers often read data that was just written. Because the data is still in the page cache, Kafka can serve consumer reads directly from RAM without any disk I/O. A consumer reading data written seconds ago never touches the disk at all.

This also means Kafka's heap requirements are small. The OS page cache is the real buffer.

### Zero-copy transfer

When a consumer requests records, Kafka needs to read bytes from the `.log` file and write them to a network socket. Normally this involves four copies: disk to kernel buffer, kernel buffer to userspace, userspace to kernel socket buffer, kernel socket buffer to NIC.

Kafka uses the `sendfile(2)` syscall instead. This transfers bytes directly from the page cache to the network socket, skipping userspace entirely. Two copies instead of four, and no context switches for the data path.

### Log retention

Kafka retains records by time or by total size:

- `log.retention.hours`: default 168 (7 days). Records older than this are eligible for deletion.
- `log.retention.bytes`: maximum total size per partition. When exceeded, old segments are deleted.

Deletion is coarse: Kafka deletes whole closed segments, not individual records. A record just inside a segment that also contains newer records survives until the entire segment is eligible.

### Log compaction

Compaction is an alternative to time-based deletion. Instead of deleting old segments wholesale, Kafka keeps only the latest record per key. Earlier values for the same key are removed.

Before compaction:

```
offset: 0    key=user:42  value={"name":"Alice","city":"NY"}
offset: 1    key=user:99  value={"name":"Bob","city":"LA"}
offset: 2    key=user:42  value={"name":"Alice","city":"SF"}   <- newer
offset: 3    key=user:99  value={"name":"Bob","city":"Chicago"} <- newer
offset: 4    key=user:42  value=null                           <- tombstone (delete)
```

After compaction:

```
offset: 3    key=user:99  value={"name":"Bob","city":"Chicago"}
(user:42 removed; tombstone triggers deletion of all prior entries for that key)
```

Compaction is used for changelog topics: Kafka Streams state stores, CDC topics, and any topic where a record represents the current state of an entity rather than an event that happened.

## Replication

Each partition is replicated across multiple brokers.

**Leader**: the broker that handles all reads and writes for a partition.

**Follower**: a replica that fetches records from the leader and keeps a copy.

**ISR (In-Sync Replicas)**: the subset of replicas that are caught up to the leader within a configurable lag window (`replica.lag.time.max.ms`). A follower that falls too far behind is removed from the ISR.

```
Partition 0 replicated across 3 brokers (replication factor = 3):

Broker 1 [Leader]   <--- Follower fetch --- Broker 2 [Follower, in ISR]
                    <--- Follower fetch --- Broker 3 [Follower, in ISR]

ISR = {Broker1, Broker2, Broker3}
```

If the leader dies, Kafka's controller elects a new leader from the ISR. Because every ISR member has all committed records, no data loss occurs.

### Write flow with replication

The sequence for a producer write with `acks=all`:

```
Producer
  |
  | 1. Send batch to partition leader
  v
Broker 1 [Leader, Partition 0]
  |  writes batch to local .log file
  |
  | 2. Followers fetch from leader (pull, not push)
  +-------> Broker 2 [Follower]  writes batch locally
  +-------> Broker 3 [Follower]  writes batch locally
  |
  | 3. Followers send fetch response (implicit ack)
  | 4. Leader advances High Watermark once all ISR have fetched
  |
  v
Producer receives success ack

Consumers can only read up to the High Watermark.
Records written but not yet replicated to all ISR are not visible to consumers.
```

The High Watermark (HW) is the offset of the last record fully replicated to all ISR members. Consumers never read past it. This prevents a consumer from reading a record that could be lost if the leader fails before replication completes.

**Unclean leader election** (`unclean.leader.election.enable`): if set to `true`, Kafka may elect a replica outside the ISR as leader when no ISR member is available. This restores availability at the cost of losing records that were committed to the old leader but not replicated. Default is `false` for most configurations.

## Producers

### Batching

Producers accumulate records in a per-partition buffer before sending. A batch is flushed when `batch.size` bytes accumulate or `linger.ms` milliseconds pass. Larger batches improve throughput. Higher `linger.ms` values trade latency for throughput.

### Compression

Compression is applied at the batch level, not the record level. Options: `none`, `gzip`, `snappy`, `lz4`, `zstd`. `lz4` is a common default: fast compression and decompression, reasonable ratio. Compressed batches are stored as-is on disk and sent as-is to consumers. Decompression happens in the consumer, not the broker.

### Acknowledgment modes

| `acks` value | Behavior | Durability | Latency |
| --- | --- | --- | --- |
| `0` | Producer does not wait for any ack (fire and forget) | Lowest | Lowest |
| `1` | Leader writes to its local log and responds | Moderate | Moderate |
| `all` / `-1` | Leader waits for all ISR replicas to acknowledge | Highest | Highest |

`acks=all` with `min.insync.replicas=2` is the standard durable configuration. The producer waits until at least two ISR replicas have the record before receiving a success response.

### Idempotent producer

With `enable.idempotence=true`, the producer assigns each record a sequence number. If a batch is sent twice due to a retry, the broker deduplicates using the sequence number. Exactly-once delivery per producer session per partition, with no application-level effort.

### Producer configuration example

```python
from confluent_kafka import Producer

p = Producer({
    'bootstrap.servers': 'broker1:9092,broker2:9092,broker3:9092',
    'acks': 'all',                  # wait for all ISR replicas
    'enable.idempotence': True,     # sequence numbers, retries safe
    'compression.type': 'lz4',     # batch-level compression
    'linger.ms': 5,                 # wait up to 5ms to fill a batch
    'batch.size': 65536,            # 64 KB batch ceiling
    'retries': 5,
    'retry.backoff.ms': 100,
})

def delivery_report(err, msg):
    if err:
        print(f"Delivery failed: {err}")
    else:
        print(f"Delivered to {msg.topic()} [{msg.partition()}] @ offset {msg.offset()}")

for i in range(1000):
    p.produce(
        topic='orders',
        key=str(i % 10),           # key controls partition assignment
        value=f'{{"order_id": {i}}}',
        callback=delivery_report,
    )
    p.poll(0)                       # trigger callbacks without blocking

p.flush()                           # block until all in-flight messages delivered
```

`p.poll(0)` triggers delivery callbacks without blocking. `p.flush()` at the end of a batch drains the internal buffer and blocks until all messages have either been delivered or failed.

## Consumers

### Consumer groups and partition assignment

Parallelism is bounded by partition count. If a topic has 6 partitions and a consumer group has 4 members, two consumers each handle two partitions and two handle one. If a seventh consumer joins, it sits idle. To increase parallelism, increase partition count at topic creation (or repartition, which is disruptive).

```
Topic: orders (6 partitions)

Consumer Group (4 members):
  Consumer 1: Partition 0, Partition 1
  Consumer 2: Partition 2, Partition 3
  Consumer 3: Partition 4
  Consumer 4: Partition 5
  (no partition for a 5th consumer if one were added)
```

### Offset management

Consumers commit their current offset to a special internal topic: `__consumer_offsets`. Kafka stores the committed offset per (group, topic, partition) tuple. When a consumer restarts or a rebalance occurs, the new consumer assignment reads from the last committed offset.

`auto.offset.reset` controls behavior for a new group (or one whose offsets expired):

- `earliest`: start from the beginning of the partition.
- `latest`: start from the current end. All historical records are skipped.

New consumer groups default to `latest`. This is a common source of confusion: a new group deployed against an existing topic sees no historical messages.

### Delivery semantics

**At-most-once**: commit offset before processing. If the consumer crashes after committing but before processing, the record is lost.

**At-least-once**: process record, then commit offset. If the consumer crashes after processing but before committing, the record is reprocessed on restart. This is the default for most Kafka consumers. Requires idempotent processing logic.

**Exactly-once**: Kafka's transactional API coordinates offset commits and output writes in a single atomic transaction. Used in Kafka Streams and in producers that write to Kafka as their output. Has nontrivial performance overhead. Most production systems prefer at-least-once with idempotent consumers.

### Replay

Because offsets are just pointers into an immutable log, a consumer can seek to any offset and reread records. This is the feature that makes Kafka suitable for event sourcing, auditing, and backfilling downstream systems. A traditional queue destroys messages after delivery; Kafka does not.

```python
from confluent_kafka import Consumer

c = Consumer({
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'replay-group',
    'auto.offset.reset': 'earliest',
})
c.subscribe(['orders'])

# Or seek to a specific offset
from confluent_kafka import TopicPartition
tp = TopicPartition('orders', partition=0, offset=12345)
c.assign([tp])
c.seek(tp)

while True:
    msg = c.poll(1.0)
    if msg is None:
        break
    print(f"offset={msg.offset()} value={msg.value()}")
c.close()
```

## KRaft vs ZooKeeper

Prior to Kafka 2.8, cluster metadata (broker registrations, topic configs, partition leaders) lived in ZooKeeper. This created an operational burden: a separate ZooKeeper ensemble, separate failure modes, and a ZooKeeper bottleneck for controller operations.

KIP-500 introduced KRaft (Kafka Raft): a quorum of Kafka brokers stores metadata in a replicated log inside Kafka itself. The KRaft controller is elected via a Raft consensus algorithm, the same way any other distributed log would elect a leader.

KRaft became the default in Kafka 3.3. ZooKeeper mode is deprecated and removed in Kafka 4.0. New deployments should use KRaft.

## When to use Kafka vs alternatives

**Use Kafka when:**
- You need event replay (re-run a pipeline against historical data, backfill a new downstream system).
- You need an audit log (immutable record of what happened and when).
- You are doing CDC (change data capture): stream database changes to other systems.
- You have high-throughput pipelines and many independent consumers.
- Fan-out is important: multiple services each need the full stream.

**Use RabbitMQ or SQS when:**
- Each job should be consumed exactly once by one worker (task queue pattern).
- No replay is needed.
- Volume is modest (millions of messages per day, not per second).
- You need per-message routing by type or content.

**Do not use Kafka as a database.** The log is not indexed by arbitrary fields. Compaction retains only the latest value per key, with no transactional reads. Kafka is an excellent transport layer; it is a poor query layer.

## Common gotchas

**Partition count is permanent (mostly).** You can increase partitions but not decrease them without deleting and recreating the topic. Key-based routing breaks when partition count changes because `hash(key) % partitions` produces different results. Choose partition count at creation based on expected peak consumer parallelism.

**More partitions have real costs.** Each partition is a directory with open file handles, replication traffic, and controller state. A cluster with 10,000 partitions behaves differently than one with 100. Do not set partition count to 100 by default.

**Consumer lag is the health metric.** Throughput can look fine while a consumer group falls further behind. Monitor `kafka.consumer:type=consumer-fetch-manager-metrics,name=records-lag-max` per group per partition.

**Default retention is 7 days.** If a consumer group is down for more than 7 days, its unread records are deleted. Adjust `log.retention.hours` for topics that need longer replay windows.

**`auto.offset.reset=latest` swallows history.** A new consumer group deployed against an active topic with this setting (the default) sees only records written after it started. If you need historical data, set `auto.offset.reset=earliest` before the first poll.

**Retention set to 0 deletes data immediately.** This is a valid configuration for topics used as pure message-passing channels, but it is sometimes set accidentally during cleanup and silently discards all data.

## References

- [Kafka documentation](https://kafka.apache.org/documentation/)
- [Kafka: The Definitive Guide (Shapira, Palino, Sivaram, Petty)](https://www.oreilly.com/library/view/kafka-the-definitive/9781492043072/)
- [The Log: What every software engineer should know about real-time data's unifying abstraction (Jay Kreps, LinkedIn Engineering)](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)

## Related topics

- [Message Queues](../): queue vs pub/sub patterns, RabbitMQ comparison, delivery guarantees
- [Databases at Scale](../../databases/): Kafka as a CDC layer feeding downstream databases
- [Event Sourcing](../../event-sourcing/): Kafka's immutable log maps directly to the event sourcing pattern
- [Caching](../../caching/): consumers often write Kafka records into a cache layer for low-latency reads
