function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestIncreasingPath(matrix: number[][]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]]) === 4);
    assert(longestIncreasingPath([[3, 4, 5], [3, 2, 6], [2, 2, 1]]) === 4);
    assert(longestIncreasingPath([[1]]) === 1);
    assert(longestIncreasingPath([[1, 1], [1, 1]]) === 1);
    assert(longestIncreasingPath([[1, 2, 3, 4]]) === 4);
    const grid = Array.from({ length: 300 }, (_, i) =>
        Array.from({ length: 300 }, (_, j) => i * 300 + j)
    );
    const t0 = performance.now();
    longestIncreasingPath(grid);
    console.log(`perf longestIncreasingPath(300x300 grid): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
