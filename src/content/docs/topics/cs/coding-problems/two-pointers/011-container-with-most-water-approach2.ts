function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxArea(height: number[]): number {
    let l = 0, r = height.length - 1;   // L1: O(1) init pointers
    let best = 0;                        // L2: O(1)
    while (l < r) {                      // L3: loop, at most n iterations total
        const area = Math.min(height[l], height[r]) * (r - l); // L4: O(1) area
        best = Math.max(best, area);     // L5: O(1) update
        if (height[l] < height[r]) l++; // L6/L7: O(1) advance left
        else r--;                        // L8: O(1) advance right
    }
    return best;
}

assert(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) === 49);
assert(maxArea([1, 1]) === 1);
assert(maxArea([1, 2, 1]) === 2);
assert(maxArea([4, 3, 2, 1, 4]) === 16);
assert(maxArea([1, 2, 4, 3]) === 4);
console.log('all tests pass');
