function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function insert(intervals: number[][], newInterval: number[]): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(insert([[1,3],[6,9]], [2,5])) === JSON.stringify([[1,5],[6,9]]));
    assert(JSON.stringify(insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8])) === JSON.stringify([[1,2],[3,10],[12,16]]));
    assert(JSON.stringify(insert([[3,5],[6,9]], [1,2])) === JSON.stringify([[1,2],[3,5],[6,9]]));
    assert(JSON.stringify(insert([[1,2],[3,5]], [7,9])) === JSON.stringify([[1,2],[3,5],[7,9]]));
    assert(JSON.stringify(insert([[1,2],[3,4],[5,6]], [0,10])) === JSON.stringify([[0,10]]));
    assert(JSON.stringify(insert([], [1,5])) === JSON.stringify([[1,5]]));

    // perf
    const t0 = performance.now();
    insert(Array.from({ length: 1000 }, (_, i) => [2 * i, 2 * i + 1]), [999, 1000]);
    console.log(`perf insert 1000 intervals: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
