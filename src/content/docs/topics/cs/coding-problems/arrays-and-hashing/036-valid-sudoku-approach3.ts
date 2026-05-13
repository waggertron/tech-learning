function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isValidSudoku(board: string[][]): boolean {
    const rows = new Array(9).fill(0);               // L1
    const cols = new Array(9).fill(0);               // L2
    const boxes = new Array(9).fill(0);              // L3
    for (let r = 0; r < 9; r++) {                   // L4
        for (let c = 0; c < 9; c++) {               // L5
            const ch = board[r][c];                  // L6
            if (ch === '.') continue;                // L7
            const bit = 1 << (parseInt(ch) - 1);    // L8: bitmask
            const b = Math.floor(r / 3) * 3 + Math.floor(c / 3); // L9
            if (rows[r] & bit || cols[c] & bit || boxes[b] & bit) return false; // L10
            rows[r] |= bit;                          // L11
            cols[c] |= bit;                          // L12
            boxes[b] |= bit;                         // L13
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
