function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class Node {
    val: number;
    next: Node | null;
    random: Node | null;
    constructor(val: number = 0, next: Node | null = null, random: Node | null = null) {
        this.val = val; this.next = next; this.random = random;
    }
}

function copyRandomList(head: Node | null): Node | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    assert(copyRandomList(null) === null);

    // Single node, random points to itself
    const n1 = new Node(1);
    n1.random = n1;
    const copy1 = copyRandomList(n1);
    assert(copy1 !== null && copy1 !== n1);
    assert(copy1!.val === 1);
    assert(copy1!.random === copy1);

    // Two nodes
    const a = new Node(7);
    const b = new Node(13);
    a.next = b;
    b.random = a;
    const copy2 = copyRandomList(a);
    assert(copy2 !== null && copy2 !== a);
    assert(copy2!.val === 7);
    assert(copy2!.next!.val === 13);
    assert(copy2!.next!.random === copy2);

    // perf
    const nodes = Array.from({ length: 100_000 }, (_, i) => new Node(i));
    for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
    for (let i = 0; i < nodes.length; i++) nodes[i].random = nodes[Math.floor(Math.random() * nodes.length)];
    const t0 = performance.now();
    copyRandomList(nodes[0]);
    console.log(`perf copyRandomList(100000 nodes): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
