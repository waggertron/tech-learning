function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function numIslands(grid: string[][]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    const g1 = [['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']];
    assert(numIslands(g1) === 1);
    const g2 = [['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']];
    assert(numIslands(g2) === 3);
    assert(numIslands([]) === 0);
    assert(numIslands([['1']]) === 1);
    assert(numIslands([['0']]) === 0);
    const g3 = [['1','1'],['1','1']];
    assert(numIslands(g3) === 1);
    // perf
    const big: string[][] = Array.from({ length: 50 }, () => Array(50).fill('1'));
    const t0 = performance.now();
    numIslands(big);
    console.log(`perf num-islands 50x50 all-land grid: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
