function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findCriticalAndPseudoCriticalEdges(n: number, edges: number[][]): number[][] {
    // TODO: implement
    return [[], []];
}

function _runTests(): void {
    assert(JSON.stringify(findCriticalAndPseudoCriticalEdges(5, [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]])) === JSON.stringify([[0,1],[2,3,4,5]]));
    assert(JSON.stringify(findCriticalAndPseudoCriticalEdges(4, [[0,1,1],[1,2,1],[2,3,1],[0,3,1]])) === JSON.stringify([[],[0,1,2,3]]));
    assert(JSON.stringify(findCriticalAndPseudoCriticalEdges(2, [[0,1,5]])) === JSON.stringify([[0],[]]));
    // perf
    const pN = 20;
    const pEdges: number[][] = [];
    let seed = 42;
    const rand = () => { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed; };
    for (let i = 0; i < pN && pEdges.length < 50; i++)
        for (let j = i + 1; j < pN && pEdges.length < 50; j++)
            pEdges.push([i, j, (rand() % 100) + 1]);
    const t0 = performance.now();
    findCriticalAndPseudoCriticalEdges(pN, pEdges);
    console.log(`perf find_critical_and_pseudo_critical_edges on 20 nodes, 50 edges: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
