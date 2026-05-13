function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function subsets(nums: number[]): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const norm = (arr: number[][]): string =>
        JSON.stringify(arr.map(a => [...a].sort((x, y) => x - y)).sort((a, b) => JSON.stringify(a) < JSON.stringify(b) ? -1 : 1));
    const r = subsets([1, 2, 3]);
    assert(r.length === 8);
    assert(norm(r) === norm([[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]));
    const r2 = subsets([0]);
    assert(norm(r2) === norm([[], [0]]));
    assert(JSON.stringify(subsets([])) === JSON.stringify([[]]));
    // perf
    const t0 = performance.now();
    subsets(Array.from({ length: 12 }, (_, i) => i));
    console.log(`perf subsets(n=12): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
