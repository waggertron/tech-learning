function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function coinChange(coins: number[], amount: number): number {
    const INF = amount + 1;
    const dp = new Array(amount + 1).fill(INF);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++) {
        for (const c of coins) {
            if (c <= i) dp[i] = Math.min(dp[i], dp[i - c] + 1);
        }
    }
    return dp[amount] !== INF ? dp[amount] : -1;
}

assert(coinChange([1, 2, 5], 11) === 3);
assert(coinChange([2], 3) === -1);
assert(coinChange([1], 0) === 0);
assert(coinChange([1], 1) === 1);
assert(coinChange([2, 5, 10, 1], 27) === 4);
assert(coinChange([186, 419, 83, 408], 6249) === 20);
console.log("all tests pass");
