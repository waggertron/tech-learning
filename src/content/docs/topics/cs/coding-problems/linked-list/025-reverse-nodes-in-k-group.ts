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

function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    assert(JSON.stringify(toList(reverseKGroup(fromList([1,2,3,4,5]), 2))) === JSON.stringify([2,1,4,3,5]));
    assert(JSON.stringify(toList(reverseKGroup(fromList([1,2,3,4,5]), 3))) === JSON.stringify([3,2,1,4,5]));
    assert(JSON.stringify(toList(reverseKGroup(fromList([1,2,3,4,5,6]), 3))) === JSON.stringify([3,2,1,6,5,4]));
    assert(JSON.stringify(toList(reverseKGroup(fromList([1,2,3]), 1))) === JSON.stringify([1,2,3]));
    assert(JSON.stringify(toList(reverseKGroup(fromList([1,2,3]), 3))) === JSON.stringify([3,2,1]));
    // perf
    const head = fromList(Array.from({ length: 1000 }, (_, i) => i));
    const t0 = performance.now();
    reverseKGroup(head, 5);
    console.log(`perf reverseKGroup(1000 nodes, k=5): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
