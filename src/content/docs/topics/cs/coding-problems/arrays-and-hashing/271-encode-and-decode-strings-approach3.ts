function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function encode(strs: string[]): string {
    return strs.map(s => `${s.length}#${s}`).join('');  // L1: O(N) one pass
}

function decode(s: string): string[] {
    const result: string[] = [];
    let i = 0;                               // L2: O(1) init
    while (i < s.length) {                  // L3: loop, advances by len(each string)+header
        const j = s.indexOf('#', i);        // L4: O(len_digits) scan for '#'
        const length = parseInt(s.slice(i, j));  // L5: O(len_digits) parse int
        result.push(s.slice(j + 1, j + 1 + length));  // L6: O(length) slice
        i = j + 1 + length;                // L7: O(1) advance
    }
    return result;
}

const cases: string[][] = [['hello', 'world', 'foo', 'bar'], [''], ['a'], [], ['hello#world', 'foo#bar'], ['5#abc', 'def']];
for (const strs of cases) {
    assert(JSON.stringify(decode(encode(strs))) === JSON.stringify(strs), `Failed on: ${JSON.stringify(strs)}`);
}
console.log("all tests pass");
