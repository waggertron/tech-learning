function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function solve(board: string[][]): void {
    if (board.length === 0) return;
    const rows = board.length, cols = board[0].length;

    function dfs(r: number, c: number): void {
        if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== 'O') return;
        board[r][c] = 'T';
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
    }

    for (let c = 0; c < cols; c++) { dfs(0, c); dfs(rows - 1, c); }
    for (let r = 0; r < rows; r++) { dfs(r, 0); dfs(r, cols - 1); }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 'O') board[r][c] = 'X';
            else if (board[r][c] === 'T') board[r][c] = 'O';
        }
    }
}

const b1 = [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']];
solve(b1);
assert(JSON.stringify(b1) === JSON.stringify([['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']]));
const b2 = [['X','X'],['X','X']];
solve(b2);
assert(JSON.stringify(b2) === JSON.stringify([['X','X'],['X','X']]));
const b3 = [['O']];
solve(b3);
assert(JSON.stringify(b3) === JSON.stringify([['O']]));
const b4 = [['O','O','O'],['O','X','O'],['O','O','O']];
solve(b4);
assert(JSON.stringify(b4) === JSON.stringify([['O','O','O'],['O','X','O'],['O','O','O']]));
const b5 = [['X','X','X'],['X','O','X'],['X','X','X']];
solve(b5);
assert(JSON.stringify(b5) === JSON.stringify([['X','X','X'],['X','X','X'],['X','X','X']]));
console.log('all tests pass');
