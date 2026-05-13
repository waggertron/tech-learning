function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function largestRectangleArea(heights: number[]): number {
    const n = heights.length;
    const left = new Array(n).fill(-1);
    const right = new Array(n).fill(n);

    let stack: number[] = [];
    for (let i = 0; i < n; i++) {
        while (stack.length && heights[stack[stack.length - 1]] >= heights[i])
            stack.pop();
        left[i] = stack.length ? stack[stack.length - 1] : -1;
        stack.push(i);
    }

    stack = [];
    for (let i = n - 1; i >= 0; i--) {
        while (stack.length && heights[stack[stack.length - 1]] >= heights[i])
            stack.pop();
        right[i] = stack.length ? stack[stack.length - 1] : n;
        stack.push(i);
    }

    let best = 0;
    for (let i = 0; i < n; i++)
        best = Math.max(best, heights[i] * (right[i] - left[i] - 1));
    return best;
}

assert(largestRectangleArea([2, 1, 5, 6, 2, 3]) === 10);
assert(largestRectangleArea([2, 4]) === 4);
assert(largestRectangleArea([1]) === 1);
assert(largestRectangleArea([6, 5, 4, 3, 2, 1]) === 12);
assert(largestRectangleArea([1, 2, 3, 4, 5, 6]) === 12);
assert(largestRectangleArea([2, 0, 2]) === 2);
console.log('all tests pass');
