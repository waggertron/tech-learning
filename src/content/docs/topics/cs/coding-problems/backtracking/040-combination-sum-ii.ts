function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function combinationSum2(candidates: number[], target: number): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const norm = (arr: number[][]): string =>
        JSON.stringify(arr.map(a => [...a].sort((x, y) => x - y)).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
    const r = combinationSum2([10, 1, 2, 7, 6, 1, 5], 8);
    assert(norm(r) === norm([[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]));
    const r2 = combinationSum2([2, 5, 2, 1, 2], 5);
    assert(norm(r2) === norm([[1, 2, 2], [5]]));
    assert(combinationSum2([1, 2], 10).length === 0);
    assert(norm(combinationSum2([3, 3], 3)) === norm([[3]]));
    // perf
    const t0 = performance.now();
    combinationSum2([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3], 15);
    console.log(`perf combinationSum2(13 candidates, target=15): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
