function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minCostClimbingStairs(cost: number[]): number {
    const n = cost.length;
    const dp = new Array(n).fill(0);
    dp[0] = cost[0];
    dp[1] = cost[1];
    for (let i = 2; i < n; i++) {
        dp[i] = cost[i] + Math.min(dp[i - 1], dp[i - 2]);
    }
    return Math.min(dp[n - 1], dp[n - 2]);
}

assert(minCostClimbingStairs([10, 15, 20]) === 15);
assert(minCostClimbingStairs([1, 100, 1, 1, 1, 100, 1, 1, 100, 1]) === 6);
assert(minCostClimbingStairs([0, 0]) === 0);
assert(minCostClimbingStairs([1, 2]) === 1);
assert(minCostClimbingStairs([5, 3, 1, 2]) === 4);
console.log("all tests pass");
