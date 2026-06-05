// Minimal Kademlia DHT implementation (in-memory simulation).
//
// K     = bucket size (20 in production, 3 here for clarity)
// BITS  = ID space width (160 in production, 8 here for clarity)
// ALPHA = lookup concurrency (3 in production)

const K = 3;
const BITS = 8;
const ALPHA = 3;

const xorDist = (a: number, b: number): number => a ^ b;

const bucketIndex = (ownId: number, otherId: number): number => {
  const d = xorDist(ownId, otherId);
  if (d === 0) return 0;
  return 31 - Math.clz32(d); // position of highest set bit
};

class RoutingTable {
  owner: number;
  buckets: number[][];

  constructor(owner: number) {
    this.owner = owner;
    this.buckets = Array.from({ length: BITS }, () => []);
  }

  add(nodeId: number): void {
    if (nodeId === this.owner) return;
    const b = bucketIndex(this.owner, nodeId);
    const bucket = this.buckets[b];
    const idx = bucket.indexOf(nodeId);
    if (idx !== -1) {
      bucket.splice(idx, 1);
      bucket.push(nodeId); // move to tail = most recently seen
    } else if (bucket.length < K) {
      bucket.push(nodeId);
    }
  }

  closest(target: number, n = K): number[] {
    return this.buckets
      .flat()
      .sort((a, b) => xorDist(a, target) - xorDist(b, target))
      .slice(0, n);
  }
}

class KademliaNode {
  nodeId: number;
  net: KademliaNetwork;
  table: RoutingTable;
  store: Map<number, string>;

  constructor(nodeId: number, net: KademliaNetwork) {
    this.nodeId = nodeId;
    this.net = net;
    this.table = new RoutingTable(nodeId);
    this.store = new Map();
  }

  rpcFindNode(target: number): number[] {
    return this.table.closest(target);
  }

  rpcFindValue(key: number): { value: string | null; nodes: number[] } {
    if (this.store.has(key)) {
      return { value: this.store.get(key)!, nodes: [] };
    }
    return { value: null, nodes: this.table.closest(key) };
  }

  rpcStore(key: number, value: string): void {
    this.store.set(key, value);
  }

  lookup(target: number): number[] {
    const seen = new Set<number>([this.nodeId]);
    let shortlist = this.table.closest(target, ALPHA);

    while (true) {
      const newNodes: number[] = [];
      for (const nid of shortlist) {
        if (seen.has(nid)) continue;
        seen.add(nid);
        const remote = this.net.nodes.get(nid);
        if (remote) {
          const returned = remote.rpcFindNode(target);
          returned.forEach((n) => this.table.add(n));
          newNodes.push(...returned);
        }
      }
      const candidate = [...new Set([...shortlist, ...newNodes])]
        .sort((a, b) => xorDist(a, target) - xorDist(b, target))
        .slice(0, K);

      if (candidate.join() === shortlist.join()) break;
      shortlist = candidate;
    }
    return shortlist;
  }

  put(key: number, value: string): void {
    for (const nid of this.lookup(key)) {
      this.net.nodes.get(nid)?.rpcStore(key, value);
    }
  }

  get(key: number): string | null {
    const seen = new Set<number>([this.nodeId]);
    let shortlist = this.table.closest(key, ALPHA);

    while (true) {
      const newNodes: number[] = [];
      for (const nid of shortlist) {
        if (seen.has(nid)) continue;
        seen.add(nid);
        const remote = this.net.nodes.get(nid);
        if (remote) {
          const { value, nodes } = remote.rpcFindValue(key);
          if (value !== null) return value;
          nodes.forEach((n) => this.table.add(n));
          newNodes.push(...nodes);
        }
      }
      const candidate = [...new Set([...shortlist, ...newNodes])]
        .sort((a, b) => xorDist(a, key) - xorDist(b, key))
        .slice(0, K);

      if (candidate.join() === shortlist.join()) return null;
      shortlist = candidate;
    }
  }
}

class KademliaNetwork {
  nodes: Map<number, KademliaNode>;

  constructor() {
    this.nodes = new Map();
  }

  join(nodeId: number): KademliaNode {
    const node = new KademliaNode(nodeId, this);
    let i = 0;
    for (const existingId of this.nodes.keys()) {
      if (i >= K) break;
      node.table.add(existingId);
      this.nodes.get(existingId)!.table.add(nodeId);
      i++;
    }
    this.nodes.set(nodeId, node);
    if (this.nodes.size > 1) node.lookup(nodeId);
    return node;
  }
}

// Demo
const net = new KademliaNetwork();
const nodeIds = [7, 23, 45, 67, 89, 112, 134, 156, 178, 200, 12, 34, 56, 78, 100, 120];
const nodes = nodeIds.map((id) => net.join(id));

const key = 42;
const value = "hello kademlia";
nodes[0].put(key, value);

const result = nodes[nodes.length - 1].get(key);
console.log(`get(${key}) = ${JSON.stringify(result)}`);

const target = 100;
const closest = nodes[0].lookup(target);
console.log(`\nClosest ${K} nodes to ${target}:`);
for (const nid of closest) {
  console.log(`  node ${String(nid).padStart(3)}  XOR dist ${xorDist(nid, target)}`);
}
