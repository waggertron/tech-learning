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
    // TODO: implement
    return null;
}

function _runTests(): void {
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
    assert(ca.neighbors.length === 1);
    const cb = ca.neighbors[0];
    assert(cb !== b);
    assert(cb.val === 2);
    assert(cb.neighbors[0] === ca);

    const nodes = [new Node(1), new Node(2), new Node(3), new Node(4)];
    nodes[0].neighbors = [nodes[1], nodes[3]];
    nodes[1].neighbors = [nodes[0], nodes[2]];
    nodes[2].neighbors = [nodes[1], nodes[3]];
    nodes[3].neighbors = [nodes[2], nodes[0]];
    const rootClone = cloneGraph(nodes[0])!;
    const visited = new Map<number, Node>();
    const q: Node[] = [rootClone];
    while (q.length > 0) {
        const cur = q.shift()!;
        if (visited.has(cur.val)) continue;
        visited.set(cur.val, cur);
        for (const nb of cur.neighbors) q.push(nb);
    }
    assert(new Set(visited.keys()).size === 4);
    for (const orig of nodes) assert(!Array.from(visited.values()).includes(orig));

    // perf
    const bigNodes = Array.from({ length: 10_000 }, (_, i) => new Node(i));
    for (let i = 0; i < 9_999; i++) {
        bigNodes[i].neighbors = [bigNodes[i + 1]];
        bigNodes[i + 1].neighbors = [bigNodes[i]];
    }
    const t0 = performance.now();
    cloneGraph(bigNodes[0]);
    console.log(`perf clone-graph 10000-node chain: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
