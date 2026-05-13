function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findPeakElement(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(findPeakElement([1, 2, 3, 1]) === 2);
    const r1 = findPeakElement([1, 2, 1, 3, 5, 6, 4]);
    assert(r1 === 1 || r1 === 5, `expected 1 or 5, got ${r1}`);
    assert(findPeakElement([1]) === 0);
    assert(findPeakElement([1, 2, 3]) === 2);
    assert(findPeakElement([3, 2, 1]) === 0);
    // perf
    const nums = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 1000000));
    const t0 = performance.now();
    findPeakElement(nums);
    console.log(`perf findPeakElement(100000 elements): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
