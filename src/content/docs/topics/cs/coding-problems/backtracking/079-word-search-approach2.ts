function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function exist(board: string[][], word: string): boolean {
    const rows = board.length;
    const cols = board[0].length;

    function dfs(r: number, c: number, i: number): boolean {
        if (i === word.length) return true;                               // L1: full match
        if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[i])
            return false;                                                 // L2: boundary / mismatch
        const saved = board[r][c];
        board[r][c] = '#';                                               // L3: O(1) mark in-place
        const found = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) ||
                      dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);    // L4: 4 recursive calls
        board[r][c] = saved;                                             // L5: O(1) restore
        return found;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }
    return false;
}

const b = (): string[][] => [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']];
assert(exist(b(), 'ABCCED') === true);
assert(exist(b(), 'SEE') === true);
assert(exist(b(), 'ABCB') === false);
assert(exist([['A']], 'A') === true);
assert(exist([['A']], 'B') === false);
console.log('all tests pass');
