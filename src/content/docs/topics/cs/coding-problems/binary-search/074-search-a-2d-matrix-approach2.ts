function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function searchMatrix(matrix: number[][], target: number): boolean {
    for (const row of matrix) {
        if (row[0] <= target && target <= row[row.length - 1]) {
            // binary search within row
            let lo = 0, hi = row.length - 1;
            while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                if (row[mid] === target) return true;
                if (row[mid] < target) lo = mid + 1;
                else hi = mid - 1;
            }
        }
    }
    return false;
}

const m = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
assert(searchMatrix(m, 3) === true);
assert(searchMatrix(m, 13) === false);
assert(searchMatrix([[1]], 1) === true);
assert(searchMatrix([[1]], 2) === false);
assert(searchMatrix([[1, 3]], 3) === true);
assert(searchMatrix([[1], [3]], 1) === true);
console.log("all tests pass");
