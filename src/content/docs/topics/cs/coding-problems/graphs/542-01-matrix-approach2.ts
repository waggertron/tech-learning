function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function updateMatrix(mat: number[][]): number[][] {
    const rows = mat.length, cols = mat[0].length;
    const dist: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(Infinity));
    const q: [number, number][] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (mat[r][c] === 0) { dist[r][c] = 0; q.push([r, c]); }
        }
    }
    let head = 0;
    while (head < q.length) {
        const [r, c] = q[head++];
        for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && dist[nr][nc] === Infinity) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push([nr, nc]);
            }
        }
    }
    return dist;
}

assert(JSON.stringify(updateMatrix([[0,0,0],[0,1,0],[0,0,0]])) === JSON.stringify([[0,0,0],[0,1,0],[0,0,0]]));
assert(JSON.stringify(updateMatrix([[0,0,0],[0,1,0],[1,1,1]])) === JSON.stringify([[0,0,0],[0,1,0],[1,2,1]]));
assert(JSON.stringify(updateMatrix([[0,0],[0,0]])) === JSON.stringify([[0,0],[0,0]]));
assert(JSON.stringify(updateMatrix([[0]])) === JSON.stringify([[0]]));
assert(JSON.stringify(updateMatrix([[0,0,0],[0,0,0],[0,0,1]])) === JSON.stringify([[0,0,0],[0,0,0],[0,0,1]]));
console.log('all tests pass');
