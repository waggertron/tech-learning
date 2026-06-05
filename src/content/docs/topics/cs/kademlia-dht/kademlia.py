"""
Minimal Kademlia DHT implementation (in-memory simulation).

K      = bucket size (20 in production, 3 here for clarity)
BITS   = ID space width (160 in production, 8 here for clarity)
ALPHA  = lookup concurrency (3 in production)
"""

import random
from typing import Optional

K = 3
BITS = 8
ALPHA = 3


def xor_dist(a: int, b: int) -> int:
    return a ^ b


def bucket_index(own_id: int, other_id: int) -> int:
    """Return the k-bucket index (highest set bit of XOR distance)."""
    d = xor_dist(own_id, other_id)
    if d == 0:
        return 0
    return d.bit_length() - 1


class RoutingTable:
    def __init__(self, owner: int) -> None:
        self.owner = owner
        self.buckets: list[list[int]] = [[] for _ in range(BITS)]

    def add(self, node_id: int) -> None:
        if node_id == self.owner:
            return
        b = bucket_index(self.owner, node_id)
        bucket = self.buckets[b]
        if node_id in bucket:
            bucket.remove(node_id)
            bucket.append(node_id)  # move to tail = most recently seen
        elif len(bucket) < K:
            bucket.append(node_id)
        # If bucket full, production Kademlia pings the head (LRU) node.
        # Here we silently drop — uptime-biased replacement is the key rule.

    def closest(self, target: int, n: int = K) -> list[int]:
        """Return the n known nodes closest to target by XOR distance."""
        all_nodes = [nid for bucket in self.buckets for nid in bucket]
        all_nodes.sort(key=lambda nid: xor_dist(nid, target))
        return all_nodes[:n]


class Node:
    def __init__(self, node_id: int, network: "Network") -> None:
        self.node_id = node_id
        self.net = network
        self.table = RoutingTable(node_id)
        self.store: dict[int, str] = {}

    # ---- RPCs (simulated as direct method calls) ----

    def rpc_find_node(self, target: int) -> list[int]:
        """Return K closest nodes to target from this node's routing table."""
        return self.table.closest(target)

    def rpc_find_value(self, key: int) -> tuple[Optional[str], list[int]]:
        """Return (value, []) if stored here, else (None, K closest nodes)."""
        if key in self.store:
            return self.store[key], []
        return None, self.table.closest(key)

    def rpc_store(self, key: int, value: str) -> None:
        self.store[key] = value

    # ---- High-level operations ----

    def lookup(self, target: int) -> list[int]:
        """Iterative FIND_NODE: return K closest nodes across the network."""
        seen: set[int] = {self.node_id}
        shortlist = self.table.closest(target, ALPHA)

        while True:
            new_nodes: list[int] = []
            for nid in shortlist:
                if nid in seen:
                    continue
                seen.add(nid)
                remote = self.net.nodes.get(nid)
                if remote:
                    returned = remote.rpc_find_node(target)
                    for r in returned:
                        self.table.add(r)
                    new_nodes.extend(returned)

            candidate = sorted(
                set(shortlist) | set(new_nodes),
                key=lambda n: xor_dist(n, target),
            )[:K]

            if candidate == shortlist:
                break
            shortlist = candidate

        return shortlist

    def put(self, key: int, value: str) -> None:
        """Store value on the K nodes closest to key."""
        for nid in self.lookup(key):
            remote = self.net.nodes.get(nid)
            if remote:
                remote.rpc_store(key, value)

    def get(self, key: int) -> Optional[str]:
        """Retrieve value for key from the network."""
        seen: set[int] = {self.node_id}
        shortlist = self.table.closest(key, ALPHA)

        while True:
            new_nodes: list[int] = []
            for nid in shortlist:
                if nid in seen:
                    continue
                seen.add(nid)
                remote = self.net.nodes.get(nid)
                if remote:
                    value, nodes = remote.rpc_find_value(key)
                    if value is not None:
                        return value
                    for r in nodes:
                        self.table.add(r)
                    new_nodes.extend(nodes)

            candidate = sorted(
                set(shortlist) | set(new_nodes),
                key=lambda n: xor_dist(n, key),
            )[:K]

            if candidate == shortlist:
                return None
            shortlist = candidate


class Network:
    """In-memory simulated Kademlia network."""

    def __init__(self) -> None:
        self.nodes: dict[int, Node] = {}

    def join(self, node_id: int) -> Node:
        node = Node(node_id, self)
        # Bootstrap: seed with up to K existing nodes
        for existing_id in list(self.nodes)[:K]:
            node.table.add(existing_id)
            self.nodes[existing_id].table.add(node_id)
        self.nodes[node_id] = node
        if len(self.nodes) > 1:
            node.lookup(node_id)  # populate routing table
        return node


if __name__ == "__main__":
    random.seed(7)
    net = Network()

    ids = random.sample(range(1, 2**BITS), 16)
    nodes = [net.join(nid) for nid in ids]

    # Store and retrieve
    key, value = 42, "hello kademlia"
    nodes[0].put(key, value)
    result = nodes[-1].get(key)
    print(f"get({key}) = {result!r}")

    # Show XOR routing
    target = 100
    closest = nodes[0].lookup(target)
    print(f"\nClosest {K} nodes to {target}:")
    for nid in closest:
        print(f"  node {nid:3d}  XOR dist {xor_dist(nid, target)}")
