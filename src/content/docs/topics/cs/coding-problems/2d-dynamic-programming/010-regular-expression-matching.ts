function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isMatch(s: string, p: string): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isMatch('aa', 'a') === false);
    assert(isMatch('aa', 'a*') === true);
    assert(isMatch('ab', '.*') === true);
    assert(isMatch('mississippi', 'mis*is*p*.') === false);
    assert(isMatch('', '') === true);
    assert(isMatch('', 'a*') === true);
    const t0 = performance.now();
    isMatch('a'.repeat(200), 'a'.repeat(100) + '.*');
    console.log(`perf isMatch("a"*200, pattern): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
