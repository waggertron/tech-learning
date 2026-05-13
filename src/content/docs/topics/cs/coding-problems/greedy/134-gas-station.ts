function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function canCompleteCircuit(gas: number[], cost: number[]): number {
    // TODO: implement
    return -1;
}

function _runTests(): void {
    assert(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]) === 3);
    assert(canCompleteCircuit([2, 3, 4], [3, 4, 3]) === -1);
    assert(canCompleteCircuit([1], [1]) === 0);
    assert(canCompleteCircuit([5], [4]) === 0);
    assert(canCompleteCircuit([2, 0, 1], [0, 1, 2]) === 0);
    // perf
    const t0 = performance.now();
    canCompleteCircuit(Array(10000).fill(2), Array(10000).fill(1));
    console.log(`perf canCompleteCircuit(n=10000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
