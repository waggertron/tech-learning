function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function shortestPathBinaryMatrix(grid: number[][]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(shortestPathBinaryMatrix([[0,1],[1,0]]) === 2);
    assert(shortestPathBinaryMatrix([[0,0,0],[1,1,0],[1,1,0]]) === 4);
    assert(shortestPathBinaryMatrix([[1,0,0],[1,1,0],[1,1,0]]) === -1);
    assert(shortestPathBinaryMatrix([[0,0,0],[0,0,0],[0,0,1]]) === -1);
    assert(shortestPathBinaryMatrix([[0]]) === 1);
    assert(shortestPathBinaryMatrix([[1]]) === -1);
    assert(shortestPathBinaryMatrix([[0,0],[0,0]]) === 2);
    // perf
    const n = 50;
    const big = Array.from({ length: n }, () => new Array(n).fill(0));
    const t0 = performance.now();
    shortestPathBinaryMatrix(big);
    console.log(`perf shortest-path-binary-matrix ${n}x${n} all-clear grid: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
