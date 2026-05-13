function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function subsetsWithDup(nums: number[]): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const norm = (arr: number[][]): string =>
        JSON.stringify(arr.map(a => [...a].sort((x, y) => x - y)).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
    const r = subsetsWithDup([1, 2, 2]);
    assert(norm(r) === norm([[], [1], [2], [1,2], [2,2], [1,2,2]]));
    const r2 = subsetsWithDup([0]);
    assert(norm(r2) === norm([[], [0]]));
    const r3 = subsetsWithDup([2, 2, 2]);
    assert(norm(r3) === norm([[], [2], [2,2], [2,2,2]]));
    // perf
    const t0 = performance.now();
    subsetsWithDup([1,1,2,2,3,3,4,4,5,5,6,6]);
    console.log(`perf subsetsWithDup(n=12 with dups): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
