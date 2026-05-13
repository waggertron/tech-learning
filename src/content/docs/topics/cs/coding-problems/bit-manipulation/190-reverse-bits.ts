function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function reverseBits(n: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(reverseBits(43261596) === 964176192);
    assert(reverseBits(4294967293) === 3221225471);
    assert(reverseBits(0) === 0);
    assert(reverseBits(4294967295) === 4294967295);
    assert(reverseBits(1) === 2147483648);
    // perf
    const t0 = performance.now();
    for (let i = 0; i < 1_000_000; i++) reverseBits((i * 1000003) >>> 0);
    console.log(`perf reverseBits x1000000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
