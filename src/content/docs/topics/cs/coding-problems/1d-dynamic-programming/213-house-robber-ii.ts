function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function rob(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(rob([2, 3, 2]) === 3);
    assert(rob([1, 2, 3, 1]) === 4);
    assert(rob([1, 2, 3]) === 3);
    assert(rob([5]) === 5);
    assert(rob([1, 3]) === 3);
    assert(rob([2, 7, 9, 3, 1]) === 11);
    // perf
    const t0 = performance.now();
    rob(Array.from({ length: 1_000_000 }, (_, i) => 1_000_000 - i));
    console.log(`perf rob(range 1000000 desc circular): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
