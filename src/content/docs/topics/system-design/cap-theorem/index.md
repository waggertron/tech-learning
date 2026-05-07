---
title: CAP Theorem
description: "Consistency, availability, and partition tolerance: why you can only have two, what CP and AP mean in practice, and the PACELC extension that covers the latency trade-off during normal operation."
parent: system-design
tags: [system-design, cap-theorem, distributed-systems, consistency]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

CAP theorem states that a distributed data store can guarantee at most two of three properties simultaneously: Consistency, Availability, and Partition Tolerance. Eric Brewer introduced it in 2000; Gilbert and Lynch formally proved it in 2002.

## The three properties

**Consistency (C)**: every read receives the most recent write or an error. All nodes see the same data at the same time. This is **linearizability** (also called strong consistency). Not to be confused with the C in ACID, which means something different.

**Availability (A)**: every request receives a non-error response (though it may not be the latest data). The system keeps responding even when nodes fail.

**Partition Tolerance (P)**: the system continues operating even when network messages between nodes are dropped or delayed (a network partition).

## Why P is not optional

A network partition is not a rare edge case. In any real distributed system, network links fail. Packets are dropped. Switches reboot. Datacenters lose connectivity. The only way to avoid partition tolerance as a requirement is to run on a single machine, which eliminates distribution.

In practice, the choice is always between C and A when a partition occurs. **CA** systems are single-node systems: not truly distributed.

## CP systems: choose consistency over availability

During a partition, a CP system rejects requests rather than returning potentially stale data. Users get errors until the partition heals.

```
Normal operation:
  [ Node A ] <--(sync)--> [ Node B ]
  Both nodes agree on data.

Partition:
  [ Node A ] X          X [ Node B ]
  Node A: rejects requests (returns error)
  Node B: rejects requests (returns error)
```

**Examples**: ZooKeeper, etcd, HBase, Apache Kafka (when acks=all), relational databases with synchronous replication.

**When to choose CP**: financial transactions, distributed locks, leader election, configuration management. Any case where returning stale or conflicting data would cause a worse outcome than returning an error.

## AP systems: choose availability over consistency

During a partition, an AP system continues serving requests on all nodes, but different nodes may return different (stale or conflicting) data. After the partition heals, the system **reconciles** the diverged data.

```
Normal operation:
  [ Node A ] <--(async replication)--> [ Node B ]

Partition:
  [ Node A ] X          X [ Node B ]
  Node A: accepts writes, serves reads (may be stale)
  Node B: accepts writes, serves reads (may be stale)

After partition heals:
  Conflict resolution: last-write-wins, merge, or application-level logic
```

**Examples**: Cassandra, DynamoDB, CouchDB, Amazon S3.

**When to choose AP**: shopping carts, social feeds, user profiles, DNS, any case where serving slightly stale data is better than returning an error.

## Consistency levels in practice

CAP describes the extreme cases. Real systems offer a spectrum of consistency levels:

### Strong consistency (linearizability)

Every read sees the most recent write. Requires coordination across nodes on every write. High latency. ZooKeeper, etcd.

### Sequential consistency

Operations appear in the order in which they were issued, but not necessarily in real time. All nodes see the same order.

### Causal consistency

Operations that are causally related are seen in the same order by all nodes. Concurrent operations may be seen in any order. MongoDB sessions, some Cassandra configurations.

### Read-your-writes

After a client writes a value, it always sees that value on subsequent reads (possibly from a different node). This is a weaker guarantee but often sufficient for user-facing features.

### Eventual consistency

If no new writes occur, all replicas will eventually converge to the same value. No guarantee on timing. DNS, Cassandra with consistency level ONE.

```python
# Simulating eventual consistency with async replication
import time
import threading

class Node:
    def __init__(self, name):
        self.name = name
        self.data = {}

    def write(self, key, value):
        self.data[key] = value

    def read(self, key):
        return self.data.get(key)

node_a = Node("A")
node_b = Node("B")

def replicate_async():
    time.sleep(0.5)  # simulate replication lag
    node_b.data.update(node_a.data)
    print(f"Replication complete. Node B now has: {node_b.data}")

# Write to node A
node_a.write("user:1", {"name": "Alice"})
print(f"After write: Node A={node_a.read('user:1')}, Node B={node_b.read('user:1')}")
# After write: Node A={'name': 'Alice'}, Node B=None  (stale!)

threading.Thread(target=replicate_async).start()

time.sleep(1)
print(f"After replication: Node A={node_a.read('user:1')}, Node B={node_b.read('user:1')}")
# After replication: both nodes agree  (eventually consistent)
```

## PACELC: the full picture

CAP only covers what happens during a partition. PACELC (Daniel Abadi, 2012) extends it to cover the normal case:

```
If Partition:
  choose Availability or Consistency
Else (no partition):
  choose Latency or Consistency
```

Even without a partition, you trade consistency for latency. Synchronous replication (strong consistency) requires waiting for all replicas to acknowledge a write, which takes longer. Asynchronous replication (eventual consistency) returns immediately but risks stale reads.

| System | Partition | Normal |
| --- | --- | --- |
| DynamoDB | AP | EL (elects latency) |
| Cassandra | AP | EL |
| MongoDB | CP | EC (elects consistency) |
| ZooKeeper | CP | EC |
| Spanner (Google) | CP | EC (with external consistency) |

## Real system implications

**Building a shopping cart (AP)**: users expect the cart to always work. If two devices add items concurrently, merge both; never reject an add. Stale cart data is acceptable; returning an error is not.

**Building a distributed lock (CP)**: two services must not hold the same lock simultaneously. During a partition, reject lock acquisition rather than risk double-granting the lock.

**Read-your-writes for user profiles**: after a user updates their profile picture, they should see the new picture. Route the user's reads to the same node that received the write (sticky reads), or wait for synchronous replication to complete before returning.

## References

- [Brewer's CAP Theorem, Gilbert and Lynch (2002)](https://dl.acm.org/doi/10.1145/564585.564601)
- [PACELC, Abadi (2012)](https://dbmsmusings.blogspot.com/2010/04/problems-with-cap-and-yahoos-little.html)
- [Designing Data-Intensive Applications, Kleppmann, Chapter 9](https://dataintensive.net/)
- [Jepsen: distributed systems safety research](https://jepsen.io/)

## Related topics

- [Databases at Scale](../databases/), replication models and the CP/AP trade-offs they make
- [Consistent Hashing](../consistent-hashing/), AP systems use consistent hashing for partition-tolerant data distribution
- [Caching](../caching/), cache-aside is an AP design: cache may serve stale data
- [Scalability](../scalability/), the CAP trade-off is the fundamental constraint on distributed scalability
