function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestPalindrome(s: string): string {
    // TODO: implement
    return '';
}

function _runTests(): void {
    assert(['bab', 'aba'].includes(longestPalindrome('babad')));
    assert(longestPalindrome('cbbd') === 'bb');
    assert(longestPalindrome('a') === 'a');
    assert(['a', 'c'].includes(longestPalindrome('ac')));
    assert(longestPalindrome('racecar') === 'racecar');
    assert(longestPalindrome('abacaba') === 'abacaba');
    // perf
    const t0 = performance.now();
    longestPalindrome('a'.repeat(500));
    console.log(`perf longestPalindrome("a"*500): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
