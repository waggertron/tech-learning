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

function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    assert(JSON.stringify(toList(mergeKLists([fromList([1,4,5]), fromList([1,3,4]), fromList([2,6])]))) === JSON.stringify([1,1,2,3,4,4,5,6]));
    assert(mergeKLists([]) === null);
    assert(JSON.stringify(toList(mergeKLists([null]))) === JSON.stringify([]));
    assert(JSON.stringify(toList(mergeKLists([fromList([1,2,3])]))) === JSON.stringify([1,2,3]));
    assert(JSON.stringify(toList(mergeKLists([fromList([1,2]), null]))) === JSON.stringify([1,2]));
    // perf
    const lists = Array.from({ length: 10 }, (_, i) =>
        fromList(Array.from({ length: 100 }, (_, j) => i + j * 10))
    );
    const t0 = performance.now();
    mergeKLists(lists);
    console.log(`perf mergeKLists(10 lists x 100 nodes): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
