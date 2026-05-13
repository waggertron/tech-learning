function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isInterleave(s1: string, s2: string, s3: string): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isInterleave('aabcc', 'dbbca', 'aadbbcbcac') === true);
    assert(isInterleave('aabcc', 'dbbca', 'aadbbbaccc') === false);
    assert(isInterleave('', '', '') === true);
    assert(isInterleave('a', '', 'a') === true);
    assert(isInterleave('', 'b', 'b') === true);
    assert(isInterleave('a', 'b', 'abc') === false);
    const s1 = 'a'.repeat(500);
    const s2 = 'b'.repeat(500);
    const t0 = performance.now();
    isInterleave(s1, s2, s1 + s2);
    console.log(`perf isInterleave("a"*500, "b"*500, s1+s2): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
