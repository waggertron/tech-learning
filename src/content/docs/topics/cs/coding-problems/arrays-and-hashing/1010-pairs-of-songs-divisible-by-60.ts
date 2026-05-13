function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function numPairsDivisibleBy60(time: number[]): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(numPairsDivisibleBy60([30,20,150,100,40]) === 3);
    assert(numPairsDivisibleBy60([60,60,60]) === 3);
    assert(numPairsDivisibleBy60([10,50,90,30]) === 2);
    assert(numPairsDivisibleBy60([1]) === 0);
    // perf
    const t0 = performance.now();
    numPairsDivisibleBy60(Array(10000).fill(30));
    console.log(`perf numPairsDivisibleBy60 n=10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
