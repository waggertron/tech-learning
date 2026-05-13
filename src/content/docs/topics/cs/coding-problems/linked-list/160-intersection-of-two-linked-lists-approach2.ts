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
    let pA = headA;
    let pB = headB;
    while (pA !== pB) {
        pA = pA ? pA.next : headB;
        pB = pB ? pB.next : headA;
    }
    return pA;
}

const shared = new ListNode(8, new ListNode(4, new ListNode(5)));
const headA = new ListNode(4, new ListNode(1, shared));
const headB = new ListNode(5, new ListNode(6, new ListNode(1, shared)));
assert(getIntersectionNode(headA, headB) === shared);
const a = new ListNode(2, new ListNode(6, new ListNode(4)));
const b = new ListNode(1, new ListNode(5));
assert(getIntersectionNode(a, b) === null);
assert(getIntersectionNode(null, null) === null);
assert(getIntersectionNode(new ListNode(1), null) === null);
console.log('all tests pass');
