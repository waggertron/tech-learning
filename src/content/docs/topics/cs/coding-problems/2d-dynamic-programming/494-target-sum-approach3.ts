function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findTargetSumWays(nums: number[], target: number): number {
    const total = nums.reduce((a, b) => a + b, 0);
    if ((total + target) % 2 !== 0 || total < Math.abs(target)) return 0;
    const P = (total + target) / 2;
    const dp: number[] = new Array(P + 1).fill(0);
    dp[0] = 1;
    for (const x of nums) {
        for (let s = P; s >= x; s--) {
            dp[s] += dp[s - x];
        }
    }
    return dp[P];
}

assert(findTargetSumWays([1, 1, 1, 1, 1], 3) === 5);
assert(findTargetSumWays([1], 1) === 1);
assert(findTargetSumWays([1, 1], 0) === 2);
assert(findTargetSumWays([1, 2], 4) === 0);
assert(findTargetSumWays([1], -1) === 1);
assert(findTargetSumWays([0, 0, 0], 0) === 8);
console.log("all tests pass");
