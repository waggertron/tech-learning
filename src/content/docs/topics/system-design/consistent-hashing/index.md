---
title: Consistent Hashing
description: "How consistent hashing solves the resharding problem: the hash ring, virtual nodes, why naive modulo hashing fails when cluster size changes, and where it appears in real distributed systems."
parent: system-design
tags: [system-design, consistent-hashing, distributed-systems, sharding]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

Consistent hashing is a technique for distributing data across a set of nodes such that adding or removing a node remaps as few keys as possible. It is used in distributed caches, databases, and CDNs anywhere the set of servers changes over time.

## The problem with naive modulo hashing

The simplest way to assign a key to a server is:

```python
server = servers[hash(key) % len(servers)]
```

This works until the cluster size changes. Add one server to a 4-server cluster (now 5 servers), and `hash(key) % 5` gives completely different results than `hash(key) % 4`. Nearly every key maps to a different server.

```
4 servers: key "user:1" -> hash=123456 -> 123456 % 4 = 0 -> server_0
5 servers: key "user:1" -> hash=123456 -> 123456 % 5 = 1 -> server_1
```

When a cache cluster grows from N to N+1 servers, almost all cache entries are invalidated simultaneously. Every request misses and falls through to the database. This is a **cache stampede** at cluster scale.

For a cluster storing 10 million keys, a single node addition can cause 9 million cache misses in the first few seconds.

## The hash ring

Consistent hashing maps both keys and servers onto a circular hash space (the "ring"), typically [0, 2^32). Each server is assigned a position on the ring by hashing its ID (e.g. its IP address or hostname).

```
                   0
             .-----'-----.
           /               \
      2^32/4                 2^32/4
   [Server A]              [Server B]
          |                    |
          |                    |
      2^32*3/4             2^32/2
          .       [Server C]  .
           '-------.---------'
```

To assign a key to a server: hash the key to get a position on the ring, then walk clockwise to find the first server. That server owns the key.

```
Key "user:1" hashes to position X.
Walk clockwise: first server encountered is Server B.
Server B owns key "user:1".
```

When a new server D is added to the ring, it only takes over keys that fall between the previous server (before D's position) and D. All other keys remain on their current servers.

When a server is removed, only its keys move, to the next server clockwise. The rest of the ring is unaffected.

**Result**: adding or removing one server remaps only K/N keys on average, where K is the total number of keys and N is the number of servers. For a 10-node cluster, adding one node remaps only ~10% of keys instead of ~100%.

## Virtual nodes

Naive consistent hashing places each physical server at one position on the ring. With a small number of servers, the distribution is uneven: one server may own 40% of the ring while another owns 5%.

**Virtual nodes** (vnodes) solve this. Each physical server is represented by multiple positions on the ring (e.g. 100-200 vnodes each). Virtual nodes are created by hashing `server_id + vnode_index`.

```
Server A: [hash("A_0"), hash("A_1"), hash("A_2"), ..., hash("A_99")]
Server B: [hash("B_0"), hash("B_1"), hash("B_2"), ..., hash("B_99")]
```

With many virtual nodes, positions are spread evenly across the ring, so each physical server ends up owning roughly equal portions regardless of the underlying hash values.

Virtual nodes also make heterogeneous clusters natural: a server with 2x the RAM gets 2x the vnodes and handles 2x the data.

## Implementation

```python
import hashlib
import bisect

class ConsistentHashRing:
    def __init__(self, nodes: list[str], vnodes_per_node: int = 150):
        self.vnodes_per_node = vnodes_per_node
        self.ring: dict[int, str] = {}
        self.sorted_keys: list[int] = []
        for node in nodes:
            self.add_node(node)

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node: str) -> None:
        for i in range(self.vnodes_per_node):
            vnode_key = f"{node}:{i}"
            h = self._hash(vnode_key)
            self.ring[h] = node
            bisect.insort(self.sorted_keys, h)

    def remove_node(self, node: str) -> None:
        for i in range(self.vnodes_per_node):
            vnode_key = f"{node}:{i}"
            h = self._hash(vnode_key)
            del self.ring[h]
            self.sorted_keys.remove(h)

    def get_node(self, key: str) -> str:
        if not self.ring:
            return None
        h = self._hash(key)
        idx = bisect.bisect(self.sorted_keys, h)
        if idx == len(self.sorted_keys):
            idx = 0  # wrap around the ring
        return self.ring[self.sorted_keys[idx]]


# Demo: how many keys remap when adding a node
ring = ConsistentHashRing(["server_a", "server_b", "server_c", "server_d"])

keys = [f"user:{i}" for i in range(10_000)]
before = {k: ring.get_node(k) for k in keys}

ring.add_node("server_e")
after = {k: ring.get_node(k) for k in keys}

remapped = sum(1 for k in keys if before[k] != after[k])
print(f"Keys remapped: {remapped}/{len(keys)} ({remapped/len(keys)*100:.1f}%)")
# Keys remapped: ~2000/10000 (~20%)  -- expected for 5 nodes = 1/5 of keys
```

With 4 nodes, adding a 5th remaps about 1/5 of keys (20%) instead of almost all.

## Replication with consistent hashing

Distributed databases often store multiple replicas of each key. The standard approach: assign the key to the first N servers clockwise on the ring (N is the replication factor).

```
Key "user:1" -> position X
Replication factor 3:
  Primary:  first server clockwise -> Server B
  Replica1: second server clockwise -> Server C
  Replica2: third server clockwise  -> Server D
```

This gives automatic replica placement that adapts when nodes join or leave the ring.

## Where consistent hashing appears

**Distributed caches**: Memcached clusters (client-side consistent hashing via libketama), Redis Cluster (though it uses hash slots, a fixed 16384-slot variant of the ring).

**Distributed databases**: Amazon DynamoDB, Apache Cassandra. Cassandra's vnodes feature maps directly to the virtual node concept above.

**CDNs**: route requests for a given URL to the same edge node consistently (to maximize cache hit rate). Adding a new edge node remaps only a fraction of URLs.

**Load balancers**: route connections from the same client to the same backend (stateful protocols). More stable than IP hash when backends change.

## References

- [Consistent Hashing and Random Trees, Karger et al. (1997)](https://dl.acm.org/doi/10.1145/258533.258660)
- [Amazon DynamoDB: consistent hashing internals](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)
- [Cassandra vnodes documentation](https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html)
- [System Design Interview, Alex Xu, Chapter 5](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)

## Related topics

- [Databases at Scale](../databases/), consistent hashing solves the resharding problem for distributed databases
- [Caching](../caching/), distributed caches use consistent hashing to decide which cache node holds which key
- [CAP Theorem](../cap-theorem/), AP systems that use consistent hashing for partition tolerance
- [Load Balancing](../load-balancing/), consistent hashing as an alternative to IP hash for session affinity
