function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function lengthOfLongestSubstring(s: string): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(lengthOfLongestSubstring('abcabcbb') === 3);
    assert(lengthOfLongestSubstring('bbbbb') === 1);
    assert(lengthOfLongestSubstring('pwwkew') === 3);
    assert(lengthOfLongestSubstring('') === 0);
    assert(lengthOfLongestSubstring('a') === 1);
    assert(lengthOfLongestSubstring('abcdef') === 6);
    // perf
    const t0 = performance.now();
    lengthOfLongestSubstring('abcd'.repeat(250_000));
    console.log(`perf 1000000-char string: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
