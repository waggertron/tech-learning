function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function networkDelayTime(times: number[][], n: number, k: number): number {
    // TODO: implement
    return -1;
}

function _runTests(): void {
    assert(networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2) === 2);
    assert(networkDelayTime([[1,2,1]], 2, 1) === 1);
    assert(networkDelayTime([[1,2,1]], 2, 2) === -1);
    assert(networkDelayTime([], 1, 1) === 0);
    assert(networkDelayTime([[1,2,1],[1,2,5]], 2, 1) === 1);
    // perf
    const bigTimes = Array.from({ length: 9_999 }, (_, i) => [i + 1, i + 2, 1]);
    const t0 = performance.now();
    networkDelayTime(bigTimes, 10_000, 1);
    console.log(`perf network-delay-time 10000 nodes chain: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
