function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minWindow(s: string, t: string): string {
    // TODO: implement
    return '';
}

function _runTests(): void {
    assert(minWindow('ADOBECODEBANC', 'ABC') === 'BANC');
    assert(minWindow('a', 'a') === 'a');
    assert(minWindow('a', 'aa') === '');
    assert(minWindow('', 'a') === '');
    assert(minWindow('abc', '') === '');
    assert(minWindow('aa', 'aa') === 'aa');
    // perf
    const t0 = performance.now();
    minWindow('a'.repeat(5000) + 'b'.repeat(5000), 'ab');
    console.log(`perf 10000-char string: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
