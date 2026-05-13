function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function encode(strs: string[]): string {
    // TODO: implement
    return '';
}

function decode(s: string): string[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const cases = [
        ['hello', 'world', 'foo', 'bar'],
        [''],
        ['a'],
        [],
        ['hello#world', 'foo#bar'],
        ['5#abc', 'def'],
    ];
    for (const strs of cases) {
        assert(JSON.stringify(decode(encode(strs))) === JSON.stringify(strs), `Failed on: ${JSON.stringify(strs)}`);
    }
    // perf
    const big = Array(10000).fill('word'.repeat(10));
    const t0 = performance.now();
    decode(encode(big));
    console.log(`perf encode+decode n=10000 strings: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
