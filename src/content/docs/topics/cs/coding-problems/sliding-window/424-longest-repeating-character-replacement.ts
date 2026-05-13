function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function characterReplacement(s: string, k: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(characterReplacement('ABAB', 2) === 4);
    assert(characterReplacement('AABABBA', 1) === 4);
    assert(characterReplacement('A', 0) === 1);
    assert(characterReplacement('AAAA', 2) === 4);
    assert(characterReplacement('ABCDE', 1) === 2);
    assert(characterReplacement('AABBA', 2) === 5);
    // perf
    const t0 = performance.now();
    characterReplacement('abcd'.repeat(2500), 1000);
    console.log(`perf 10000-char string k=1000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
