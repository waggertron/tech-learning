function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function combinationSum(candidates: number[], target: number): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const r = combinationSum([2, 3, 6, 7], 7);
    const norm = (arr: number[][]): string =>
        JSON.stringify(arr.map(a => [...a].sort((x, y) => x - y)).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
    assert(norm(r) === norm([[2, 2, 3], [7]]));
    const r2 = combinationSum([2, 3, 5], 8);
    assert(norm(r2) === norm([[2, 2, 2, 2], [2, 3, 3], [3, 5]]));
    assert(norm(combinationSum([3], 9)) === norm([[3, 3, 3]]));
    assert(combinationSum([5], 3).length === 0);
    // perf
    const t0 = performance.now();
    combinationSum([1, 2, 3, 4, 5], 15);
    console.log(`perf combinationSum([1..5], target=15): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
