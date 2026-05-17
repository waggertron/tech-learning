function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function criticalConnections(n: number, connections: number[][]): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(criticalConnections(4, [[0,1],[1,2],[2,0],[1,3]])) === JSON.stringify([[1,3]]));
    assert(JSON.stringify(criticalConnections(2, [[0,1]])) === JSON.stringify([[0,1]]));
    assert(JSON.stringify(criticalConnections(3, [[0,1],[1,2],[0,2]])) === JSON.stringify([]));
    const r = criticalConnections(6, [[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[1,3]]);
    assert(JSON.stringify([...r].sort((a, b) => a[0] - b[0] || a[1] - b[1])) === JSON.stringify([[1,3]]));
    // perf
    const bigN = 500;
    const edges = Array.from({ length: bigN - 1 }, (_, i) => [i, i + 1]);
    const t0 = performance.now();
    criticalConnections(bigN, edges);
    console.log(`perf critical_connections on chain of 10000 nodes: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
