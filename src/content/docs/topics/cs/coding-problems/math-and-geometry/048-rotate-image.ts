function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function rotate(matrix: number[][]): void {
    // TODO: implement (in place)
}

function _runTests(): void {
    const m = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    rotate(m);
    assert(JSON.stringify(m) === JSON.stringify([[7, 4, 1], [8, 5, 2], [9, 6, 3]]));

    const m2 = [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]];
    rotate(m2);
    assert(JSON.stringify(m2) === JSON.stringify([[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]));

    const m3 = [[1]];
    rotate(m3);
    assert(JSON.stringify(m3) === JSON.stringify([[1]]));

    const m4 = [[1, 2], [3, 4]];
    rotate(m4);
    assert(JSON.stringify(m4) === JSON.stringify([[3, 1], [4, 2]]));

    const t0 = performance.now();
    const bigM: number[][] = Array.from({ length: 100 }, (_, i) =>
        Array.from({ length: 100 }, (_, j) => i * 100 + j)
    );
    rotate(bigM);
    console.log(`perf rotate 100x100 matrix: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
