function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function trap(height: number[]): number {
    const n = height.length;                           // L1: O(1)
    if (n === 0) return 0;                             // L2: O(1) guard
    const leftMax = new Array(n).fill(0);              // L3: O(n)
    const rightMax = new Array(n).fill(0);             // L4: O(n)

    leftMax[0] = height[0];                            // L5: O(1)
    for (let i = 1; i < n; i++)                        // L6: forward pass
        leftMax[i] = Math.max(leftMax[i - 1], height[i]); // L7: O(1)

    rightMax[n - 1] = height[n - 1];                  // L8: O(1)
    for (let i = n - 2; i >= 0; i--)                  // L9: backward pass
        rightMax[i] = Math.max(rightMax[i + 1], height[i]); // L10: O(1)

    let total = 0;
    for (let i = 0; i < n; i++)                        // L11: O(n)
        total += Math.min(leftMax[i], rightMax[i]) - height[i];
    return total;
}

assert(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) === 6);
assert(trap([4, 2, 0, 3, 2, 5]) === 9);
assert(trap([]) === 0);
assert(trap([3]) === 0);
assert(trap([3, 0, 3]) === 3);
assert(trap([1, 0, 1]) === 1);
console.log('all tests pass');
