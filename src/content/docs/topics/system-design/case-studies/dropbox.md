---
title: "Case Study: Dropbox"
description: "Full system design walkthrough for Dropbox: chunked uploads, block deduplication via content-addressable storage (SHA-256), delta sync, and the metadata service vs block store split that enables 64 PB at scale."
parent: case-studies
tags: [system-design, case-studies, interviews]
status: draft
created: 2026-05-21
updated: 2026-05-21
---

Dropbox looks like a file storage problem but is really a deduplication problem. The key insight: by splitting every file into fixed-size blocks and using the SHA-256 hash of each block as its storage key (content-addressable storage), two users uploading identical files share the same blocks in S3. Storage consumption is proportional to unique content, not to the number of copies. At 500M users, this difference is the margin between a viable business and bankruptcy.

## Series concepts

### Introduced here

- **Chunked upload with content-addressable storage:** files split into 4 MB blocks; each block's S3 key is `SHA-256(block_bytes)`. Two identical blocks, regardless of who uploaded them, occupy one slot in S3. Enables deduplication, resumable uploads, and delta sync simultaneously.
- **Delta sync:** the client maintains a local block index. On file edit, only the changed blocks are uploaded. A 100 MB file with a 4 MB edit uploads 4 MB, not 100 MB.
- **Metadata service vs block store split:** two separate systems with separate scaling profiles. The metadata service is ACID (PostgreSQL, sharded by user_id); the block store is eventually consistent (S3). Neither is a substitute for the other.

### Carried forward from prior entries

- **ID generation ([Bitly](./bitly/)):** block IDs are SHA-256 hashes (content-derived, not Snowflake), but file IDs and version IDs use Snowflake-style generation.
- **Kafka:** upload completion events publish to Kafka; consumers notify connected devices of new versions to sync.
- **Redis:** upload session state (which blocks have been confirmed uploaded for an in-progress session) is tracked in Redis.

## Clarifying questions

Ask these before drawing anything:

- **Scale**: how many users? How many DAU? Average file size?
- **File types**: any restrictions (executables, archives)?
- **Versioning**: how many versions per file? How long are old versions retained?
- **Sharing**: can users share files or folders with other users?
- **Collaboration**: do multiple users edit the same file simultaneously?
- **Mobile clients**: are there mobile apps with background sync?

What the answers reveal:

- Large average file size (video vs documents) changes the block size and dedup ratio
- Versioning depth drives metadata storage growth
- Sharing means access control must be enforced at the metadata layer, not just S3
- Simultaneous edits require a conflict resolution policy
- Mobile sync must handle intermittent connectivity: resumable uploads are mandatory

For this walkthrough: 500M users, 50M DAU, avg file 500 KB, 180-day version retention, sharing supported, last-write-wins conflict resolution.

## Estimation

```
Upload QPS:
  50M DAU * 2 uploads/day = 100M uploads/day
  100M / 86,400 = 1,157 uploads/sec
  Peak (3x): ~3,500 uploads/sec

Raw storage ingested per day:
  100M uploads * 500 KB avg = 50 TB/day raw

After deduplication (30% dedup rate assumed):
  50 TB * 0.70 = 35 TB/day net new blocks in S3

5-year storage:
  35 TB/day * 365 * 5 = ~64 PB

Metadata:
  100M file records/day * 200 bytes = 20 GB/day metadata
  5 years: ~36 TB metadata (fits in sharded PostgreSQL)

Block store:
  50 TB/day raw * 30 dedup = 35 TB/day unique blocks
  Average block: 4 MB -> ~8.75M new blocks/day
  At 32 bytes per block record: ~280 MB/day block index growth
```

**Conclusion**: block storage (64 PB) requires S3 or equivalent object storage -- no on-premises solution is cost-competitive. Metadata (36 TB) fits in a sharded relational database. The two systems scale independently.

## High-level design

```mermaid
flowchart TD
    Client -->|1. chunk + hash| ClientLib[Client Library]
    ClientLib -->|2. which blocks are new?| MetaSvc[Metadata Service]
    MetaSvc -->|3. missing block IDs| ClientLib
    ClientLib -->|4. upload missing blocks| S3[(Block Store\nS3)]
    ClientLib -->|5. confirm upload| MetaSvc
    MetaSvc -->|6. write file version| PG[(PostgreSQL\nMetadata DB)]
    MetaSvc -->|7. publish event| Kafka[Kafka: file.updated]
    Kafka -->|8. delta notification| SyncSvc[Sync Service]
    SyncSvc -->|9. push via WebSocket| OtherDevices[Other Devices]
    OtherDevices -->|10. fetch changed blocks| S3
```

Core endpoints:

```
POST /upload/init
  body:    { filename, size, block_hashes: string[] }
  returns: { upload_id, missing_blocks: string[] }

PUT /upload/{upload_id}/block/{block_hash}
  body:    raw block bytes
  returns: { block_hash, stored: true }

POST /upload/{upload_id}/complete
  body:    { block_hashes: string[], parent_version_id?: string }
  returns: { file_id, version_id, created_at }

GET /files/{file_id}/versions
  returns: [ { version_id, created_at, block_hashes, size } ]

GET /blocks/{block_hash}
  returns: block bytes (served from S3 or CDN)
```

