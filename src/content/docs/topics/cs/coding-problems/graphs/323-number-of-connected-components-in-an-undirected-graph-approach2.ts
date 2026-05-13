function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function countComponents(n: number, edges: number[][]): number {
    const parent = Array.from({ length: n }, (_, i) => i);
    let count = n;

    function find(x: number): number {
        while (parent[x] !== x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    for (const [u, v] of edges) {
        const ru = find(u), rv = find(v);
        if (ru !== rv) {
            parent[ru] = rv;
            count--;
        }
    }
    return count;
}

assert(countComponents(5, [[0,1],[1,2],[3,4]]) === 2);
assert(countComponents(5, [[0,1],[1,2],[2,3],[3,4]]) === 1);
assert(countComponents(4, []) === 4);
assert(countComponents(1, []) === 1);
assert(countComponents(3, [[0,1],[1,2],[0,2]]) === 1);
console.log('all tests pass');
