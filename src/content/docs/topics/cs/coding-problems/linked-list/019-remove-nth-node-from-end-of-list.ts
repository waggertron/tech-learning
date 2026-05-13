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

function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    assert(JSON.stringify(toList(removeNthFromEnd(fromList([1,2,3,4,5]), 2))) === JSON.stringify([1,2,3,5]));
    assert(JSON.stringify(toList(removeNthFromEnd(fromList([1]), 1))) === JSON.stringify([]));
    assert(JSON.stringify(toList(removeNthFromEnd(fromList([1,2]), 1))) === JSON.stringify([1]));
    assert(JSON.stringify(toList(removeNthFromEnd(fromList([1,2]), 2))) === JSON.stringify([2]));
    assert(JSON.stringify(toList(removeNthFromEnd(fromList([1,2,3,4,5]), 5))) === JSON.stringify([2,3,4,5]));
    // perf
    const head = fromList(Array.from({ length: 1000 }, (_, i) => i));
    const t0 = performance.now();
    removeNthFromEnd(head, 500);
    console.log(`perf removeNthFromEnd(1000 nodes): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
