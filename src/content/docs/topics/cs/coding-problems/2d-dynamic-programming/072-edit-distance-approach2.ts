function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minDistance(word1: string, word2: string): number {
    const memo: Map<string, number> = new Map();
    function f(i: number, j: number): number {
        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key)!;
        let result: number;
        if (i === word1.length) {
            result = word2.length - j;
        } else if (j === word2.length) {
            result = word1.length - i;
        } else if (word1[i] === word2[j]) {
            result = f(i + 1, j + 1);
        } else {
            result = 1 + Math.min(f(i + 1, j), f(i, j + 1), f(i + 1, j + 1));
        }
        memo.set(key, result);
        return result;
    }
    return f(0, 0);
}

assert(minDistance("horse", "ros") === 3);
assert(minDistance("intention", "execution") === 5);
assert(minDistance("", "") === 0);
assert(minDistance("abc", "") === 3);
assert(minDistance("", "abc") === 3);
assert(minDistance("abc", "abc") === 0);
console.log("all tests pass");
