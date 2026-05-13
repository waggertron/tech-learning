function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function spiralOrder(matrix: number[][]): number[] {
    if (!matrix.length) return [];
    const result: number[] = [];
    let top = 0, bottom = matrix.length - 1;    // L1: O(1)
    let left = 0, right = matrix[0].length - 1; // L2: O(1)

    while (top <= bottom && left <= right) {     // L3: outer loop, min(m,n)/2 rounds
        for (let c = left; c <= right; c++)      // L4: walk top row
            result.push(matrix[top][c]);         // L5: O(1) amortized
        top++;                                   // L6: shrink
        for (let r = top; r <= bottom; r++)      // L7: walk right col
            result.push(matrix[r][right]);
        right--;
        if (top <= bottom) {
            for (let c = right; c >= left; c--)  // L8: walk bottom row
                result.push(matrix[bottom][c]);
            bottom--;
        }
        if (left <= right) {
            for (let r = bottom; r >= top; r--)  // L9: walk left col
                result.push(matrix[r][left]);
            left++;
        }
    }
    return result;
}

assert(JSON.stringify(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])) === JSON.stringify([1, 2, 3, 6, 9, 8, 7, 4, 5]));
assert(JSON.stringify(spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])) === JSON.stringify([1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]));
assert(JSON.stringify(spiralOrder([[1]])) === JSON.stringify([1]));
assert(JSON.stringify(spiralOrder([[1, 2], [3, 4]])) === JSON.stringify([1, 2, 4, 3]));
assert(JSON.stringify(spiralOrder([[1], [2], [3]])) === JSON.stringify([1, 2, 3]));
assert(JSON.stringify(spiralOrder([[1, 2, 3]])) === JSON.stringify([1, 2, 3]));
console.log('all tests pass');
