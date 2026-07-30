function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minSubArrayLen(target: number, nums: number[]): number {
    let left = 0;
    let total = 0;
    let best = nums.length + 1;

    for (let right = 0; right < nums.length; right++) {   // L1: right expands n times
        total += nums[right];                             // L2: O(1) add entering value
        while (total >= target) {                         // L3: shrink while window is valid
            best = Math.min(best, right - left + 1);      // L4: O(1) record current length
            total -= nums[left];                          // L5: O(1) remove leaving value
            left++;                                       // L6: left advances at most n times
        }
    }

    return best === nums.length + 1 ? 0 : best;           // L7: O(1)
}

assert(minSubArrayLen(7, [2, 3, 1, 2, 4, 3]) === 2);
assert(minSubArrayLen(4, [1, 4, 4]) === 1);
assert(minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1]) === 0);
assert(minSubArrayLen(3, [1, 1, 1]) === 3);
assert(minSubArrayLen(15, [5, 1, 3, 5, 10, 7, 4, 9, 2, 8]) === 2);
console.log('all tests pass');