## Deep dive: block chunking and deduplication

The client splits every file into 4 MB fixed-size blocks (last block may be smaller). For each block, it computes `block_id = SHA-256(block_bytes)`. The SHA-256 hash serves as both a globally unique identifier and a data integrity check.

```python
import hashlib
from pathlib import Path

BLOCK_SIZE = 4 * 1024 * 1024  # 4 MB

def chunk_file(filepath: str) -> list[tuple[str, bytes]]:
    """Returns list of (block_hash, block_bytes) tuples."""
    blocks = []
    with open(filepath, 'rb') as f:
        while True:
            data = f.read(BLOCK_SIZE)
            if not data:
                break
            block_hash = hashlib.sha256(data).hexdigest()
            blocks.append((block_hash, data))
    return blocks

def upload_file(filepath: str, metadata_client, s3_client):
    blocks = chunk_file(filepath)
    block_hashes = [h for h, _ in blocks]

    # ask metadata service which blocks it has never seen
    resp = metadata_client.post('/upload/init', {
        'filename': Path(filepath).name,
        'size': Path(filepath).stat().st_size,
        'block_hashes': block_hashes,
    })
    upload_id = resp['upload_id']
    missing = set(resp['missing_blocks'])

    # upload only the blocks the server does not already have
    for block_hash, block_bytes in blocks:
        if block_hash in missing:
            s3_client.put_object(
                Bucket='dropbox-blocks',
                Key=block_hash,    # content-addressable: key IS the hash
                Body=block_bytes,
            )
            metadata_client.put(f'/upload/{upload_id}/block/{block_hash}')

    return metadata_client.post(f'/upload/{upload_id}/complete', {
        'block_hashes': block_hashes,
    })
```

When two users upload the same file, the second user's `/upload/init` call receives `missing_blocks: []` because all block hashes already exist. The second upload costs zero bytes of S3 storage and completes in milliseconds.

## Deep dive: sync protocol and delta sync

The sync service maintains a persistent connection (WebSocket or long-poll) to each active client. When a file changes, only the diff (changed blocks) is transmitted.

```python
import json
import websockets
import asyncio

class SyncClient:
    def __init__(self, user_id: str, device_id: str):
        self.user_id = user_id
        self.device_id = device_id
        self.local_index: dict[str, list[str]] = {}  # file_id -> [block_hashes]

    async def listen(self, ws_url: str):
        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({
                'type': 'auth',
                'user_id': self.user_id,
                'device_id': self.device_id,
            }))
            async for message in ws:
                event = json.loads(message)
                if event['type'] == 'file.updated':
                    await self.handle_file_update(event)

    async def handle_file_update(self, event: dict):
        file_id = event['file_id']
        new_hashes = event['block_hashes']
        old_hashes = self.local_index.get(file_id, [])

        # compute which blocks we don't have locally
        old_set = set(old_hashes)
        missing = [h for h in new_hashes if h not in old_set]

        # download only missing blocks
        for block_hash in missing:
            block_bytes = await fetch_block(block_hash)
            write_block_to_disk(block_hash, block_bytes)

        # reassemble file from blocks (in order)
        reassemble_file(file_id, new_hashes)
        self.local_index[file_id] = new_hashes
```

On the server side, Kafka carries the delta event:

```python
from kafka import KafkaConsumer, KafkaProducer

# When a file version is confirmed, publish delta
def publish_file_updated(file_id: str, user_id: str, block_hashes: list[str]):
    producer.send('file.updated', {
        'file_id': file_id,
        'user_id': user_id,
        'block_hashes': block_hashes,
        'timestamp': now_iso(),
    })

# Sync service consumes and pushes to connected WebSockets
consumer = KafkaConsumer('file.updated', group_id='sync-delivery')
for msg in consumer:
    event = json.loads(msg.value)
    user_id = event['user_id']
    # look up which WebSocket connections belong to this user
    connections = connection_registry.get_connections(user_id)
    for conn in connections:
        conn.send(event)
```

## Deep dive: metadata service

The metadata service is the system's consistency anchor. File versions must be atomic: a reader either sees all blocks of a version or none.

```python
# PostgreSQL schema (simplified)
CREATE TABLE files (
    file_id       BIGINT PRIMARY KEY,   -- Snowflake ID
    owner_id      BIGINT NOT NULL,      -- sharding key
    name          TEXT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL,
    deleted_at    TIMESTAMPTZ           -- soft delete
);

CREATE TABLE file_versions (
    version_id    BIGINT PRIMARY KEY,   -- Snowflake ID
    file_id       BIGINT NOT NULL REFERENCES files(file_id),
    block_hashes  TEXT[] NOT NULL,      -- ordered array of SHA-256 hashes
    size_bytes    BIGINT NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL
);

CREATE INDEX ON file_versions (file_id, created_at DESC);
```

