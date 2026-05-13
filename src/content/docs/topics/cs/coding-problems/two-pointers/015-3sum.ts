function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function threeSum(nums: number[]): number[][] {
    // TODO: implement
    return [];
}

function normalize(result: number[][]): string {
    return JSON.stringify(result.map(t => [...t].sort((a, b) => a - b)).sort((a, b) => {
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
        return 0;
    }));
}

function _runTests(): void {
    assert(normalize(threeSum([-1, 0, 1, 2, -1, -4])) === normalize([[-1, -1, 2], [-1, 0, 1]]));
    assert(JSON.stringify(threeSum([0, 1, 1])) === JSON.stringify([]));
    assert(JSON.stringify(threeSum([0, 0, 0])) === JSON.stringify([[0, 0, 0]]));
    assert(JSON.stringify(threeSum([])) === JSON.stringify([]));
    assert(JSON.stringify(threeSum([-2, 0, 0, 2, 2])) === JSON.stringify([[-2, 0, 2]]));
    // perf
    const big = [...Array.from({ length: 5000 }, (_, i) => 5000 - i), ...Array.from({ length: 5000 }, (_, i) => -5000 + i)];
    const t0 = performance.now();
    threeSum(big);
    console.log(`perf 10000-element array: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
