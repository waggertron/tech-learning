function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function rotate(matrix: number[][]): void {
    const n = matrix.length;                                     // L1: O(1)
    for (let r = 0; r < Math.floor(n / 2); r++) {              // L2: n/2 rings
        for (let c = r; c < n - r - 1; c++) {                  // L3: n-2r-1 cells per ring
            const tmp = matrix[r][c];                            // L4: save top-left
            matrix[r][c] = matrix[n - 1 - c][r];               // L5: left -> top
            matrix[n - 1 - c][r] = matrix[n - 1 - r][n - 1 - c]; // L6: bottom -> left
            matrix[n - 1 - r][n - 1 - c] = matrix[c][n - 1 - r]; // L7: right -> bottom
            matrix[c][n - 1 - r] = tmp;                         // L8: top -> right
        }
    }
}

const m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
rotate(m);
assert(JSON.stringify(m) === JSON.stringify([[7, 4, 1], [8, 5, 2], [9, 6, 3]]));
const m2 = [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]];
rotate(m2);
assert(JSON.stringify(m2) === JSON.stringify([[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]));
const m3 = [[1]];
rotate(m3);
assert(JSON.stringify(m3) === JSON.stringify([[1]]));
const m4 = [[1, 2], [3, 4]];
rotate(m4);
assert(JSON.stringify(m4) === JSON.stringify([[3, 1], [4, 2]]));
console.log('all tests pass');
