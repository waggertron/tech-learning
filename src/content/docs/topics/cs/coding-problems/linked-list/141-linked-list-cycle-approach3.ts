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

function hasCycle(head: ListNode | null): boolean {
    let slow = head;
    let fast = head;
    while (fast && fast.next) {
        slow = slow!.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}

assert(hasCycle(null) === false);
assert(hasCycle(new ListNode(1)) === false);
const n1 = new ListNode(1); const n2 = new ListNode(2); const n3 = new ListNode(3);
n1.next = n2; n2.next = n3;
assert(hasCycle(n1) === false);
const a = new ListNode(3); const b = new ListNode(2); const c = new ListNode(0); const d = new ListNode(-4);
a.next = b; b.next = c; c.next = d; d.next = b;
assert(hasCycle(a) === true);
const x = new ListNode(1); x.next = x;
assert(hasCycle(x) === true);
console.log('all tests pass');
