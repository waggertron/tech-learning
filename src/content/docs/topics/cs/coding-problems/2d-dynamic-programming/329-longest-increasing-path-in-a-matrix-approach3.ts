function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestIncreasingPath(matrix: number[][]): number {
    if (!matrix.length) return 0;
    const rows = matrix.length, cols = matrix[0].length;
    const inDeg: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] < matrix[r][c]) {
                    inDeg[r][c]++;
                }
            }
        }
    }
    const queue: [number, number][] = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (inDeg[r][c] === 0) queue.push([r, c]);
    let levels = 0, qi = 0;
    while (qi < queue.length) {
        levels++;
        const size = queue.length - qi;
        for (let s = 0; s < size; s++) {
            const [r, c] = queue[qi++];
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c]) {
                    if (--inDeg[nr][nc] === 0) queue.push([nr, nc]);
                }
            }
        }
    }
    return levels;
}

assert(longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]]) === 4);
assert(longestIncreasingPath([[3, 4, 5], [3, 2, 6], [2, 2, 1]]) === 4);
assert(longestIncreasingPath([[1]]) === 1);
assert(longestIncreasingPath([[1, 1], [1, 1]]) === 1);
assert(longestIncreasingPath([[1, 2, 3, 4]]) === 4);
console.log("all tests pass");
