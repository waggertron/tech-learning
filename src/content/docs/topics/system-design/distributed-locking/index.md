---
title: Distributed Locking
description: "How to coordinate exclusive access to a shared resource across multiple servers: Redis SETNX, Redlock, ZooKeeper ephemeral nodes, fencing tokens, and the critical distinction between efficiency locks and correctness locks."
parent: system-design
tags: [system-design, distributed-locking, redis, zookeeper]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

A distributed lock prevents multiple processes across different servers from simultaneously accessing a shared resource. The need arises constantly: only one worker should process a given job, only one instance should run a scheduled task, only one request should update a record while holding the lock.

The hard part: in a distributed system, clocks are skewed, networks are unreliable, and processes can pause at any moment (garbage collection, OS scheduling). A lock that appears held might have been released due to a timeout before the holder has finished its work.

## The core problem

A mutex (mutual exclusion lock) in a single process is straightforward -- it uses shared memory and the OS scheduler. A distributed lock must work across processes on different machines with no shared memory. The lock state lives in an external system.

Requirements for a correct distributed lock:
1. **Mutual exclusion**: only one client holds the lock at a time
2. **Deadlock-free**: if a lock holder crashes, the lock must eventually be released (TTL-based expiry)
3. **Fault tolerance**: the locking service itself must not be a single point of failure

## Redis SETNX: the simplest approach

`SETNX` (SET if Not eXists) atomically sets a key only if it does not already exist:

```python
import redis
import uuid
import time

r = redis.Redis()

def acquire_lock(resource: str, ttl_seconds: int = 30) -> str | None:
    lock_id = str(uuid.uuid4())  # unique token for this acquisition
    acquired = r.set(
        f"lock:{resource}",
        lock_id,
        nx=True,         # only set if key does not exist
        ex=ttl_seconds   # auto-expire to prevent deadlock
    )
    return lock_id if acquired else None

def release_lock(resource: str, lock_id: str) -> bool:
    # CRITICAL: only release if we still own the lock
    # Use Lua script for atomicity (check + delete must be atomic)
    script = """
    if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
    else
        return 0
    end
    """
    result = r.eval(script, 1, f"lock:{resource}", lock_id)
    return bool(result)

# Usage
lock_id = acquire_lock("order:42", ttl_seconds=30)
if lock_id:
    try:
        process_order("42")
    finally:
        release_lock("order:42", lock_id)
else:
    # Lock is held by another process
    raise LockNotAvailableError("order:42 is locked")
```

**Why the Lua script for release**: if you do GET, check it is your lock, then DEL -- another process could acquire the lock between your GET and DEL. The Lua script runs atomically on the Redis server, making the check-and-delete a single operation.

**Why store a unique lock_id**: if your TTL expires while you are still processing, another process acquires the lock. When you finish and try to release, you must verify the lock still belongs to you. Without the unique token, you would release a lock you no longer own.

## The TTL expiry problem

TTL-based expiry solves deadlocks (crashed processes do not hold locks forever) but introduces a new hazard: **lock expiry while the holder is still working**.

```
t=0:  Process A acquires lock, TTL=30s
t=25: Process A pauses (long GC, slow OS scheduler)
t=30: Lock TTL expires
t=31: Process B acquires the lock
t=32: Process A resumes, still thinks it holds the lock
      Both A and B are now "holding" the lock simultaneously
```

This is not hypothetical. A Java GC pause can last 5-30 seconds. An OS scheduling delay can pause a process for seconds. The lock holder cannot guarantee it will complete before the TTL expires.

**For efficiency locks** (where the occasional concurrent access causes a minor problem -- duplicate notification, double send of a non-critical message), this is acceptable.

**For correctness locks** (where concurrent access causes data corruption, double billing, or safety violations), this is not acceptable. See the fencing token section below.

## Redlock: multi-node Redis locking

To survive a single Redis node failure, Martin Kleppmann and others proposed using multiple Redis nodes. Redlock acquires the lock on a majority of N independent Redis nodes (typically N=5):

```python
import time
import uuid

REDIS_NODES = [redis.Redis(host=f"redis-{i}") for i in range(5)]
QUORUM = len(REDIS_NODES) // 2 + 1  # 3 out of 5

def acquire_redlock(resource: str, ttl_ms: int = 30_000) -> tuple[str, int] | None:
    lock_id = str(uuid.uuid4())
    start = time.time_ns() // 1_000_000  # milliseconds

    acquired_count = 0
    for node in REDIS_NODES:
        try:
            if node.set(f"lock:{resource}", lock_id, nx=True, px=ttl_ms):
                acquired_count += 1
        except Exception:
            pass  # node is down; continue

    elapsed = (time.time_ns() // 1_000_000) - start
    remaining_ttl = ttl_ms - elapsed

    if acquired_count >= QUORUM and remaining_ttl > 0:
        return (lock_id, remaining_ttl)

    # Did not get quorum -- release whatever we acquired
    for node in REDIS_NODES:
        try:
            node.eval(RELEASE_SCRIPT, 1, f"lock:{resource}", lock_id)
        except Exception:
            pass
    return None
```

**Kleppmann's critique of Redlock**: even with 5 nodes, Redlock does not provide strong safety for correctness locks. If a process pauses after acquiring Redlock (GC, OS scheduling) and its TTL expires, another process can acquire the lock -- and both may proceed concurrently. The multi-node approach protects against node failure but not against clock skew and process pauses.

