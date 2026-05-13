function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function solve(board: string[][]): void {
    // TODO: implement (modifies board in place)
}

function _runTests(): void {
    const b1 = [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']];
    solve(b1);
    assert(JSON.stringify(b1) === JSON.stringify([['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']]));

    const b2 = [['X','X'],['X','X']];
    solve(b2);
    assert(JSON.stringify(b2) === JSON.stringify([['X','X'],['X','X']]));

    const b3 = [['O']];
    solve(b3);
    assert(JSON.stringify(b3) === JSON.stringify([['O']]));

    const b4 = [['O','O','O'],['O','X','O'],['O','O','O']];
    solve(b4);
    assert(JSON.stringify(b4) === JSON.stringify([['O','O','O'],['O','X','O'],['O','O','O']]));

    const b5 = [['X','X','X'],['X','O','X'],['X','X','X']];
    solve(b5);
    assert(JSON.stringify(b5) === JSON.stringify([['X','X','X'],['X','X','X'],['X','X','X']]));

    // perf
    const big = Array.from({ length: 300 }, (_, i) =>
        Array.from({ length: 300 }, (__, j) =>
            (i === 0 || i === 299 || j === 0 || j === 299) ? 'O' : 'X'));
    const t0 = performance.now();
    solve(big);
    console.log(`perf surrounded-regions 300x300 board: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
