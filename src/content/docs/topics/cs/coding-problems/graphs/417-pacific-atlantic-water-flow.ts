function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function pacificAtlantic(heights: number[][]): number[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const h1 = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]];
    const r1 = pacificAtlantic(h1).map(p => p.join(',')).sort();
    const e1 = [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]].map(p => p.join(',')).sort();
    assert(JSON.stringify(r1) === JSON.stringify(e1));
    assert(JSON.stringify(pacificAtlantic([[5]])) === JSON.stringify([[0,0]]));
    const r2 = pacificAtlantic([[1,1],[1,1]]).map(p => p.join(',')).sort();
    assert(JSON.stringify(r2) === JSON.stringify([[0,0],[0,1],[1,0],[1,1]].map(p => p.join(',')).sort()));
    const r3 = pacificAtlantic([[1,2,3],[4,5,6],[7,8,9]]);
    assert(r3.some(p => p[0] === 2 && p[1] === 2));
    assert(JSON.stringify(pacificAtlantic([])) === JSON.stringify([]));
    // perf
    const big = Array.from({ length: 300 }, (_, i) => Array.from({ length: 300 }, (__, j) => i + j));
    const t0 = performance.now();
    pacificAtlantic(big);
    console.log(`perf pacific-atlantic 300x300 grid: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