**When Redlock is appropriate**: efficiency locks where the failure mode is "occasionally two processes do the same thing" (tolerable) rather than "occasionally two processes corrupt shared data" (not tolerable).

## ZooKeeper ephemeral nodes: stronger guarantees

ZooKeeper provides a stronger distributed locking primitive through **ephemeral sequential nodes**:

1. Each client creates an ephemeral sequential znode under a lock path: `/locks/my_lock-0000000001`, `/locks/my_lock-0000000002`, etc.
2. The client with the lowest sequence number holds the lock.
3. Each other client watches the node with the next-lower sequence number (not all nodes -- avoids herd effect).
4. When the watched node is deleted (lock released or client session expired), the watcher's client checks if it now has the lowest number and acquires the lock.

```
ZooKeeper znodes:
  /locks/order-42-lock-0000000001  (Client A: holds lock)
  /locks/order-42-lock-0000000002  (Client B: watches 0000000001)
  /locks/order-42-lock-0000000003  (Client C: watches 0000000002)

Client A finishes, deletes its znode:
  /locks/order-42-lock-0000000002  (Client B: now lowest, acquires lock)
  /locks/order-42-lock-0000000003  (Client C: watches 0000000002)
```

**Ephemeral znodes** are automatically deleted when the client's session expires (due to network partition or crash). This eliminates the need for a manual TTL -- ZooKeeper's session management handles expiry.

**ZooKeeper guarantees**: total ordering of operations, linearizable reads (with `SYNC`), and session-based liveness. These are stronger than Redis's best-effort semantics. This is why distributed systems that require correctness locks (distributed job schedulers, leader election in Kafka, Hadoop NameNode HA) use ZooKeeper.

## Fencing tokens: the correct approach for critical locks

For correctness locks, neither Redis SETNX nor Redlock is sufficient on its own. The solution is a **fencing token**: a monotonically increasing number issued by the lock service when the lock is granted. The protected resource rejects any request with a token lower than the highest it has seen.

```
t=0:  Process A acquires lock, receives token=33
t=25: Process A pauses (GC)
t=30: Lock expires
t=31: Process B acquires lock, receives token=34
t=32: Process B writes to the resource with token=34. Resource accepts.
t=33: Process A resumes, tries to write with token=33. Resource rejects (34 > 33).
```

```python
# Resource (e.g., a database) checks fencing token
def update_with_fence(resource_id: str, data: dict, token: int) -> bool:
    # Atomic compare-and-set: only accept if token is higher than last seen
    result = db.execute("""
        UPDATE resources
        SET data = %s, last_fence_token = %s
        WHERE id = %s AND last_fence_token < %s
    """, data, token, resource_id, token)
    return result.rowcount > 0  # False means token was rejected (stale)
```

The fencing token requires cooperation from the resource being protected. This is sometimes possible (a database, a file system that supports conditional writes) and sometimes not (a third-party API with no token support).

## Comparison

| Approach | Mutual exclusion | Deadlock-free | Correctness under pauses | Complexity |
| --- | --- | --- | --- | --- |
| Redis SETNX | Yes | Yes (TTL) | No | Low |
| Redlock | Yes (with caveats) | Yes (TTL) | No | Medium |
| ZooKeeper ephemeral | Yes | Yes (session) | No without fencing | High |
| ZooKeeper + fencing | Yes | Yes (session) | Yes | High |

## Key takeaways

**Know the distinction between efficiency and correctness locks.** For efficiency locks (deduplicate a job, prevent duplicate notification), Redis SETNX with a TTL is simple and sufficient. For correctness locks (ensure exactly one billing charge, prevent data corruption), you need a stronger mechanism -- either ZooKeeper with fencing tokens, or a database-level conditional write.

**Always store a unique token when acquiring a Redis lock.** The check-then-delete pattern (GET lock, verify it's yours, DEL) must be atomic. A Lua script on the Redis server is the correct way to implement this -- not two separate commands with a gap between them.

**Process pauses break lock guarantees.** GC pauses, OS scheduling delays, and network partitions can all cause a lock holder to miss its TTL. For critical systems, either keep lock TTLs generous (much longer than any expected pause) or use fencing tokens as a belt-and-suspenders mechanism.

**ZooKeeper's session-based expiry is more reliable than Redis TTL.** A ZooKeeper session expires when the client is genuinely disconnected, not on a timer. This means a healthy client can always extend its session, while a crashed or partitioned client loses its session automatically.

**Distributed locks are often a sign that the design needs rethinking.** If you need a distributed lock to serialize access to a single shared resource, consider whether that resource can be partitioned (each shard has its own lock), or whether an optimistic concurrency pattern (compare-and-swap in the DB) can replace the lock entirely.

## References

- [Martin Kleppmann: How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html)
- [Designing Data-Intensive Applications, Kleppmann, Chapter 8 and 9](https://dataintensive.net/)
- [Redis: Distributed locks with Redis (Redlock)](https://redis.io/docs/manual/patterns/distributed-locks/)
- [ZooKeeper: Distributed coordination](https://zookeeper.apache.org/doc/current/recipes.html)

## Related topics

- [CAP Theorem](../cap-theorem/), the consistency guarantees that determine which locking approach is appropriate
- [Caching](../caching/), Redis as the lock store for efficiency locks
- [Distributed Consensus (named algorithms)](../../cs/named-algorithms/), Raft and Paxos as the foundations for ZooKeeper's guarantees
- [Saga Pattern](../saga-pattern/), an alternative to locks for distributed transaction coordination
