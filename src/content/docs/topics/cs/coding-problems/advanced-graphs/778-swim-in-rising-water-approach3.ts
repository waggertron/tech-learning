function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function swimInWater(grid: number[][]): number {
    const n = grid.length;
    const cells: [number, number, number][] = [];
    for (let r = 0; r < n; r++)
        for (let c = 0; c < n; c++)
            cells.push([grid[r][c], r, c]);
    cells.sort((a, b) => a[0] - b[0]);

    const parent = Array.from({ length: n * n }, (_, i) => i);
    const active = new Array(n * n).fill(false);

    function find(x: number): number {
        while (parent[x] !== x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }

    function union(a: number, b: number): void {
        const ra = find(a), rb = find(b);
        if (ra !== rb) parent[ra] = rb;
    }

    for (const [v, r, c] of cells) {
        const idx = r * n + c;
        active[idx] = true;
        for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && active[nr * n + nc]) {
                union(idx, nr * n + nc);
            }
        }
        if (find(0) === find(n * n - 1)) return v;
    }
    return -1;
}

assert(swimInWater([[0,2],[1,3]]) === 3);
assert(swimInWater([[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]) === 16);
assert(swimInWater([[0]]) === 0);
assert(swimInWater([[7]]) === 7);
assert(swimInWater([[0,1],[3,2]]) === 2);
console.log('all tests pass');
