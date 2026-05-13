function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minCostConnectPoints(points: number[][]): number {
    const n = points.length;
    const edges: [number, number, number][] = [];
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) {
            const d = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
            edges.push([d, i, j]);
        }
    edges.sort((a, b) => a[0] - b[0]);

    const parent = Array.from({ length: n }, (_, i) => i);
    function find(x: number): number {
        while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }

    let total = 0, added = 0;
    for (const [d, i, j] of edges) {
        const ri = find(i), rj = find(j);
        if (ri !== rj) {
            parent[ri] = rj;
            total += d;
            if (++added === n - 1) break;
        }
    }
    return total;
}

assert(minCostConnectPoints([[0,0],[2,2],[3,10],[5,2],[7,0]]) === 20);
assert(minCostConnectPoints([[3,12],[-2,5],[-4,1]]) === 18);
assert(minCostConnectPoints([[0,0]]) === 0);
assert(minCostConnectPoints([[0,0],[1,1]]) === 2);
assert(minCostConnectPoints([[0,0],[1,0],[2,0],[3,0]]) === 3);
console.log('all tests pass');
