function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function longestConsecutive(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(longestConsecutive([100, 4, 200, 1, 3, 2]) === 4);
    assert(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]) === 9);
    assert(longestConsecutive([]) === 0);
    assert(longestConsecutive([1]) === 1);
    assert(longestConsecutive([1, 2, 3, 4, 5]) === 5);
    assert(longestConsecutive([5, 4, 3, 2, 1]) === 5);
    // perf
    const t0 = performance.now();
    longestConsecutive(Array.from({ length: 10000 }, (_, i) => i));
    console.log(`perf longestConsecutive n=10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
