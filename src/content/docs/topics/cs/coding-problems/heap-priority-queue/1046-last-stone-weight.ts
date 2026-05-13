function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function lastStoneWeight(stones: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(lastStoneWeight([2, 7, 4, 1, 8, 1]) === 1);
    assert(lastStoneWeight([1]) === 1);
    assert(lastStoneWeight([31, 26, 33, 21, 40]) === 9);
    assert(lastStoneWeight([9, 3, 2, 10]) === 0);
    assert(lastStoneWeight([2, 2]) === 0);
    assert(lastStoneWeight([1, 3]) === 2);
    // perf
    const t0 = performance.now();
    lastStoneWeight(Array.from({ length: 10000 }, (_, i) => i + 1));
    console.log(`perf lastStoneWeight n=10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
