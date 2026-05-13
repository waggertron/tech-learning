function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minDistance(word1: string, word2: string): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(minDistance('horse', 'ros') === 3);
    assert(minDistance('intention', 'execution') === 5);
    assert(minDistance('', '') === 0);
    assert(minDistance('abc', '') === 3);
    assert(minDistance('', 'abc') === 3);
    assert(minDistance('abc', 'abc') === 0);
    const t0 = performance.now();
    minDistance('a'.repeat(1000), 'b'.repeat(1000));
    console.log(`perf minDistance("a"*1000, "b"*1000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
