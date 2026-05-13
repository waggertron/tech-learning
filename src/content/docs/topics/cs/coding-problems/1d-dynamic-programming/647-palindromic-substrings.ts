function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function countSubstrings(s: string): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(countSubstrings('abc') === 3);
    assert(countSubstrings('aaa') === 6);
    assert(countSubstrings('a') === 1);
    assert(countSubstrings('aa') === 3);
    assert(countSubstrings('abba') === 6);
    assert(countSubstrings('racecar') === 10);
    // perf
    const t0 = performance.now();
    countSubstrings('a'.repeat(1000));
    console.log(`perf countSubstrings("a"*1000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
