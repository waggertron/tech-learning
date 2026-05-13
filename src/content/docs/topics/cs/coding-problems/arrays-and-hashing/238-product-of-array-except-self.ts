function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function productExceptSelf(nums: number[]): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(productExceptSelf([1, 2, 3, 4])) === JSON.stringify([24, 12, 8, 6]));
    assert(JSON.stringify(productExceptSelf([-1, 1, 0, -3, 3])) === JSON.stringify([0, 0, 9, 0, 0]));
    assert(JSON.stringify(productExceptSelf([1, 1])) === JSON.stringify([1, 1]));
    assert(JSON.stringify(productExceptSelf([2, 3])) === JSON.stringify([3, 2]));
    assert(JSON.stringify(productExceptSelf([1, 0])) === JSON.stringify([0, 1]));
    // perf
    const t0 = performance.now();
    productExceptSelf(Array.from({ length: 10000 }, (_, i) => i + 1));
    console.log(`perf productExceptSelf n=10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
