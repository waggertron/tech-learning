function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function rob(nums: number[]): number {
    function robRange(lo: number, hi: number): number {
        let prev2 = 0, prev1 = 0;
        for (let i = lo; i < hi; i++) {
            [prev2, prev1] = [prev1, Math.max(prev1, prev2 + nums[i])];
        }
        return prev1;
    }
    if (nums.length === 1) return nums[0];
    return Math.max(robRange(0, nums.length - 1), robRange(1, nums.length));
}

assert(rob([2, 3, 2]) === 3);
assert(rob([1, 2, 3, 1]) === 4);
assert(rob([1, 2, 3]) === 3);
assert(rob([5]) === 5);
assert(rob([1, 3]) === 3);
assert(rob([2, 7, 9, 3, 1]) === 11);
console.log("all tests pass");
