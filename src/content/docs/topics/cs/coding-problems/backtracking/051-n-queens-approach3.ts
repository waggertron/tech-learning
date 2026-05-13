function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function solveNQueens(n: number): string[][] {
    const result: string[][] = [];
    const colsUsed = new Set<number>();
    const diag1 = new Set<number>();  // row + col
    const diag2 = new Set<number>();  // row - col
    const placement: number[] = new Array(n).fill(-1);

    function backtrack(r: number): void {
        if (r === n) {
            const board = Array.from({ length: n }, (_, i) =>
                Array.from({ length: n }, (_, j) => placement[i] === j ? 'Q' : '.').join('')
            );
            result.push(board);                       // L1: O(n^2) build board
            return;
        }
        for (let c = 0; c < n; c++) {
            if (colsUsed.has(c) || diag1.has(r + c) || diag2.has(r - c))
                continue;                             // L2: O(1) conflict check
            colsUsed.add(c);                          // L3: O(1) mark column
            diag1.add(r + c);                         // L4: O(1) mark anti-diag
            diag2.add(r - c);                         // L5: O(1) mark main diag
            placement[r] = c;
            backtrack(r + 1);                         // L6: recurse to next row
            colsUsed.delete(c);                       // L7: O(1) unmark
            diag1.delete(r + c);
            diag2.delete(r - c);
        }
    }

    backtrack(0);
    return result;
}

assert(JSON.stringify(solveNQueens(1)) === JSON.stringify([['Q']]));
const r4 = solveNQueens(4);
assert(r4.length === 2);
assert(
    JSON.stringify(r4.sort()) ===
    JSON.stringify([['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']].sort())
);
assert(solveNQueens(5).length === 10);
assert(solveNQueens(2).length === 0);
assert(solveNQueens(3).length === 0);
console.log('all tests pass');
