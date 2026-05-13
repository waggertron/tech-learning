function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function repeatedSubstringPattern(s: string): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(repeatedSubstringPattern('abab') === true);
    assert(repeatedSubstringPattern('aba') === false);
    assert(repeatedSubstringPattern('abcabcabcabc') === true);
    assert(repeatedSubstringPattern('a') === false);
    assert(repeatedSubstringPattern('aa') === true);
    assert(repeatedSubstringPattern('abaaba') === true);
    // perf
    const t0 = performance.now();
    repeatedSubstringPattern('ab'.repeat(500_000));
    console.log(`perf repeatedSubstringPattern n=1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
