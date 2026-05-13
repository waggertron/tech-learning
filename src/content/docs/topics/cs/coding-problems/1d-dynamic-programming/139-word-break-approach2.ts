function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function wordBreak(s: string, wordDict: string[]): boolean {
    const words = new Set(wordDict);
    const memo = new Map<number, boolean>();
    function f(start: number): boolean {
        if (start === s.length) return true;
        if (memo.has(start)) return memo.get(start)!;
        for (let end = start + 1; end <= s.length; end++) {
            if (words.has(s.slice(start, end)) && f(end)) {
                memo.set(start, true);
                return true;
            }
        }
        memo.set(start, false);
        return false;
    }
    return f(0);
}

assert(wordBreak('leetcode', ['leet', 'code']) === true);
assert(wordBreak('applepenapple', ['apple', 'pen']) === true);
assert(wordBreak('catsandog', ['cats', 'dog', 'sand', 'and', 'cat']) === false);
assert(wordBreak('a', ['a']) === true);
assert(wordBreak('a', ['b']) === false);
assert(wordBreak('aaaa', ['a', 'aa']) === true);
console.log("all tests pass");
