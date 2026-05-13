function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function largestRectangleArea(heights: number[]): number {
    const h = [...heights, 0];               // L3: sentinel appended
    const stack: number[] = [];
    let best = 0;
    for (let i = 0; i < h.length; i++) {    // L4: n+1 iterations
        while (stack.length && h[stack[stack.length - 1]] > h[i]) {  // L5: pop taller bars
            const top = stack.pop()!;        // L6: O(1) amortized pop
            const height = h[top];           // L7: O(1)
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;  // L8: O(1) width
            best = Math.max(best, height * width);  // L9: O(1) update
        }
        stack.push(i);                       // L10: O(1) push
    }
    return best;
}

assert(largestRectangleArea([2, 1, 5, 6, 2, 3]) === 10);
assert(largestRectangleArea([2, 4]) === 4);
assert(largestRectangleArea([1]) === 1);
assert(largestRectangleArea([6, 5, 4, 3, 2, 1]) === 12);
assert(largestRectangleArea([1, 2, 3, 4, 5, 6]) === 12);
assert(largestRectangleArea([2, 0, 2]) === 2);
console.log('all tests pass');
