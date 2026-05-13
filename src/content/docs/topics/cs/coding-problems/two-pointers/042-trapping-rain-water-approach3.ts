function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function trap(height: number[]): number {
    let l = 0, r = height.length - 1;   // L1: O(1) init pointers
    let leftMax = 0, rightMax = 0;       // L2: O(1) running maxes
    let total = 0;                       // L3: O(1)
    while (l < r) {                      // L4: loop, n iterations total
        if (height[l] < height[r]) {     // L5: O(1) compare sides
            if (height[l] >= leftMax)    // L6: O(1)
                leftMax = height[l];     // L7: O(1) update max
            else
                total += leftMax - height[l]; // L8: O(1) collect water
            l++;                         // L9: O(1) advance left
        } else {
            if (height[r] >= rightMax)   // L10: O(1)
                rightMax = height[r];    // L11: O(1) update max
            else
                total += rightMax - height[r]; // L12: O(1) collect water
            r--;                         // L13: O(1) advance right
        }
    }
    return total;
}

assert(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) === 6);
assert(trap([4, 2, 0, 3, 2, 5]) === 9);
assert(trap([]) === 0);
assert(trap([3]) === 0);
assert(trap([3, 0, 3]) === 3);
assert(trap([1, 0, 1]) === 1);
console.log('all tests pass');
