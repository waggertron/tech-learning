function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function leastInterval(tasks: string[], n: number): number {
    // TODO: implement
    return 0;
}

function _runTests(): void {
    assert(leastInterval(['A','A','A','B','B','B'], 2) === 8);
    assert(leastInterval(['A','A','A','B','B','B'], 0) === 6);
    assert(leastInterval(['A','A','A','A','A','A','B','C','D','E','F','G'], 2) === 16);
    assert(leastInterval(['A','B','C','D','A','B','C','D'], 2) === 8);
    assert(leastInterval(['A','A','A'], 3) === 9);
    assert(leastInterval(['A','A','A'], 0) === 3);
    // perf
    const bigTasks = Array.from({ length: 10000 }, (_, i) => String.fromCharCode(65 + (i % 26)));
    const t0 = performance.now();
    leastInterval(bigTasks, 2);
    console.log(`perf leastInterval n=10000: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
