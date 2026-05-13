function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function setZeroes(matrix: number[][]): void {
    // TODO: implement (in place)
}

function _runTests(): void {
    const m = [[1, 1, 1], [1, 0, 1], [1, 1, 1]];
    setZeroes(m);
    assert(JSON.stringify(m) === JSON.stringify([[1, 0, 1], [0, 0, 0], [1, 0, 1]]));

    const m2 = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]];
    setZeroes(m2);
    assert(JSON.stringify(m2) === JSON.stringify([[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]));

    const m3 = [[1]];
    setZeroes(m3);
    assert(JSON.stringify(m3) === JSON.stringify([[1]]));

    const m4 = [[0]];
    setZeroes(m4);
    assert(JSON.stringify(m4) === JSON.stringify([[0]]));

    const t0 = performance.now();
    const bigM: number[][] = Array.from({ length: 100 }, (_, i) =>
        Array.from({ length: 100 }, (_, j) => i * 100 + j)
    );
    bigM[50][50] = 0;
    setZeroes(bigM);
    console.log(`perf setZeroes 100x100 matrix: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
