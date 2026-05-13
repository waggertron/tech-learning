function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(canFinish(2, [[1, 0]]) === true);
    assert(canFinish(2, [[1, 0], [0, 1]]) === false);
    assert(canFinish(5, []) === true);
    assert(canFinish(1, []) === true);
    assert(canFinish(3, [[1, 0], [2, 1], [0, 2]]) === false);
    assert(canFinish(4, [[1, 0], [2, 0], [3, 1], [3, 2]]) === true);
    // perf
    const t0 = performance.now();
    canFinish(10_000, Array.from({ length: 9_999 }, (_, i) => [i + 1, i]));
    console.log(`perf can-finish 10000 courses DAG chain: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
