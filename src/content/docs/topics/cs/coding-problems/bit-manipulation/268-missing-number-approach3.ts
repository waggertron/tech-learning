function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function missingNumber(nums: number[]): number {
    let result = nums.length;               // L1: O(1), start with n
    for (let i = 0; i < nums.length; i++) { // L2: single pass, n iterations
        result ^= i ^ nums[i];              // L3: O(1), cancel paired values
    }
    return result;
}

assert(missingNumber([3, 0, 1]) === 2);
assert(missingNumber([0, 1]) === 2);
assert(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]) === 8);
assert(missingNumber([0]) === 1);
assert(missingNumber([1]) === 0);
assert(missingNumber([0, 1, 2, 4, 5]) === 3);
console.log("all tests pass");
