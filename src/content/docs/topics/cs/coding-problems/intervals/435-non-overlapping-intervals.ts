function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function eraseOverlapIntervals(intervals: number[][]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]) === 1);
    assert(eraseOverlapIntervals([[1,2],[1,2],[1,2]]) === 2);
    assert(eraseOverlapIntervals([[1,2],[2,3]]) === 0);
    assert(eraseOverlapIntervals([[1,5]]) === 0);
    assert(eraseOverlapIntervals([]) === 0);
    assert(eraseOverlapIntervals([[1,100],[2,3],[4,5],[6,7]]) === 1);

    // perf
    const t0 = performance.now();
    eraseOverlapIntervals(Array.from({ length: 500_000 }, (_, i) => [2 * i, 2 * i + 1]));
    console.log(`perf eraseOverlapIntervals 500000 non-overlapping intervals: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
