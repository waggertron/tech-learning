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

function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
    const dummy = new ListNode(0, head);
    let groupPrev: ListNode = dummy;
    while (true) {
        let kth: ListNode | null = groupPrev;
        for (let i = 0; i < k; i++) {
            kth = kth!.next;
            if (!kth) return dummy.next;
        }
        const groupNext = kth!.next;
        let prev: ListNode | null = groupNext;
        let curr: ListNode | null = groupPrev.next;
        while (curr !== groupNext) {
            const nxt = curr!.next;
            curr!.next = prev;
            prev = curr;
            curr = nxt;
        }
        const tmp = groupPrev.next!;
        groupPrev.next = kth;
        groupPrev = tmp;
    }
}

assert(JSON.stringify(toList(reverseKGroup(fromList([1,2,3,4,5]), 2))) === JSON.stringify([2,1,4,3,5]));
assert(JSON.stringify(toList(reverseKGroup(fromList([1,2,3,4,5]), 3))) === JSON.stringify([3,2,1,4,5]));
assert(JSON.stringify(toList(reverseKGroup(fromList([1,2,3,4,5,6]), 3))) === JSON.stringify([3,2,1,6,5,4]));
assert(JSON.stringify(toList(reverseKGroup(fromList([1,2,3]), 1))) === JSON.stringify([1,2,3]));
assert(JSON.stringify(toList(reverseKGroup(fromList([1,2,3]), 3))) === JSON.stringify([3,2,1]));
console.log('all tests pass');
