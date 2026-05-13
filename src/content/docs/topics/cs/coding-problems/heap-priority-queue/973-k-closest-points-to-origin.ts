function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function kClosest(points: number[][], k: number): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    let result = kClosest([[1, 3], [-2, 2]], 1);
    assert(JSON.stringify(result) === JSON.stringify([[-2, 2]]), `got ${JSON.stringify(result)}`);

    result = kClosest([[3, 3], [5, -1], [-2, 4]], 2);
    const sortFn = (a: number[], b: number[]) => a[0] - b[0] || a[1] - b[1];
    assert(
        JSON.stringify(result.slice().sort(sortFn)) === JSON.stringify([[3, 3], [-2, 4]].sort(sortFn)),
        `got ${JSON.stringify(result)}`
    );

    assert(JSON.stringify(kClosest([[0, 0]], 1)) === JSON.stringify([[0, 0]]));

    result = kClosest([[1, 0], [-1, 0], [0, 1], [0, -1]], 2);
    assert(result.length === 2);

    result = kClosest([[1, 2], [3, 4], [0, 0]], 3);
    assert(result.length === 3);

    // perf
    const bigPts = Array.from({ length: 10000 }, (_, i) => [i, i + 1]);
    const t0 = performance.now();
    kClosest(bigPts, 500);
    console.log(`perf kClosest n=10000 k=500: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
