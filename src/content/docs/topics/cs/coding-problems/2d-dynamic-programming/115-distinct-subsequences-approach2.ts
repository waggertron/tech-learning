function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function numDistinct(s: string, t: string): number {
    const memo: Map<string, number> = new Map();
    function f(i: number, j: number): number {
        if (j === t.length) return 1;
        if (i === s.length) return 0;
        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key)!;
        let result: number;
        if (s[i] === t[j]) {
            result = f(i + 1, j + 1) + f(i + 1, j);
        } else {
            result = f(i + 1, j);
        }
        memo.set(key, result);
        return result;
    }
    return f(0, 0);
}

assert(numDistinct("rabbbit", "rabbit") === 3);
assert(numDistinct("babgbag", "bag") === 5);
assert(numDistinct("abc", "") === 1);
assert(numDistinct("", "a") === 0);
assert(numDistinct("abc", "abc") === 1);
assert(numDistinct("aaa", "b") === 0);
console.log("all tests pass");
