function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function largestRectangleArea(heights: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(largestRectangleArea([2, 1, 5, 6, 2, 3]) === 10);
    assert(largestRectangleArea([2, 4]) === 4);
    assert(largestRectangleArea([1]) === 1);
    assert(largestRectangleArea([6, 5, 4, 3, 2, 1]) === 12);
    assert(largestRectangleArea([1, 2, 3, 4, 5, 6]) === 12);
    assert(largestRectangleArea([2, 0, 2]) === 2);
    // perf
    const t0 = performance.now();
    largestRectangleArea(Array.from({ length: 1_000_000 }, (_, i) => i % 100));
    console.log(`perf 1000000-bar histogram: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
