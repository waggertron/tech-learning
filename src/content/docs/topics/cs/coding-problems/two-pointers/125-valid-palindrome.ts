function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isPalindrome(s: string): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isPalindrome('A man, a plan, a canal: Panama') === true);
    assert(isPalindrome('race a car') === false);
    assert(isPalindrome(' ') === true);
    assert(isPalindrome('') === true);
    assert(isPalindrome('a') === true);
    assert(isPalindrome('aa') === true);
    assert(isPalindrome('ab') === false);
    // perf
    const t0 = performance.now();
    isPalindrome('a'.repeat(1_000_000));
    console.log(`perf 1000000-char palindrome string: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
