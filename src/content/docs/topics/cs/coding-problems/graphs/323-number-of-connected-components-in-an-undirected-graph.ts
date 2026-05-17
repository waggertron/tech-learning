function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function countComponents(n: number, edges: number[][]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(countComponents(5, [[0,1],[1,2],[3,4]]) === 2);
    assert(countComponents(5, [[0,1],[1,2],[2,3],[3,4]]) === 1);
    assert(countComponents(4, []) === 4);
    assert(countComponents(1, []) === 1);
    assert(countComponents(3, [[0,1],[1,2],[0,2]]) === 1);
    // perf
    const t0 = performance.now();
    countComponents(500, Array.from({ length: 499 }, (_, i) => [i, i + 1]));
    console.log(`perf count-components 10000 nodes chain: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