Sharding by `owner_id` keeps all files for a user on the same shard. Cross-user queries (shared folders) require a lookup in a separate sharing table, but single-user operations never cross shard boundaries.

```python
def get_latest_version(file_id: int, user_id: int) -> dict | None:
    shard = shard_for_user(user_id)
    row = shard.query_one("""
        SELECT v.version_id, v.block_hashes, v.size_bytes, v.created_at
        FROM file_versions v
        JOIN files f ON f.file_id = v.file_id
        WHERE v.file_id = %s AND f.owner_id = %s
        ORDER BY v.created_at DESC
        LIMIT 1
    """, file_id, user_id)
    return dict(row) if row else None
```

## Deep dive: conflict resolution

Dropbox uses last-write-wins with a conflicted copy rather than operational transforms. This is simpler to implement and correct to reason about, at the cost of occasionally surprising users.

```python
def resolve_conflict(
    file_id: str,
    incoming_version: dict,
    current_version: dict,
    user_display_name: str,
) -> str:
    """
    If the incoming version's parent does not match the current version,
    a concurrent edit occurred. Create a conflicted copy rather than
    silently overwriting.
    """
    if incoming_version['parent_version_id'] != current_version['version_id']:
        # concurrent edit detected: save as a new file with "(conflicted copy)" suffix
        conflict_name = (
            f"{file_id}_conflicted_copy_{user_display_name}_{now_iso()}"
        )
        create_new_file(conflict_name, incoming_version['block_hashes'])
        return 'conflict_copy_created'

    # no conflict: apply the new version normally
    apply_version(file_id, incoming_version)
    return 'applied'
```

The user sees both the current file and their conflicted copy in the folder. They must manually reconcile. Simpler systems (Google Docs) use operational transforms for true real-time collaboration, but that is a much harder problem and not what Dropbox is optimized for.

## Failure modes

**S3 upload failure mid-file**: because uploads are block-by-block, a failure leaves some blocks in S3 and some missing. The upload session (tracked in Redis) records which blocks were confirmed. On retry, the client re-calls `/upload/init`, which reports only the still-missing blocks. Resumable uploads are free with content-addressable storage.

**Metadata DB shard outage**: users on the affected shard cannot read or write files. S3 is unaffected. Mitigate with hot standby replicas and automatic failover (Patroni for PostgreSQL).

**Block store corruption**: SHA-256 is used as both the key and the integrity check. On download, recompute `SHA-256(block_bytes)` and compare to the key. If they differ, the block is corrupt: retry from a different S3 region or replica.

**Sync storm on reconnect**: a device offline for a week reconnects and requests all delta events it missed. If many devices reconnect simultaneously (Monday morning), the sync service faces a thundering herd. Mitigate with jittered reconnect backoff and a dedicated catch-up path that reads directly from the database rather than replaying Kafka.

**Dedup ratio degradation**: encrypted or compressed files cannot be deduplicated because their blocks are unique even for identical source content. If users encrypt before uploading (common for sensitive documents), dedup ratios fall toward zero. This is a business model consideration, not purely a technical one.

## Key takeaways

**Content-addressable storage is the core insight.** Using `SHA-256(block_bytes)` as both the S3 key and the block identifier makes deduplication, integrity verification, and resumable uploads fall out naturally from a single design decision.

**Separate metadata from block storage.** Metadata needs ACID guarantees (file versions must be atomic); block storage needs scale and durability (S3). Neither system is a substitute for the other. Interview answers that use a single database for both will have scaling problems they cannot explain.

**Delta sync is only possible because of block chunking.** A system that stores files as single opaque blobs must re-upload the entire file on any change. Block chunking makes the diff explicit: the client uploads only the blocks whose hashes changed.

**The metadata service is the consistency boundary.** Even though blocks live in eventually-consistent S3, a user never sees a partial file version because the metadata service atomically commits the complete block_hashes array. Read the metadata first, then fetch the blocks.

**Conflict resolution should match user expectations, not theoretical elegance.** Operational transforms are correct but complex. Last-write-wins with a conflicted copy is simple, auditable, and keeps the user in control of the final state.

## References

- [Dropbox Tech Blog: Scaling to exabytes](https://dropbox.tech/infrastructure/magic-pocket-infrastructure)
- [Dropbox Tech Blog: How we optimized Magic Pocket for cold storage](https://dropbox.tech/infrastructure/optimizing-magic-pocket-cold-storage)
- [System Design Interview Vol 2, Alex Xu, Chapter 9](https://bytebytego.com/)
- [AWS S3: content-addressable storage patterns](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)

## Related topics

- [Bitly case study](./bitly/), introduces ID generation and Kafka patterns used here
- [Ticketmaster case study](./ticketmaster/), carries forward Redis and Kafka
- [Databases](../databases/), PostgreSQL sharding strategies for the metadata service
- [Message Queues](../message-queues/), Kafka for sync event delivery
- [Caching](../caching/), Redis for upload session state
- [Scalability](../scalability/), sharding and replication for 64 PB at scale
