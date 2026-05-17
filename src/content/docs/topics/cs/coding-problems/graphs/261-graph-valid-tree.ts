function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function validTree(n: number, edges: number[][]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(validTree(5, [[0,1],[0,2],[0,3],[1,4]]) === true);
    assert(validTree(5, [[0,1],[1,2],[2,3],[1,3],[1,4]]) === false);
    assert(validTree(1, []) === true);
    assert(validTree(2, [[0, 1]]) === true);
    assert(validTree(2, []) === false);
    assert(validTree(3, [[0,1],[1,2],[0,2]]) === false);
    // perf
    const t0 = performance.now();
    validTree(500, Array.from({ length: 499 }, (_, i) => [i, i + 1]));
    console.log(`perf valid-tree 10000 nodes chain: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
