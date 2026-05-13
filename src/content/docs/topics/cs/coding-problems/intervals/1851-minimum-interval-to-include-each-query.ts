function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minInterval(intervals: number[][], queries: number[]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(minInterval([[1,4],[2,4],[3,6],[4,4]], [2,3,4,5])) === JSON.stringify([3,3,1,4]));
    assert(JSON.stringify(minInterval([[2,3],[2,5],[1,8],[20,25]], [2,19,5,22])) === JSON.stringify([2,-1,4,6]));
    assert(JSON.stringify(minInterval([[1,3]], [5])) === JSON.stringify([-1]));
    assert(JSON.stringify(minInterval([[1,10]], [5])) === JSON.stringify([10]));
    assert(JSON.stringify(minInterval([[1,5],[2,3]], [2,3])) === JSON.stringify([2,2]));

    // perf
    const t0 = performance.now();
    const bigIntervals = Array.from({ length: 500_000 }, (_, i) => [2 * i, 2 * i + 1]);
    const bigQueries = Array.from({ length: 500_000 }, (_, i) => 2 * i);
    minInterval(bigIntervals, bigQueries);
    console.log(`perf minInterval 500000 intervals 500000 queries: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
