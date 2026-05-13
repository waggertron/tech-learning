function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(findMedianSortedArrays([1, 3], [2]) === 2.0);
    assert(findMedianSortedArrays([1, 2], [3, 4]) === 2.5);
    assert(findMedianSortedArrays([0, 0], [0, 0]) === 0.0);
    assert(findMedianSortedArrays([], [1]) === 1.0);
    assert(findMedianSortedArrays([2], []) === 2.0);
    assert(findMedianSortedArrays([1, 3], [2, 4]) === 2.5);
    // perf
    const a = Array.from({ length: 100000 }, (_, i) => i * 2);
    const b = Array.from({ length: 100000 }, (_, i) => i * 2 + 1);
    const t0 = performance.now();
    for (let i = 0; i < 1_000_000; i++) findMedianSortedArrays(a, b);
    console.log(`perf findMedianSortedArrays n=100000 each x1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
