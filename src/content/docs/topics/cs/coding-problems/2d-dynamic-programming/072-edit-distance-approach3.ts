function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minDistance(word1: string, word2: string): number {
    const m = word1.length, n = word2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => {
        const row = new Array(n + 1).fill(0);
        row[0] = i;
        return row;
    });
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }
    return dp[m][n];
}

assert(minDistance("horse", "ros") === 3);
assert(minDistance("intention", "execution") === 5);
assert(minDistance("", "") === 0);
assert(minDistance("abc", "") === 3);
assert(minDistance("", "abc") === 3);
assert(minDistance("abc", "abc") === 0);
console.log("all tests pass");
