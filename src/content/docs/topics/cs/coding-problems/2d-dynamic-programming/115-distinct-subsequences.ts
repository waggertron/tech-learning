function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function numDistinct(s: string, t: string): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(numDistinct('rabbbit', 'rabbit') === 3);
    assert(numDistinct('babgbag', 'bag') === 5);
    assert(numDistinct('abc', '') === 1);
    assert(numDistinct('', 'a') === 0);
    assert(numDistinct('abc', 'abc') === 1);
    assert(numDistinct('aaa', 'b') === 0);
    const t0 = performance.now();
    numDistinct('a'.repeat(200), 'a'.repeat(100));
    console.log(`perf numDistinct("a"*200, "a"*100): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
