function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isMatch(s: string, p: string): boolean {
    const memo: Map<string, boolean> = new Map();
    function match(i: number, j: number): boolean {
        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key)!;
        if (j === p.length) return i === s.length;
        const first = i < s.length && (p[j] === '.' || p[j] === s[i]);
        let result: boolean;
        if (j + 1 < p.length && p[j + 1] === '*') {
            result = match(i, j + 2) || (first && match(i + 1, j));
        } else {
            result = first && match(i + 1, j + 1);
        }
        memo.set(key, result);
        return result;
    }
    return match(0, 0);
}

assert(isMatch("aa", "a") === false);
assert(isMatch("aa", "a*") === true);
assert(isMatch("ab", ".*") === true);
assert(isMatch("mississippi", "mis*is*p*.") === false);
assert(isMatch("", "") === true);
assert(isMatch("", "a*") === true);
console.log("all tests pass");
