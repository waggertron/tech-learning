function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxAreaOfIsland(grid: number[][]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(maxAreaOfIsland([
        [0,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,1,1,0,1,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,1,0,0,1,0,1,0,0],
        [0,1,0,0,1,1,0,0,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,1,0,0,0,0],
    ]) === 6);
    assert(maxAreaOfIsland([[0,0,0,0,0,0,0,0]]) === 0);
    assert(maxAreaOfIsland([[1]]) === 1);
    assert(maxAreaOfIsland([[0]]) === 0);
    assert(maxAreaOfIsland([[1,0,0,1,1],[1,0,0,0,1]]) === 3);
    assert(maxAreaOfIsland([[1,1],[1,1]]) === 4);
    // perf
    const big = Array.from({ length: 300 }, () => Array(300).fill(1));
    const t0 = performance.now();
    maxAreaOfIsland(big);
    console.log(`perf max-area-of-island 300x300 all-land grid: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
