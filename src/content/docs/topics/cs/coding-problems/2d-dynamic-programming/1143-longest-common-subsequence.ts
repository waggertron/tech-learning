function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestCommonSubsequence(text1: string, text2: string): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(longestCommonSubsequence('abcde', 'ace') === 3);
    assert(longestCommonSubsequence('abc', 'abc') === 3);
    assert(longestCommonSubsequence('abc', 'def') === 0);
    assert(longestCommonSubsequence('', 'abc') === 0);
    assert(longestCommonSubsequence('abc', '') === 0);
    assert(longestCommonSubsequence('a', 'a') === 1);
    const t0 = performance.now();
    longestCommonSubsequence('a'.repeat(200), 'b'.repeat(200));
    console.log(`perf longestCommonSubsequence("a"*200, "b"*200): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
