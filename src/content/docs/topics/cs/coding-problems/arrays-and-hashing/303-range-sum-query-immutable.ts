function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class NumArray {
    constructor(nums: number[]) {
        // TODO: implement
    }

    sumRange(left: number, right: number): number {
        // TODO: implement
        return 0;
    }
}

function _runTests(): void {
    const na = new NumArray([-2, 0, 3, -5, 2, -1]);
    assert(na.sumRange(0, 2) === 1);
    assert(na.sumRange(2, 5) === -1);
    assert(na.sumRange(0, 5) === -3);

    const na2 = new NumArray([5]);
    assert(na2.sumRange(0, 0) === 5);

    const na3 = new NumArray([-1, -2, -3]);
    assert(na3.sumRange(0, 2) === -6);
    assert(na3.sumRange(1, 2) === -5);

    // perf
    const na4 = new NumArray(Array.from({ length: 100000 }, (_, i) => i));
    const t0 = performance.now();
    for (let i = 0; i < 100000; i += 100) na4.sumRange(0, i);
    console.log(`perf 1000 queries on NumArray(100000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
