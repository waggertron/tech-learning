function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function merge(intervals: number[][]): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]])) === JSON.stringify([[1,6],[8,10],[15,18]]));
    assert(JSON.stringify(merge([[1,4],[4,5]])) === JSON.stringify([[1,5]]));
    assert(JSON.stringify(merge([[1,2]])) === JSON.stringify([[1,2]]));
    assert(JSON.stringify(merge([[1,10],[2,5],[3,8]])) === JSON.stringify([[1,10]]));
    assert(JSON.stringify(merge([[1,2],[3,4],[5,6]])) === JSON.stringify([[1,2],[3,4],[5,6]]));
    assert(JSON.stringify(merge([[15,18],[1,3],[2,6],[8,10]])) === JSON.stringify([[1,6],[8,10],[15,18]]));

    // perf
    const t0 = performance.now();
    merge(Array.from({ length: 500_000 }, (_, i) => [2 * i, 2 * i + 1]));
    console.log(`perf merge 500000 non-overlapping intervals: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
