function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findRedundantConnection(edges: number[][]): number[] {
    const n = edges.length;
    const parent = Array.from({ length: n + 1 }, (_, i) => i);

    function find(x: number): number {
        while (parent[x] !== x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    function union(a: number, b: number): boolean {
        const ra = find(a), rb = find(b);
        if (ra === rb) return false;
        parent[ra] = rb;
        return true;
    }

    for (const [u, v] of edges) {
        if (!union(u, v)) return [u, v];
    }
    return [];
}

assert(JSON.stringify(findRedundantConnection([[1,2],[1,3],[2,3]])) === JSON.stringify([2, 3]));
assert(JSON.stringify(findRedundantConnection([[1,2],[2,3],[3,4],[1,4],[1,5]])) === JSON.stringify([1, 4]));
assert(JSON.stringify(findRedundantConnection([[1,2],[1,2]])) === JSON.stringify([1, 2]));
assert(JSON.stringify(findRedundantConnection([[1,2],[2,3],[1,3]])) === JSON.stringify([1, 3]));
assert(JSON.stringify(findRedundantConnection([[1,2],[2,3],[3,4],[4,5],[3,5]])) === JSON.stringify([3, 5]));
console.log('all tests pass');
