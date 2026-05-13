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

function getIntersectionNode(headA: ListNode | null, headB: ListNode | null): ListNode | null {
    // TODO: implement
    return null;
}

function _runTests(): void {
    // Shared tail: A=[4,1,8,4,5], B=[5,6,1,8,4,5], intersect at node 8
    const shared = new ListNode(8, new ListNode(4, new ListNode(5)));
    const headA = new ListNode(4, new ListNode(1, shared));
    const headB = new ListNode(5, new ListNode(6, new ListNode(1, shared)));
    assert(getIntersectionNode(headA, headB) === shared);

    // No intersection
    const a = new ListNode(2, new ListNode(6, new ListNode(4)));
    const b = new ListNode(1, new ListNode(5));
    assert(getIntersectionNode(a, b) === null);

    // Both empty
    assert(getIntersectionNode(null, null) === null);

    // One empty
    assert(getIntersectionNode(new ListNode(1), null) === null);

    // perf
    const shared2 = new ListNode(99);
    const longA = new ListNode(0, new ListNode(1, shared2));
    const longB = new ListNode(2, new ListNode(3, new ListNode(4, shared2)));
    const t0 = performance.now();
    getIntersectionNode(longA, longB);
    console.log(`perf getIntersectionNode: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
