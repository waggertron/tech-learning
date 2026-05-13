function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxProfit(prices: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(maxProfit([1, 2, 3, 0, 2]) === 3);
    assert(maxProfit([1]) === 0);
    assert(maxProfit([]) === 0);
    assert(maxProfit([5, 4, 3, 2, 1]) === 0);
    assert(maxProfit([1, 2, 3, 4, 5]) === 4);
    assert(maxProfit([1, 2]) === 1);
    const t0 = performance.now();
    maxProfit(Array.from({ length: 1_000_000 }, (_, i) => 1_000_000 - i));
    console.log(`perf maxProfit(range 1000000 desc): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
