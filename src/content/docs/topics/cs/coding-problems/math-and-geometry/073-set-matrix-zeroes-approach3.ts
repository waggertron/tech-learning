function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function setZeroes(matrix: number[][]): void {
    const rows = matrix.length, cols = matrix[0].length;
    const firstRowZero = matrix[0].some(v => v === 0);             // L1: O(n)
    const firstColZero = matrix.some(row => row[0] === 0);         // L2: O(m)

    // Use first row/col as markers
    for (let r = 1; r < rows; r++) {                               // L3: mark pass
        for (let c = 1; c < cols; c++) {
            if (matrix[r][c] === 0) {
                matrix[r][0] = 0;                                  // L4: O(1)
                matrix[0][c] = 0;                                  // L5: O(1)
            }
        }
    }

    // Zero based on markers
    for (let r = 1; r < rows; r++) {                               // L6: apply pass
        for (let c = 1; c < cols; c++) {
            if (matrix[r][0] === 0 || matrix[0][c] === 0) {
                matrix[r][c] = 0;                                  // L7: O(1)
            }
        }
    }

    if (firstRowZero) for (let c = 0; c < cols; c++) matrix[0][c] = 0;  // L8: O(n)
    if (firstColZero) for (let r = 0; r < rows; r++) matrix[r][0] = 0;  // L9: O(m)
}

const m = [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
setZeroes(m);
assert(JSON.stringify(m) === JSON.stringify([[1, 0, 1], [0, 0, 0], [1, 0, 1]]));
const m2 = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]];
setZeroes(m2);
assert(JSON.stringify(m2) === JSON.stringify([[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]));
const m3 = [[1]];
setZeroes(m3);
assert(JSON.stringify(m3) === JSON.stringify([[1]]));
const m4 = [[0]];
setZeroes(m4);
assert(JSON.stringify(m4) === JSON.stringify([[0]]));
console.log('all tests pass');
