function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function numIslands(grid: string[][]): number {
    if (grid.length === 0) return 0;
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    function bfs(r: number, c: number): void {
        const q: [number, number][] = [[r, c]];
        grid[r][c] = '0';
        while (q.length > 0) {
            const [x, y] = q.shift()!;
            for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
                const nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] === '1') {
                    grid[nx][ny] = '0';
                    q.push([nx, ny]);
                }
            }
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                count++;
                bfs(r, c);
            }
        }
    }
    return count;
}

const g1 = [['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']];
assert(numIslands(g1) === 1);
const g2 = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']];
assert(numIslands(g2) === 3);
assert(numIslands([]) === 0);
assert(numIslands([['1']]) === 1);
assert(numIslands([['0']]) === 0);
const g3 = [['1','1'],['1','1']];
assert(numIslands(g3) === 1);
console.log('all tests pass');
