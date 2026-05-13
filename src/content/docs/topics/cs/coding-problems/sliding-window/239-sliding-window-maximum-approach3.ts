function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxSlidingWindow(nums: number[], k: number): number[] {
    const dq: number[] = [];   // stores indices; front = max of current window
    const result: number[] = [];
    for (let i = 0; i < nums.length; i++) {          // L1: outer loop, n iterations
        while (dq.length > 0 && dq[0] <= i - k) {   // L2: evict expired front
            dq.shift();                               // L3: O(1) amortized
        }
        while (dq.length > 0 && nums[dq[dq.length - 1]] < nums[i]) {  // L4: remove dominated back
            dq.pop();                                 // L5: O(1)
        }
        dq.push(i);                                   // L6: O(1) push
        if (i >= k - 1) {
            result.push(nums[dq[0]]);                 // L7: O(1) read front
        }
    }
    return result;
}

assert(JSON.stringify(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)) === JSON.stringify([3, 3, 5, 5, 6, 7]));
assert(JSON.stringify(maxSlidingWindow([1], 1)) === JSON.stringify([1]));
assert(JSON.stringify(maxSlidingWindow([1, -1], 1)) === JSON.stringify([1, -1]));
assert(JSON.stringify(maxSlidingWindow([9, 8, 7, 6, 5], 3)) === JSON.stringify([9, 8, 7]));
assert(JSON.stringify(maxSlidingWindow([1, 2, 3, 4, 5], 3)) === JSON.stringify([3, 4, 5]));
console.log('all tests pass');
