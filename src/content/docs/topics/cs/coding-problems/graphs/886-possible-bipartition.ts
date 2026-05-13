function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

function possibleBipartition(n: number, dislikes: number[][]): boolean {
    // TODO: implement
    return false;
}

function _runTests(): void {
    assert(possibleBipartition(4, [[1,2],[1,3],[2,4]]) === true);
    assert(possibleBipartition(3, [[1,2],[1,3],[2,3]]) === false);
    assert(possibleBipartition(5, [[1,2],[2,3],[3,4],[4,5],[1,5]]) === false);
    assert(possibleBipartition(4, []) === true);
    assert(possibleBipartition(4, [[1,2],[3,4]]) === true);
    assert(possibleBipartition(1, []) === true);
    // perf
    const nPeople = 10_000;
    const bigDislikes = Array.from({ length: nPeople }, (_, i) => [i + 1, (i % nPeople) + 1 === nPeople ? 1 : (i % nPeople) + 2]);
    const t0 = performance.now();
    possibleBipartition(nPeople, bigDislikes);
    console.log(`perf possible-bipartition ${nPeople} people even cycle: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
