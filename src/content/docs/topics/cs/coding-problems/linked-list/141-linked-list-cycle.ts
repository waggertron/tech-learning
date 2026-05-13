function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val: number = 0, next: ListNode | null = null) {
        this.val = val; this.next = next;
    }
}

function hasCycle(head: ListNode | null): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(hasCycle(null) === false);
    assert(hasCycle(new ListNode(1)) === false);
    const n1 = new ListNode(1);
    const n2 = new ListNode(2);
    const n3 = new ListNode(3);
    n1.next = n2; n2.next = n3;
    assert(hasCycle(n1) === false);
    const a = new ListNode(3);
    const b = new ListNode(2);
    const c = new ListNode(0);
    const d = new ListNode(-4);
    a.next = b; b.next = c; c.next = d; d.next = b;
    assert(hasCycle(a) === true);
    const x = new ListNode(1);
    x.next = x;
    assert(hasCycle(x) === true);
    // perf
    const nodes = Array.from({ length: 1000 }, (_, i) => new ListNode(i));
    for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i + 1];
    const t0 = performance.now();
    hasCycle(nodes[0]);
    console.log(`perf hasCycle(1000-node acyclic list): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
