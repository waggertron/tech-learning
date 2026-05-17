function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findOrder(numCourses: number, prerequisites: number[][]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    const r1 = findOrder(2, [[1, 0]]);
    assert(JSON.stringify(r1) === JSON.stringify([0, 1]));

    const r2 = findOrder(4, [[1,0],[2,0],[3,1],[3,2]]);
    assert(r2.indexOf(0) < r2.indexOf(1));
    assert(r2.indexOf(0) < r2.indexOf(2));
    assert(r2.indexOf(1) < r2.indexOf(3));
    assert(r2.indexOf(2) < r2.indexOf(3));

    assert(JSON.stringify(findOrder(2, [[1, 0],[0, 1]])) === JSON.stringify([]));
    assert(JSON.stringify(findOrder(1, [])) === JSON.stringify([0]));

    const r3 = findOrder(3, []);
    assert(new Set(r3).size === 3);

    assert(JSON.stringify(findOrder(3, [[0,1],[1,2],[2,0]])) === JSON.stringify([]));

    // perf
    const t0 = performance.now();
    findOrder(500, Array.from({ length: 499 }, (_, i) => [i + 1, i]));
    console.log(`perf find-order 10000 courses DAG chain: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
