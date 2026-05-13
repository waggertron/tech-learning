function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findRedundantConnection(edges: number[][]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(findRedundantConnection([[1,2],[1,3],[2,3]])) === JSON.stringify([2, 3]));
    assert(JSON.stringify(findRedundantConnection([[1,2],[2,3],[3,4],[1,4],[1,5]])) === JSON.stringify([1, 4]));
    assert(JSON.stringify(findRedundantConnection([[1,2],[1,2]])) === JSON.stringify([1, 2]));
    assert(JSON.stringify(findRedundantConnection([[1,2],[2,3],[1,3]])) === JSON.stringify([1, 3]));
    assert(JSON.stringify(findRedundantConnection([[1,2],[2,3],[3,4],[4,5],[3,5]])) === JSON.stringify([3, 5]));
    // perf
    const bigEdges = Array.from({ length: 199 }, (_, i) => [i + 1, i + 2]);
    bigEdges.push([1, 200]);
    const t0 = performance.now();
    findRedundantConnection(bigEdges);
    console.log(`perf redundant-connection 200 nodes cycle: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
