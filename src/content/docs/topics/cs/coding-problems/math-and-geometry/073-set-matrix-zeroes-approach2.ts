function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function setZeroes(matrix: number[][]): void {
    const rows = matrix.length, cols = matrix[0].length;    // L1: O(1)
    const zeroRows = new Array(rows).fill(false);           // L2: O(m)
    const zeroCols = new Array(cols).fill(false);           // L3: O(n)

    for (let r = 0; r < rows; r++) {                       // L4: first pass, m*n iterations
        for (let c = 0; c < cols; c++) {
            if (matrix[r][c] === 0) {
                zeroRows[r] = true;                        // L5: O(1)
                zeroCols[c] = true;                        // L6: O(1)
            }
        }
    }

    for (let r = 0; r < rows; r++) {                       // L7: second pass, m*n iterations
        for (let c = 0; c < cols; c++) {
            if (zeroRows[r] || zeroCols[c]) {
                matrix[r][c] = 0;                          // L8: O(1)
            }
        }
    }
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
