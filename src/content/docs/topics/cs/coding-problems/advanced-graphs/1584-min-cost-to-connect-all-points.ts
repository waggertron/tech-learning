function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function minCostConnectPoints(points: number[][]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(minCostConnectPoints([[0,0],[2,2],[3,10],[5,2],[7,0]]) === 20);
    assert(minCostConnectPoints([[3,12],[-2,5],[-4,1]]) === 18);
    assert(minCostConnectPoints([[0,0]]) === 0);
    assert(minCostConnectPoints([[0,0],[1,1]]) === 2);
    assert(minCostConnectPoints([[0,0],[1,0],[2,0],[3,0]]) === 3);
    // perf
    const bigPoints = Array.from({ length: 200 }, (_, i) => [i, i * 2]);
    const t0 = performance.now();
    minCostConnectPoints(bigPoints);
    console.log(`perf min-cost-connect 200 points: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
