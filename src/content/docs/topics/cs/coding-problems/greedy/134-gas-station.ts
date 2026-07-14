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
    assert(canCompleteCircuit([0], [0]) === 0);
    assert(canCompleteCircuit([10_000], [10_000]) === 0);
    assert(canCompleteCircuit([2, 0, 1], [0, 1, 2]) === 0);

    const n = 100_000;
    const largeGas = Array(n).fill(0);
    const largeCost = Array(n).fill(0);
    for (let i = 0; i < 10_000; i++) largeCost[i] = 1;
    largeGas[10_000] = 10_000;

    const t0 = performance.now();
    assert(canCompleteCircuit(largeGas, largeCost) === 10_000);
    console.log(`perf canCompleteCircuit(n=100000): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
