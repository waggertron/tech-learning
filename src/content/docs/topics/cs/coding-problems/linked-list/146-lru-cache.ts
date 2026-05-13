function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class LRUNode {
    key: number;
    val: number;
    prev: LRUNode | null;
    next: LRUNode | null;
    constructor(key: number = 0, val: number = 0) {
        this.key = key; this.val = val; this.prev = null; this.next = null;
    }
}

class LRUCache {
    private cap: number;
    private cache: Map<number, LRUNode>;
    private head: LRUNode;
    private tail: LRUNode;

    constructor(capacity: number) {
        // TODO: implement
        this.cap = capacity;
        this.cache = new Map();
        this.head = new LRUNode();
        this.tail = new LRUNode();
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    get(key: number): number {
        // TODO: implement
        return -1;
    }

    put(key: number, value: number): void {
        // TODO: implement
    }
}

function _runTests(): void {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    assert(cache.get(1) === 1);
    cache.put(3, 3);
    assert(cache.get(2) === -1);
    cache.put(4, 4);
    assert(cache.get(1) === -1);
    assert(cache.get(3) === 3);
    assert(cache.get(4) === 4);

    const c1 = new LRUCache(1);
    c1.put(1, 10);
    assert(c1.get(1) === 10);
    c1.put(2, 20);
    assert(c1.get(1) === -1);
    assert(c1.get(2) === 20);

    // perf
    const big = new LRUCache(1000);
    const t0 = performance.now();
    for (let i = 0; i < 100_000; i++) { big.put(i % 1500, i); big.get(i % 1000); }
    console.log(`perf LRUCache 100000 ops: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
