function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function missingNumber(nums: number[]): number {
    const n = nums.length;                              // L1: O(1)
    return n * (n + 1) / 2 - nums.reduce((a, b) => a + b, 0); // L2: O(n)
}

assert(missingNumber([3, 0, 1]) === 2);
assert(missingNumber([0, 1]) === 2);
assert(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]) === 8);
assert(missingNumber([0]) === 1);
assert(missingNumber([1]) === 0);
assert(missingNumber([0, 1, 2, 4, 5]) === 3);
console.log("all tests pass");
