function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxProfit(prices: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(maxProfit([7, 1, 5, 3, 6, 4]) === 5);
    assert(maxProfit([7, 6, 4, 3, 1]) === 0);
    assert(maxProfit([1]) === 0);
    assert(maxProfit([1, 2]) === 1);
    assert(maxProfit([2, 4, 1]) === 2);
    assert(maxProfit([3, 3, 3]) === 0);
    // perf
    const t0 = performance.now();
    maxProfit(Array.from({ length: 10000 }, (_, i) => i));
    console.log(`perf 10000-element array: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
