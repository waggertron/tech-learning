function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isInterleave(s1: string, s2: string, s3: string): boolean {
    const m = s1.length, n = s2.length;
    if (m + n !== s3.length) return false;
    const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
    dp[0][0] = true;
    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i === 0 && j === 0) continue;
            const k = i + j - 1;
            if (i > 0 && s1[i - 1] === s3[k] && dp[i - 1][j]) dp[i][j] = true;
            if (!dp[i][j] && j > 0 && s2[j - 1] === s3[k] && dp[i][j - 1]) dp[i][j] = true;
        }
    }
    return dp[m][n];
}

assert(isInterleave("aabcc", "dbbca", "aadbbcbcac") === true);
assert(isInterleave("aabcc", "dbbca", "aadbbbaccc") === false);
assert(isInterleave("", "", "") === true);
assert(isInterleave("a", "", "a") === true);
assert(isInterleave("", "b", "b") === true);
assert(isInterleave("a", "b", "abc") === false);
console.log("all tests pass");
