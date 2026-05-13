function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findMin(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(findMin([3, 4, 5, 1, 2]) === 1);
    assert(findMin([4, 5, 6, 7, 0, 1, 2]) === 0);
    assert(findMin([11, 13, 15, 17]) === 11);
    assert(findMin([1]) === 1);
    assert(findMin([2, 1]) === 1);
    assert(findMin([1, 2]) === 1);
    // perf
    const arr = [...Array.from({ length: 50000 }, (_, i) => i + 50000), ...Array.from({ length: 50000 }, (_, i) => i)];
    const t0 = performance.now();
    for (let i = 0; i < 1_000_000; i++) findMin(arr);
    console.log(`perf findMin rotated n=100000 x1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
