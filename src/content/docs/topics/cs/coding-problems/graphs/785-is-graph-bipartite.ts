function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isBipartite(graph: number[][]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isBipartite([[1,2,3],[0,2],[0,1,3],[0,2]]) === false);
    assert(isBipartite([[1,3],[0,2],[1,3],[0,2]]) === true);
    assert(isBipartite([[]]) === true);
    assert(isBipartite([[1],[0]]) === true);
    assert(isBipartite([[1,2],[0,2],[0,1]]) === false);
    assert(isBipartite([[1],[0],[3],[2]]) === true);
    // perf
    const n = 10_000;
    const bigGraph = Array.from({ length: n }, (_, i) => [(i - 1 + n) % n, (i + 1) % n]);
    const t0 = performance.now();
    isBipartite(bigGraph);
    console.log(`perf is-graph-bipartite ${n}-node even cycle: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
