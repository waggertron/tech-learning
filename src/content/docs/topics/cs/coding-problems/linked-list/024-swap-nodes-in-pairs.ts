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

function swapPairs(head: ListNode | null): ListNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    assert(JSON.stringify(toList(swapPairs(fromList([1,2,3,4])))) === JSON.stringify([2,1,4,3]));
    assert(JSON.stringify(toList(swapPairs(fromList([])))) === JSON.stringify([]));
    assert(JSON.stringify(toList(swapPairs(fromList([1])))) === JSON.stringify([1]));
    assert(JSON.stringify(toList(swapPairs(fromList([1,2,3])))) === JSON.stringify([2,1,3]));
    // perf
    const head = fromList(Array.from({ length: 1000 }, (_, i) => i));
    const t0 = performance.now();
    swapPairs(head);
    console.log(`perf swapPairs(1000 nodes): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
