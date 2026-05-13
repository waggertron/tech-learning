function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function orangesRotting(grid: number[][]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(orangesRotting([[2,1,1],[1,1,0],[0,1,1]]) === 4);
    assert(orangesRotting([[2,1,1],[0,1,1],[1,0,1]]) === -1);
    assert(orangesRotting([[0,2]]) === 0);
    assert(orangesRotting([[1,1],[1,1]]) === -1);
    assert(orangesRotting([[0]]) === 0);
    assert(orangesRotting([[2,1]]) === 1);
    // perf
    const big = Array.from({ length: 300 }, (_, i) => Array.from({ length: 300 }, (__, j) => (i === 0 && j === 0) ? 2 : 1));
    const t0 = performance.now();
    orangesRotting(big);
    console.log(`perf rotting-oranges 300x300 grid: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
