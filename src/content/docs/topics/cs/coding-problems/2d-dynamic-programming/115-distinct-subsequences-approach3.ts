function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function numDistinct(s: string, t: string): number {
    const m = s.length, n = t.length;
    const dp: number[] = new Array(n + 1).fill(0);
    dp[0] = 1;
    for (let i = 0; i < m; i++) {
        for (let j = n; j >= 1; j--) {
            if (s[i] === t[j - 1]) dp[j] += dp[j - 1];
        }
    }
    return dp[n];
}

assert(numDistinct("rabbbit", "rabbit") === 3);
assert(numDistinct("babgbag", "bag") === 5);
assert(numDistinct("abc", "") === 1);
assert(numDistinct("", "a") === 0);
assert(numDistinct("abc", "abc") === 1);
assert(numDistinct("aaa", "b") === 0);
console.log("all tests pass");
