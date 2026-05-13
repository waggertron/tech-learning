function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function singleNumber(nums: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(singleNumber([2, 2, 1]) === 1);
    assert(singleNumber([4, 1, 2, 1, 2]) === 4);
    assert(singleNumber([1]) === 1);
    assert(singleNumber([0, 0, 99]) === 99);
    assert(singleNumber([-1, -1, 42]) === 42);
    assert(singleNumber([2 ** 31 - 1]) === 2 ** 31 - 1);
    // perf
    const nums = [...Array.from({ length: 1000 }, (_, i) => i), ...Array.from({ length: 1000 }, (_, i) => i), 9999];
    const t0 = performance.now();
    singleNumber(nums);
    console.log(`perf singleNumber n=2001: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
