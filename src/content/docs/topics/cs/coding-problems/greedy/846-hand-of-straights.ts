function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function isNStraightHand(hand: number[], groupSize: number): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(isNStraightHand([1,2,3,6,2,3,4,7,8], 3) === true);
    assert(isNStraightHand([1,2,3,4,5], 4) === false);
    assert(isNStraightHand([1], 1) === true);
    assert(isNStraightHand([1,2,3], 3) === true);
    assert(isNStraightHand([1,2,4], 3) === false);
    assert(isNStraightHand([1,1,2,2,3,3], 3) === true);
    // perf
    const t0 = performance.now();
    isNStraightHand(Array.from({ length: 500_000 }, (_, i) => i), 10);
    console.log(`perf isNStraightHand(n=500000, groupSize=10): ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
