function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function swimInWater(grid: number[][]): number {
    // TODO: implement
    return -1;
}

function _runTests(): void {
    assert(swimInWater([[0,2],[1,3]]) === 3);
    assert(swimInWater([[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]) === 16);
    assert(swimInWater([[0]]) === 0);
    assert(swimInWater([[7]]) === 7);
    assert(swimInWater([[0,1],[3,2]]) === 2);
    // perf: 30x30 grid with shuffled values
    const n = 30;
    const vals = Array.from({ length: n * n }, (_, i) => i);
    // simple deterministic shuffle (seeded-like)
    for (let i = vals.length - 1; i > 0; i--) {
        const j = (i * 1664525 + 1013904223) % (i + 1);
        [vals[i], vals[j]] = [vals[j], vals[i]];
    }
    const big: number[][] = Array.from({ length: n }, (_, r) => vals.slice(r * n, (r + 1) * n));
    const t0 = performance.now();
    swimInWater(big);
    console.log(`perf swim-in-rising-water 30x30 grid: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
