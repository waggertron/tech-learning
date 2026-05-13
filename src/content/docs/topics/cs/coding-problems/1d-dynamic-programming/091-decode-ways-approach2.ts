function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function numDecodings(s: string): number {
    const memo = new Map<number, number>();
    function f(i: number): number {
        if (i === s.length) return 1;
        if (s[i] === '0') return 0;
        if (memo.has(i)) return memo.get(i)!;
        let ways = f(i + 1);
        if (i + 1 < s.length) {
            const two = parseInt(s.slice(i, i + 2));
            if (two >= 10 && two <= 26) ways += f(i + 2);
        }
        memo.set(i, ways);
        return ways;
    }
    return f(0);
}

assert(numDecodings('12') === 2);
assert(numDecodings('226') === 3);
assert(numDecodings('06') === 0);
assert(numDecodings('0') === 0);
assert(numDecodings('1') === 1);
assert(numDecodings('11106') === 2);
console.log("all tests pass");
