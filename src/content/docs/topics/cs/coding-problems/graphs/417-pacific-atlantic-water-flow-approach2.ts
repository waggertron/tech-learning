function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function pacificAtlantic(heights: number[][]): number[][] {
    if (heights.length === 0) return [];
    const rows = heights.length, cols = heights[0].length;
    const pac = new Set<string>();
    const atl = new Set<string>();

    function dfs(r: number, c: number, visited: Set<string>): void {
        const key = `${r},${c}`;
        if (visited.has(key)) return;
        visited.add(key);
        for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && heights[nr][nc] >= heights[r][c]) {
                dfs(nr, nc, visited);
            }
        }
    }

    for (let c = 0; c < cols; c++) { dfs(0, c, pac); dfs(rows - 1, c, atl); }
    for (let r = 0; r < rows; r++) { dfs(r, 0, pac); dfs(r, cols - 1, atl); }

    const result: number[][] = [];
    for (const key of pac) {
        if (atl.has(key)) {
            const [r, c] = key.split(',').map(Number);
            result.push([r, c]);
        }
    }
    return result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

const h1 = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]];
assert(JSON.stringify(pacificAtlantic(h1)) === JSON.stringify([[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]));
assert(JSON.stringify(pacificAtlantic([[5]])) === JSON.stringify([[0,0]]));
const r2 = pacificAtlantic([[1,1],[1,1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
assert(JSON.stringify(r2) === JSON.stringify([[0,0],[0,1],[1,0],[1,1]]));
const r3 = pacificAtlantic([[1,2,3],[4,5,6],[7,8,9]]);
assert(r3.some(p => p[0] === 2 && p[1] === 2));
assert(JSON.stringify(pacificAtlantic([])) === JSON.stringify([]));
console.log('all tests pass');
