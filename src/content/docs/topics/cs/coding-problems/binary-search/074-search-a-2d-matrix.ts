function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function searchMatrix(matrix: number[][], target: number): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    const m = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
    assert(searchMatrix(m, 3) === true);
    assert(searchMatrix(m, 13) === false);
    assert(searchMatrix([[1]], 1) === true);
    assert(searchMatrix([[1]], 2) === false);
    assert(searchMatrix([[1, 3]], 3) === true);
    assert(searchMatrix([[1], [3]], 1) === true);
    // perf
    const rows = 1000, cols = 100;
    const mat = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => r * cols + c)
    );
    const t0 = performance.now();
    for (let i = 0; i < 1_000_000; i++) searchMatrix(mat, rows * cols - 1);
    console.log(`perf searchMatrix 1000x100 x1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
