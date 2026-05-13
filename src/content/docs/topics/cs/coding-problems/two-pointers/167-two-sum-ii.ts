function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function twoSum(numbers: number[], target: number): number[] {
    // TODO: implement
    return [];
}

function _runTests(): void {
    assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === JSON.stringify([1, 2]));
    assert(JSON.stringify(twoSum([2, 3, 4], 6)) === JSON.stringify([1, 3]));
    assert(JSON.stringify(twoSum([3, 3], 6)) === JSON.stringify([1, 2]));
    assert(JSON.stringify(twoSum([1, 2, 3, 4, 5], 9)) === JSON.stringify([4, 5]));
    assert(JSON.stringify(twoSum([-3, -1, 0, 2, 4], 1)) === JSON.stringify([1, 5]));
    // perf
    const big = Array.from({ length: 10000 }, (_, i) => i + 1);
    const t0 = performance.now();
    twoSum(big, 19999);
    console.log(`perf 10000-element sorted array: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
