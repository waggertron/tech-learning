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

function toList(head: ListNode | null): number[] {
    const out: number[] = [];
    while (head) { out.push(head.val); head = head.next; }
    return out;
}

function fromList(vals: number[]): ListNode | null {
    const dummy = new ListNode();
    let cur = dummy;
    for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
    return dummy.next;
}

function reorderList(head: ListNode | null): void {
    // TODO: implement
}

function _runTests(): void {
    let h = fromList([1,2,3,4]);
    reorderList(h);
    assert(JSON.stringify(toList(h)) === JSON.stringify([1,4,2,3]));
    h = fromList([1,2,3,4,5]);
    reorderList(h);
    assert(JSON.stringify(toList(h)) === JSON.stringify([1,5,2,4,3]));
    h = fromList([1]);
    reorderList(h);
    assert(JSON.stringify(toList(h)) === JSON.stringify([1]));
    h = fromList([1,2]);
    reorderList(h);
    assert(JSON.stringify(toList(h)) === JSON.stringify([1,2]));
    // perf
    const head = fromList(Array.from({ length: 1000 }, (_, i) => i));
    const t0 = performance.now();
    reorderList(head);
    console.log(`perf reorderList(1000 nodes): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
