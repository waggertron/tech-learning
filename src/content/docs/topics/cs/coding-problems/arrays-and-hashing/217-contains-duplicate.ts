function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function containsDuplicate(nums: number[]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(containsDuplicate([1, 2, 3, 1]) === true);
    assert(containsDuplicate([1, 2, 3, 4]) === false);
    assert(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]) === true);
    assert(containsDuplicate([]) === false);
    assert(containsDuplicate([5]) === false);
    assert(containsDuplicate([5, 5]) === true);
    // perf
    const t0 = performance.now();
    containsDuplicate(Array.from({ length: 1_000_000 }, (_, i) => i));
    console.log(`perf containsDuplicate n=1000000 unique: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
