function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestPalindrome(s: string): string {
    const n = s.length;
    if (n <= 1) return s;
    const dp: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    let best = s[0];

    for (let i = 0; i < n; i++) dp[i][i] = true;

    for (let length = 2; length <= n; length++) {
        for (let i = 0; i <= n - length; i++) {
            const j = i + length - 1;
            if (s[i] === s[j] && (length === 2 || dp[i + 1][j - 1])) {
                dp[i][j] = true;
                if (length > best.length) best = s.slice(i, j + 1);
            }
        }
    }
    return best;
}

assert(['bab', 'aba'].includes(longestPalindrome('babad')));
assert(longestPalindrome('cbbd') === 'bb');
assert(longestPalindrome('a') === 'a');
assert(['a', 'c'].includes(longestPalindrome('ac')));
assert(longestPalindrome('racecar') === 'racecar');
assert(longestPalindrome('abacaba') === 'abacaba');
console.log("all tests pass");
