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

function reorderList(head: ListNode | null): void {
    if (!head || !head.next) return;
    let slow: ListNode = head;
    let fast: ListNode | null = head;
    while (fast.next && fast.next.next) {
        slow = slow.next!;
        fast = fast.next.next;
    }
    let prev: ListNode | null = null;
    let curr: ListNode | null = slow.next;
    slow.next = null;
    while (curr) {
        const nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    let first: ListNode | null = head;
    let second: ListNode | null = prev;
    while (second) {
        const t1 = first!.next;
        const t2 = second.next;
        first!.next = second;
        second.next = t1;
        first = t1;
        second = t2;
    }
}

let h = fromList([1,2,3,4]); reorderList(h); assert(JSON.stringify(toList(h)) === JSON.stringify([1,4,2,3]));
h = fromList([1,2,3,4,5]); reorderList(h); assert(JSON.stringify(toList(h)) === JSON.stringify([1,5,2,4,3]));
h = fromList([1]); reorderList(h); assert(JSON.stringify(toList(h)) === JSON.stringify([1]));
h = fromList([1,2]); reorderList(h); assert(JSON.stringify(toList(h)) === JSON.stringify([1,2]));
console.log('all tests pass');
