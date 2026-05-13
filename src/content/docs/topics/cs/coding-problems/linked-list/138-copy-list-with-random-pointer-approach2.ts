function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class Node {
    val: number;
    next: Node | null;
    random: Node | null;
    constructor(val: number = 0, next: Node | null = null, random: Node | null = null) {
        this.val = val; this.next = next; this.random = random;
    }
}

function copyRandomList(head: Node | null): Node | null {
    if (!head) return null;
    const oldToNew = new Map<Node, Node>();
    let cur: Node | null = head;
    while (cur) { oldToNew.set(cur, new Node(cur.val)); cur = cur.next; }
    cur = head;
    while (cur) {
        oldToNew.get(cur)!.next = cur.next ? oldToNew.get(cur.next)! : null;
        oldToNew.get(cur)!.random = cur.random ? oldToNew.get(cur.random)! : null;
        cur = cur.next;
    }
    return oldToNew.get(head)!;
}

assert(copyRandomList(null) === null);
const n1 = new Node(1); n1.random = n1;
const copy1 = copyRandomList(n1);
assert(copy1 !== null && copy1 !== n1 && copy1!.val === 1 && copy1!.random === copy1);
const a = new Node(7); const b = new Node(13); a.next = b; b.random = a;
const copy2 = copyRandomList(a);
assert(copy2 !== null && copy2 !== a && copy2!.val === 7 && copy2!.next!.val === 13 && copy2!.next!.random === copy2);
console.log('all tests pass');
