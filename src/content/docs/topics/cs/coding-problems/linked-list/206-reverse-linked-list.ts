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

function reverseList(head: ListNode | null): ListNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    assert(JSON.stringify(toList(reverseList(fromList([1,2,3,4,5])))) === JSON.stringify([5,4,3,2,1]));
    assert(JSON.stringify(toList(reverseList(fromList([1,2])))) === JSON.stringify([2,1]));
    assert(JSON.stringify(toList(reverseList(fromList([1])))) === JSON.stringify([1]));
    assert(reverseList(null) === null);
    // perf
    const vals = Array.from({ length: 100_000 }, (_, i) => i);
    const head = fromList(vals);
    const t0 = performance.now();
    reverseList(head);
    console.log(`perf reverseList(100000 nodes): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
