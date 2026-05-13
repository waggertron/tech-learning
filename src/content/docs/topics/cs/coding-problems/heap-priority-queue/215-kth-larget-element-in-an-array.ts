function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findKthLargest(nums: number[], k: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(findKthLargest([3, 2, 1, 5, 6, 4], 2) === 5);
    assert(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4) === 4);
    assert(findKthLargest([1], 1) === 1);
    assert(findKthLargest([7, 6, 5, 4, 3, 2, 1], 1) === 7);
    assert(findKthLargest([7, 6, 5, 4, 3, 2, 1], 7) === 1);
    // perf
    const nums = Array.from({ length: 10000 }, (_, i) => i).sort(() => Math.random() - 0.5);
    const t0 = performance.now();
    findKthLargest(nums, 500);
    console.log(`perf findKthLargest n=10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
