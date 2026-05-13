function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function mergeTriplets(triplets: number[][], target: number[]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(mergeTriplets([[2,5,3],[1,8,4],[1,7,5]], [2,7,5]) === true);
    assert(mergeTriplets([[1,3,4],[2,5,8]], [2,5,8]) === true);
    assert(mergeTriplets([[3,4,5]], [2,5,8]) === false);
    assert(mergeTriplets([[1,1,1]], [1,1,1]) === true);
    assert(mergeTriplets([[1,0,0],[0,1,0],[0,0,1]], [1,1,1]) === true);
    // perf
    const t0 = performance.now();
    const big = Array.from({ length: 10000 }, (_, i) => [(i % 5) + 1, (i % 7) + 1, (i % 3) + 1]);
    mergeTriplets(big, [5, 7, 3]);
    console.log(`perf mergeTriplets(n=10000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
