function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function rob(nums: number[]): number {
    const n = nums.length;
    if (n === 1) return nums[0];
    const dp = new Array(n).fill(0);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);
    }
    return dp[n - 1];
}

assert(rob([1, 2, 3, 1]) === 4);
assert(rob([2, 7, 9, 3, 1]) === 12);
assert(rob([0]) === 0);
assert(rob([5]) === 5);
assert(rob([2, 1]) === 2);
assert(rob([1, 3, 1, 3, 100]) === 103);
console.log("all tests pass");
