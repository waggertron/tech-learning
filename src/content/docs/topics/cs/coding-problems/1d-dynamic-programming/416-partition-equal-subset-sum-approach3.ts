function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canPartition(nums: number[]): boolean {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;
    const target = total / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    for (const x of nums) {
        for (let s = target; s >= x; s--) {
            dp[s] = dp[s] || dp[s - x];
        }
    }
    return dp[target];
}

assert(canPartition([1, 5, 11, 5]) === true);
assert(canPartition([1, 2, 3, 5]) === false);
assert(canPartition([1]) === false);
assert(canPartition([2, 2]) === true);
assert(canPartition([1, 2, 5]) === false);
assert(canPartition([3, 3, 3, 4, 5]) === true);
console.log("all tests pass");
