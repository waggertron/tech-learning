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

function mergeTwo(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummy = new ListNode();
    let tail = dummy;
    while (l1 && l2) {
        if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }
        else { tail.next = l2; l2 = l2.next; }
        tail = tail.next!;
    }
    tail.next = l1 ?? l2;
    return dummy.next;
}

function mergeKLists(lists: (ListNode | null)[]): ListNode | null {
    if (!lists.length) return null;
    while (lists.length > 1) {
        const merged: (ListNode | null)[] = [];
        for (let i = 0; i < lists.length; i += 2) {
            const a = lists[i];
            const b = i + 1 < lists.length ? lists[i + 1] : null;
            merged.push(mergeTwo(a, b));
        }
        lists = merged;
    }
    return lists[0];
}

assert(JSON.stringify(toList(mergeKLists([fromList([1,4,5]), fromList([1,3,4]), fromList([2,6])]))) === JSON.stringify([1,1,2,3,4,4,5,6]));
assert(mergeKLists([]) === null);
assert(JSON.stringify(toList(mergeKLists([null]))) === JSON.stringify([]));
assert(JSON.stringify(toList(mergeKLists([fromList([1,2,3])]))) === JSON.stringify([1,2,3]));
assert(JSON.stringify(toList(mergeKLists([fromList([1,2]), null]))) === JSON.stringify([1,2]));
console.log('all tests pass');
