function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function shortestPathBinaryMatrix(grid: number[][]): number {
    const n = grid.length;
    if (grid[0][0] === 1 || grid[n-1][n-1] === 1) return -1;
    if (n === 1) return 1;
    const q: [number, number, number][] = [[0, 0, 1]];
    grid[0][0] = 1;
    const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    let head = 0;
    while (head < q.length) {
        const [r, c, dist] = q[head++];
        for (const [dr, dc] of DIRS) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
                if (nr === n - 1 && nc === n - 1) return dist + 1;
                grid[nr][nc] = 1;
                q.push([nr, nc, dist + 1]);
            }
        }
    }
    return -1;
}

assert(shortestPathBinaryMatrix([[0,1],[1,0]]) === 2);
assert(shortestPathBinaryMatrix([[0,0,0],[1,1,0],[1,1,0]]) === 4);
assert(shortestPathBinaryMatrix([[1,0,0],[1,1,0],[1,1,0]]) === -1);
assert(shortestPathBinaryMatrix([[0,0,0],[0,0,0],[0,0,1]]) === -1);
assert(shortestPathBinaryMatrix([[0]]) === 1);
assert(shortestPathBinaryMatrix([[1]]) === -1);
assert(shortestPathBinaryMatrix([[0,0],[0,0]]) === 2);
console.log('all tests pass');
