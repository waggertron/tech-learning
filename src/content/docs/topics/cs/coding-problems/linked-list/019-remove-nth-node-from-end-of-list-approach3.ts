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
    const dummy = new ListNode(0, head);
    let slow: ListNode = dummy;
    let fast: ListNode | null = dummy;
    for (let i = 0; i <= n; i++) fast = fast!.next;
    while (fast) {
        slow = slow.next!;
        fast = fast.next;
    }
    slow.next = slow.next!.next;
    return dummy.next;
}

assert(JSON.stringify(toList(removeNthFromEnd(fromList([1,2,3,4,5]), 2))) === JSON.stringify([1,2,3,5]));
assert(JSON.stringify(toList(removeNthFromEnd(fromList([1]), 1))) === JSON.stringify([]));
assert(JSON.stringify(toList(removeNthFromEnd(fromList([1,2]), 1))) === JSON.stringify([1]));
assert(JSON.stringify(toList(removeNthFromEnd(fromList([1,2]), 2))) === JSON.stringify([2]));
assert(JSON.stringify(toList(removeNthFromEnd(fromList([1,2,3,4,5]), 5))) === JSON.stringify([2,3,4,5]));
console.log('all tests pass');
