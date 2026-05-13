function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function hammingWeight(n: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(hammingWeight(11) === 3);
    assert(hammingWeight(128) === 1);
    assert(hammingWeight(0) === 0);
    assert(hammingWeight(4294967295) === 32);
    assert(hammingWeight(1) === 1);
    assert(hammingWeight(183) === 6);
    // perf
    const t0 = performance.now();
    for (let i = 0; i < 1_000_000; i++) hammingWeight((i * 1000003) & 0xFFFFFFFF);
    console.log(`perf hammingWeight x1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
