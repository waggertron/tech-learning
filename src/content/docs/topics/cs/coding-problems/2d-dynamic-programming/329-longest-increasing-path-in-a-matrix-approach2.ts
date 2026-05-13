function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestIncreasingPath(matrix: number[][]): number {
    if (!matrix.length) return 0;
    const rows = matrix.length, cols = matrix[0].length;
    const memo: Map<number, number> = new Map();
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    function dfs(r: number, c: number): number {
        const key = r * cols + c;
        if (memo.has(key)) return memo.get(key)!;
        let best = 1;
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c]) {
                best = Math.max(best, 1 + dfs(nr, nc));
            }
        }
        memo.set(key, best);
        return best;
    }
    let ans = 0;
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            ans = Math.max(ans, dfs(r, c));
    return ans;
}

assert(longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]]) === 4);
assert(longestIncreasingPath([[3, 4, 5], [3, 2, 6], [2, 2, 1]]) === 4);
assert(longestIncreasingPath([[1]]) === 1);
assert(longestIncreasingPath([[1, 1], [1, 1]]) === 1);
assert(longestIncreasingPath([[1, 2, 3, 4]]) === 4);
console.log("all tests pass");
