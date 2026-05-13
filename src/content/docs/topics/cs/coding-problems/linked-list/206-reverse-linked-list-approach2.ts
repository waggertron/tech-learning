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

function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let curr = head;
    while (curr) {
        const nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}

assert(JSON.stringify(toList(reverseList(fromList([1,2,3,4,5])))) === JSON.stringify([5,4,3,2,1]));
assert(JSON.stringify(toList(reverseList(fromList([1,2])))) === JSON.stringify([2,1]));
assert(JSON.stringify(toList(reverseList(fromList([1])))) === JSON.stringify([1]));
assert(reverseList(null) === null);
console.log('all tests pass');
