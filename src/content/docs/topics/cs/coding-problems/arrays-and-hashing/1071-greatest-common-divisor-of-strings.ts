function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function gcdOfStrings(str1: string, str2: string): string {
    // TODO: implement
    return '';
}

function _runTests(): void {
    assert(gcdOfStrings('ABCABC', 'ABC') === 'ABC');
    assert(gcdOfStrings('ABABAB', 'ABAB') === 'AB');
    assert(gcdOfStrings('LEET', 'CODE') === '');
    assert(gcdOfStrings('AAAAAB', 'AAA') === '');
    assert(gcdOfStrings('A', 'A') === 'A');
    assert(gcdOfStrings('AAAA', 'AA') === 'AA');
    // perf
    const t0 = performance.now();
    gcdOfStrings('A'.repeat(1000), 'A'.repeat(999));
    console.log(`perf gcdOfStrings n=1999: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
