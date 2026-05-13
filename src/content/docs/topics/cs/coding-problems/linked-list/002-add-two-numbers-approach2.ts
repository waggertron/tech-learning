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
    const dummy = new ListNode();
    let tail = dummy;
    let carry = 0;
    while (l1 || l2 || carry) {
        let v = carry;
        if (l1) { v += l1.val; l1 = l1.next; }
        if (l2) { v += l2.val; l2 = l2.next; }
        carry = Math.floor(v / 10);
        tail.next = new ListNode(v % 10);
        tail = tail.next;
    }
    return dummy.next;
}

assert(JSON.stringify(toList(addTwoNumbers(fromList([2,4,3]), fromList([5,6,4])))) === JSON.stringify([7,0,8]));
assert(JSON.stringify(toList(addTwoNumbers(fromList([0]), fromList([0])))) === JSON.stringify([0]));
assert(JSON.stringify(toList(addTwoNumbers(fromList([9,9,9,9,9,9,9]), fromList([9,9,9,9])))) === JSON.stringify([8,9,9,9,0,0,0,1]));
assert(JSON.stringify(toList(addTwoNumbers(fromList([1]), fromList([2])))) === JSON.stringify([3]));
assert(JSON.stringify(toList(addTwoNumbers(fromList([5]), fromList([5])))) === JSON.stringify([0,1]));
console.log('all tests pass');
