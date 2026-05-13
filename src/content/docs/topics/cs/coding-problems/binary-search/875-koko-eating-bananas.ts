function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minEatingSpeed(piles: number[], h: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(minEatingSpeed([3, 6, 7, 11], 8) === 4);
    assert(minEatingSpeed([30, 11, 23, 4, 20], 5) === 30);
    assert(minEatingSpeed([30, 11, 23, 4, 20], 6) === 23);
    assert(minEatingSpeed([1], 1) === 1);
    assert(minEatingSpeed([1000000000], 2) === 500000000);
    // perf
    const piles = Array.from({ length: 100000 }, (_, i) => i + 1);
    const t0 = performance.now();
    minEatingSpeed(piles, 100000);
    console.log(`perf minEatingSpeed n=100000 piles: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
