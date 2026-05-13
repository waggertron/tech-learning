function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function countSubstrings(s: string): number {
    const n = s.length;
    const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    let count = 0;
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
        count++;
    }
    for (let length = 2; length <= n; length++) {
        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1;
            if (s[i] === s[j] && (length === 2 || dp[i + 1][j - 1])) {
                dp[i][j] = true;
                count++;
            }
        }
    }
    return count;
}

assert(countSubstrings('abc') === 3);
assert(countSubstrings('aaa') === 6);
assert(countSubstrings('a') === 1);
assert(countSubstrings('aa') === 3);
assert(countSubstrings('abba') === 6);
assert(countSubstrings('racecar') === 10);
console.log("all tests pass");
