function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isInterleave(s1: string, s2: string, s3: string): boolean {
    if (s1.length + s2.length !== s3.length) return false;
    const memo: Map<string, boolean> = new Map();
    function f(i: number, j: number): boolean {
        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key)!;
        const k = i + j;
        if (k === s3.length) { memo.set(key, true); return true; }
        let result = false;
        if (i < s1.length && s1[i] === s3[k] && f(i + 1, j)) result = true;
        if (!result && j < s2.length && s2[j] === s3[k] && f(i, j + 1)) result = true;
        memo.set(key, result);
        return result;
    }
    return f(0, 0);
}

assert(isInterleave("aabcc", "dbbca", "aadbbcbcac") === true);
assert(isInterleave("aabcc", "dbbca", "aadbbbaccc") === false);
assert(isInterleave("", "", "") === true);
assert(isInterleave("a", "", "a") === true);
assert(isInterleave("", "b", "b") === true);
assert(isInterleave("a", "b", "abc") === false);
console.log("all tests pass");
