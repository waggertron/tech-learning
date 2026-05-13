function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function updateMatrix(mat: number[][]): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(updateMatrix([[0,0,0],[0,1,0],[0,0,0]])) === JSON.stringify([[0,0,0],[0,1,0],[0,0,0]]));
    assert(JSON.stringify(updateMatrix([[0,0,0],[0,1,0],[1,1,1]])) === JSON.stringify([[0,0,0],[0,1,0],[1,2,1]]));
    assert(JSON.stringify(updateMatrix([[0,0],[0,0]])) === JSON.stringify([[0,0],[0,0]]));
    assert(JSON.stringify(updateMatrix([[0]])) === JSON.stringify([[0]]));
    assert(JSON.stringify(updateMatrix([[0,0,0],[0,0,0],[0,0,1]])) === JSON.stringify([[0,0,0],[0,0,0],[0,0,1]]));
    // perf
    const n = 50;
    const big = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (__, c) => (r === 0 || c === 0) ? 0 : 1));
    const t0 = performance.now();
    updateMatrix(big);
    console.log(`perf 01-matrix ${n}x${n} grid: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
