function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function checkInclusion(s1: string, s2: string): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(checkInclusion('ab', 'eidbaooo') === true);
    assert(checkInclusion('ab', 'eidboaoo') === false);
    assert(checkInclusion('a', 'a') === true);
    assert(checkInclusion('a', 'b') === false);
    assert(checkInclusion('abc', 'ab') === false);
    assert(checkInclusion('aab', 'aabc') === true);
    // perf
    const t0 = performance.now();
    checkInclusion('ab', 'abcd'.repeat(2500));
    console.log(`perf 10000-char s2: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
