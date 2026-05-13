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

function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    assert(JSON.stringify(toList(mergeTwoLists(fromList([1,2,4]), fromList([1,3,4])))) === JSON.stringify([1,1,2,3,4,4]));
    assert(JSON.stringify(toList(mergeTwoLists(null, null))) === JSON.stringify([]));
    assert(JSON.stringify(toList(mergeTwoLists(null, fromList([0])))) === JSON.stringify([0]));
    assert(JSON.stringify(toList(mergeTwoLists(fromList([1,3,5]), null))) === JSON.stringify([1,3,5]));
    assert(JSON.stringify(toList(mergeTwoLists(fromList([1,2,3]), fromList([4,5,6,7])))) === JSON.stringify([1,2,3,4,5,6,7]));
    // perf
    const head1 = fromList(Array.from({ length: 100_000 }, (_, i) => i * 2));
    const head2 = fromList(Array.from({ length: 100_000 }, (_, i) => i * 2 + 1));
    const t0 = performance.now();
    mergeTwoLists(head1, head2);
    console.log(`perf mergeTwoLists(100000 nodes each): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
