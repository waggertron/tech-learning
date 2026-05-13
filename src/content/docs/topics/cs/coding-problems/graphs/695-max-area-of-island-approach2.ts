function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxAreaOfIsland(grid: number[][]): number {
    if (grid.length === 0) return 0;
    const rows = grid.length, cols = grid[0].length;

    function dfs(r: number, c: number): number {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== 1) return 0;
        grid[r][c] = 0;
        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
    }

    let best = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) best = Math.max(best, dfs(r, c));
        }
    }
    return best;
}

assert(maxAreaOfIsland([
    [0,0,1,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0],
    [0,1,1,0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,1,1,0,0,1,0,1,0,0],
    [0,1,0,0,1,1,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0],
]) === 6);
assert(maxAreaOfIsland([[0,0,0,0,0,0,0,0]]) === 0);
assert(maxAreaOfIsland([[1]]) === 1);
assert(maxAreaOfIsland([[0]]) === 0);
assert(maxAreaOfIsland([[1,0,0,1,1],[1,0,0,0,1]]) === 3);
assert(maxAreaOfIsland([[1,1],[1,1]]) === 4);
console.log('all tests pass');
