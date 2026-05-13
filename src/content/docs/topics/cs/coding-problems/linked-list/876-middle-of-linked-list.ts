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

function fromList(vals: number[]): ListNode | null {
    const dummy = new ListNode();
    let cur = dummy;
    for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
    return dummy.next;
}

function middleNode(head: ListNode | null): ListNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    assert(middleNode(fromList([1,2,3,4,5]))!.val === 3);
    assert(middleNode(fromList([1,2,3,4,5,6]))!.val === 4);
    assert(middleNode(fromList([1,2]))!.val === 2);
    assert(middleNode(fromList([1]))!.val === 1);
    // perf
    const head = fromList(Array.from({ length: 100_000 }, (_, i) => i));
    const t0 = performance.now();
    middleNode(head);
    console.log(`perf middleNode(100000 nodes): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
