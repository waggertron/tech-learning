function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function searchMatrix(matrix: number[][], target: number): boolean {
    const m = matrix.length, n = matrix[0].length;
    let lo = 0, hi = m * n - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const r = Math.floor(mid / n), c = mid % n;
        if (matrix[r][c] === target) return true;
        if (matrix[r][c] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}

const mat = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
assert(searchMatrix(mat, 3) === true);
assert(searchMatrix(mat, 13) === false);
assert(searchMatrix([[1]], 1) === true);
assert(searchMatrix([[1]], 2) === false);
assert(searchMatrix([[1, 3]], 3) === true);
assert(searchMatrix([[1], [3]], 1) === true);
console.log("all tests pass");
