function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function spiralOrder(matrix: number[][]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]])) === JSON.stringify([1, 2, 3, 6, 9, 8, 7, 4, 5]));
    assert(JSON.stringify(spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])) === JSON.stringify([1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]));
    assert(JSON.stringify(spiralOrder([[1]])) === JSON.stringify([1]));
    assert(JSON.stringify(spiralOrder([[1, 2], [3, 4]])) === JSON.stringify([1, 2, 4, 3]));
    assert(JSON.stringify(spiralOrder([[1], [2], [3]])) === JSON.stringify([1, 2, 3]));
    assert(JSON.stringify(spiralOrder([[1, 2, 3]])) === JSON.stringify([1, 2, 3]));

    const t0 = performance.now();
    const bigM: number[][] = Array.from({ length: 100 }, (_, i) =>
        Array.from({ length: 100 }, (_, j) => i * 100 + j)
    );
    spiralOrder(bigM);
    console.log(`perf spiralOrder 100x100 matrix: ${(performance.now() - t0).toFixed(1)}ms`);

    console.log('all tests pass');
}

_runTests();
