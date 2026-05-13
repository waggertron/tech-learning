function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function numDecodings(s: string): number {
    if (!s || s[0] === '0') return 0;
    let prev2 = 1, prev1 = 1;
    for (let i = 1; i < s.length; i++) {
        let cur = 0;
        if (s[i] !== '0') cur += prev1;
        const two = parseInt(s.slice(i - 1, i + 1));
        if (two >= 10 && two <= 26) cur += prev2;
        [prev2, prev1] = [prev1, cur];
    }
    return prev1;
}

assert(numDecodings('12') === 2);
assert(numDecodings('226') === 3);
assert(numDecodings('06') === 0);
assert(numDecodings('0') === 0);
assert(numDecodings('1') === 1);
assert(numDecodings('11106') === 2);
console.log("all tests pass");
