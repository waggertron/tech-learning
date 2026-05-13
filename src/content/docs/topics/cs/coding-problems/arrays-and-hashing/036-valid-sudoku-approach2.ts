function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isValidSudoku(board: string[][]): boolean {
    const rows: Set<string>[] = Array.from({ length: 9 }, () => new Set()); // L1
    const cols: Set<string>[] = Array.from({ length: 9 }, () => new Set()); // L2
    const boxes: Set<string>[] = Array.from({ length: 9 }, () => new Set()); // L3
    for (let r = 0; r < 9; r++) {                    // L4
        for (let c = 0; c < 9; c++) {                // L5
            const ch = board[r][c];                  // L6
            if (ch === '.') continue;                 // L7
            const b = Math.floor(r / 3) * 3 + Math.floor(c / 3); // L8
            if (rows[r].has(ch) || cols[c].has(ch) || boxes[b].has(ch)) return false; // L9
            rows[r].add(ch);                         // L10
            cols[c].add(ch);                         // L11
            boxes[b].add(ch);                        // L12
        }
    }
    return true;
}

const validBoard = [['5','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],['.','9','8','.','.','.','.','6','.'],['8','.','.','.','6','.','.','.','3'],['4','.','.','8','.','3','.','.','1'],['7','.','.','.','2','.','.','.','6'],['.','6','.','.','.','.','2','8','.'],['.','.','.','4','1','9','.','.','5'],['.','.','.','.','8','.','.','7','9']];
assert(isValidSudoku(validBoard) === true);
const dupRow = [['8','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],['.','9','8','.','.','.','.','6','.'],['8','.','.','.','6','.','.','.','3'],['4','.','.','8','.','3','.','.','1'],['7','.','.','.','2','.','.','.','6'],['.','6','.','.','.','.','2','8','.'],['.','.','.','4','1','9','.','.','5'],['.','.','.','.','8','.','.','7','9']];
assert(isValidSudoku(dupRow) === false);
assert(isValidSudoku(Array.from({ length: 9 }, () => Array(9).fill('.'))) === true);
console.log("all tests pass");
