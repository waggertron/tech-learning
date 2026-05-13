function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function change(amount: number, coins: number[]): number {
    const dp: number[] = new Array(amount + 1).fill(0);
    dp[0] = 1;
    for (const c of coins) {
        for (let s = c; s <= amount; s++) {
            dp[s] += dp[s - c];
        }
    }
    return dp[amount];
}

assert(change(5, [1, 2, 5]) === 4);
assert(change(3, [2]) === 0);
assert(change(0, [1, 2, 5]) === 1);
assert(change(10, [5]) === 1);
assert(change(10, [1, 5, 10]) === 4);
console.log("all tests pass");
