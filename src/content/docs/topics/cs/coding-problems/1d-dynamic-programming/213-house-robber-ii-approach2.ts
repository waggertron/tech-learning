function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function rob(nums: number[]): number {
    function robLinear(arr: number[]): number {
        let prev2 = 0, prev1 = 0;
        for (const x of arr) {
            [prev2, prev1] = [prev1, Math.max(prev1, prev2 + x)];
        }
        return prev1;
    }
    if (nums.length === 1) return nums[0];
    return Math.max(robLinear(nums.slice(0, -1)), robLinear(nums.slice(1)));
}

assert(rob([2, 3, 2]) === 3);
assert(rob([1, 2, 3, 1]) === 4);
assert(rob([1, 2, 3]) === 3);
assert(rob([5]) === 5);
assert(rob([1, 3]) === 3);
assert(rob([2, 7, 9, 3, 1]) === 11);
console.log("all tests pass");
