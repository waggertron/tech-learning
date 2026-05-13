function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function validTree(n: number, edges: number[][]): boolean {
    if (edges.length !== n - 1) return false;
    const parent = Array.from({ length: n }, (_, i) => i);

    function find(x: number): number {
        while (parent[x] !== x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    for (const [u, v] of edges) {
        const ru = find(u), rv = find(v);
        if (ru === rv) return false;
        parent[ru] = rv;
    }
    return true;
}

assert(validTree(5, [[0,1],[0,2],[0,3],[1,4]]) === true);
assert(validTree(5, [[0,1],[1,2],[2,3],[1,3],[1,4]]) === false);
assert(validTree(1, []) === true);
assert(validTree(2, [[0, 1]]) === true);
assert(validTree(2, []) === false);
assert(validTree(3, [[0,1],[1,2],[0,2]]) === false);
console.log('all tests pass');
