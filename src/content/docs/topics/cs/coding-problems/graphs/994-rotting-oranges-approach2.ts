function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function orangesRotting(grid: number[][]): number {
    const rows = grid.length, cols = grid[0].length;
    const q: [number, number, number][] = [];
    let fresh = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 2) q.push([r, c, 0]);
            else if (grid[r][c] === 1) fresh++;
        }
    }

    let time = 0, head = 0;
    while (head < q.length) {
        const [r, c, t] = q[head++];
        time = t;
        for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
                grid[nr][nc] = 2;
                fresh--;
                q.push([nr, nc, t + 1]);
            }
        }
    }
    return fresh === 0 ? time : -1;
}

assert(orangesRotting([[2,1,1],[1,1,0],[0,1,1]]) === 4);
assert(orangesRotting([[2,1,1],[0,1,1],[1,0,1]]) === -1);
assert(orangesRotting([[0,2]]) === 0);
assert(orangesRotting([[1,1],[1,1]]) === -1);
assert(orangesRotting([[0]]) === 0);
assert(orangesRotting([[2,1]]) === 1);
console.log('all tests pass');
