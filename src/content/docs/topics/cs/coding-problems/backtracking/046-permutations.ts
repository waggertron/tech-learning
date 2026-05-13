function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function permute(nums: number[]): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const norm = (arr: number[][]): string =>
        JSON.stringify(arr.map(a => [...a]).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
    const r = permute([1, 2, 3]);
    assert(r.length === 6);
    assert(norm(r) === norm([[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]));
    const r2 = permute([0, 1]);
    assert(norm(r2) === norm([[0,1],[1,0]]));
    assert(JSON.stringify(permute([1])) === JSON.stringify([[1]]));
    // perf
    const t0 = performance.now();
    permute([1, 2, 3, 4, 5, 6, 7, 8]);
    console.log(`perf permute(n=8): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
