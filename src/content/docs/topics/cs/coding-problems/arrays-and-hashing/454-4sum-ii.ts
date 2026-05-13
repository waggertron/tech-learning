function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function fourSumCount(nums1: number[], nums2: number[], nums3: number[], nums4: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(fourSumCount([1,2], [-2,-1], [-1,2], [0,2]) === 2);
    assert(fourSumCount([0], [0], [0], [0]) === 1);
    assert(fourSumCount([-1,-1], [-1,1], [-1,1], [1,-1]) === 6);
    // perf
    const n = 500;
    const arr = Array.from({length: n}, (_, i) => i);
    const t0 = performance.now();
    fourSumCount(arr, arr, arr, arr);
    console.log(`perf fourSumCount n=${n}: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
