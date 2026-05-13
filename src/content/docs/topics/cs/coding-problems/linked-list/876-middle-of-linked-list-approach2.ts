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

function fromList(vals: number[]): ListNode | null {
    const dummy = new ListNode();
    let cur = dummy;
    for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
    return dummy.next;
}

function middleNode(head: ListNode | null): ListNode | null {
    let slow = head;
    let fast = head;
    while (fast && fast.next) {
        slow = slow!.next;
        fast = fast.next.next;
    }
    return slow;
}

assert(middleNode(fromList([1,2,3,4,5]))!.val === 3);
assert(middleNode(fromList([1,2,3,4,5,6]))!.val === 4);
assert(middleNode(fromList([1,2]))!.val === 2);
assert(middleNode(fromList([1]))!.val === 1);
console.log('all tests pass');
