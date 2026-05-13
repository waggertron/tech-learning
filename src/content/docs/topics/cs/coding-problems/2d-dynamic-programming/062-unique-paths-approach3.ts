function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function uniquePaths(m: number, n: number): number {
    const dp: number[] = new Array(n).fill(1);
    for (let r = 1; r < m; r++) {
        for (let c = 1; c < n; c++) {
            dp[c] += dp[c - 1];
        }
    }
    return dp[n - 1];
}

assert(uniquePaths(3, 7) === 28);
assert(uniquePaths(3, 2) === 3);
assert(uniquePaths(1, 1) === 1);
assert(uniquePaths(1, 5) === 1);
assert(uniquePaths(5, 1) === 1);
assert(uniquePaths(3, 3) === 6);
console.log("all tests pass");
