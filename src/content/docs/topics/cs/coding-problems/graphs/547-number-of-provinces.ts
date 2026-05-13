function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findCircleNum(isConnected: number[][]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(findCircleNum([[1,1,0],[1,1,0],[0,0,1]]) === 2);
    assert(findCircleNum([[1,0,0],[0,1,0],[0,0,1]]) === 3);
    assert(findCircleNum([[1,1,1],[1,1,1],[1,1,1]]) === 1);
    assert(findCircleNum([[1]]) === 1);
    assert(findCircleNum([[1,1,0],[1,1,1],[0,1,1]]) === 1);
    // perf
    const n = 1000;
    const big = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (__, j) => i === j ? 1 : 0));
    const t0 = performance.now();
    findCircleNum(big);
    console.log(`perf number-of-provinces ${n} isolated cities: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
