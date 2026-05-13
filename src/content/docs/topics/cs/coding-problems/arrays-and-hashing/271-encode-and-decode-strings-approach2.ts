function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function encode(strs: string[]): string {
    return JSON.stringify(strs);   // L1: O(N) JSON encode
}

function decode(s: string): string[] {
    return JSON.parse(s);          // L2: O(N) JSON decode
}

const cases: string[][] = [['hello', 'world', 'foo', 'bar'], [''], ['a'], [], ['hello#world', 'foo#bar'], ['5#abc', 'def']];
for (const strs of cases) {
    assert(JSON.stringify(decode(encode(strs))) === JSON.stringify(strs), `Failed on: ${JSON.stringify(strs)}`);
}
console.log("all tests pass");
