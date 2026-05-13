function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class LRUNode {
    key: number; val: number;
    prev: LRUNode | null = null;
    next: LRUNode | null = null;
    constructor(key: number = 0, val: number = 0) { this.key = key; this.val = val; }
}

class LRUCache {
    private cap: number;
    private cache: Map<number, LRUNode>;
    private head: LRUNode;
    private tail: LRUNode;

    constructor(capacity: number) {
        this.cap = capacity;
        this.cache = new Map();
        this.head = new LRUNode(); this.tail = new LRUNode();
        this.head.next = this.tail; this.tail.prev = this.head;
    }

    private remove(node: LRUNode): void {
        node.prev!.next = node.next;
        node.next!.prev = node.prev;
    }

    private addToFront(node: LRUNode): void {
        node.prev = this.head; node.next = this.head.next;
        this.head.next!.prev = node; this.head.next = node;
    }

    get(key: number): number {
        const node = this.cache.get(key);
        if (!node) return -1;
        this.remove(node); this.addToFront(node);
        return node.val;
    }

    put(key: number, value: number): void {
        const existing = this.cache.get(key);
        if (existing) {
            existing.val = value;
            this.remove(existing); this.addToFront(existing); return;
        }
        if (this.cache.size >= this.cap) {
            const lru = this.tail.prev!;
            this.remove(lru); this.cache.delete(lru.key);
        }
        const node = new LRUNode(key, value);
        this.cache.set(key, node); this.addToFront(node);
    }
}

const cache = new LRUCache(2);
cache.put(1, 1); cache.put(2, 2);
assert(cache.get(1) === 1);
cache.put(3, 3);
assert(cache.get(2) === -1);
cache.put(4, 4);
assert(cache.get(1) === -1);
assert(cache.get(3) === 3);
assert(cache.get(4) === 4);
const c1 = new LRUCache(1);
c1.put(1, 10); assert(c1.get(1) === 10);
c1.put(2, 20); assert(c1.get(1) === -1); assert(c1.get(2) === 20);
console.log('all tests pass');
