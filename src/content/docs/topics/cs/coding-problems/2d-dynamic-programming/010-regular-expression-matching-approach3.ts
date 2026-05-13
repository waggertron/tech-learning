function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isMatch(s: string, p: string): boolean {
    const m = s.length, n = p.length;
    const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
    dp[0][0] = true;
    for (let j = 1; j <= n; j++) {
        if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
    }
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j - 1] === '*') {
                dp[i][j] = dp[i][j - 2];
                if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j];
                }
            } else {
                if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
    }
    return dp[m][n];
}

assert(isMatch("aa", "a") === false);
assert(isMatch("aa", "a*") === true);
assert(isMatch("ab", ".*") === true);
assert(isMatch("mississippi", "mis*is*p*.") === false);
assert(isMatch("", "") === true);
assert(isMatch("", "a*") === true);
console.log("all tests pass");
