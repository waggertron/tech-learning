function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function findDuplicate(nums: number[]): number {
    // TODO: implement
    return -1;
}

function _runTests(): void {
    assert(findDuplicate([1,3,4,2,2]) === 2);
    assert(findDuplicate([3,1,3,4,2]) === 3);
    assert(findDuplicate([3,3,3,3,3]) === 3);
    assert(findDuplicate([1,1]) === 1);
    assert(findDuplicate([2,2,2,1]) === 2);
    // perf
    const n = 1000;
    const nums = Array.from({ length: n + 1 }, (_, i) => (i === n ? n - 1 : i + 1));
    nums[n] = nums[n - 2]; // introduce duplicate
    const t0 = performance.now();
    findDuplicate(nums);
    console.log(`perf findDuplicate(${n + 1} elements): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
