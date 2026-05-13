function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxCoins(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(maxCoins([3, 1, 5, 8]) === 167);
    assert(maxCoins([1, 5]) === 10);
    assert(maxCoins([5]) === 5);
    assert(maxCoins([3, 3]) === 12);
    assert(maxCoins([1, 1, 1]) === 3);
    const t0 = performance.now();
    maxCoins(Array.from({ length: 100 }, (_, i) => i + 1));
    console.log(`perf maxCoins(range 1..100): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
