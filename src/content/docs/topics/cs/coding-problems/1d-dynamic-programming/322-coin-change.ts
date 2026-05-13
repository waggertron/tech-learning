function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function coinChange(coins: number[], amount: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(coinChange([1, 2, 5], 11) === 3);
    assert(coinChange([2], 3) === -1);
    assert(coinChange([1], 0) === 0);
    assert(coinChange([1], 1) === 1);
    assert(coinChange([2, 5, 10, 1], 27) === 4);
    assert(coinChange([186, 419, 83, 408], 6249) === 20);
    // perf
    const t0 = performance.now();
    coinChange([1, 2, 5], 500);
    console.log(`perf coinChange([1,2,5], 500): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
