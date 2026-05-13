function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function twoSum(nums: number[], target: number): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([0, 1]));
    assert(JSON.stringify(twoSum([3, 2, 4], 6)) === JSON.stringify([1, 2]));
    assert(JSON.stringify(twoSum([3, 3], 6)) === JSON.stringify([0, 1]));
    assert(JSON.stringify(twoSum([1, 2, 3, 4, 5], 9)) === JSON.stringify([3, 4]));
    assert(JSON.stringify(twoSum([0, 4], 4)) === JSON.stringify([0, 1]));
    // perf
    const t0 = performance.now();
    twoSum(Array.from({ length: 1_000_000 }, (_, i) => i), 1_999_997);
    console.log(`perf twoSum n=1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
