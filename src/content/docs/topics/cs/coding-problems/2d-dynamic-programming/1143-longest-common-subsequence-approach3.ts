function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestCommonSubsequence(text1: string, text2: string): number {
    let s1 = text1, s2 = text2;
    if (s1.length < s2.length) [s1, s2] = [s2, s1];
    const m = s1.length, n = s2.length;
    let prev: number[] = new Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
        const curr: number[] = new Array(n + 1).fill(0);
        for (let j = 1; j <= n; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                curr[j] = 1 + prev[j - 1];
            } else {
                curr[j] = Math.max(prev[j], curr[j - 1]);
            }
        }
        prev = curr;
    }
    return prev[n];
}

assert(longestCommonSubsequence("abcde", "ace") === 3);
assert(longestCommonSubsequence("abc", "abc") === 3);
assert(longestCommonSubsequence("abc", "def") === 0);
assert(longestCommonSubsequence("", "abc") === 0);
assert(longestCommonSubsequence("abc", "") === 0);
assert(longestCommonSubsequence("a", "a") === 1);
console.log("all tests pass");
