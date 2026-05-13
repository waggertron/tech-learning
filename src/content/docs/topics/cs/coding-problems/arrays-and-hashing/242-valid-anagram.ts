function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isAnagram(s: string, t: string): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isAnagram('anagram', 'nagaram') === true);
    assert(isAnagram('rat', 'car') === false);
    assert(isAnagram('a', 'a') === true);
    assert(isAnagram('ab', 'ba') === true);
    assert(isAnagram('ab', 'a') === false);
    assert(isAnagram('', '') === true);
    // perf
    const _s = 'abcdefghij'.repeat(100_000);
    const _u = _s.split('').reverse().join('');
    const t0 = performance.now();
    isAnagram(_s, _u);
    console.log(`perf isAnagram len=1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
