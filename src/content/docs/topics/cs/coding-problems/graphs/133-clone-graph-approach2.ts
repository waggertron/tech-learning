function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class Node {
    val: number;
    neighbors: Node[];
    constructor(val: number = 0, neighbors: Node[] = []) {
        this.val = val;
        this.neighbors = neighbors;
    }
}

function cloneGraph(node: Node | null): Node | null {
    if (!node) return null;
    const oldToNew = new Map<Node, Node>();
    oldToNew.set(node, new Node(node.val));
    const q: Node[] = [node];
    while (q.length > 0) {
        const cur = q.shift()!;
        for (const nb of cur.neighbors) {
            if (!oldToNew.has(nb)) {
                oldToNew.set(nb, new Node(nb.val));
                q.push(nb);
            }
            oldToNew.get(cur)!.neighbors.push(oldToNew.get(nb)!);
        }
    }
    return oldToNew.get(node)!;
}

assert(cloneGraph(null) === null);
const n1 = new Node(1);
const c1 = cloneGraph(n1)!;
assert(c1 !== n1);
assert(c1.val === 1);
assert(c1.neighbors.length === 0);
const a = new Node(1);
const b = new Node(2);
a.neighbors = [b];
b.neighbors = [a];
const ca = cloneGraph(a)!;
assert(ca !== a);
assert(ca.val === 1);
const cb = ca.neighbors[0];
assert(cb !== b);
assert(cb.val === 2);
assert(cb.neighbors[0] === ca);
console.log('all tests pass');
