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

function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    assert(JSON.stringify(toList(addTwoNumbers(fromList([2,4,3]), fromList([5,6,4])))) === JSON.stringify([7,0,8]));
    assert(JSON.stringify(toList(addTwoNumbers(fromList([0]), fromList([0])))) === JSON.stringify([0]));
    assert(JSON.stringify(toList(addTwoNumbers(fromList([9,9,9,9,9,9,9]), fromList([9,9,9,9])))) === JSON.stringify([8,9,9,9,0,0,0,1]));
    assert(JSON.stringify(toList(addTwoNumbers(fromList([1]), fromList([2])))) === JSON.stringify([3]));
    assert(JSON.stringify(toList(addTwoNumbers(fromList([5]), fromList([5])))) === JSON.stringify([0,1]));
    // perf
    const head1 = fromList(Array.from({ length: 100_000 }, () => 9));
    const head2 = fromList(Array.from({ length: 100_000 }, () => 9));
    const t0 = performance.now();
    addTwoNumbers(head1, head2);
    console.log(`perf addTwoNumbers(100000-digit numbers): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
