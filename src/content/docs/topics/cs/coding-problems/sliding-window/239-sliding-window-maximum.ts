function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function maxSlidingWindow(nums: number[], k: number): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)) === JSON.stringify([3, 3, 5, 5, 6, 7]));
    assert(JSON.stringify(maxSlidingWindow([1], 1)) === JSON.stringify([1]));
    assert(JSON.stringify(maxSlidingWindow([1, -1], 1)) === JSON.stringify([1, -1]));
    assert(JSON.stringify(maxSlidingWindow([9, 8, 7, 6, 5], 3)) === JSON.stringify([9, 8, 7]));
    assert(JSON.stringify(maxSlidingWindow([1, 2, 3, 4, 5], 3)) === JSON.stringify([3, 4, 5]));
    // perf
    const t0 = performance.now();
    maxSlidingWindow(Array.from({ length: 1_000_000 }, (_, i) => i), 100);
    console.log(`perf 1000000-element array k=100: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
