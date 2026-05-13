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
    const dummy = new ListNode();
    let tail = dummy;
    while (l1 && l2) {
        if (l1.val <= l2.val) {
            tail.next = l1;
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next!;
    }
    tail.next = l1 ?? l2;
    return dummy.next;
}

assert(JSON.stringify(toList(mergeTwoLists(fromList([1,2,4]), fromList([1,3,4])))) === JSON.stringify([1,1,2,3,4,4]));
assert(JSON.stringify(toList(mergeTwoLists(null, null))) === JSON.stringify([]));
assert(JSON.stringify(toList(mergeTwoLists(null, fromList([0])))) === JSON.stringify([0]));
assert(JSON.stringify(toList(mergeTwoLists(fromList([1,3,5]), null))) === JSON.stringify([1,3,5]));
assert(JSON.stringify(toList(mergeTwoLists(fromList([1,2,3]), fromList([4,5,6,7])))) === JSON.stringify([1,2,3,4,5,6,7]));
console.log('all tests pass');
