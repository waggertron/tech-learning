function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function solveNQueens(n: number): string[][] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(solveNQueens(1)) === JSON.stringify([['Q']]));
    const r4 = solveNQueens(4);
    assert(r4.length === 2);
    assert(
        JSON.stringify(r4.sort()) ===
        JSON.stringify([['.Q..','...Q','Q...','..Q.'],['..Q.','Q...','...Q','.Q..']]
            .sort())
    );
    assert(solveNQueens(5).length === 10);
    assert(solveNQueens(2).length === 0);
    assert(solveNQueens(3).length === 0);
    // perf
    const t0 = performance.now();
    solveNQueens(8);
    console.log(`perf solveNQueens(n=8): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
