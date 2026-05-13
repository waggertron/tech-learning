function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxCoins(nums: number[]): number {
    const padded = [1, ...nums, 1];
    const n = padded.length;
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let length = 2; length <= n; length++) {
        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1;
            for (let k = i + 1; k < j; k++) {
                const coins = padded[i] * padded[k] * padded[j] + dp[i][k] + dp[k][j];
                if (coins > dp[i][j]) dp[i][j] = coins;
            }
        }
    }
    return dp[0][n - 1];
}

assert(maxCoins([3, 1, 5, 8]) === 167);
assert(maxCoins([1, 5]) === 10);
assert(maxCoins([5]) === 5);
assert(maxCoins([3, 3]) === 12);
assert(maxCoins([1, 1, 1]) === 3);
console.log("all tests pass");
