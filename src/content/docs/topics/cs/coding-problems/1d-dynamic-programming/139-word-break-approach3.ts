function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function wordBreak(s: string, wordDict: string[]): boolean {
    const words = new Set(wordDict);
    const n = s.length;
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && words.has(s.slice(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}

assert(wordBreak('leetcode', ['leet', 'code']) === true);
assert(wordBreak('applepenapple', ['apple', 'pen']) === true);
assert(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']) === false);
assert(wordBreak('a', ['a']) === true);
assert(wordBreak('a', ['b']) === false);
assert(wordBreak('aaaa', ['a', 'aa']) === true);
console.log("all tests pass");
