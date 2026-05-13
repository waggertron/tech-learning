function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function lengthOfLIS(nums: number[]): number {
    const n = nums.length;
    const dp = new Array(n).fill(1);
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    return Math.max(...dp);
}

assert(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]) === 4);
assert(lengthOfLIS([0, 1, 0, 3, 2, 3]) === 4);
assert(lengthOfLIS([7, 7, 7, 7]) === 1);
assert(lengthOfLIS([1]) === 1);
assert(lengthOfLIS([1, 2, 3, 4, 5]) === 5);
assert(lengthOfLIS([5, 4, 3, 2, 1]) === 1);
console.log("all tests pass");
